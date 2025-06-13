# 🚀 GitPulse – Dev Activity Sync Tool

**GitPulse** est un outil CLI local pour synchroniser vos activités de développement professionnelles vers un dépôt GitHub personnel, de façon **discrète**, **automatisée** et **confidentielle**.

---

## 🎯 Objectif

Maintenir une **présence active sur GitHub** sans exposer de code confidentiel, en rejouant vos commits professionnels sous forme de commits anonymes dans un dépôt miroir personnel.

---

## ⚡ Cas d’usage

- 🔄 Garder un graph de contributions actif sur GitHub
- 🕵️‍♂️ Rejouer l’activité réelle sans exposer le code source
- 🪞 Créer un dépôt miroir personnel à partir de projets internes
- 🤖 Automatiser la synchronisation quotidienne de l’activité Git

---

## 🚀 Exemple d’utilisation rapide

# 1. Initialiser la configuration du miroir
gitpulse init


```bash
Sélectionnez l’email à utiliser pour filtrer l’activité Git :
  ❯ julien@entreprise.com
    julien.dupont@autre.com
    Saisir manuellement

Chemin du dépôt miroir (par défaut : ./gitpulse-logs) :
  ❯ ./gitpulse-logs

Voulez-vous initialiser le dépôt miroir maintenant ?
  ❯ Oui
    Non

[Entrée pour valider, ↑/↓ pour naviguer]

```

# 2. Enregistrer l’activité Git des dernières 24h
gitpulse record

# 3. Pousser les commits anonymisés vers GitHub
gitpulse push

# 4. Vérifier l’état de synchronisation
gitpulse status
```

> Astuce : Ajoute `--dry-run` à `gitpulse record` pour simuler sans créer de commits.

---

## 🔁 Flow par défaut

1. Détection du contexte Git
2. Extraction des commits liés à l’email
3. Préparation du dépôt miroir
4. Génération de commits discrets
5. Push vers GitHub

---

## 🛠️ Commandes disponibles

- `gitpulse init` : Initialiser la configuration du miroir
- `gitpulse record` : Extraire et enregistrer l’activité Git filtrée (par défaut sur les 24 dernières heures)
- `gitpulse push` : Pousser les commits anonymisés vers GitHub
- `gitpulse status` : Afficher l’état de synchronisation
- `gitpulse config` : Modifier la configuration

---

## ⚙️ Options CLI

| Option        | Description                                      |
|---------------|--------------------------------------------------|
| `--email`     | Email Git à filtrer                              |
| `--target`    | Chemin vers le dépôt miroir                      |
| `--since`     | Limite temporelle (ex: 30d)                      | 
| `--dry-run`   | Affiche les commits sans les créer               |
| `--since-last-sync` | Ne pousse que les commits depuis la dernière synchronisation |


---

## 📝 Exemple de commit généré

```git
commit 8f3a1c2
Author: Julien <julien@entreprise.com>
Date:   2024-06-06

    sync : activity recorded for 2024-06-06
```

---

## 🔒 Confidentialité

- ✅ Aucun code n’est copié
- ✅ Aucun accès réseau vers les dépôts pro
- ✅ Tout se fait localement, sur votre machine

---

## 🗂️ Structure du dépôt miroir

**Nom par défaut :** `gitpulse-logs`

**Contenu :**
- `README.md` avec compteur
- `PULSE.md` (optionnel)
- Historique Git simulé

---


Pour améliorer le branding de GitPulse :

Ajoute un slogan court et impactant sous le titre, par exemple :
“Gardez votre GitHub vivant, sans exposer votre code.”

Ajoute un badge visuel (SVG ou PNG) en haut du README, type “GitHub Activity Synced by GitPulse”.

Inclue un visuel ou une capture d’écran du graph de contributions avant/après, ou une animation GIF montrant le flow.

Mets en avant la confidentialité avec un encart ou une icône “100 % privé, 0 % code partagé”.

Ajoute une section “Pourquoi choisir GitPulse ?” avec 3–4 points clés (visibilité, simplicité, confidentialité, automatisation).

Soigne la section “Installation” avec un encart “En un clic”.

---

## 📦 Installation 

```bash
npm i

npm run build

npm install -g
```