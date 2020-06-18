---
title: Otletosphere development libraries
author: Guillaume Brioudes <https://myllaume.fr/>
date: 09/06/2020
---

To build the website quickly, but also to improve the maintainability and readability of the source code, the development team used the following libraries.

!!! check "No additional installation required"
	Except for the [Gulp.js related libraries](#gulpjs), all are included in the [Otletosphere directory]() and require no additional installation to work.

The different documentations are attached so that developers can understand and adapt the use of these libraries.

## JavaScript

### Vis.js

The JavaScript library [Vis.js](https://github.com/visjs/vis-network) allowed us to visualize the *Network* section thanks to two of its components : *Network* and *DataSet*.

The library allowed us to process the data (storage, sorting, circulation of data between functions), but also to generate the canvas, its animation and finally the management of events within it (selection, hovering, zooming).

### Fuse.js

The JavaScript library [Fuse.js](https://fusejs.io/) allowed us to implement the entity search engine. It allows us to browse arrays of JavaScript objects with a search criterion in order to extract the most relevant objects.

## CSS

### Bootstrap

We used the CSS part of the [Bootstrap] library (https://getbootstrap.com/) to easily build a flexible interface for tablet and desktop.

## Gulp.js

Below is the list of Node.js dependencies used for the production of source code via the [Gulp.js] tool (https://gulpjs.com/).

This modularized library is not required for installation, nor does it need to be modified: the [configuration files]() `package.json` and `gulpfile.js` are useful for developers who want to take advantage of the Gulp.js source code production tool: it is custom-configured. However, an [additional installation]() is required.

- gulp-autoprefixer : https://www.npmjs.com/package/gulp-autoprefixer
- gulp-concat : https://www.npmjs.com/package/gulp-concat
- gulp-sass : https://www.npmjs.com/package/gulp-sass
- node-sass : https://www.npmjs.com/package/node-sass