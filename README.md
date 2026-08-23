# EcoRide

EcoRide est une application web de covoiturage **en cours de développement**. Elle permet déjà de définir un itinéraire complet depuis le bouton **« Proposer un trajet »**, de comparer un parcours avec ou sans péages et de le visualiser sur une carte. N’hésitez pas à tester ce parcours et à parcourir le code.

Lien vers l'application pour tester la proposition de voyage : https://ecoride-brown.vercel.app/

## Technologies

- **Frontend :** React 19, TypeScript, Vite, SCSS, React Router, React Hook Form, Zod et OpenLayers.
- **Backend :** PHP 8.3, Symfony 7.4, Doctrine ORM/ODM, MySQL 8.4 et MongoDB 7.
- **Infrastructure :** Docker Compose, Node.js 22, Nginx, phpMyAdmin et ESLint.
- **API et cartographie :** API Adresse de data.gouv.fr, Geoapify Routing et fonds de carte OpenStreetMap.

## Tester localement

```bash
cp ecoride-front-end/.env.example ecoride-front-end/.env
docker compose up --build
```

Ajoutez votre clé Geoapify dans `ecoride-front-end/.env`, puis ouvrez [http://localhost:5173](http://localhost:5173). Une démonstration en ligne sera ajoutée prochainement.
