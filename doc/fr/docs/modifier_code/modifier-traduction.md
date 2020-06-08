---
title: Modifier traduction de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 03/06/2020
---

Dans l'[entête](../utilisation/elements-interface.md#entete) se trouvent les commandes de traduction : des boutons permettent de changer de langue sur le site en activant un script qui vient parcourir l'ensemble de la page, trouve les éléments à traduire et leur traduction pour mettre la seconde en place.

Le script se trouve dans le fichier `/dist/scripts/translate.js` et [peut être modifié de différentes manière selon l'approche](./outils-developpement.md) que vous avez choisi pour modifier le code source.

## Traduire un élément

Pour qu'un élément intégré en HTML dans `index.html` soit automatiquement traduit, vous devez lui appliquer les attributs présentés ci-dessous. `data-lang-fr` contient sa traduction française et `data-lang-en` contient sa traduction anglaise. Le simple fait d'appliquer l'une de ces balises à un élément enclenche sa traduction systématique. Attention à bien lui appliquer toutes les langues disponibles.

```html
<h3 data-lang-fr="Connexions" data-lang-en="Connection">Connexions</h3>
```

## Ajouter une langue

Pour ajouter une langue, il vous faut ajouter son bouton de référence dans `index.html`. Vous pouvez le placer dans la balise `#!html <div class="lang-box">` ou ailleurs. Il s'inscrit de la manière suivante pour inclure la langue russe, par exemple : les attributs `id`, `data-lang` et `class` sont tous trois impactés.

```html
<div id="lang-ru" data-lang="Ru" class="lang-box__flag lang-box__flag--ru"></div>
```

En JavaScript, si nous gardrons le même exemple, il vous faut ajouter le selecteur `#!javascript document.querySelector('#lang-ru')` au sein du tableau `langage.flags`.

!!! success
    Dès lors, toute balise portant l'attribut `data-lang-ru="Lorem ipsum"` aura son texte changé en "Lorem ipsum" au clic que le bouton correpondant.

### Styliser le bouton

Selon [l'approche](./outils-developpement.md) que vous avez choisi pour modifier le code source vous devrez suivre les consignes pour le SCSS ou le CSS.

=== "CSS"
    Dans `/assets/main.css`, retrouvez le selecteur `lang-box__flag` en dessous duquel vous pourrez ajouter les lignes suivantes et remplacer soit `lang_ru.svg` par le nom de l'image de votre choix soit le chemin complet `./icons/lang_ru.svg` si votre image ne se trouve pas dans le repertoire `/assets/icons/`.
    ```css
    .lang-box__flag--ru {
        background-image: url("./icons/lang_ru.svg");
    }
    ```

=== "SCSS"
    Si votre image correspond au chemin suivant `./icons/lang_ru.svg` modifiez simplement la ligne suivante dans le fichier `/dist/sass/layout/_entete.scss` en lui ajoutant `, "ru"`
    ```scss
    $langages: "fr", "en", "ru";
    ```
    Sinon, vous pouvez intégrer le code suivant au sein de `/dist/sass/layout/_entete.scss` avec le chemin de votre image.
    ```scss hl_lines="7-9"
    .lang-box {
        ...

        &__flag {
            ...

            &--ru {
                background-image: url('lang_ru.svg');
            }
    }
    ```

## Traduire le volet de description

```mermaid
graph TD
    evtclick{{Clic sur bouton traduction}} --> fx_translate[translateAll]
    obj_fiche((Fiche)) -.- fx_fill[fill]
    obj_fiche -.- memory((memory))
    memory --> fx_fill
    evtclick --> memory
    fx_translate --> html[[HTML Elements]]

    style evtclick fill:#4051b5,color:#fff
```

Dans la fonction `fill` de l'objet `fiche` inscrit dans le fichier `/dist/scripts/fiche.js` se trouve ce *switcher* qui va vous permettre d'alterner l'affichage des métadonnées au sein du [volet de description](../utilisation/elements-interface.md#volet-de-description) selon la langue active.

Pour chaque `case` correspondant à une langue vous allez pouvoir activer certaines [fonctions d'affichage](./modifier-volet.md#injection) du volet.

```javascript hl_lines="8"
switch (langage.actual) {
    case 'Fr':
        // fonctinos pour le français
        break;
    case 'En':
        // fonctions pour l'anglais
        break;
    case 'Ru':
        // fonctions pour le russe
        break;
}
```

Vous pouvez inscrire dans le fichier `entite.json` des métadonnées destinées à une langue en particulier comme pour l'exemple ci-dessous.

```json hl_lines="6 7"
    [
        {
            "label": "Suzanne Briet",
            "id": 2,
            "relation": "contemporain",
            "description": "en français",
            "description_en": "en anglais",
        }
    ]
```

### Langue par défaut

Pour modifier la langue par défaut du volet, vous devez changer la ligne suivante dans l'objet `langage` qui se trouve dans le fichier `/dist/scripts/translate.js`. Dans l'exemple ci-dessous, la langue par défaut est le Russe.

```javascript hl_lines="3"
var langage = {
    flags: [document.querySelector('#lang-ru'), document.querySelector('#lang-en')],
    actual: 'Ru',
    translateAll: function() { ... }
}
```