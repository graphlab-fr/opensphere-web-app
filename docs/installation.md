---
title: Installation et de configuration du logiciel de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 29/05/2020
---

Les consignes suivantes permettent de télécharger et installer le logiciel faisant fonctionner l'Otletosphère.

Après le téléchargement par différents moyens, l'installation est facilitée par la mise en place de différentes entrées sous forme de fichiers JSON permettant servant de bases de données pour les entités, leurs relations et leurs liaisons, soit respectivement les nœuds, leurs groupes et leur liens.

## Téléchargement

La dernière version testée du code source est entreposée sur un [dépôt GitHub]. Deux méthodes s'offrent à vous.

### Par commande

Une fois à l'emplacement souhaité vous pouvez télécharger le contenu via la ligne de commande suivante si vous avez installé le [logiciel Git](https://git-scm.com/).

```bash
$ git clone https://github.com/Myllaume/otletosphere.git
```

### Par archive

Vous pouvez également vous rendre sur le [dépôt GitHub] et cliquer le bouton *Clone or download* puis sur *Download ZIP*. Vous n'avez alors plus qu'à décompresser l'archive téléchargée et à la placer à l'emplacement de votre choix :

- [décompresser une archive sur Windows](https://support.microsoft.com/fr-fr/help/14200/windows-compress-uncompress-zip-files)
- [décompresser une archive sur macOS](https://support.apple.com/fr-fr/guide/mac-help/mchlp2528/mac)

## Saisie des données

Vous trouverez dans l'[arborescence du répertoire](/architecture code source/#arborescence-de-fichier) Otletosphere les trois fichiers d'exemple en JSON : `entite.json`, `metas.json` et `lien.json`. Pour apporter votre propre contenu il vous faut remplacer les valeurs inscrites dans ces fichiers.

### Entités

Ci-dessous un modèle de fichier `entite.json` et sa table de données.

Il s'agit d'inscrire toutes les entités qui seront intégrées aux vues *Réseau* et *Fiches* du site.

| Clé         | Valeur                             |
| ----------- | ---------------------------------- |
| id          | nombre entier unique supérieur à 0 |
| label       | chaine de caractère                |
| relation    | chaine de caractère                |
| metas       | objet                              |
| metas.*any* | HTML                               |

```json
[
    {
        "label": "Paul Otlet",
        "id": 1,
        "relation": "self",
		"metas": {
			"genre": "lorem",
            "age": "lorem",
            "description": "lorem <b>ipsum</b>"
		}
    },
    {
        "label": "Suzanne Briet",
        "id": 2,
        "relation": "contemporain"
    }
    ...
]
```

### Métadonnées

Ci-dessous un modèle de fichier `metas.json`.

Il s'agit de référencer les métadonnées spécifiées pour chaque entité inscrite dans `entite.json` afin qu'elles apparaissent de le [volet de description](/elements interface/#volet-de-description).

Les clés (comme 'genre' ci-dessous) indiquent le nom des métadonnées à afficher et les valeurs (comme 'inconnu' ou `null` ci-dessous) sont l'affichage par défaut.

| Clé   | Valeur |
| ----- | ------ |
| *any* | HTML   |

```json
[
    {
		"genre": null,
		"age": "inconnu",
		"description": "<b>aucune</b> description trouvée"
    }
]
```

### Liens

Ci-dessous un modèle de fichier `lien.json` et sa table de données.

| Clé   | Valeur                                                       |
| ----- | ------------------------------------------------------------ |
| id    | nombre entier unique supérieur à 0                           |
| from  | nombre entier unique supérieur à 0 correspondant à l'`id` d'une entité |
| to    | nombre entier unique supérieur à 0 correspondant à l'`id` d'une entité |
| label | HTML                                                         |

```json
[
    {
        "id": 1,
        "from": 1,
        "to" : 2,
        "label" : ""
    },
    {
        "id": 2,
        "from": 1,
        "to" : 3,
        "label" : "Il travaillent ensemble <b>depuis 10 ans<b>"
    }
    ...
]
```

## Gulp.js

[Gulp.js](https://gulpjs.com/) est un module Node.js qui fonctionne largement avec les boîtes commandes (*Invite de commande* de Windows et *Terminal* de macOS). Voici un tutoriel d'installation complet sur le sujet : https://www.alsacreations.com/tuto/lire/1686-introduction-a-gulp.html

Le fichier `package.json` contient toutes les dépendances nécessaires et le `gulpfile.js` contient la configuration adaptée à l'environnement.

Pour installer les dépendances vous pouvez executer la commande suivante :

```bash
npm install
```

### Commandes

La commande suivante vous permet de lancer le traitement des fichiers `.scss` et `.js` repectivement depuis les [répertoires](/architecture code source/#arborescence-de-fichier) `/sass` et `/scripts` vers `/assets/main.css` et `/assets/main.js`.

```bash
gulp watch
```

À chaque enregistrement d'un fichier `.scss` ou `.js` aux emplacements `/sass` ou `/scripts`, Gulp.js compile les fichiers.