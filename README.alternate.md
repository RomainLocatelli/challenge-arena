# 🎮 ChallengeArena

> **Découvrez des défis de jeux vidéo créés par la communauté. Créez vos propres défis, participez, et votez pour les meilleures performances.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-green?style=flat-square&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)](LICENSE)

---

## 🌟 Fonctionnalités

- **📝 Créer des défis** : Concevez vos propres défis gaming et partagez-les avec la communauté
- **🏆 Participer** : Soumettez vos meilleures performances pour relever les défis
- **⭐ Voter** : Appréciez les défis et les participations les plus captivants
- **📊 Classement** : Consultez le leaderboard des meilleurs participants
- **🛡️ Modération** : Système robuste de signalement et d'administration
- **👤 Profils utilisateur** : Gérez votre compte, consultez votre historique
- **🎯 Filtrage par jeux** : Explorez les défis classés par jeu vidéo

---

## 🚀 Démarrage rapide

### Prérequis

- **Docker** & **Docker Compose** (recommandé)
- **Node.js 24+** (pour développement local)
- **Git**

### Installation

```bash
# 1. Clone le repository
git clone https://github.com/O-clock-Dublin/projet-gamerchallenges.git
cd gamerchallenge

# 2. Crée le fichier .env
cp .env.example .env

# 3. Génère les secrets (JWT_SECRET)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copie le résultat dans .env

# 4. Lance les services avec Docker
docker compose up --build

# 5. Crée la base de données
cd api
npm run db:generate
npx prisma migrate dev
```

### Accès

Une fois lancé, accédez à :

- **Frontend** : http://localhost:8008
- **API** : http://localhost:3000
- **Prisma Studio** (gestion DB) : http://localhost:5555

---

## 🏗️ Architecture

### Structure du Projet

```
gamerchallenge/
├── api/                    # Backend Express + Prisma
│   ├── src/
│   │   ├── controllers/    # Handlers des requêtes HTTP
│   │   ├── services/       # Logique métier
│   │   ├── middlewares/    # Auth, validation, erreurs
│   │   ├── routes/         # Définitions des endpoints
│   │   └── schemas/        # Validation Zod
│   ├── prisma/
│   │   ├── schema.prisma   # Modèle de données
│   │   └── migrations/     # Historique des changements DB
│   └── package.json
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/           # Pages et layout (App Router)
│   │   ├── component/     # Composants React réutilisables
│   │   └── lib/           # Utilitaires et contextes
│   └── package.json
├── compose.yml            # Orchestration Docker
└── .env                   # Variables d'environnement (⚠️ jamais committer)
```

### Stack Technique

| Composant            | Technologie                                    |
| -------------------- | ---------------------------------------------- |
| **Frontend**         | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend**          | Node.js, Express 5, TypeScript                 |
| **BDD**              | PostgreSQL 18, Prisma ORM                      |
| **Auth**             | JWT (HttpOnly cookies)                         |
| **Validation**       | Zod                                            |
| **Conteneurisation** | Docker, Docker Compose                         |

---

## 📚 Documentation des Développeurs

### Scripts Disponibles

#### API

```bash
cd api

npm run dev              # 🚀 Mode développement (watch mode)
npm run devdb            # 🚀 Dev + gestion DB automatique
npm run db:generate      # Génère Prisma Client
npm run db:migrate       # Applique les migrations
npm run db:studio        # Ouvre Prisma Studio
npm run seed             # Insère les données initiales
npm run start            # Mode production
npm run lint             # Vérifie le code
npm run lint:fix         # Corrige automatiquement
npm run format           # Formate le code (Prettier)
```

#### Client

```bash
cd client

npm run dev              # 🚀 Serveur de dev Next.js
npm run build            # 📦 Build pour production
npm run start            # Lance la build de prod
npm run lint             # Vérifie le code
npm run lint:fix         # Corrige automatiquement
npm run format           # Formate le code (Prettier)
```

### Endpoints API Principaux

| Méthode | Endpoint          | Description                 |
| ------- | ----------------- | --------------------------- |
| `POST`  | `/auth/register`  | Créer un compte             |
| `POST`  | `/auth/login`     | Se connecter                |
| `POST`  | `/auth/logout`    | Se déconnecter              |
| `GET`   | `/games`          | Lister tous les jeux        |
| `GET`   | `/challenges`     | Lister tous les défis       |
| `POST`  | `/challenges`     | Créer un défi               |
| `GET`   | `/challenges/:id` | Récupérer un défi           |
| `GET`   | `/participation`  | Lister les participations   |
| `POST`  | `/participation`  | Soumettre une participation |
| `GET`   | `/leaderboard`    | Classement des meilleurs    |
| `GET`   | `/profile`        | Profil utilisateur          |
| `POST`  | `/reports`        | Signaler un contenu         |

Pour la liste complète, consultez les fichiers dans `api/src/routes/`.

### Workflow de Développement

1. **Créer une branche** depuis `dev` ou `main`

   ```bash
   git checkout -b feature/ma-fonctionalite
   ```

2. **Faire tes modifications** et tester localement

   ```bash
   npm run lint:fix && npm run format
   ```

3. **Committer** avec des messages clairs

   ```bash
   git commit -m "feat: ajoute la fonctionnalité X"
   ```

4. **Pousser et créer une Pull Request**
   ```bash
   git push origin feature/ma-fonctionalite
   ```

---

## 🔐 Authentification

Le projet utilise **JWT avec HttpOnly cookies** pour une sécurité maximale :

- Tokens valides 7 jours
- Stockage sécurisé côté navigateur (impossible d'accéder via JavaScript)
- Vérification automatique de l'utilisateur (existence, ban, suppression)
- Passwords hachés avec **Argon2**

---

## 📦 Variables d'Environnement

Crée un fichier `.env` à la racine avec :

```env
# Database
POSTGRES_USER=gamerchallengeuser
POSTGRES_PASSWORD=ton-mot-de-passe-securise
POSTGRES_DB=gamerchallengedb
DATABASE_URL=postgresql://gamerchallengeuser:ton-mot-de-passe-securise@my-little-db:5432/gamerchallengedb

# API
JWT_SECRET=ton-secret-aleatoire-de-64-caracteres
NODE_ENV=development
RAWG_API_KEY=ta-cle-api-rawg-optionnelle
COOKIE_DOMAIN=localhost
FRONTEND_URL=http://localhost:8008

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:8008
API_INTERNAL_URL=http://api:3000
```

> **Note** : Génère un JWT_SECRET sécurisé avec :
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Clone** ton fork
3. **Crée une branche** feature (`git checkout -b feature/AmazingFeature`)
4. **Committe** tes changements (`git commit -m 'Add some AmazingFeature'`)
5. **Push** vers ta branche (`git push origin feature/AmazingFeature`)
6. **Ouvre une Pull Request**

### Conseils pour bien contribuer

- ✅ Écris du code lisible et bien commenté
- ✅ Respecte les conventions du projet (TypeScript, Zod validation)
- ✅ Ajoute des tests si possible
- ✅ Mets à jour la documentation
- ✅ Lance `npm run lint:fix` avant de committer

---

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

Développé par l'équipe **O-clock Dublin**

---

## 📞 Support & Contact

Pour toute question ou suggestion :

- 📧 **Email** : contact@gamerchallenge.com
- 🐛 **Signaler un bug** : [Créer une issue](https://github.com/O-clock-Dublin/projet-gamerchallenges/issues)
- 💬 **Discussions** : [Discussions GitHub](https://github.com/O-clock-Dublin/projet-gamerchallenges/discussions)

---

## 🎯 Roadmap

- [ ] Système de notifications
- [ ] Chat entre utilisateurs
- [ ] Défis personnalisés avec récompenses
- [ ] Intégration Twitch/YouTube
- [ ] Application mobile (React Native)
- [ ] Système de streaming intégré
- [ ] Achievements et badges

---

**Made with ❤️ for gamers by gamers**
