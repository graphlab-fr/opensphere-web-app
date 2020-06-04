---
title: Modifier volet de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr>
date: 04/06/2020
---

Ce tutoriel va décrire comment modifier le contenu du [volet de description](/elements interface/#volet-de-description), à savoir l'affichage des informations disponibles pour chaque [entité sélectionnée](/selection entites/#methodes).

Les modifications suivantes s'effectuent dans le fichier `/dist/scripts/fiche.js` si vous [utilisez les outils de développements](/modifier code source/#utiliser-les-outils-de-developpement). Sinon vous devrez modifier le fichier `/assets/main.js`.

## Architecture de l'objet *Fiche*

<div class="mermaid">
graph TD
    1[switchNode]
    2((fiche))
    3[fill]
    4[findConnectedNodes]
    5((network))
    6((visualisation))
    7((data))
    8[getNodeMetas]
    9[getConnectedNodes]
    10[getConnectedEdges]
    11((edges))
    12[get]
    13((nodes))
    14[get]
    15[setConnexion]
    16[setMeta]

    style 3 fill:#4051b5,color:#fff

    1 --> 3
    2 -.- 3
    4 --> 3
    5 -.- 6
    5 -.- 7
    8 --> 1
    6 --> 9
    6 --> 10
    9 --> 4
    10 --> 4
    7 -.- 11
    11 --> 12
    12 --> 4
    7 -.- 13
    13 --> 14
    14 --> 8
    2 -.- 15
    2 -.- 16
    3 --> 15
    3 --> 16
</div>

Nous allons modifier la fonction `fill` de l'objet `fiche` (noté `fiche.fill`). Cette fonction possède deux entrées :

- `nodeMetas` est un objet contenant toutes les métadonnées de l'entité sélectionnée (fourni par la fonction `getNodeMetas`).
- `nodeConnectedList` est un tableau contenant tous les liens et leurs métadonnées (fourni par la fonction `findConnectedNodes`)

Elle va ensuite rediriger les données accumulées vers des fonctions qui vont générer le HTML nécessaire à l'affichage et l'injecter dans les [balises HTML](#element-html-de-reference) du volet de description. Ces balises sont référencées dans l'objet `fiche.fields`.

### Injection

Les fonctions d'injection sont toutes préfixées `set` et peuvent prendre deux formes.

Dans tous les cas elles reçoivent les métadonnées d'un attribut de l'objet `nodeMetas` : `nodeMetas.annee_naissance` correspond à la métadonnée `annee_naissance`.

```json hl_lines="5"
    [
        {
            "label": "Suzanne Briet",
            "id": 2,
            "annee_naissance": 1894,
            ...
        }
    ]
```

#### Forme générique

La fonction `fiche.setMeta` prend en entrée une [métadonnée](#injection) (paramètre `meta`) ainsi qu'un [élément HTML](#element-html-de-reference) (paramètre `content`).

<div class="mermaid">
graph TD
   A(Appel de la fonction) --> B{meta est-il null ?}
   B -->|Non| D(L'élement HTML prend</br>la valeur de meta)
   B -->|Oui| C(L'élement HTML est vidé)
</div>

#### Forme spécifique

Par exemple, la fonction `fiche.setDates` prend en entrée plusieurs [métadonnées](#injection) pour opérer un traitement spécifique.

L'[élément HTML](#element-html-de-reference) où elle va injecter le code HTML généré est intégré directement dans le fonction.

#### Élément HTML de référence

Dans l'objet `fiche.fields` vous retrouvez toutes les références aux éléments HTML issus de `index.html`.

Les sélections se font grâce à des identifiants tel que `#!js document.querySelector('#fiche-meta-date')` sélectionne la balise `#!html <span id="fiche-meta-date"></span>`

## Modifier l'affichage

Pour vos ajouts et modifications, il ne vous reste qu'à repérer les fonctions existantes et à modifier leur contenu selon les principes expliqués ci-dessus.

La [fonction `fiche.setMeta`](#forme-generique) vous permet de rapidement injecter le contenu d'une métadonnée dans un élément

!!! tip "Tester les valeurs `null`"
    Pensez à bien intégrer les tests :
    ```javascript
    if (meta === null) {
        content.innerHTML = '';
    }
    ```