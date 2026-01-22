---
title: "Terraform Test : Les limitations"
description: "Retour d'expérience sur le framework de test natif de Terraform. Le cas des outputs à Null."
pubDate: 2024-03-10
tags: ["terraform", "iac", "testing"]
draft: true
---

## Le problème

Lorsqu'on teste un module qui dépend d'une ressource créée dynamiquement, on peut se retrouver avec des outputs qui sont `null` dans certains cas. Par exemple, si une ressource n'est pas créée en raison de conditions spécifiques, l'output associé sera `null`.
