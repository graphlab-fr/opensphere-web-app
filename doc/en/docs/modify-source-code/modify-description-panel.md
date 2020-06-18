---
title: Modify description panel from l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr>
date: 09/06/2020
---

This tutorial will describe how to modify the content of the [description pane](../usage/interface-elements.md#description-panel), i.e. how to display the information available for each [selected entity](../usage/entities-selection.md#methods).

The following changes are made in the `/dist/scripts/fiche.js` file if you [use the development tools](../modify-source-code/dev-tools.md#using-the-development-tools). Otherwise you will need to modify the `/assets/main.js` file.

## Object architecture

```mermaid
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
```

We will modify the `fill` function of the `fiche` object (noted `fiche.fill`). This function has two inputs:

- `nodeMetas` is an object containing all the metadata of the selected entity (provided by the `getNodeMetas` function).
- `nodeConnectedList` is an array containing all the links and their metadata (provided by the `findConnectedNodes` function).

It will then redirect the accumulated data to functions that will generate the HTML required for display and inject it into the [HTML tags](#reference-html-element) of the description pane. These tags are referenced in the `fiche.fields' object.

### Injection

The injection functions are all prefixed `set` and can take two forms.

In all cases they receive the metadata of an attribute of the `nodeMetas' object: `nodeMetas.year_birth` corresponds to the metadata `year_birth`.

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

#### Generic form

The `file.setMeta' function takes as input a [metadata]() (`meta` parameter) and an [HTML element]() (`content' parameter).

```mermaid
graph TD
   A(Appel de la fonction) --> B{meta est-il null ?}
   B -->|Non| D(L'élement HTML prend</br>la valeur de meta)
   B -->|Oui| C(L'élement HTML est vidé)
```

#### Specific shape

For example, the `setDates file' function takes in several [metadata](#injection) to perform specific processing.

The [HTML element](#reference-html-element) where it will inject the generated HTML code is built directly into the function.

#### Reference HTML element

In the `fiche.fields` object you will find all references to HTML elements from `index.html`.

The selections are made using identifiers such as `#!js document.querySelector('#fiche-meta-date')` selects the `#!html <span id="fiche-meta-date"></span>` tag.

## Change the display

For your additions and modifications, all you have to do is identify the existing functions and modify their content according to the principles explained above.

The [function `file.setMeta`](#generic-form) allows you to quickly inject the contents of a metadata in a

!!! tip "Test the `null` values"
    Remember to integrate the tests:
    ```javascript
    if (meta === null) {
        content.innerHTML = '';
    }
    ```

!!! info "language display"
    To change the display of the pane according to the language, go to the [translation tutorial](./modify-translation.md#translate-description-panel).