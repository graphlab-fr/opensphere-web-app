---
title: Modify groups l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 09/06/2020
---

This tutorial will describe how to modify entity groups based on the entries you made in the `/data/entite.json` file.

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

## Add a group based on a relationship ##

In the `network' object (`/dist/scripts/network.js`) is the `groups' object.

For each **relationship recognized as a group** of entities, there is a dedicated object as above, i.e. named according to the name of the relationship and with [different parameters to modify the appearance]() of all the nodes of the *Network* view that are linked to it.

```javascript
contemporain: {shape: 'circularImage', color: {border: chooseColor('contemporain')}}
```

To group entities with "friend" and "opponent" as `relationships', enter the objects below into `network.options':

```javascript
groups: {
    ami: {shape: 'circularImage', color: {border: chooseColor('ami')}},
    opposant: {shape: 'circularImage', color: {border: chooseColor('opposant')}}
}
```

## Change the appearance of nodes in a group

The different aesthetic and reactive parameters applicable to the nodes are presented in the [Vis.js documentation](https://visjs.github.io/vis-network/docs/network/nodes.html) and should be added directly in the object of the group as presented above. These parameters are applied as an overlay to those directly applied to the nodes.

The `chooseColor` function (`/dist/scripts/network.js`) allows to find at any time a color as defined within it. This function is used several times in the software to find the color of a relationship : be sure to write a color for each of your groups, respecting the case. Below, a color has been assigned to the groups "colleague" and "contemporary".

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

The `relationEntite` parameter is a string allowing you to find the eponymous color, while `lowerOpacity` indicates whether or not the returned color should be transparent.

```javascript
chooseColor('collegue') // --> 'rgb(128, 0, 128)'
chooseColor('contemporain', true) // --> 'rgba(0, 112, 0, 0.4)'
```

## Group selection buttons

In the `index.html` file are the buttons to enable and disable entity groups. Simply place a button such as below in the page and enter the name of the group to which it is linked by its `data-group` attribute: it is then automatically activated.

In the `index.html` file are the buttons to enable and disable entity groups. 

```html
<button class="btn-group" data-group="famille">famille</button>
```