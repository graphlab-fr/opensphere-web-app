---
title: Modifier traduction de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 03/06/2020
---

Dans l'[entête](../utilisation/elements-interface.md#entete) se trouvent les commandes de traduction : des boutons permettent de changer de langue sur le site en activant un script qui vient parcourir l'ensemble de la page, trouve les éléments à traduire et leur traduction pour mettre la seconde en place.

Le script se trouve dans le fichier `/dist/scripts/translate.js` et [peut être modifié de différentes manière selon l'approche](./outils-developpement.md) que vous avez choisi pour modifier le code source.

## Traduire un élément de l'interface

Pour qu'un élément intégré en HTML dans `index.html` soit automatiquement traduit, vous devez lui appliquer les attributs présentés ci-dessous. `data-lang-fr` contient sa traduction française et `data-lang-en` contient sa traduction anglaise. Le simple fait d'appliquer l'une de ces balises à un élément enclenche sa traduction systématique. Attention à bien lui appliquer toutes les langues disponibles.

```html
<h3 data-lang-fr="Connexions" data-lang-en="Connection">Connexions</h3>
```

### Ajouter une langue

Pour ajouter une langue, il vous faut ajouter son bouton de référence dans `index.html`. Vous pouvez le placer dans la balise `#!html <div class="lang-box">` ou ailleurs. Il s'inscrit de la manière suivante pour inclure la langue russe, par exemple : les attributs `id`, `data-lang` et `class` sont tous trois impactés.

```html
<div id="lang-ru" data-lang="Ru" class="lang-box__flag lang-box__flag--ru"></div>
```

En JavaScript, si nous gardrons le même exemple, il vous faut ajouter le selecteur `#!javascript document.querySelector('#lang-ru')` au sein du tableau `langage.flags`.

!!! success
    Dès lors, toute balise portant l'attribut `data-lang-ru="Lorem ipsum"` aura son texte changé en "Lorem ipsum" au clic que le bouton correpondant.

## Traduire les données

La méthode précédante nous a permis de traduire les éléments de l'interface, mais les données dépendent des [méthodes de VisJs](../developpement/bibliotheques.md##visjs-v7102). Dans le fichier `/dist/scripts/translate.js` vous trouverez un *switch* (voir code ci-dessous). Il est parcouru à chaque changement de langue et vous permet de modifier les différentes valeurs de vos entités avant qu'elles ne soient ensuite appliquées au [volet de description](../utilisation/elements-interface.md#volet-de-description) et aux [fiches](../utilisation/elements-interface.md#fiches).

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

### Ajouter une langue

Vous pouvez prévoir une version de vos métadonnées dédiée à cette langue dans vos fichiers `entite.json` et `lien.json`.

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

Lors de l'[injection des données](../developpement/inscrire-donnees.md#injection-des-donnees) dans le site, nous vous suggerons d'appliquer ce modèle (voir code ci-dessous). Le logiciel se chargera de traduire.

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