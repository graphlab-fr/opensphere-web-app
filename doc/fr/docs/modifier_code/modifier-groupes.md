---
title: Modifier groupes de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 03/06/2020
---

Ce tutoriel va décrire comment modifier les groupes d'entités selon les entrées que vous avez effectué dans le fichier `/data/entite.json`.

```json hl_lines="5"
    [
        {
            "label": "Suzanne Briet",
            "id": 2,
            "relation": "contemporain",
            ...
        }
    ]
```

## Ajouter un groupe en fonction d'une relation

Dans l'objet `network` (`/dist/scripts/network.js`) se trouve l'objet `groups`.

Pour chaque **relation reconnue comme un groupe** d'entité on trouve un objet dédié comme ci-dessus, c'est à dire nommé selon le nom de la relation et avec [différents paramètres visant à modifier l'apparence](#modifier-lapparence-des-nuds-dun-groupe) de tous les nœuds de la vue *Réseau* qui y sont liés.

```javascript
contemporain: {shape: 'circularImage', color: {border: chooseColor('contemporain')}}
```

Pour regrouper des entités avec pour `relation` "ami" et "opposant", on entre les objets ci-dessous dans `network.options` :

```javascript
groups: {
    ami: {shape: 'circularImage', color: {border: chooseColor('ami')}},
    opposant: {shape: 'circularImage', color: {border: chooseColor('opposant')}}
}
```

## Modifier l'apparence des nœuds d'un groupe

Les différents paramètres esthétiques et réactifs applicables aux nœuds sont présentés dans la [documentation de Vis.js](https://visjs.github.io/vis-network/docs/network/nodes.html) et doivent directement être ajoutés dans l'objet du groupe tel qu'il a été présenté ci-dessus. Ces paramètres s'appliquent en sur-couche par rapport à ceux directement appliqués aux nœuds.

La fonction `chooseColor` (`/dist/scripts/network.js`) permet de retrouver à tout moment une couleur telle qu'elle a été définie en son sein. Cette fonction est utilisé plusieurs fois dans le logiciel pour retrouver la couleur d'une relation : veillez à y inscrire pour chacun de vos groupes une couleur en repectant bien la casse. Ci-dessous, on a attribué une couleur aux groupes "collegue" et "contemporain".

```javascript
function chooseColor(relationEntite, lowerOpacity = false) {
    switch (relationEntite) {
        case 'collegue':
            var color = '128, 0, 128'; break;
        case 'contemporain':
            var color = '0, 112, 0'; break;
        ...
    }
    ...
}
```

Le paramètre `relationEntite` est une chaine de caractère permettant de retrouver la couleur éponyme tandis que `lowerOpacity` indique si oui ou non la couleur renvoyée doit être transparente.

```javascript
chooseColor('collegue') // --> 'rgb(128, 0, 128)'
chooseColor('contemporain', true) // --> 'rgba(0, 112, 0, 0.4)'
```

## Bouton de sélection des groupes

Dans le fichier `index.html` se trouve les boutons permettant d'activer et désactiver des groupes d'entités. Il suffit de placer un bouton tel que ci-dessous dans la page et de lui inscrire le nom du groupe auquel il est lié par son attribut `data-group` : il est alors automatiquement activé.

Le code ci-dessous présente un bouton lié au groupe "famille". 

```html
<button class="btn-group" data-group="famille">famille</button>
```