---
title: Modify metadatas from Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 29/07/2020
---

## Metadata from different ontologies

The metadata of the Otletosphere are written in the `index.html` file and nested in the `<head>` tag.

### Impact

Modifying the metadata to describe your content allows you to be better referenced on search engines, but also to integrate you on different platforms such as social networks or even [Zotero](https://www.zotero.org/).

### Modification

In order for different engines to be able to interpret the site's metadata, they are repeated according to different standards:

- [OpenGraph](https://developers.facebook.com/docs/sharing/webmasters?locale=en_EN) (Facebook, LinkedIn)
- [Twitter](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started)
- [Schema.org](https://schema.org/) (Google)
- [Dublin Core](http://paladini.github.io/dublin-core-basics/)

The two tags below make it possible to declare the title of the page respectively for display on search engine result pages (among others) and for display on Facebook and LinkedIn publications.

```html
<title>Otletosphère - cartographie relationnelle Paul Otlet</title>
<meta property="og:title" content="Otletosphère - cartographie relationnelle Paul Otlet"/>
```

In the `index.html` file, the metadata have been grouped together as far as possible according to what they allow to be declared (title, description, authors... ). You only have to modify the tags of the same group to adapt them to your content.

!!! important
	The Schema.org metadata embedded in the `#!html <script type="application/ld+json"></script>` tag could not be distributed in the `<head>`. Don't forget to modify them.

### Cover image

Twitter, LinkedIn and Facebook (among others) offer the possibility of automatically displaying an image on publications containing your site's address.

The `<meta>` tags responsible for this behavior are listed under the comment `<!-- social image -->` and point to an image according to the path `./assets/image-rs.jpg`.

You can create an image `image-rs.jpg` and place it in the `/assets/` directory. We recommend you the 600x314 format.

### Test the metadatas

The following tools allow you to test your changes once your site is online. If you have completed all the fields, consistent information should appear:

- Overview: https://metatags.io/
- Twitter cards: https://cards-dev.twitter.com/validator
- Facebook card: https://developers.facebook.com/tools/debug/
- Schema.org: https://search.google.com/structured-data/testing-tool/u/0/

## Favicon

In the `index.html` file, the icons metadatas follows the comment `<!-- FAVICON -->`.

The web site https://realfavicongenerator.net/ allows you to easily generate icons for web browsers and application menus. So when a web user opens your site in a tab or adds it as a favorite, your personalized icon appears.

## Humans.txt

You will find the `humans.txt` file at the root of your site. It allows you to list the different people who participated in the project, their form of contribution and to assign them a contact link. More information on the site presenting this initiative: http://humanstxt.org/.

This file is linked to the site via the tag `#!html <link type="text/plain" rel="author" href="https://site.fr/humans.txt"/>`.