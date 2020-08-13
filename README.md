# Otletosphère [![DOI](https://zenodo.org/badge/268753837.svg)](https://zenodo.org/badge/latestdoi/268753837)

Visualisation du réseau de Paul Otlet

## Liens

Feuilles *GSheet* : https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing

Visualisation documentation : https://hyperotlet.github.io/otletosphere/

## Installations

Dépendances documentation et téléchargement dépôt.

https://www.python.org/
https://www.mkdocs.org/
https://squidfunk.github.io/mkdocs-material/
https://github.com/davisp/ghp-import

```bash
pip install mkdocs
pip install mkdocs-material
pip install ghp-import

git clone https://github.com/hyperotlet/otletosphere.git
```

Déploiement de la documentation

```bash
cd scripts
sh build.sh
cd ..
ghp-import -p build
```

# Documentation Otletosphère

 Rédaction de la documentation du projet Otletosphère.

## Contribution

Vous êtes invités à contribuer en rédigeant des fichiers markdown dans le répertoire `/docs` et à mettre à jour la partie `# Navigation` du fichier `mkdocs.yml` en fonction de vos ajouts.

### Rédaction markdown

#### Syntaxe et extensions

Vous pouvez recourir à l'ensemble des syntaxes présentées sur ce [guide des notations markdown](https://www.markdownguide.org/cheat-sheet/) (y compris la *Extended Syntax*).

De plus, vous pouvez insérer les éléments particuliers suivants (avec lien vers leur documentation) :

- Panneaux : https://squidfunk.github.io/mkdocs-material/extensions/admonition/#usage
  - dont panneaux dépliants : https://squidfunk.github.io/mkdocs-material/extensions/admonition/#collapsible-blocks
- Blocs de code
  - groupés : https://squidfunk.github.io/mkdocs-material/extensions/codehilite/#grouping-code-blocks
  - sur une ligne : https://squidfunk.github.io/mkdocs-material/extensions/pymdown/#inlinehilite
- Bloc avec onglets : https://squidfunk.github.io/mkdocs-material/extensions/pymdown/#tabbed
- Notes en bas de page : https://squidfunk.github.io/mkdocs-material/extensions/footnotes/#usage

#### Éléments page

##### Niveaux de titre

Il ne doit y avoir qu'un seul titre de niveau 1 par page, voire aucun si la clé `title` *YAML front matter* a été complétée. Tous les autres titres doivent être de niveau 2 ou inférieur.

Tous les titres font l'objet d'une ancre qu'il est possible d'utiliser à la mise en places des liens.

##### Métadonnées

N'hésitez pas à ajouter un *YAML front matter* tout en haut de vos fichiers markdown différencier titre de la page et `titre 1`, mais aussi être référencé comme auteur dans le *head* de la page.

```markdown
title: Lorem ipsum
description: Nullam urna elit, malesuada eget finibus ut, ac tortor.
author: Albert Bush
date: xx/xx/xxxx
```

##### Liens

Les liens internes doivent être inscrits de la manière suivante pour fonctionner (exemple vers le fichier `faq.md`) :

```markdown
[texte lien](/<nom_fichier_md_sans_extension>/#<ancre>)

[faq](/faq)
[faq](/faq/#question3)
```

### Mise à jour navigation

Pour mettre à jour la navigation du site, il est nécessaire de modifier la partie `# Navigation` du fichier `mkdocs.yml` en respectant la hiérarchie décrite plus bas.

```yaml
nav:
  - Accueil: index.md # seul nom à ne pas modifier
  - Partie1:
    - Page: nom fichier.md
  - Partie2:
    - Page: nom fichier.md
    - Page: nom fichier.md
```

## Arborescence modèle

Voici la proposition d'arborescence en trois niveaux d'indentation tel que :

1. **Partie** (il ne s'agit pas d'une page, on n'y écrit pas, on lui donne un nom et on lui assigne des pages)
2. **Page** (rédigées en markdown, elles comportent titres et sous-titres et tout autre élément markdown)
3. **Titre** (ils forment la *table des matières* de la page)

Il n'est pas nécessaire de la mettre à jour : elle sert au démarrage, le temps de compléter le `mkdocs.yml` qui servira à son tour de guide.

- Page d'accueil
- Démarche
	- Relations à Otlet
	- Métadonnées
		1. Label
		2. Description
	- Langues
	- Choix techniques
		1. Effets
		2. Continuité de navigation
- Guide d'utilisation
	- Éléments de l'interface
		1. Réseau
		2. Volet de description
		3. Entête
		4. Fiches
		5. À propos
	- Naviguer dans le réseau
		1. Axes de navigation
		2. Éléments graphiques
		3. Depuis le volet de description
	- Sélectionner une entité
		1. Méthodes
		2. Effets
	- Trier les entités
- FAQ
- Historique
	- Objectifs du projet
	- Versions
		1. Première version
		2. Deuxième version
	- Équipe
	- Journal des ajouts
- Développement
	- Bibliothèques
		1. Vis.js
		2. Fuse.js
		3. Bootstrap
	- Réutiliser le projet
		1. Téléchargement et installation
		2. Dépendances
	- Architecture
