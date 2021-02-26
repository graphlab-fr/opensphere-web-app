---
title: Intégration de la base de données
author: Guillaume Brioudes <https://myllaume.fr/>
date: 2021-02-26
lang: fr
keywords:
  - développeur
---

Plusieurs outils vous permettent de créer une base de données adaptée à l’Opensphère. Nous allons d’abord nous intéresser aux contraintes dues à l’environnement du logiciel. Elles vont vous permettre d’utiliser des outils de manière adaptée et que nous allons présenter à la fin de ce tutoriel.

# Fichiers de données

L’Opensphère extrait les données de deux [fichiers JSON](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/JSON). Vous trouverez un exemple de chaque dans le répertoire initial :

- `entite.json` : liste des entités du graphe, correspondant aux nœuds ;
- `lien.json` : liste des liens entre ces nœuds.

## Entrées minimums

Soit ci-dessous un exemple simplifié du fichier `entite.json`. Le nœud appelé « Paul Otlet » possède l’identifiant **unique** « 1 » et possède un type « Personne ». Ce sont les informations minimums pour afficher une entité, la filtrer parmi toutes les autres.

```json
[{
    "label": "Paul Otlet",
    "id": 1,
    "type": "Personne",
    "description": "Fondateur du Mundaneum"
},
{
    "label": "Mundaneum",
    "id": 2,
    "type": "Institution",
    "description": "Le projet phare de Paul Otlet"
}]
```

On complète ce premier fichier avec l’entrée suivante dans `lien.json`. **Tout se joue sur les identifiants** : le lien « 1 » relie les nœuds « 1 » et « 2 » correspondant respectivement à nos deux entités, nœuds, précédents. On ajoute par ailleurs une label à la liaison pour constitué le niveau d’information minimum des liens.

```json
[{
    "id": 1,
    "from": 1,
    "to": 2,
    "label": "Paul Otlet est le fondateur du Mundaneum."
}]
```

## Données de description

Vous pouvez ajouter autant d’informations que vous le souhaitez pour chaque entité. Comme illustré ci-dessous, vous pouvez renseigner des dates, des catégories. Vous pouvez faire cela dans plusieurs langues si vous souhaitez obtenir une interface multilingue.

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

Nous verrons plus tard comment intégrer ces informations de manière systématiques dans l’interface.

# Enregistrement des données

Nous avons donc besoin d’outil qui vont nous permettre d’entrer nos données, de mettre en relation nos entités (faire correspondre de leurs identifiants **uniques**) et enfin d’obtenir ces données au format JSON.

Les tableurs sont les interfaces les plus efficaces. Ils vous permettent de compléter systématiquement une liste d’entité (en ligne) pour une série d’informations (en colonne) que vous avez décidé de renseigner. Vous verrez rapidement les cases qu’il vous reste à compléter, les informations que vous pouvez croiser (calcul) à l’aide de formules.

Nous vous proposons deux outils en ligne collaboratifs. Ce sont deux tableurs que vous pourrez utiliser avec une équipe et éventuellement en même temps.

Nous vous avons facilité le travail en vous proposant des modèles à copier pour votre propre compte. Vous retrouverez pour chaque modèle les tables « entites » et « liens » vous permettant d’enregistrer vos nœuds. Faites bien attention à distribuer les identifiants **uniques** dans les colonnes « id » prévues à cet effet.

## Airtable

Pour les personnes qui sont habituées aux tableurs comme Excel, Calc ou Sheet, [Airtable](https://airtable.com/) peut être un peu déroutant. Ça n’est pas un tableau de calcul, mais bien une série de tables de données comme en utilisent les professionnels des bases de données. L’interface reste simple et la [documentation (en anglais)](https://support.airtable.com/hc/en-us) bien fournie. Il est plus facile d’y mettre en place une vérification, correspondance systématique des données en mettant en relation une colonne d’une table « A » avec le contenu d’une table « B ». Nous avons déjà assuré la correspondance des identifiants dans le modèle ci-après.

Retrouvez sur la page suivante un modèle de base de données adapté à l’Opensphère : [https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs](https://airtable.com/shrBRlWxvzFatUoFF/tblHqN5RE9z7j5HdU/viwn2Q7y4fijyAfSs)

L’export se fait en CSV pour les deux tables « entites » et « liens ». Vous devrez utiliser un [convertisseur CSV → JSON](http://convertcsv.com/json-to-csv.htm) pour obtenir les fichiers `entite.json` et `lien.json`.

## Google Sheet

C’est un tableur traditionnel dont les vérifications, correspondances entre les colonnes sont assurées par des formules. Sur notre modèle de données, que vous pourrez retrouver ci-après, nous avons automatisé la correspondance des identifiants.

Retrouvez sur la page suivante un modèle de base de données adapté à l’Opensphère : [https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing)

L’export se fait en CSV pour les deux feuilles « Entites » et « Extraction ». Cette dernière est une image de la feuille « Liens ». Grâce à la [fonction `RECHERCHEV`](https://support.google.com/docs/answer/3093318?hl=fr), les labels mis en relation dans la feuille « Liens » sont remplacés par leurs identifiants respectifs dans la feuille « Extraction », laquelle peut être traitée par le logiciel.

Vous pouvez également exporter les données directement en JSON. Pour cela installez l’extension *Export Sheet Data* depuis l'onglet « Modules complémentaires » dans Google Sheet. Une fois installée, vous pouvez la retrouver dans le même onglet et afficher le panneau de l’outil avec le bouton « Open Sidebar ». La configuration est détaillée dans [la feuille « Notice export »](https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit#gid=1378398983).

# Intégration

Une fois les fichiers `entite.json` et `lien.json` obtenus (renommer vos exports si nécessaire), vous devez les placer dans le répertoire `/data`, en remplacement des deux fichiers d’exemple. Vos données peuvent alors être captées par le logiciel. Il faut maintenant les intégrer au flux interne.

Dans le fichier `/assets/main.js`, à partir de la ligne 200, vous allez retrouver la commande d’intégration, simplifiée ci-dessous. Elle vous permet de faire correspondre vos champs (colonnes du tableur) à des constantes. Par exemple, dans cette liste, notre champ « label » (appelé « entite.label » dans ce contexte) est associé à la constante « label ». Ce sont ces constantes que vous allez pouvoir employer lors des autres étapes de la réutilisation du logiciel.

Avec cette configuration

- on fait correspondre « label », « description » et « id » à des constantes équivalentes ;
- on traduit notre champ « titre » en constante « title » ;
- on assigne la traduction du champ « titre » en français et en anglais.

```javascript
network.data.nodes.add(
    entites.map(function(entite) {
        var entiteObj = {
            // entite metas, default langage
            id: entite.id,
            label: entite.label,
            titre: entite.titre,
            type: entite.type,
            description: entite.description,
            // translated metas
            Fr: {
                title: entite.titre
            },
            En: {
                title: entite.titre_en
            },
```