---
title: Schémas de données de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr>
date: 27/04/2020
update: 28/05/2020
---

## Refonte données Otletosphère

L'objectif est d'optimiser (plus rapide, plus fiable) au maximum les entrées dans l'Otletosphère pour les administrateurs et de rassembler les circuits d'injection pour les développeurs. Les données sont actuellement réparties dans deux fichiers dont les **modifications ne sont pas synchronisées** automatiquement et à partir de **champs libres**. Cette marge de manœuvre peut laisser place à des bugs.

Ce modèle sera intégré dans un unique tableur (un seul fichier *GSheet*). Les objets ont chacun leur feuille, `Entités` et `Liens`.

D'autres feuilles jointes (`Pays`, `Relations` etc.) serviront de base de données comme pour les pays, relations et types. Ainsi, il sera possible à tout moment d'augmenter ces listes avec des nouvelles entrées augmentant ainsi les possiblités de saisie (controlées) sur le site. Ce sera aussi l'occasion pour chaque type et relation de décrire le contexte auquel ils sont liés sur leur feuilles respectives, cela afin de guider la saisie.

### Lexique

- `integer` : entiers naturels
- `string` : chaine de caractère
- `list` : chaine de caractère parmis un lexique limité
- `boolean` : "VRAI" ou "FAUX"
- Les nom des tables, aussi appelées "objets" débutent pas une majuscule : `Entité`
- Les nom des champs sont en minuscule : `id`

## Modèle de données

| Objet    | Métadonnée     | Typage  | Lexique                                                     | Commentaire                                                 |
| -------- | -------------- | ------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Entité   | id             | integer |                                                             |                                                             |
| Entité   | label          | string  |                                                             |                                                             |
| Entité   | relation_otlet | list    | collègue<br />contemporain<br />collaborateur<br />opposant | Extraits de la feuille `Relations`, colonne `label` |
| Entité   | type           | list    | personne<br />institution<br />événement<br />œuvre         | Extraits de la feuille `Types`, colonne `label`     |
| Entité   | nom            | string  |                                                             |                                                             |
| Entité   | prenom         | string  |                                                             |                                                             |
| Entité   | pays           | list    | liste des pays en français                                  | Extraits de la feuille `Pays`, colonne `label_fr`   |
| Entité   | pays_en        | list    | liste des pays en anglais                                   | Extraits de la feuille `Pays`, colonne `label_en`   |
| Entité   | discipline     | string  |                                                             |                                                             |
| Entité   | discipline_en  | string  |                                                             |                                                             |
| Entité   | description    | string  |                                                             |                                                             |
| Entité   | description_en | string  |                                                             |                                                             |
| Entité   | image          | string  |                                                             |                                                             |
| Entité   | titre          | string  | < 70                                                        |                                                             |
| Entité   | lien_wikipedia | string  | URL                                                         |                                                             |
| Entité   | date_naissance | integer | < 2020                                                      | Année                                                       |
| Entité   | date_mort      | integer | < 2020                                                      | Année                                                       |
| Entité   | genre          | list    | homme<br />femme                                            |                                                             |
| Entité   | public         | boolean |                                                             | Si publié sur le site ou non                                |
| Lien     | from           | integer | `Entité.id`                                                  |                                                             |
| Lien     | to             | integer | `Entité.id`                                                  |                                                             |
| Lien     | label          | string  | < 70                                                        |                                                             |
| Lien     | preuve         | string  | URL                                                         |                                                             |
| Relation | label          | string  | < 20                                                        |                                                             |
| Relation | couleur        | string  |                                                             | Indicatif : aucune incidence sur le site                    |
| Relation | description    | string  |                                                             | Indicatif : aucune incidence sur le site                    |
| Type     | label          | string  | < 20                                                        |                                                             |
| Type     | description    | string  |                                                             | Indicatif : aucune incidence sur le site                    |
| Pays     | label_fr       | string  |                                                             |                                                             |
| Pays     | label_en       | string  |                                                             |                                                             |
| Network  | from           | integer | `Entité.id`                                       | Extraits de la feuille `Entité`, colonne `id`       |
| Network  | to             | integer | `Entité.id`                                       | Extraits de la feuille `Entité`, colonne `id`       |

## Historique des changements

Voici une liste exhaustive des changements présentés sous forme de liste, puis après sous forme de tableau.

Le tout sera unifié dans dans un unique tableur (un seul fichier *GSheet*).

- Table `Entités`
   - Colonnes supprimées :
      -  `shape` car automatisable tel que si `relation_otlet` == institution, alors `shape` = "carré", sinon `shape` = "rond"
      - `brokenImage` automatisable de la même manière que `shape`
   - Colonne modifiées :
      - `relation ` renommée `titre`
      - `gender ` renommée `genre`
      - `group` renommée `relation_otlet`
      - `date_naissance` et `date_mort` sont exprimés en année
   - Colonnes ajoutées :
      - `public` permettant de cacher un contenu qui n'est ainsi pas intégré au site : on peut alors le modifier sans craindre de casser l'interface
- Table `Liens`
   - Colonnes modifiées
      - `from` et `to` remplacent `from_name` et `to_name`. Aucune saisie d'`id` ne se fera manuellement, mais automatiquement, en fonction du `label` référencé dans l'un des deux champs. L'`id` sera saisi automatiquement sur la feuille `Network` et sera automatiquement ajoutées/échangées lorsqu'un label `label` se sera ajouté/échangé dans `from` ou `to`.
      - `Preuve de la relation` renommée `preuve` et ne pourrait prendre la forme que d'une URL (vers une site, une image) pour faciliter son intégration sur le site.
      - `titre ` renommée `label`