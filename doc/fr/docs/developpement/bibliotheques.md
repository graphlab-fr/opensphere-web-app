---
title: Bibliothèques de développement de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 27/05/2020
update: 29/07/2020
---

Pour réaliser le site web rapidement, mais aussi améliorer la maintenabilité et la lisbilités du code source, l'équipe de développement a recouru aux bibliothèques suivantes.

!!! check "Aucune installation supplémentaire nécessaire"
	Sauf les [bibliothèques liées à Gulp.js](#gulpjs), toutes sont incluses dans le [répertoire Otletosphere](./architecture-code-source.md#arborescence-de-fichier) et ne nécessitent aucune installation supplémentaire pour fonctionner.

Sont jointes les différentes documentations pour que les développeurs puissent comprendre et adapter l'utilisation de ces bibliothèques.

## JavaScript

### Vis.js (v7.10.2)

La bibliothèque JavaScript [Vis.js](https://github.com/visjs/vis-network) nous a permis de réaliser la visualisation de la section *Réseau* grâce à deux de ses composants : *Network* et *DataSet*.

La bibliothèque nous a permis de traiter les données (stockage, tri, circulation de données entre les fonctions), mais aussi de générer le canvas, son animation et enfin la gestion des évenements en son sein (sélection, survol, zoom).

### Fuse.js (v6.4.1)

La bibliothèque JavaScript [Fuse.js](https://fusejs.io/) nous a permis de mettre en place le moteur de recherche d'entité. Elle permet de parcourir des tableaux, entre autres, d'objets JavaScript avec un critère de recherche afin d'en extraire les objets les plus pertinents.

## CSS

### Bootstrap Grid (v4.5.0)

Nous avons utilisé la partie Grid CSS de la bibliothèque [Bootstrap](https://getbootstrap.com/) afin de réaliser facilement une interface flexible pour tablette et desktop.

## Gulp.js

Retrouvez ci-dessous la liste des dépendances Node.js utilisées pour la production du code source via l'outil [Gulp.js](https://gulpjs.com/).

Cette bibliothèque modularisée n'est pas nécessaire pour l'installation, pas plus qu'elle n'a besoin d'être modifée : les [fichiers de configuration](./architecture-code-source.md#arborescence-de-fichier) `package.json` et `gulpfile.js` sont utiles aux développeurs souhaitant profiter de l'outil de production de code source Gulp.js : il est configuré sur mesure. Une [installation complémentaire](./installation.md#gulpjs) est toutefois nécessaire.

- gulp-autoprefixer : https://www.npmjs.com/package/gulp-autoprefixer
- gulp-concat : https://www.npmjs.com/package/gulp-concat
- gulp-sass : https://www.npmjs.com/package/gulp-sass
- node-sass : https://www.npmjs.com/package/node-sass