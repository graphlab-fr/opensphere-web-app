---
title: Accueil
author: Guillaume Brioudes <https://myllaume.fr/>
date: 2021-02-26
lang: fr
keywords:
  - développeur
---

Les consignes suivantes permettent de télécharger et d’installer le logiciel afin de l'utiliser pour votre propre projet. Nous vous rappelons que vous aurez besoin d’un serveur web (local ou en ligne) pour le faire fonctionner. Veillez à adapter l’emplacement de votre installation selon cette contrainte.

# Téléchargement

La dernière version testée du code source est entreposée sur [notre dépôt GitHub](https://github.com/hyperotlet/opensphere). Plusieurs méthodes d'installation s'offrent à vous.

Vous pouvez [**télécharger l’ensemble des fichiers** en suivant ce lien](https://github.com/hyperotlet/opensphere/archive/master.zip). Il s’agit de la version « master » du logiciel, sable et vérifiée. Vous n'avez alors plus qu’à décompresser ([sur Windows](https://support.microsoft.com/fr-fr/windows/compresser-et-d%C3%A9compresser-des-fichiers-8d28fa72-f2f9-712f-67df-f80cf89fd4e5), [sur MacOs](https://support.apple.com/fr-fr/guide/mac-help/mchlp2528/mac)) l’archive téléchargée.

---

Deux autres méthodes vous permettent de **conserver l’historique de développement**, utile si vous souhaitez à votre tour élaborer différentes versions de votre Opensphère grâce à l’outil [Git](https://git-scm.com/).

- **Via une ligne de commande**, si vous avez installé le [logiciel Git](https://git-scm.com/). La commande `git clone https://github.com/hyperotlet/opensphere.git` inclue l’ensemble des fichiers et l’historique de développement.
- **Via [GitHub Desktop](https://desktop.github.com/)**, une interface graphique intégrant Git.

# Mise en route

Il vous faut un serveur web pour faire fonctionner l’Opensphère. Les fichiers de données ne peuvent être captés que grâce à des protocoles propres aux serveurs. Votre serveur peut être

- **en local**, grâce à un logiciel comme [WAMP](https://www.wampserver.com/) (Windows), [MAMP](https://www.mamp.info/en/downloads/) (MacOs, Windows) ou [XAMP](https://www.apachefriends.org/fr/index.html) (MacOs, Windows, Linux) ;
- **en ligne**, et dans ce cas il vous faut transférer les fichiers de l’Opensphère grâce à un [client FTP, comme FileZilla](https://filezilla-project.org/).

Déplacez vos fichiers à la source de votre serveur ou déplacez la source pour que la racine puisse être le fichier `index.html`.