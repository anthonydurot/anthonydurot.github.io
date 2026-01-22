---
title: "Pydantic vs GCP Secret Manager"
description: 'Comment un secret "détruit" peut faire planter toute votre application'
pubDate: 2026-01-20
tags: ["system"]
mermaid: false
---

## Introduction

Dans l'écosystème Python moderne, l'association de **FastAPI** et de **Pydantic v2** est devenue un standard pour la gestion robuste des configurations. L'extension `pydantic-settings` offre une fonctionnalité fantastique : la capacité de peupler vos modèles de configuration directement depuis des sources externes, comme des variables d'environnement, des fichiers `.env`, ou des services cloud.

Pour les utilisateurs de Google Cloud Platform (GCP), le `GoogleSecretManagerSettingsSource` natif semble être la solution idéale. Vous définissez votre modèle Pydantic, et magiquement, il va chercher les valeurs correspondantes dans GCP Secret Manager.

Cependant, dans des environnements cloud réels et "vivants", cette intégration peut cacher un piège redoutable capable d'empêcher le démarrage de votre application, même si votre configuration est parfaitement valide.

## Le Problème : L'Énumération Gourmande et les Secrets Fantômes

Imaginez le scénario suivant : votre projet GCP est utilisé par plusieurs équipes ou a une longue histoire. Il contient des dizaines de secrets. Certains sont actifs, d'autres sont obsolètes et ont été marqués comme **"DESTROYED"** (détruits) dans l'interface GCP, en attente de suppression définitive.

Votre application, elle, n'a besoin que de deux secrets : `DB_PASSWORD` et `API_KEY`.

Vous lancez votre application, et **CRASH**. Une stack trace obscure apparaît au démarrage :

```text
google.api_core.exceptions.FailedPrecondition: 400 Secret Version [projects/.../secrets/UN_VIEUX_SECRET_INUTILE/versions/1] is in DESTROYED state.

```

Pourquoi votre application plante-t-elle à cause d'un secret (`UN_VIEUX_SECRET_INUTILE`) qu'elle n'utilise même pas dans son modèle Pydantic ?

### La cause technique

Le coupable est la stratégie "d'énumération gourmande" (*greedy enumeration*) utilisée par l'implémentation native de Pydantic.

Au démarrage, avant même de vérifier de quels champs votre modèle a besoin, le `GoogleSecretManagerSettingsSource` tente de lister et d'accéder aux métadonnées de **tous** les secrets disponibles dans le projet GCP.

C'est ici que le bât blesse :

1. GCP considère qu'accéder à un secret qui n'existe pas est une erreur `404 Not Found`. La librairie gère cela très bien (elle l'ignore).
2. Mais GCP considère qu'accéder à un secret qui existe mais qui est dans l'état `DESTROYED` est une erreur client : **`400 Failed Precondition`**.

La librairie native de Pydantic n'est pas conçue pour gérer cette erreur `400` lors de sa phase d'énumération. Elle interprète cela comme une défaillance critique de l'infrastructure et lève une exception, stoppant net votre application.

Dans un monde idéal, nos projets GCP seraient toujours propres. Dans la réalité, un seul secret cassé oublié par une autre équipe peut mettre à terre votre service.

## La Solution : Une Sur-couche de Sécurité Chirurgicale

Nous ne voulons pas réécrire toute la logique de Pydantic. Nous voulons conserver son comportement par défaut (scanner les secrets), mais le rendre résilient aux erreurs GCP.

La solution consiste à créer une sur-couche "pare-balles" autour du mécanisme interne qui récupère les valeurs des secrets.

Dans les entrailles de `pydantic-settings`, il y a une classe `GoogleSecretManagerMapping` qui agit comme un dictionnaire. Lorsque Pydantic itère sur les configurations possibles, il appelle la méthode `__getitem__` de ce mapping pour chaque secret trouvé.

C'est précisément là que nous allons intervenir. Nous allons intercepter l'appel qui échoue.

### 1. Le code de la solution

Créez un fichier, par exemple `app/settings/safe_gcp_source.py` :

```python
from typing import Any
from pydantic_settings import GoogleSecretManagerSettingsSource
from pydantic_settings.sources.providers.gcp import GoogleSecretManagerMapping

class SafeGoogleSecretManagerMapping(GoogleSecretManagerMapping):
    """
    Une sur-couche résiliente autour du Mapping GCP natif.

    Le mapping natif plante si N'IMPORTE QUEL secret du projet est dans un état
    'DESTROYED' (Erreur 400) ou a des problèmes de permission (Erreur 403)
    pendant l'itération.

    Cette implémentation intercepte ces erreurs spécifiques et retourne None.
    Pour Pydantic, None signifie "valeur non trouvée", ce qui permet d'ignorer
    le secret cassé en toute sécurité sans arrêter l'application.
    """
    def __getitem__(self, key: str) -> Any:
        try:
            # On tente de récupérer le secret avec la logique native
            return super().__getitem__(key)
        except Exception:
            # 🛑 FILET DE SÉCURITÉ
            # Si GCP renvoie UNE ERREUR QUELCONQUE (Détruit, Manquant, Interdit),
            # on retourne None. Pydantic ignorera simplement cette entrée.
            return None

class SafeGoogleSecretManagerSettingsSource(GoogleSecretManagerSettingsSource):
    """
    Injecte le SafeGoogleSecretManagerMapping dans la source de paramètres.
    """
    def _load_env_vars(self) -> SafeGoogleSecretManagerMapping:
        # C'est le "hook" qui nous permet de remplacer la classe de mapping interne
        # par notre version sécurisée.
        return SafeGoogleSecretManagerMapping(
            self._secret_client,
            self._project_id,
            self.case_sensitive,
        )

```

Ce code fait une chose simple : si la récupération d'un secret échoue pour *n'importe quelle raison* (y compris le fameux code 400 sur un secret détruit), il retourne `None` au lieu de laisser l'exception remonter. Pydantic voit `None`, considère que la valeur n'est pas définie pour ce secret, et continue sa route tranquillement.

### 2. L'intégration dans votre classe Settings

Il ne reste plus qu'à dire à Pydantic d'utiliser notre source sécurisée au lieu de la source native. Cela se fait via la méthode `settings_customise_sources` dans votre modèle principal.

Dans votre fichier `app/settings/main.py` (ou équivalent) :

```python
from pydantic_settings import BaseSettings, SettingsConfigDict, PydanticBaseSettingsSource
# Importez votre source sécurisée
from app.settings.safe_gcp_source import SafeGoogleSecretManagerSettingsSource
import os

class Settings(BaseSettings):
    # Vos champs de configuration...
    db_password: str
    api_key: str

    model_config = SettingsConfigDict(
        # ... vos autres configs ...
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        
        project_id = os.getenv("GCP_PROJECT_ID", "votre-projet-par-defaut")

        # On instancie NOTRE source sécurisée
        gcp_settings = SafeGoogleSecretManagerSettingsSource(
            settings_cls,
            project_id=project_id,
        )

        # On l'ajoute à la liste des sources (l'ordre importe pour la priorité)
        return (
            init_settings,
            env_settings,
            dotenv_settings,
            gcp_settings, # <-- Notre source résiliente
            file_secret_settings,
        )

```

## Conclusion

En adoptant cette approche "chirurgicale", vous obtenez le meilleur des deux mondes :

1. Vous conservez le comportement natif de Pydantic qui scanne automatiquement les secrets disponibles.
2. Vous rendez votre application robuste face à "l'hygiène" parfois douteuse des projets cloud partagés.

Un secret détruit ou mal configuré par une autre équipe ne sera plus jamais la cause d'un réveil nocturne pour une application qui refuse de démarrer en production.
