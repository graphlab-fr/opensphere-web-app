# Otletosphère

Visualisation du réseau de Paul Otlet

## Liens

Feuilles *GSheet* : https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit?usp=sharing

Visualisation documentation : https://hyperotlet.github.io/otletosphere/

## Instalations

Dépendances documentations et téléchargement dépôt.

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