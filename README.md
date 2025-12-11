# 🏥 VitaCare - Plateforme de Gestion de Santé Personnelle

<div align="center">

**Une application moderne et complète pour gérer vos documents médicaux et suivre votre santé**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 📋 Table des Matières

-  [À Propos](#à-propos)
-  [Fonctionnalités](#fonctionnalités)
-  [Technologies Utilisées](#technologies-utilisées)
-  [Architecture du Projet](#architecture-du-projet)
-  [Prérequis](#prérequis)
-  [Installation](#installation)
-  [Configuration](#configuration)
-  [Utilisation](#utilisation)
-  [API Endpoints](#api-endpoints)
-  [Équipe de Développement](#équipe-de-développement)
-  [Licence](#licence)

---

## 🎯 À Propos

**VitaCare** est une plateforme web moderne et intuitive conçue pour aider les utilisateurs à gérer efficacement leurs documents médicaux et suivre leur état de santé. L'application offre une interface utilisateur élégante, avec des fonctionnalités avancées de gestion documentaire, de traduction automatique et de suivi des informations médicales personnelles.

### 🎨 Points Forts

-  🔒 **Sécurité avancée** avec JWT et OAuth2 (Google)
-  📄 **Gestion documentaire** complète avec upload, visualisation PDF et organisation par tags
-  🌍 **Traduction automatique** de documents médicaux
-  📊 **Tableau de bord** interactif avec statistiques de santé
-  👤 **Profil utilisateur** détaillé avec informations médicales
-  🎨 **Interface moderne** avec Ant Design en français
-  📱 **Responsive Design** pour tous les appareils

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

-  **OAuth2 Google** pour une connexion rapide et sécurisée
-  **JWT (JSON Web Tokens)** pour la gestion de sessions
-  **Protection des routes** et authentification persistante

### 📁 Gestion de Documents

-  **Upload de fichiers** (PDF, images) jusqu'à 10MB
-  **Visualisation PDF** intégrée avec navigation
-  **Organisation par tags** personnalisables
-  **Filtrage et tri** des documents (récent, alphabétique, type)
-  **Recherche intelligente** par nom ou type de fichier
-  **Suppression sécurisée** de documents

### 🌐 Traduction de Documents

-  **Extraction automatique** du texte des PDF
-  **Traduction instantanée**
-  **Interface modale** élégante pour visualiser les traductions
-  **Détection automatique** de la langue source

### 👤 Profil Utilisateur Complet

#### Informations Démographiques

-  Nom, prénom, email, téléphone
-  Date de naissance avec calcul automatique de l'âge
-  Genre (Homme/Femme)
-  Photo de profil (upload ou Google)

#### Données Médicales

-  Groupe sanguin (A+, A-, B+, B-, AB+, AB-, O+, O-)
-  Taille et poids avec calcul automatique de l'IMC
-  Allergies
-  Maladies chroniques
-  Médicaments actuels

#### Statistiques de Santé

-  Progression du profil en pourcentage
-  Alertes médicales actives
-  Nombre de documents et étiquettes
-  Membre depuis (année d'inscription)

### 📊 Tableau de Bord

-  **Cartes statistiques** : documents, étiquettes, alertes médicales
-  **Informations personnelles** : démographie, métriques de santé, alertes
-  **Barre de recherche globale** pour trouver rapidement des documents
-  **Navigation intuitive** avec sidebar personnalisée

---

## 🛠 Technologies Utilisées

### Backend

| Technologie              | Version | Usage                           |
| ------------------------ | ------- | ------------------------------- |
| **Spring Boot**          | 3.5.4   | Framework principal             |
| **Spring Security**      | 6.x     | Authentification & autorisation |
| **Spring Data JPA**      | 3.x     | ORM et accès aux données        |
| **Spring OAuth2 Client** | 6.x     | Authentification Google         |
| **MySQL**                | 8.0     | Base de données                 |
| **JWT (JJWT)**           | 0.11.5  | Gestion des tokens              |
| **Lombok**               | 1.18.38 | Réduction du code boilerplate   |
| **Maven**                | 3.x     | Gestion des dépendances         |
| **Java**                 | 21      | Langage de programmation        |

### Frontend

| Technologie      | Version  | Usage                      |
| ---------------- | -------- | -------------------------- |
| **React**        | 18.3.1   | Bibliothèque UI            |
| **Ant Design**   | 5.27.1   | Framework de composants UI |
| **React Router** | 7.8.2    | Gestion de la navigation   |
| **Axios**        | 1.11.0   | Client HTTP                |
| **Moment.js**    | 2.30.1   | Gestion des dates          |
| **React PDF**    | 6.2.2    | Visualisation PDF          |
| **PDF.js**       | 3.11.174 | Extraction de texte PDF    |
| **JWT Decode**   | 4.0.0    | Décodage des tokens JWT    |

---

## 🏗 Architecture du Projet

```
VitaCare/
│
├── backend/                          # Application Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/vitacare/vitacare/
│   │   │   │   ├── Config/           # Configuration Spring Security
│   │   │   │   ├── Controller/       # Contrôleurs REST API
│   │   │   │   ├── DTO/              # Data Transfer Objects
│   │   │   │   ├── Model/            # Entités JPA
│   │   │   │   ├── Payload/          # Request/Response models
│   │   │   │   ├── Repository/       # Interfaces JPA Repository
│   │   │   │   ├── Security/         # JWT & OAuth2
│   │   │   │   ├── Service/          # Logique métier
│   │   │   │   └── Util/             # Utilitaires
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Tests unitaires
│   ├── uploads/                      # Stockage des fichiers uploadés
│   └── pom.xml                       # Configuration Maven
│
├── frontend/                         # Application React
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── assets/                   # Images et ressources
│   │   ├── components/               # Composants React
│   │   │   ├── AuthCard.jsx          # Authentification
│   │   │   ├── Documents.jsx         # Gestion documents
│   │   │   ├── GestionProfile.jsx    # Profil utilisateur
│   │   │   ├── Sidebar/              # Navigation
│   │   │   └── ...
│   │   ├── constants/                # Constantes (couleurs, config)
│   │   ├── contexts/                 # Context API React
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # Pages principales
│   │   │   ├── Dashboard.jsx         # Tableau de bord
│   │   │   ├── LoginPage.jsx         # Page de connexion
│   │   │   └── ...
│   │   ├── styles/                   # Fichiers CSS
│   │   ├── utils/                    # Fonctions utilitaires
│   │   │   └── api.js                # Configuration API
│   │   ├── App.jsx                   # Composant principal
│   │   └── index.js                  # Point d'entrée
│   └── package.json                  # Dépendances npm
│
└── README.md                         # Ce fichier
```

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

-  **Java JDK 21** ou supérieur
-  **Node.js 18+** et npm
-  **MySQL 8.0** ou supérieur
-  **Maven 3.6+**
-  Un IDE (IntelliJ IDEA, Eclipse, VS Code)
-  Git pour le cloning

---

## 💻 Utilisation

### Première Connexion

1. **Inscription** : Créez un compte avec email et mot de passe
2. **Connexion Google** : Ou utilisez votre compte Google
3. **Compléter le profil** : Ajoutez vos informations médicales
4. **Uploader des documents** : Commencez à organiser vos documents médicaux

### Gestion des Documents

1. **Upload** : Glissez-déposez ou sélectionnez des fichiers (PDF, images)
2. **Organiser** : Ajoutez des tags pour catégoriser vos documents
3. **Filtrer** : Utilisez les filtres par tag et options de tri
4. **Traduire** : Cliquez sur l'icône de traduction pour les PDFs
5. **Visualiser** : Prévisualisez les documents directement dans l'application

### Gestion du Profil

1. **Modifier** : Cliquez sur "Modifier mon profil"
2. **Remplir** : Complétez toutes les informations médicales
3. **Photo** : Uploadez une photo de profil personnalisée
4. **Enregistrer** : Sauvegardez vos modifications

---

## 👥 Équipe de Développement

### Développeurs

<table>
  <tr>
    <td align="center">
      <strong>Rayen Drira</strong><br>
      <a href="mailto:rayen.drira@outlook.com">rayen.drira@outlook.com</a><br>
      Backend & Security
    </td>
    <td align="center">
      <strong>Hiba Dammak</strong><br>
      <a href="mailto:hiba@gmail.com">hiba@gmail.com</a><br>
      Frontend & UI/UX
    </td>
  </tr>
</table>

---

## 🔐 Sécurité

-  **Authentification JWT** avec expiration automatique
-  **Mots de passe hashés** avec Spring Security
-  **OAuth2 sécurisé** avec Google
-  **CORS configuré** pour la production
-  **Validation des entrées** côté backend et frontend
-  **Protection CSRF** pour les requêtes sensibles

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

<div align="center">

**Fait avec ❤️ par l'équipe VitaCare**

⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !

</div>

---
