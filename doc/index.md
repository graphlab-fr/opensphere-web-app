---
title: Documentation de l'Opensphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 2021-02-26
lang: fr
keywords:
  - développeur
---

L’Opensphère est un logiciel de cartographie relationnelle interactive conçu par l’équipe du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/).

Les fonctionnalités du logiciel sont décrites dans le [manuel d'utilisation](https://hyperotlet.github.io/otletosphere/) de l'Otletosphère, qui constitue l'origine du projet (voir les [exemples d'utilisation](#) plus bas).

Cette documentation s’adresse aux personnes souhaitant réutiliser le code de l'Opensphère.

L'Opensphère a été conçue pour faciliter la réutilisation. Son fonctionnement nécessite uniquement un serveur web local ou en ligne. Le code est écrit en JavaScript mais il n'est pas nécessaire de connaître ce langage pour s'approprier le logiciel : il suffit de modifier le code aux endroits indiqués dans cette documentation pour l'adapter à ses données et métadonnées. Il est toutefois recommandé d’avoir des [notions de base en HTML](https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/HTML_basics).

La documentation fournit également des ressources pour personnaliser le logiciel en profondeur aux personnes maîtrisant JavaScript.

::: sommaire
1. [Installation](#)
2. [Intégration des données](#)
3. [Paramétrer le menu de description](#)
4. [Paramétrer les filtres](#)
5. [Ajouter une langue d’affichage et description](#)
6. [Modifier la description du site web](#)
7. [Environnement de développement](#)
8. [Exemples d'utilisation]()
:::

# Installation

## Pré-requis

Il vous faut un serveur web pour faire fonctionner l’Opensphère. En effet, les fichiers de données ne peuvent être captés que grâce à des protocoles propres aux serveurs.

Pour afficher l'Opensphère en local, utilisez un logiciel comme [WAMP](https://www.wampserver.com/) (Windows), [MAMP](https://www.mamp.info/fr/downloads/) (Windows, macOS) ou [XAMP](https://www.apachefriends.org/fr/index.html) (Windows, macOS, Linux).

Pour héberger l'Opensphère en ligne, il vous faudra un moyen de transférer les fichiers de l’Opensphère sur un serveur, par exemple avec un client FTP comme [FileZilla](https://filezilla-project.org/) (Windows, macOS, Linux).

## Téléchargement

Le code de l'Opensphère est hébergé sur GitHub : <https://github.com/hyperotlet/opensphere>. Pour télécharger la dernière version, rendez-vous sur [la page des téléchargements](https://github.com/hyperotlet/opensphere/releases).

Vous pouvez également cloner le dépôt via un client Git, comme par exemple [GitHub Desktop](https://desktop.github.com/) (Windows, macOS), ou via un terminal en saisissant la commande suivante :

```bash
git clone https://github.com/hyperotlet/opensphere.git
```

## Mise en route

Déplacez le dossier `opensphere` dans le dossier racine de votre serveur, ou bien configurez votre serveur pour faire du dossier `opensphere` la racine.

# Format des données

L’Opensphère requiert que les données décrivant les entités et leurs relations soient contenues séparément dans deux fichiers [JSON](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/JSON) nommés respectivement `entite.json` et `lien.json`. Ces deux fichiers doivent être placés dans le répertoire `/data`.

## Entités

### Métadonnées requises

L'exemple ci-dessous constitue une version simplifiée du fichier `entite.json`. Il présente les métadonnées qui doivent obligatoirement être présentes pour que l'Opensphère fonctionne :

```json
[{
    "label": "Paul Otlet",
    "id": 1,
    "group": "Personne",
    "description": "Fondateur du Mundaneum"
},
{
    "label": "Mundaneum",
    "id": 2,
    "group": "Institution",
    "description": "Le projet phare de Paul Otlet"
}]
```

### Ajouter des métadonnées

Vous pouvez ajouter autant de métadonnées que vous le souhaitez pour chaque entité. Ceci permet notamment de décliner les informations dans plusieurs langues. <!-- ajouter: (voir [multilinguisme](#) plus bas) -->

```json
[{
    "label": "Paul Otlet",
    "id": 1,
    "type": "Personne",
    "description": "Fondateur du Mundaneum",
    "annee_naissance": 1868,
    "annee_mort": 1944,
    "pays": "Belgique",
    "pays_en": "Belgium",
    "domaine": "Bibliographie",
    "domaine_en": "Bibliography",
    "lien_wikipedia":"https://fr.wikipedia.org/wiki/Paul_Otlet",
    "lien_wikipedia_en":"https://en.wikipedia.org/wiki/Paul_Otlet"
}]
```

<!-- Nous verrons plus tard comment [intégrer ces informations de manière systématique](#) dans l’interface. -->

## Liens

L'exemple ci-dessous constitue une version simplifiée du fichier `lien.json`. Les liens reposent sur les identifiants des entités. Les liens eux-mêmes ont un identifiant distinct. Par exemple, le lien `1` relie les entités `1` et `2`.

```json
[{
    "id": 1,
    "from": 1,
    "to": 2,
    "label": "Paul Otlet est le fondateur du Mundaneum."
}]
```

## Générer des données au format requis

Générer des données au format requis pour l'Opensphère nécessite de disposer d'outils permettant la saisie des données, leur mise en relation par un système d'identifiants uniques, et leur export au format JSON. Nous proposons des modèles Google Sheets et Airtable afin de faciliter ces différentes étapes.

### Modèle Google Sheets

Un modèle Google Sheets pour l'Opensphère est disponible à l'adresse suivante : [https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing)

[Google Sheets](https://www.google.com/sheets/about/) est un tableur classique, qui repose sur des formules pour contrôler la saisie des données. Notre modèle inclut des formules, notamment pour faire correspondre automatiquement les identifiants d'une feuille à l'autre. Afin de ne pas rencontrer de difficultés, n'oubliez pas d'étendre les formules sur plusieurs lignes après avoir saisi des données.

La saisie des données concernant les entités se fait dans la feuille « Entités ». La saisie des données concernant leurs relations se fait dans la feuille « Liens ». La feuille « Extraction » doit être remplie automatiquement grâce une formule qui remplace les noms des identités par les identifiants correspondants (grâce à la [fonction `RECHERCHEV`](https://support.google.com/docs/answer/3093318?hl=fr). Ceci permet de saisir les relations dans une interface confortable (la feuille « Liens ») tout en exportant les données au format requis depuis une feuille ad hoc (la feuille « Extraction »).

Pour exporter les données au format JSON, installez l’extension [Export Sheet Data](https://workspace.google.com/marketplace/app/export_sheet_data/903838927001) depuis l’onglet `Modules complémentaires` dans Google Sheets.

Une fois l'extension installée, cliquez sur `Modules complémentaires` › `Export Sheet Data` › `Open Sidebar`. Suivez les instructions détaillées dans la feuille « Notice export » et reprises ci-dessous :

<!-- Inclure les instructions ici. Bien préciser quelles feuilles exporter. -->

### Modèle Airtable

Un modèle Airtable pour l'Opensphère est disponible à l'adresse suivante : [https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs](https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs)

[Airtable](https://airtable.com/) est un logiciel qui permet d'utiliser une base de données via l'interface d'un tableur collaboratif en ligne. [Une documentation](https://support.airtable.com/hc/en-us) est disponible en anglais. Notre modèle inclut des règles qui permettent de contrôler la saisie des données.

Les tables « entites » et « liens » peuvent être exportées au format CSV. Vous devrez utiliser un [convertisseur CSV-JSON](http://convertcsv.com/json-to-csv.htm) pour obtenir les fichiers `entite.json` et `lien.json` requis.

# Intégration des données

Une fois les fichiers `entite.json` et `lien.json` placés dans le répertoire `/data`, il faut modifier le code de l'Opensphère pour qu'elle puisse lire les données.

![Transfert des données](transfert-data.svg)

Dans le fichier `/assets/main.js`, à partir de la ligne 20, vous allez retrouver la commande d’intégration, simplifiée ci-dessous. Elle vous permet de faire correspondre vos champs (colonnes du tableur) à des constantes. Par exemple, dans cette commande, notre champ « titre » (appelé « entite.titre » dans ce contexte) est associé à la constante « title ». Ainsi, dans le contexte du logiciel, « titre » est devenu « title ». Ce sont ces constantes que vous allez pouvoir employer lors des autres étapes de la réutilisation du logiciel.

Avec cette configuration

- on fait correspondre « label », « description » et « id » à des constantes équivalentes ;
- on traduit notre champ « titre » en constante « title » ;
- on augmente l’âge de toutes les entités de 6 ;
- on assigne la traduction du champ « titre » en français et en anglais.

```javascript
network.data.nodes.add(
    entites.map(function(entite) {
        var entiteObj = {
            // entite metas, default langage
            id: entite.id,
            label: entite.label,
            title: entite.titre,
            age: Number(entite.age) + 6,
            type: entite.type,
            description: entite.description,
            image:'./assets/photos/' + entite.image,
            // translated metas
            Fr: {
                title: entite.titre
            },
            En: {
                title: entite.titre_en
            }
        };
```

Il s’agit du même procédé quelques lignes plus bas avec les liens.

```javascript
network.data.edges.add(
    liens.map(function(lien) {
        var lienObj = {
            id: lien.id,
            from: lien.from,
            to: lien.to,
            title: lien.label,

            Fr: {
                title: lien.label
            },
            En: {
                title: lien.label_en
            }
        };
```

## Groupes

Lors de l’[intégration](#), toutes vos entités doivent être enregistrées avec une constante `group`. Celle-ci vous permet de styliser toutes les entités qui partagent la même valeur, par exemple `group: amis` représenté différemment de `group: ennemis`. Vous pouvez leur ajouter une couleur de contour commune, une forme ou tout autre [caractéristique valide pour le graphe](https://visjs.github.io/vis-network/docs/network/nodes.html).

Vous pouvez entrer les styles comme présentés ci-dessous dans le fichier `/assets/main.js`, vers la ligne 160.

```javascript
groups: { // massive styling, by group name
    amis: {shape: 'circle', color: {border: grey}, size: 20},
    ennemis: {shape: 'square', color: {border: rgb(84,84,194)}, size: 10}
}
```

## Images

Par défaut, toutes les entités doivent avoir une image, éventuellement de remplacement. Le nom complet de l’image (nom et extension, tel que `nom_image.jpg`, ou `nom_image.png`) doit apparaître dans une constante tel que `image:'./assets/photos/' + nom_image`. Les images doivent être placées dans le répertoire `/assets/photos` d’après l’instruction précédente.

Si vous souhaitez ne plus afficher d’images dans le graphe et le panneau de description, veuillez suivre les étapes suivantes :

- dans `/assets/main.js`, ligne ~30
    - retirer le champ « image » de la [commande d’intégration](#)
- dans `/assets/main.js`, ligne ~150
    - modifier le champ `shape:'image'` avec la valeur `circle`, `square` ou [autre forme valide](https://visjs.github.io/vis-network/docs/network/nodes.html)
    - modifier les champs de `groups` en retirant les valeurs `shape:'circularImage'`

## Affichage latéral

L’Opensphère permet d'afficher les informations sur chaque entité dans un panneau latéral situé à droite de l’interface. Pour chaque entité inscrite dans la base de données `entite.json` (et figurant par conséquent dans le graphe), il est possible d’afficher son `label`, son `title` (l’information `titre` ayant été réaffectée au terme `title` dans [notre exemple](#)) ou tout autre information qui a été [intégrée dans la configuration](#).

Ces informations apparaissent dans des champs que vous allez pouvoir définir et placer. Lorsqu’une entité est sélectionnée (via le graphe, l’index, le moteur de recherche ou ce même volet), l’ensemble de ces champs sont complétés avec les informations à disposition pour l’entité depuis la base de données.

Dans le fichier `index.html`, vous retrouverez une marque `LATERAL FICHE`, peu après la ligne 250. S’en suit le code intégrant le volet `<aside>` et la boîte identifiée `fiche-content`. En son sein, vous pouvez modifier tout les éléments relatifs à cet affichage.

Vous pouvez ajouter tout élément pouvant contenir du texte dans comme les balises `<span>` et `<div>` et les marquer avec l’attribut `data-meta`. C’est lui qui va permettre d’insérer comme texte dans l’élément que vous avez défini l’information passée en paramètre. Par exemple, les balises ci-dessous permet d’afficher les informations liées au constantes « title » et « description » de l’entité active.

```html
<aside id="fiche">
    …
    <main id="fiche-content">
        …
        <span data-meta="title"></span>
        <div data-meta="description"></div>
    </main>
</aside>
```

## Filtres

Les filtres sont des leviers « on/off ». Affichés sous forme de boutons en entête du site et dans le volet de filtre (affiché sur les petits écrans de tablette), ils permettent d’afficher ou de cacher les entités correspondant à certains critères. Ces critères sont renseignés dans ces mêmes boutons portant la classe `btn-group`. Il peuvent être modifiés dans le fichier `index.html`.

La valeur de l’attribut `data-type` correspond à la constante qui va être analysée. La valeur de l’attribut `data-meta` correspond à la valeur attendue de cette constante. Avec les boutons ci-dessous, il est possible respectivement d’afficher/cacher les entités pour lesquelles la constante « genre » a la valeur « homme » et la constante « group » a la valeur « institution ».

```html
<button class="btn-group" data-type="genre" data-meta="homme">homme</button>
<button class="btn-group" data-type="group" data-meta="institution">institution</button>
```

Pensez à modifier en miroir le volet de filtre `<aside id="filter-volet">`, vers la ligne 230 de `index.html`.

# Langues

Dans l’entête de la page vous trouverez les boutons de traduction du site. Il se trouvent dans la boite portant la classe `lang-box`, vers la ligne 150 de `index.html`. Vous pouvez ajouter une langue très facilement, comme pour le Russe avec l’exemple ci-dessous.

```html
<div data-lang="Ru">RU</div>
```

Une fois le bouton disposé, vous pouvez intégrer les traductions

- **au site web** : en déposant des attributs `data-lang-ru` sur les balises contenant du texte (voir exemple ci-dessous) ;

```html
<p data-lang-ru="traduction en russe">texte d’origine</p>
```

- **à la base de données** : en ajoutant des informations propre à la langue lors de l’[intégration de la configuration](#) comme ci-dessous.

```javascript
{
// entite metas, default langage
titre: entite.titre,
description: entite.description,
// translated metas
Fr: {
    title: entite.titre,
    description: entite.description
},
En: {
    title: entite.titre_en,
    description: entite.description_en
},
Ru: {
    title: entite.titre_ru,
    description: entite.description_ru
}
```

# Métadonnées du site

Les métadonnées sont les informations sur votre création récoltées par les robots qui parcourent le Web. Il s’agit du titre et de la description affichés par les moteurs de recherches. D’autres informations comme la liste des auteurs, la date de mise en ligne peuvent également être captée par des logiciels d’enregistrement comme Zotero. Pour le **référencement de votre projet**, il est primordial que vous complétiez ces champs.

Dans le fichier `index.html`, entre les lignes 15 et 97, vous êtes invités à saisir de nombreuses informations pour les attributs `content` et `href`. Nous avons laissé un texte par défaut ou bien des champs vides tels que `content="  "`.

# Environnement de développement

## Bibliothèques

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes. Elles sont été intégrées directement au code source de l’Opensphère et ne nécessitent par conséquent aucun téléchargement.

- **[Vis.js](https://github.com/visjs/vis-network) v7.10.2 (Apache License 2.0)** : réalisation la visualisation (graphe) ainsi que du système de circulation des données grâce à ses deux composants *Network* et *DataSet*.
- **[Fuse.js](https://github.com/krisk/Fuse/) v6.4.1 (Apache License 2.0)** : mise en place du moteur de recherche.
- **[Bootstrap Grid](https://github.com/twbs/bootstrap) v4.5.0 (MIT License)** : flexibilité de l’interface pour tablettes.

## Outil de développement

Nous avons fait le choix de l’outil [GulpJs](https://gulpjs.com/) pour aider au développement de l’Opensphère. Il nous permet de transpiler les fichiers JavaScript contenus dans le répertoire `/dist` en `main.js`. Ainsi, on compense la complexité du projet (un millier de ligne de JavaScript), la variété des modules (une dizaine d’objets), en la répartissant dans quelques fichiers d’une centaine de lignes.

Une fois GulpJs lancé, il suffit de modifier l’un des fichiers du répertoire `/dist` pour que les modifications soient répercutées au niveau global (dans le répertoire `/assets`). Au début de chaque fichier, vous pourrez trouver une description de son contenu et d’autres commentaires sur le code source.

Pour utiliser Gulp, veuillez suivre les [consignes d’installation](https://gulpjs.com/docs/en/getting-started/quick-start), puis exécuter successivement les commandes suivantes dans votre terminal. L’ensemble des instructions sont commentées dans le fichier `gulpfile.js`.

```
npm i
gulp watch
```

# Exemples d'utilisation

Les projets suivants ont été réalisés à l’aide du logiciel Opensphère. Ils peuvent vous servir d’exemple, d’inspiration pour réaliser votre propre réutilisation.

- **Otletosphère** : réalisée par l’équipe du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/) autour de Paul Otlet.
    - site : [http://hyperotlet.huma-num.fr/otletosphere/](http://hyperotlet.huma-num.fr/otletosphere/)
    - code source : [https://github.com/hyperotlet/otletosphere](https://github.com/hyperotlet/otletosphere)
- **OpenDataSphère** : réalisée par les étudiantes et étudiants de la [licence professionnelle MIND](http://www.infonumbordeaux.fr/mind/) pour traiter de l’open data en France.
    - site : [http://hyperotlet.huma-num.fr/opendatasphere/](http://hyperotlet.huma-num.fr/opendatasphere/)
    - code source : [https://github.com/hyperotlet/opendatasphere](https://github.com/hyperotlet/opendatasphere)
