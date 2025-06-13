# ![GitPulse Badge](https://img.shields.io/badge/GitHub%20Activity-Synced%20by%20GitPulse-brightgreen)

# 🚀 GitPulse

**Gardez votre GitHub vivant, sans exposer votre code.**

---

## Présentation

**GitPulse** est un outil CLI local qui synchronise vos activités de développement professionnelles vers un dépôt GitHub personnel, de façon **discrète**, **automatisée** et **confidentielle**. Il rejoue vos commits sous forme anonymisée, sans jamais copier de code source.

---

## Pourquoi choisir GitPulse ?

- 👀 **Visibilité** : Maintenez un graph de contributions actif sur GitHub, même pour du travail privé.
- 🔒 **Confidentialité** : Aucun code n'est copié, tout reste local, 100% privé.
- 🧘 **Simplicité** : Installation rapide, configuration guidée, usage minimaliste.

---

## Installation (en un clic)

```bash
npm i
npm run build
npm install -g
```

---

## Commandes principales

- `gitpulse init` : Initialise la configuration
- `gitpulse record` : Extrait et enregistre l’activité Git filtrée
- `gitpulse push` : Pousse les commits anonymisés vers GitHub.
- `gitpulse status` : Affiche l’état de synchronisation, les records en attentes.
- `gitpulse config` : Modifie la configuration (email, chemin, etc).

---

## Confidentialité

![Confidentialité](https://img.shields.io/badge/100%25%20privé-0%25%20code%20partagé-blue)

 - Aucun code n’est copié
 - Aucun accès réseau vers les dépôts pro
 - Tout se fait localement, sur votre machine
 

---

## Flow par défaut

1. Détection du contexte Git
2. Extraction des commits liés à l’email
3. Génération de commits discrets
4. Push vers GitHub

---

## Capture d’écran (optionnel)

Ajoutez ici un visuel du graph de contributions avant/après, ou une animation GIF du flow GitPulse.

---

## Licence

MIT