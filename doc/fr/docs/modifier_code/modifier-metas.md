---
title: Modifier les métadonnées de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 29/07/2020
---

## Métadonnées des différents ontologies

Les métadonnées de l'Otletosphère sont inscrites dans le fichier `index.html` et imbriquées dans la balise `<head>`.

### Impact

Modifier les métadonnées pour décrire votre contenu vous permet d’être mieux référencé sur les moteurs de recherche, mais aussi de vous intégrer sur différentes plateformes comme les réseaux sociaux ou même [Zotero](https://www.zotero.org/).

### Modification

Pour que différents moteurs puissent interpréter les métadonnées du site, elles sont répétées selon les différents standards :

- [OpenGraph](https://developers.facebook.com/docs/sharing/webmasters?locale=fr_FR) (Facebook, LinkedIn)
- [Twitter](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started)
- [Schema.org](https://schema.org/) (Google)
- [Dublin Core](https://openweb.eu.org/articles/dublin_core)

Les deux balises ci-dessous permettent de déclarer le titre de la page respectivement pour l’affichage sur les pages de résultat des moteurs de recherche (entre autres) et pour l’affichage sur les publications Facebook et LinkedIn.

```html
<title>Otletosphère - cartographie relationnelle Paul Otlet</title>
<meta property="og:title" content="Otletosphère - cartographie relationnelle Paul Otlet"/>
```

Dans le fichier `index.html`, les métadonnées ont été regroupées dans la mesure du possible selon ce qu’elles permettent de déclarer (title, description, authors… ). Vous n’avez qu’à modifier à la chaîne les balises d’un même groupe pour les adapter à votre contenu.

!!!important
	Les métadonnées Schema.org imbriquées dans la balise `#!html <script type="application/ld+json"></script>` n’ont pas pu être réparties dans le `<head>`. N’oubliez pas de les modifier.
	
### Image de couverture

Twitter, LinkedIn et Facebook (entre autres) offrent la possibilité d’afficher automatiquement une image sur les publications relatives à votre site.

Les balises `<meta>` responsables de ce comportement sont listées sous le commentaire `<!-- social image -->` et pointent vers une image selon le chemin `./assets/image-rs.jpg`.

Vous pouvez créer une image `image-rs.jpg` et la placer dans le répertoire `/assets/`. Nous vous conseillons le format 600x314.

### Tester les métadonnées

Les outils suivants vous permettent de tester vos modifications une fois votre site en ligne. Si vous avez complété toutes les champs, des informations cohérentes devraient apparaître :

- Vue d’ensemble : https://metatags.io/
- Twitter cards : https://cards-dev.twitter.com/validator
- Facebook card : https://developers.facebook.com/tools/debug/
- Schema.org : https://search.google.com/structured-data/testing-tool/u/0/

## Favicon

Le site https://realfavicongenerator.net/ vous permet de générer facilement les icônes pour les navigateurs web et menus d’applications. Ainsi lorsqu’un internaute ouvre votre site dans un onglet ou qu’il l’ajoute en favoris, votre icône personnalisée apparaît.

## Humans.txt

Vous trouverez le fichier `humans.txt` à la racine de votre site. Il vous permet de lister les différentes personnes qui ont participé au projet, leur forme de contribution et de leur attribuer un lien de contact. Plus d’informations sur le site de présentation cette initiative :  http://humanstxt.org/.

Ce fichier est relié au site via la balise `#!html <link type="text/plain" rel="author" href="https://site.fr/humans.txt"/>`.