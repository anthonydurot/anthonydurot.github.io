export const siteConfig = {
  name: "Anthony Durot",
  title: "Senior Cloud Engineer",
  description: "Portfolio website of Anthony Durot",
  accentColor: "#1d4ed8",
  social: {
    email: "adurot.pro@gmail.com",
    linkedin: "https://www.linkedin.com/in/anthony-durot-9a0354138/",
    github: "https://github.com/anthonydurot",
  },
  aboutMe:
    "Experienced Senior Cloud Engineer who loves to code and build efficient, scalable solutions. Passionate about learning new technologies and improving development processes.",
  skills: ["Python", "Go", "Docker", "GCP", "AWS"],
  experience: [
    {
      company: "Decathlon",
      title: "Senior Software Engineer",
      dateRange: "Mai 2022 - Aujourd'hui",
      bullets: [
        "Projet 3S – Développement et exploitation d’une plateforme Cloud personnalisable, destinée aux équipes produit pour héberger et opérer leurs applications dans le Cloud de manière standardisée, sécurisée et autonome.",
        "Capitaine de release pour les versions 0.8 et 1.3 : coordination transverse avec plusieurs équipes, validation des livrables (code, doc, tests), pilotage des campagnes \"canary\" avec les utilisateurs pilotes.",
        "Référent technique sur l’authentification des stacks vis-à-vis des API partenaires et l’intégration de nouveaux services au catalogue 3S.",
        "Conception et intégration de Vault dans la plateforme : création dynamique de namespaces par stack pour une gestion sécurisée et autonome des secrets.",
        "Migration des outils internes Python de pip vers uv, améliorant la performance, la cohérence technique et la maintenabilité.",
        "Réduction continue de la dette technique (refactorings, automatisation de tâches, rationalisation des modules internes).",
        "Accompagnement des équipes produit dans l’adoption de la plateforme et diffusion des bonnes pratiques.",
        "Formation interne des contributeurs sur les usages et l’architecture du produit"
      ],
    },
    {
      company: "Adeo",
      title: "Cloud Engineer",
      dateRange: "Février 2022 - Mai 2022",
      bullets: [
        "Au sein de l’équipe Cloud Services d’ADEO (15 personnes) qui vise à fournir des Landing Zone et Landing Hub aux équipes-projets d’Adeo via des APIs.",
        "Développement et Run des services",
        "Refonte de certains endpoints.",
        "Upgrade Terraform 0.11 vers Terraform 0.14 sur nos modules",
      ],
    },
    {
      company: "Bpifrance",
      title: "Cloud Engineer",
      dateRange: "Octobre 2020 - Avril 2022",
      bullets: [
        "Mise en place l’infrastructure décrite sur environnement AWS mutualisé à l’aide de Terraform",
        "Conteneurisation de l’application(Docker), déploiement Helm sur cluster EKS(cluster mutualisé déjà géré par les équipes Bpifrance",
        "Sécuriser l’application selon exigences définies dans le dossier d’architecture(Chiffrement données base, Https)",
        "Mettre en place la chaîne CI / CD pour déploiement applicatif auto sur plateforme Jenkins.",
        "Mise en place méthodologie GitOps à l’aide de FluxCD pour le déploiement des manifestes Kubernetes.",
        "Mettre en place les procédures d’exploitation(Sauvegarde base, Alerting & Monitoring sur Datadog, IaC Terraform)",
        "Documentation & Transfert d’expertise",
        "Evangélisation des bonnes pratiques Cloud",
        "Technologies : AWS, Terraform, Kubernetes, Helm, FluxCD",
      ],
    },
  ],
  education: [
    {
      school: "Polytech Lille",
      degree: "Diplôme d'Ingénieur",
      dateRange: "2014 - 2019",
      achievements: []
    },
  ],
};
