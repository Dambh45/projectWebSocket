## ENVIRONNEMENT

  **Contenu du .env du backend**

  DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"\
  POSTGRES_USER="user"\
  POSTGRES_PASSWORD="password"\
  POSTGRES_DB="mydb"\
  JWT_SECRET="ma_super_cle_ultra_secrete"

  **Contenu du .env du frontend**

  NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"

## INITIALISATION

### Initialisation du backend
Installation des packets    
    
    npm install
    
Lancement de la base

    docker compose up

Migrations de la base

    npx prisma migrate dev

Création du jeu de données

    npm run fixtures

Lancement du backend

    npm run start:dev

## Initialisation du frontend 
Installation des packets

    npm install

Lancement du frontend

    npm run dev

## UTILISATION

  **Accès à l'application** à l'addresse **http://localhost:3000**

  **Jeu de données :**
  - 2 Utilisateurs :
    - 1 ADMIN
    - 1 USER
  - 2 Channels : 
    - Salle 1
    - Salle 2 
  - L'utilisateur "USER" est white list sur la Salle 2

  **Accès compte admin : admin@test.com | admin1234** \
  **Accès compte user : user@test.com | user1234**

## FONCTIONNALITES

L’application permet aux utilisateurs de :
 - Créer un compte, se connecter et modifier leur profil (nom, prénom, email, couleur associée)
 - La couleur du profil est utilisée pour personnaliser l’affichage du nom dans les chats, logs, et profil utilisateur
 - Discuter via des channels de discussion, chacun accessible uniquement si l’utilisateur est présent dans la whitelist de ce channel ou possède le rôle ADMIN
 - Les messages sont conservés en base de données, et visibles à chaque reconnexion
 - Seuls les ADMIN peuvent créer ou supprimer des channels, ainsi qu’ajouter / retirer des utilisateurs de chaque channel
 - Un système de log sont accessible uniquement aux ADMIN et permet de tracer les connexions / déconnexions des utilisateurs à chaque channel
 - L’application vérifie les rôles pour toute action sensible (authentification protégée, mots de passe hashés, autorisations)
