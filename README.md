# Otletosphère [![DOI](https://zenodo.org/badge/268753837.svg)](https://zenodo.org/badge/latestdoi/268753837)

 L’Otletosphère est une cartographie relationnelle des personnalités et institutions liées à Paul Otlet. Elle permet d’étudier son réseau intellectuel et professionnel, de contextualiser ces informations par leur mise en relation, dans une logique hypertextuelle dont Paul Otlet était un précurseur.
 
 L’Otletosphère est aussi un outil mis à la disposition de tous et documenté dans ce sens. En effet, nous avons souhaité rendre possible la réutilisation de l’Otletosphère comme interface de visualisation dans d’autres contextes de recherche. Le code source est donc ouvert et librement réutilisable (licence MIT). La version 2.0 a été déposée [sur Zenodo](https://zenodo.org/record/3981189) ; le développement se poursuit sur GitHub. Une [documentation](https://hyperotlet.github.io/otletosphere/) est en ligne pour faciliter les réutilisations.


- Feuilles *GSheet* (base de données du site) : https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing
- Documentation des fonctionnalités et de l'architecture : https://hyperotlet.github.io/otletosphere/

## Maintenance et réutilisation

### Application

```bash
$ git clone https://github.com/hyperotlet/otletosphere.git
```

L'application ne fonctionne que sur un serveur local (gratuit) comme avec [XAMP](https://www.apachefriends.org/fr/index.html) ou MAMP (Mac OS) ou sur un serveur connecté à Internet. Seul un serveur peut assurer les échanges internes en matière de données.

### Documentation

Dépendances liées à la documentation et téléchargement dépôt.

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