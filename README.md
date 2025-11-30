# Gestion des Agences et Contacts

Ce projet est une application Next.js avec Clerk pour l'authentification, Prisma pour l'accès à la base de données, et Tailwind CSS pour le style. Il permet de gérer des agences et leurs contacts associés.

## Table des matières

1. [Prérequis](#prérequis)
2. [Architecture du projet](#architecture-du-projet)
3. [Diagrammes](#diagrammes)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Utilisation](#utilisation)
7. [Scripts disponibles](#scripts-disponibles)
8. [Structure du projet](#structure-du-projet)
9. [Fonctionnalités](#fonctionnalités)
10. [Déploiement](#déploiement)
11. [Contributions](#contributions)
12. [License](#license)

## Prérequis

- Node.js (v18.x ou supérieur)
- PostgreSQL (v14.x ou supérieur)
- Compte Clerk (pour l'authentification)
- npm ou yarn (gestionnaire de paquets)

## Architecture du projet

L'application est divisée en deux parties principales :

1. **Backend** : Gestion des données avec Prisma et PostgreSQL
2. **Frontend** : Application Next.js avec interface utilisateur

Les deux parties communiquent via une base de données PostgreSQL partagée.

## Diagrammes

### 1. Architecture globale

```mermaid
graph TD
    subgraph "Backend"
        A[Data CSV] --> B[Script de seed]
        B --> C[Base de données PostgreSQL]
        C --> D[Prisma ORM]
    end
    
    subgraph "Frontend"
        E[Application Next.js] --> F[Composants React]
        F --> G[Interface utilisateur]
        E --> H[Clerk Auth]
        H --> I[Authentification des utilisateurs]
        E --> J[Appels API]
        J --> C
    end
    
    K[Utilisateur] --> I
    K --> G
```

### 2. Modèle de données

```mermaid
erDiagram
    Agency {
        string id PK
        string name
        string state
        string state_code
        string type
        int population
        string website
        int total_schools
        int total_students
        string mailing_address
        string grade_span
        string locale
        string csa_cbsa
        string domain_name
        string physical_address
        string phone
        string status
        float student_teacher_ratio
        string supervisory_union
        string county
        datetime created_at
        datetime updated_at
    }
    
    Contact {
        string id PK
        string first_name
        string last_name
        string email
        string phone
        string title
        string email_type
        string contact_form_url
        datetime created_at
        datetime updated_at
        string agency_id FK
        string firm_id
        string department
    }
    
    ContactView {
        string id PK
        string userId
        string contactId FK
        datetime viewedAt
    }
    
    Agency ||--o{ Contact : has
    Contact ||--o{ ContactView : tracked
```

### 3. Flux d'authentification

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant C as Clerk
    participant A as Application
    participant DB as Base de données
    
    U->>C: Connexion
    C->>U: Redirection après authentification
    U->>A: Navigation
    A->>C: Vérification du token
    C-->>A: Validation du token
    A->>DB: Récupération des données
    DB-->>A: Données
    A->>U: Affichage de l'interface
```

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <URL-du-dépôt>
   cd clerk
   ```

2. Installez les dépendances :
   ```bash
   # Pour le backend
   npm install

   # Pour le frontend
   cd clerk-dashboard
   npm install
   ```

## Configuration

### 1. Base de données

Configurez votre base de données PostgreSQL :

1. Créez une base de données PostgreSQL
2. Mettez à jour le fichier `.env` avec l'URL de votre base de données :
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ma_base?schema=public"
   ```

### 2. Clerk

Configurez l'authentification Clerk :

1. Créez un compte sur [clerk.dev](https://clerk.dev)
2. Créez une nouvelle application
3. Copiez les clés de votre application et ajoutez-les au fichier `.env.local` dans le dossier `clerk-dashboard` :
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

4. Configurez les routes et les utilisateurs dans le tableau de bord Clerk

### 3. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `clerk-dashboard` avec les variables suivantes :

```env
# Variables Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Variables de base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/ma_base?schema=public"
```

## Utilisation

1. Initialisez la base de données :
   ```bash
   # Exécutez les commandes depuis le dossier principal
   npm run setup
   ```

2. Démarrez le serveur de développement :
   ```bash
   # Pour le frontend
   cd clerk-dashboard
   npm run dev
   ```

3. Ouvrez votre navigateur et accédez à `http://localhost:3000`

## Scripts disponibles

### Backend

- `npm run seed` - Exécute le script de remplissage de la base de données avec les données CSV
- `npm run setup` - Génère le client Prisma, pousse le schéma à la base de données et exécute le seed

### Frontend

- `npm run dev` - Démarre le serveur de développement Next.js
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Exécute l'outil de linting ESLint

## Structure du projet

```
clerk/
├── clerk-dashboard/          # Application Next.js
│   ├── app/                 # Pages et layouts Next.js
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Pages du tableau de bord
│   │   ├── sign-in/         # Page de connexion
│   │   ├── sign-up/         # Page d'inscription
│   │   ├── layout.tsx       # Layout racine
│   │   └── page.tsx         # Page d'accueil
│   ├── components/           # Composants React
│   │   ├── ui/              # Composants UI de base
│   │   ├── dashboard-client.tsx # Composant principal du tableau de bord
│   │   └── upgrade-prompt.tsx    # Composant de mise à jour
│   ├── prisma/              # Configuration Prisma
│   │   ├── schema.prisma    # Schéma de la base de données
│   │   └── seed.js          # Script de remplissage
│   ├── public/              # Fichiers statiques
│   ├── tailwind.config.ts   # Configuration Tailwind CSS
│   ├── next.config.ts       # Configuration Next.js
│   ├── middleware.ts        # Middleware Next.js
│   └── ...                  # Autres fichiers de configuration
├── data/                    # Fichiers CSV de données
│   ├── agencies_agency_rows.csv
│   └── contacts_contact_rows.csv
├── prisma/                   # Configuration et schéma Prisma
│   ├── schema.prisma        # Schéma de la base de données
│   └── seed.js             # Script de remplissage de la base de données
├── package.json             # Dépendances du backend
└── ...
```

## Fonctionnalités

### Authentification

- Système d'authentification sécurisé avec Clerk
- Inscription, connexion et déconnexion
- Gestion des sessions
- Protection des routes

### Gestion des agences

- Affichage de la liste des agences
- Recherche et filtrage des agences
- Détails d'une agence spécifique
- Informations complètes sur chaque agence (adresse, téléphone, site web, etc.)

### Gestion des contacts

- Affichage de la liste des contacts
- Recherche et filtrage des contacts
- Détails d'un contact spécifique
- Liaison entre contacts et agences
- Suivi des vues de contacts

### Interface utilisateur

- Design responsive avec Tailwind CSS
- Interface intuitive et moderne
- Composants réutilisables
- Thème personnalisable

## Déploiement

### Vercel (recommandé)

1. Téléchargez votre code sur GitHub
2. Connectez votre compte GitHub à Vercel
3. Importez votre projet
4. Configurez les variables d'environnement
5. Déployez

### Autres plateformes

Pour déployer ce projet, vous pouvez utiliser également :

- Netlify
- Heroku
- AWS
- Tout autre service qui prend en charge Node.js et PostgreSQL

Assurez-vous de configurer les variables d'environnement sur votre plateforme de déploiement :

```env
# Variables Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Variables de base de données
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

## Contributions

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Support

Pour toute question ou support, veuillez ouvrir une issue sur GitHub ou contacter moi .
