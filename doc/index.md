---
title: Documentation de développement Opensphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 2021-02-26
lang: fr
github: https://github.com/hyperotlet/opensphere
keywords:
  - développeur
---

Cette documentation technique s’adresse aux réutilisateurs (gestionnaire de données, développeurs) souhaitant **créer** leur propre Opensphère. Nous avons mis à disposition une [autre documentation dédiée aux utilisateurs souhaitant comprendre comment utiliser son interface](https://hyperotlet.github.io/otletosphere/). Nous vous recommandons sa lecture pour prendre pleinement conscience de l’ensemble des fonctionnalités du logiciel.

L’Opensphère est un logiciel permettant de présenter une cartographie relationnelle. C’est un nuage de nœuds reliés par des liens et interactif. Une [série de fonctionnalités](https://hyperotlet.github.io/otletosphere/) (graphe, moteur de recherche, index…) permettent d’explorer au sein d’une base de données (menu de description, liste des relations…). Vous trouverez des [exemples de réutilisation sur cette page](). Le logiciel a été conçu par l’équipe du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/).

Nous avons facilité au maximum la mise en place de ce système. Il peut être installé sur un serveur web (local ou en ligne). Il n’est pas nécessaire pour les réutilisatrices et réutilisateurs de savoir programmer en JavaScript, mais vous faudra plonger dans le code et y modifier des termes dans une logique sémantique, dupliquer des structures syntaxiques déjà construites. Des instructions et interface graphiques vous permettent de personnaliser le logiciel et ses données. Il est toutefois recommandé d’avoir des [notions de base en langage HTML](https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/HTML_basics).

1. [Téléchargement et déploiement](#téléchargement-et-déploiement)
2. [Intégration de la base de données](#intégration-de-la-base-de-données)
3. [Paramétrer le menu de description](#paramétrer-le-menu-de-description)
4. [Paramétrer les filtres](#paramétrer-les-filtres)
5. [Ajouter une langue d’affichage et description](#ajouter-une-langue-daffichage-et-description)

Les développeurs maîtrisant le langage JavaScript pourront également trouver des ressources pour personnaliser le logiciel en profondeur.

6. [Environnement de développement](#environnement-de-développement)

# Téléchargement et déploiement

Les consignes suivantes permettent de télécharger et d’installer le logiciel afin de l’utiliser pour votre propre projet. Nous vous rappelons que vous aurez besoin d’un [serveur web (local ou en ligne)](#mise-en-route) pour le faire fonctionner. Veillez à adapter l’emplacement de votre installation dans ce sens.

## Téléchargement

La dernière version testée du code source est entreposée sur [notre dépôt GitHub](https://github.com/hyperotlet/opensphere). Plusieurs méthodes d’installation s’offrent à vous.

Vous pouvez [**télécharger l’ensemble des fichiers** en suivant ce lien](https://github.com/hyperotlet/opensphere/archive/master.zip). Il s’agit de la version « master » du logiciel, stable et vérifiée. Vous n’avez alors plus qu’à décompresser ([sur Windows](https://support.microsoft.com/fr-fr/windows/compresser-et-d%C3%A9compresser-des-fichiers-8d28fa72-f2f9-712f-67df-f80cf89fd4e5), [sur MacOs](https://support.apple.com/fr-fr/guide/mac-help/mchlp2528/mac)) l’archive téléchargée.

Deux autres méthodes vous permettent de **conserver l’historique de développement**, utile si vous souhaitez à votre tour élaborer différentes versions de votre Opensphère grâce à l’outil [Git](https://git-scm.com/).

- **Via une ligne de commande**, si vous avez installé le [logiciel Git](https://git-scm.com/). La commande `git clone https://github.com/hyperotlet/opensphere.git` inclue l’ensemble des fichiers et l’historique de développement.
- **Via [GitHub Desktop](https://desktop.github.com/)**, une interface graphique intégrant Git.

## Mise en route

Il vous faut un serveur web pour faire fonctionner l’Opensphère. Les fichiers de données ne peuvent être captés que grâce à des protocoles propres aux serveurs. Votre serveur peut être

- **en local**, grâce à un logiciel comme [WAMP](https://www.wampserver.com/) (Windows), [MAMP](https://www.mamp.info/en/downloads/) (MacOs, Windows) ou [XAMP](https://www.apachefriends.org/fr/index.html) (MacOs, Windows, Linux) ;
- **en ligne**, et dans ce cas il vous faut transférer les fichiers de l’Opensphère grâce à un [client FTP, comme FileZilla](https://filezilla-project.org/) (Windows, MacOs, Linux).

Déplacez vos fichiers à la source de votre serveur ou déplacez la source pour que la racine soit le fichier `index.html`.

# Intégration de la base de données

[Plusieurs outils](#enregistrement-des-données) vous permettent de créer une base de données adaptée à l’Opensphère. Nous allons d’abord nous intéresser aux contraintes dues à l’environnement du logiciel. Elles vont vous permettre d’utiliser des outils de manière adaptée et que nous allons présenter à la fin de ce tutoriel.

## Fichiers de données

L’Opensphère extrait les données de deux [fichiers JSON](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/JSON), contenus dans le répertoire `/data`. Vous trouverez un exemple de chaque dans le répertoire initial :

- `entite.json` : liste des entités du graphe, correspondant aux nœuds ;
- `lien.json` : liste des liens entre ces nœuds.

### Entrées minimums

Soit ci-dessous un exemple simplifié du fichier `entite.json`. Le nœud appelé « Paul Otlet » possède l’identifiant **unique** « 1 » et appartient au groupe « Personne ». Ce sont les informations minimums pour afficher une entité, la filtrer parmi toutes les autres.

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

On complète ce premier fichier avec l’entrée suivante dans `lien.json`. **Tout le système de liaison repose sur les identifiants** : le lien « 1 » relie les nœuds « 1 » et « 2 » correspondant respectivement à nos deux entités, précédentes. On ajoute par ailleurs un label à la liaison pour constituer le niveau d’information minimum des liens.

```json
[{
    "id": 1,
    "from": 1,
    "to": 2,
    "label": "Paul Otlet est le fondateur du Mundaneum."
}]
```

### Données de description

Vous pouvez ajouter autant d’informations que vous le souhaitez pour chaque entité. Comme illustré ci-dessous, vous pouvez renseigner des dates, des catégories. Vous pouvez faire cela dans plusieurs langues si vous souhaitez obtenir une [description multilingue des entités](#ajouter-une-langue-daffichage-et-description).

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

Nous verrons plus tard comment [intégrer ces informations de manière systématique](#intégration) dans l’interface.

## Enregistrement des données

Nous avons besoin d’outils qui vont nous permettre d’enregistrer nos données, de mettre en relation nos entités (faire correspondre de leurs identifiants **uniques**) et enfin d’obtenir ces données au format JSON.

Les tableurs sont les interfaces les plus efficaces. Ils vous permettent de compléter systématiquement une liste d’entité (en ligne) pour une série d’informations (en colonne) que vous avez décidé de renseigner. Vous verrez rapidement les cases qu’il vous reste à compléter, les informations que vous pouvez croiser à l’aide de formules (calcul) ou formater (limiter à des nombres, comme pour les dates).

Nous vous proposons deux outils en ligne collaboratifs. Ce sont deux tableurs que vous pourrez utiliser avec une équipe et éventuellement simultanément.

Pour aller plus vite, nous vous proposons des modèles à dupliquer pour votre propre compte. Vous retrouverez pour chaque modèle les tables « entites » et « liens » vous permettant d’enregistrer vos nœuds.

Faites bien attention à distribuer les identifiants **uniques** dans les colonnes « id » prévues à cet effet.

### Airtable

Pour les personnes qui sont habituées aux tableurs comme Excel, Calc ou Sheet, [Airtable](https://airtable.com/) peut être un peu déroutant. Ça n’est pas un tableau de calcul, mais bien une série de tables de données comme en utilisent les professionnels des bases de données. L’interface reste simple et la [documentation (en anglais)](https://support.airtable.com/hc/en-us) bien fournie. Il est plus facile d’y mettre en place une vérification, correspondance systématique des données en limitant les entrées potentielles dans une colonne d’une table « A » au contenu d’une table « B ». Nous avons déjà assuré la correspondance des identifiants dans le modèle ci-après.

Retrouvez sur la page suivante un modèle de base de données adapté à l’Opensphère : [https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs](https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs)

L’export se fait en CSV pour les deux tables « entites » et « liens ». Vous devrez utiliser un [convertisseur CSV → JSON](http://convertcsv.com/json-to-csv.htm) pour obtenir les fichiers `entite.json` et `lien.json`.

### Google Sheet

C’est un tableur traditionnel dont les vérifications, correspondances entre les colonnes sont assurées par des formules. Sur notre modèle de données, que vous pourrez retrouver ci-après, nous avons automatisé la correspondance des identifiants. Veillez toutefois à étendre les formules dans les colonnes une fois que vous avez effectué des entrées.

Retrouvez sur la page suivante un modèle de base de données adapté à l’Opensphère : [https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing)

L’export se fait en CSV pour les deux feuilles « Entites » et « Extraction ». Cette dernière est une image de la feuille « Liens » portant les identifiants reconnus par le logiciel. Grâce à la [fonction `RECHERCHEV`](https://support.google.com/docs/answer/3093318?hl=fr), les labels mis en relation dans la feuille « Liens » sont remplacés par leurs identifiants respectifs (d’après dans le feuille « Entites ») dans la feuille « Extraction ».

Vous pouvez également exporter les données directement en JSON. Pour cela installez l’extension *Export Sheet Data* depuis l’onglet « Modules complémentaires » dans Google Sheet. Une fois installée, vous pouvez la retrouver dans le même onglet et afficher le panneau de l’outil avec le bouton « Open Sidebar ». La configuration de ce dernier est détaillée dans [la feuille « Notice export »](https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit#gid=1378398983).

## Intégration

Une fois les fichiers `entite.json` et `lien.json` obtenus (renommez vos exports si nécessaire), vous devez les placer dans le répertoire `/data`, en remplacement des deux fichiers d’exemple. Vos données peuvent alors être captées par le logiciel. Il faut maintenant les intégrer (« brancher ») à son flux interne.

![Transfère des données](transfert-data.svg)

Dans le fichier `/assets/main.js`, à partir de la ligne 20, vous allez retrouver la commande d’intégration, simplifiée ci-dessous. Elle vous permet de faire correspondre vos champs (colonnes du tableur) à des constantes. Par exemple, dans cette commande, notre champ « titre » (appelé « entite.titre » dans ce contexte) est associé à la constante « title ». Dans le contexte du logiciel, « titre » est devenu « title ». Ce sont ces constantes que vous allez pouvoir employer lors des autres étapes de la réutilisation du logiciel.

Avec cette configuration

- on fait correspondre « label », « description » et « id » à des constantes équivalentes ;
- on traduit notre champ « titre » en constante « title » ;
- on augmente l’âge de toutes les entités de 6 ;
- on assigne la traduction du champ « titre » en français et en anglais.

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

Lors de l’[intégration](#intégration), toutes vos entités doivent être enregistrées avec une constante `group`. Celle-ci vous permet de styliser toutes les entités qui partagent la même valeur, par exemple `group: amis` représenté différemment de `group: ennemis`. Vous pouvez leur ajouter une couleur de contour commune, une forme ou tout autre [caractéristique valide pour le graphe](https://visjs.github.io/vis-network/docs/network/nodes.html).

Vous pouvez entrer les styles comme présentés ci-dessous dans le fichier `/assets/main.js`, vers la ligne 160.

```javascript
groups: { // massive styling, by group name
    amis: {shape: 'circle', color: {border: grey}, size: 20},
    ennemis: {shape: 'square', color: {border: rgb(84,84,194)}, size: 10}
}
```

## Images

Par défaut, toutes les entités doivent avoir une image, éventuellement de remplacement. Si vous souhaitez ne plus afficher d’images dans le graphe et le panneau de description, veuillez suivre les étapes suivantes :

- dans `/assets/main.js`, ligne ~30)
    - retirer le champ « image » de la [commande d’intégration](#intégration)
- dans `/assets/main.js`, ligne ~150)
    - modifier le champ `shape:'image'` avec la valeur « circle », « square » ou [autre forme valide](https://visjs.github.io/vis-network/docs/network/nodes.html)
    - modifier les champs de `groups` en retirant les valeurs `shape:'circularImage'`

# Paramétrer le menu de description

Lors de l’utilisation de l’Opensphère, l’utilisateur est amené à consulter le menu de description, un volet apparaissant à droite de l’interface et contenant des informations sur les entités. Pour chaque entité inscrite dans la base de données `entite.json` (et figurant par conséquent dans le graphe), il est possible d’afficher son `label`, son `title` (l’information `titre` ayant été réaffectée au terme `title` dans notre exemple) ou tout autre information qui a été [intégrée dans la configuration](#intégration).

Ces informations apparaissent dans des champs que vous allez pouvoir placer et définir. Lorsqu’une entité est sélectionnée (via le graphe, l’index, le moteur de recherche ou ce même volet), l’ensemble de ces champs sont complétés avec les informations à disposition pour l’entité depuis la base de données.

## Intégration des champs

Dans le fichier `index.html`, vous retrouverez une marque `LATERAL FICHE`, peu après la ligne 250. S’en suit le code intégrant le volet `<aside>` et la boîte identifiée `fiche-content`. En son sein, vous pouvez modifier tout les éléments relatifs à cet affichage.

Vous pouvez ajouter tout élément pouvant contenir du texte dans comme les balises `<span>` et `<div>` et les marquer avec l’attribut `data-meta`. C’est lui qui va permettre d’insérer comme texte dans l’élément que vous avez défini l’information passée en paramètre. Par exemple, la balises `<span>` ci-dessous permet d’afficher l’information « description » de l’entité active.

```html
<aside id="fiche">
    …
    <main id="fiche-content">
        …
        <span data-meta="description"></p>
    </main>
</aside>
```

# Paramétrer les filtres

Les filtres sont des leviers « on/off ». Affichés sous forme de boutons en entête du site et dans le volet de filtre (affiché sur les petits écrans de tablette), ils permettent d’afficher ou de cacher les entités correspondant à certains critères. Ces critères sont renseignés dans ces mêmes boutons portant la classe `btn-group`. Il peuvent être modifiés dans le fichier `index.html`.

La valeur de l’attribut `data-type` correspond au [champ](#intégration) qui va être analysé. La valeur de l’attribut `data-meta` correspond à la valeur pivot. Avec les boutons ci-dessous, il est possible respectivement d’afficher/cacher les entités pour lesquelles le champ « genre » a la valeur « homme » et le champ « group » a la valeur « institution ».

```html
<button class="btn-group" data-type="genre" data-meta="homme">homme</button>
<button class="btn-group" data-type="group" data-meta="institution">institution</button>
```

Pensez à modifier en miroir le volet de filtre `<aside id="filter-volet">`.

# Ajouter une langue d’affichage et description

Dans l’entête de la page vous trouverez les boutons de traduction du site. Il se trouvent dans la boite portant la classe `lang-box`. Vous pouvez ajouter une langue très facilement, comme pour le Russe avec l’exemple ci-dessous.

```html
<div data-lang="Ru">RU</div>
```

Une fois le bouton disposé, vous pouvez intégrer les traductions

- **au site web** : en déposant des attributs `data-lang-ru` sur les balises contenant du texte (voir exemple ci-dessous) ;

```html
<p data-lang-ru="traduction en russe">texte d’origine</p>
```

- **à la base de données** : en ajoutant des informations propre à la langue lors de l’[intégration de la configuration](#intégration) comme ci-dessous.

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

# Environnement de développement

## Bibliothèques

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes. Elles sont été intégrées directement au code source de l’Opensphère et ne nécessitent par conséquent aucun téléchargement.

- **[Vis.js](https://github.com/visjs/vis-network) v7.10.2 (Apache License 2.0)** : réalisation la visualisation (graphe) ainsi que du système de circulation des données grâce à ses deux composants *Network* et *DataSet*.
- **[Fuse.js](https://github.com/krisk/Fuse/) v6.4.1 (Apache License 2.0)** : mise en place du moteur de recherche.
- **[Bootstrap Grid](https://github.com/twbs/bootstrap) v4.5.0 (MIT License)** : flexibilité de l’interface pour tablettes.

## Outil de développement

Nous avons fait le choix de l’outil [GulpJs](https://gulpjs.com/) pour nous aider au développement de l’Opensphère. Il nous permet de transpiler les fichiers CSS et JavaScript contenus dans le répertoire `/dist` en deux fichiers `main.css` et `main.js`. Ainsi, on compense la complexité du projet (un millier de ligne de JavaScript), la variété des modules (une dizaine d’objets), en la répartissant dans quelques fichiers d’une centaine de lignes.

Une fois GulpJs lancé, il suffit de modifier l’un des fichiers du répertoire `/dist` pour que les modifications soient répercutées au niveau global (dans le répertoire `/assets`). Au début de chaque fichier, vous pourrez trouver une description de son contenu et d’autres commentaires sur le code source.

Pour utiliser Gulp, veuillez suivre les [consignes d’installation](https://gulpjs.com/docs/en/getting-started/quick-start), puis exécuter successivement les commandes suivantes dans votre terminal. L’ensemble des instructions sont commentées dans le fichier `gulpfile.js`.

```
npm i
gulp watch
```

# Exemples de réutilisation de l’Opensphère

Les projets suivants ont été réalisés à l’aide du logiciel Opensphère. Ils peuvent vous servir d’exemple, d’inspiration pour réaliser votre propre réutilisation.

- **Otletosphère** : réalisée par l’équipe du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/) autour de Paul Otlet.
    - site : [http://hyperotlet.huma-num.fr/otletosphere/](http://hyperotlet.huma-num.fr/otletosphere/)
    - code source : [https://github.com/hyperotlet/otletosphere](https://github.com/hyperotlet/otletosphere)
- **OpenDataSphère** : réalisée par les étudiantes et étudiants de la [licence professionnelle MIND](http://www.infonumbordeaux.fr/mind/) pour traiter de l’opend data en France.
    - site : [https://www.arthurperret.fr/opendatasphere/](https://www.arthurperret.fr/opendatasphere/)
    - code source : [https://github.com/hyperotlet/opendatasphere](https://github.com/hyperotlet/opendatasphere)