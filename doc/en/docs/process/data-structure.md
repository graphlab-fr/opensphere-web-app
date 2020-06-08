---
title: Data drawin form Otletosphère
author: Guillaume Brioudes <https://myllaume.fr>
date: 08/06/2020
---

## Data redesign

The objective is to optimize (faster, more reliable) as much as possible the entries in the Otletosphere for administrators and to gather the injection circuits for developers. The data are currently distributed in two files whose **modifications are not synchronized** automatically and from **free fields**. This may leave room for bugs.

This template will be integrated in a single spreadsheet (one single *GSheet* file). The objects each have their own sheet, `Entities` and `Links`.

Other attached sheets (`Countries`, `Relations` etc.) will serve as a database as for countries, relations and types. Thus, it will be possible at any time to expand these lists with new entries, thus increasing the (controlled) input possibilities on the site. It will also be an opportunity for each type and relationship to describe the context to which they are linked on their respective sheets, in order to guide the entry.

### Vocabulary

- `integer` : integer
- `string` : string
- `list` : string in a limited lexicon
- `boolean` : "TRUE" or "FALSE"
- The names of the tables, also called "objects" begin with a capital letter: `Entity`.
- Field names are lowercase: `id`.

## Data model

| Objet    | Métadonnée     | Typage  | Lexique                                                     | Commentaire                                                 |
| -------- | -------------- | ------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Entité   | id             | integer |                                                             |                                                             |
| Entité   | label          | string  |                                                             |                                                             |
| Entité   | relation_otlet | list    | collègue<br />contemporain<br />collaborateur<br />opposant | From `Relations`, col `label` |
| Entité   | type           | list    | personne<br />institution<br />événement<br />œuvre         | From `Types`, col `label`     |
| Entité   | nom            | string  |                                                             |                                                             |
| Entité   | prenom         | string  |                                                             |                                                             |
| Entité   | pays           | list    | liste des pays en français                                  | From `Pays`, col `label_fr`   |
| Entité   | pays_en        | list    | liste des pays en anglais                                   | From `Pays`, col `label_en`   |
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
| Entité   | public         | boolean |                                                             | If public sur le site ou non                                |
| Lien     | from           | integer | `Entité.id`                                                  |                                                             |
| Lien     | to             | integer | `Entité.id`                                                  |                                                             |
| Lien     | label          | string  | < 70                                                        |                                                             |
| Lien     | preuve         | string  | URL                                                         |                                                             |
| Relation | label          | string  | < 20                                                        |                                                             |
| Relation | couleur        | string  |                                                             | Call sign: no impact on the site                    |
| Relation | description    | string  |                                                             | Call sign: no impact on the site                    |
| Type     | label          | string  | < 20                                                        |                                                             |
| Type     | description    | string  |                                                             | Call sign: no impact on the site                    |
| Pays     | label_fr       | string  |                                                             |                                                             |
| Pays     | label_en       | string  |                                                             |                                                             |
| Network  | from           | integer | `Entité.id`                                       | From `Entité`, col `id`       |
| Network  | to             | integer | `Entité.id`                                       | From `Entité`, col `id`       |

## History of changes

The following is an exhaustive list of changes presented first as a list and then as a table.

Everything will be unified in a single spreadsheet (a single *GSheet* file).

- Entities' table
   - Deleted columns :
      - `shape` because automatable such that if `relation_otlet` == institution, then `shape` = "square", otherwise `shape` = "round"
      - `brokenImage` can be automated in the same way as `shape`.
   - Modified Column :
      - ``relation ``renamed ``title``
      - `gender` renamed `genre`
      - `group` renamed `relation_otlet`.
      - date_birth" and "date_death" are expressed in years.
   - Added columns :
      - `public` allowing to hide a content which is not integrated to the site : we can then modify it without fear of breaking the interface
- Table `Links`
   - Modified columns
      - `from` and `to` replace `from_name` and `to_name`. No `id` will be entered manually, but automatically, depending on the `label' referenced in one of the two fields. The `id' will be entered automatically on the `Network' sheet, and will be automatically added/exchanged when a `label' is added/exchanged in `from' or `to'.
      - `Proof of relationship` renamed `proof` and could only take the form of a URL (to a site, an image) to facilitate its integration on the site.
      - `title `renamed `label