---
title: Modify translation from l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 09/06/2020
---

In the [header](../usage/interface-elements.md#header) are the translation commands: buttons allow you to change the language on the site by activating a script that goes through the whole page, finds the elements to be translated and their translation to put the second one in place.

The script is in the `/dist/scripts/translate.js` file and [can be modified in different ways depending on the approach](./dev-tools.md) you have chosen to modify the source code.

## Translate an element

For an element embedded in HTML in `index.html` to be automatically translated, you must apply the attributes shown below to it. `data-lang-en` contains its French translation, and `data-lang-en` contains its English translation. Simply applying one of these tags to an element triggers its systematic translation. Be careful to apply all available languages to it.

```html
<h3 data-lang-fr="Connexions" data-lang-en="Connection">Connexions</h3>
```

## Add a language

To add a language, you need to add its reference button in `index.html`. You can place it in the `#!html <div class="lang-box">` tag or elsewhere. It is written in the following way to include the Russian language, for example: the attributes `id`, `data-lang` and `class` are all impacted.

```html
<div id="lang-ru" data-lang="Ru" class="lang-box__flag lang-box__flag--ru"></div>
```

In JavaScript, if we keep the same example, you need to add the `#!javascript document.querySelector('#lang-ru')` selector to the `langage.flags' array.

!!! success
    Therefore, any tag with the attribute `data-lang-ru="Lorem ipsum"` will have its text changed to "Lorem ipsum" when the corresponding button is clicked.

## Translate the data

The previous method allowed us to translate the interface elements, but the data depends on [methods of VisJs](../development/libraries.md##visjs-v7102). In the `/dist/scripts/translate.js` file you will find a *switch (see code below). It is scanned at each language change and allows you to modify the different values of your entities before they are applied to the [description pane](../usage/interface-elements.md#Description-panel) and the [records](../usage/interface-elements.md#records).

```javascript hl_lines="8"
switch (langage.actual) {
    case 'Fr':
        network.data.nodes.update(
            network.data.nodes.map(entite => ({
                    id: entite.id,
                    title: ... // traduction
                })
            )
        );
        break;
    case 'En':
        // fonctions pour l'anglais
        break;
    case 'Ru':
        // fonctions pour le russe
        break;
}
```

### Add a language

You can provide a version of your metadata dedicated to that language in your `entite.json` and `lien.json` files.

```json
[
    {
        "label": "Paul Otlet",
        "id": 1,
        ...
        "domaine": "Bibliographie",
        "domaine_en": "Bibliography",
        "description": "Paul Otlet est la tête pensante du Mundaneum…",
        "description_en": "Paul Otlet is the mind behind the Mundaneum…"
    }
]
```

When [data injection](../development/register-data.md#data-injection) in the site, we suggest you apply this template (see code below). The software will take care of the translation.


```javascript
var entiteObj = {
    // entite metas
    id: entite.id,
    label: entite.label,
    ...
    description: entite.description // description dans votre langue par défaut
    description_fr: entite.description // si le français est votre langue par défaut
    description_en: entite.description_en // pour prévoir un switch vers l'anglais
};
```