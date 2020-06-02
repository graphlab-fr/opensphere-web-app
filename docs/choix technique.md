---
title: Choix techniques Otletosphère
author: Guillaume Brioudes : https://myllaume.fr/
date: 29/04/2020
---

Voici quelques explications sur les choix techniques qui ont été effectué par l'équipe de conception et de développement, toujours dans l'optique de proposer une expérience de lecture optimale et informative aux internautes.

## Continuité de navigation

La fluidité de la navigation est point capital qui a determiné la structure actuelle du site comme une pile de sections. Elles remplissent chacun un écran et la navigation en [entête](/elements interface/#entete) permet de passer de l'une à l'autre à tout moment.

### Union des vues

Entre les deux vues *Réseau* et *Notices*, il n'y avait dans la première version du site aucun lien. Ni le contenu ni l'affichage ne se poursuivaient entre les deux pages qui sont désormais unies.

L'affichage des deux vues émane désormais de l'unique base de données du site. Les différentes options de filtrage agissent simultanément sur les sections *Réseau* et *Notices*, si bien qu'elles deviennent complémentaires.

En effet, la vue *Réseau* est davantage centrée sur les relations tandis que la vue *Notices* permet de parcourir les entités listées par ordre alphabétique. La première visualisation étant au centre du projet, nous avons décider de faire converger les utilisateurs vers elle.

Le [volet de description](/elements interface/#volet-de-description) est un intermédiaire entre les deux vues. Le bouton *Visualiser* situé dans son entête permet de retrouver le nœud de l'entité décrite dans la vue *Réseau* et cela même si l'on est dans la section *Notices*.

Ce raccourcis permet de passer facilement de la liste des entités à la visualisation de leurs relations. L'entité ainsi décrite est également mise en avant afin que l'utilisateur puisse rapidement appréhender le réseau l'entourant et ainsi passer à une autre entité.

### Connexions entre les nœuds

Le [volet de description](/elements interface/#volet-de-description) propose également une liste des nœuds attachés à celui qui est décrit. Il est à partir de là facile d'aller d'un nœud à l'autre sans avoir besoin de se déplacer dans le réseau à l'aide de la souris : au clic sur l'une des connexions, la vue se recentre automatiquement sur le nœud lié.

### Historique et adressage

À chaque clic sur une carte ou un nœud, l'identifiant unique de l'entité liée est inscrit dans l'adresse de la page, ainsi que dans l'historique de navigation, et le nom de page devient son label. Ainsi, il est facile de retrouver une entité visualisée auparavant : on a pu noter son adresse unique ou bien on peut la retrouver dans l'historique du navigateur sous le nom de l'entité.

Les touches *avancer* et *reculer* du navigateur permettent également d'aller et venir entre les entités visualisées durant la navigation.

## Effets de transparence

La densité du *Réseau* est telle que sa lecture est rendue difficile. Il a été décidé de pallier cela en mettant en place des effets de transparence sur les nœuds et liens.

Au clic sur un nœud ou une carte, l'entité passe dans le mode *activé*. Cela a [différents effets](/selection entites/#effets), notamment celui de mettre en avant le réseau du nœud sélectionné en graissant sa bordure et ses liens. Cela ne nous a pas semblé suffisant pour faciliter la lecture étant donné que le parcours de la visualisation ne doit pas uniquement se faire par le biais de sélections.

Ainsi nous avons ajouté un effet au survol également : au survol d'nœud, tous à l'exception de son réseau direct deviennent translucides. Cet état ne devant pas empêcher la visualisation exceptionnelle du nœud de l'entité active, il a également été décidé que celle-ci et son réseau ne pourrait en aucun cas devenir translucide.

Ainsi il est possible de sélectionner avec le clic un nœud devenu particulièrement visible et d'y ajouter les effets de transparence avec la fonctionnalité au survol. Le combinaison des deux permet de placer un repère gras et de voir nœud par nœud survolé quelles relations ils entretiennent. Ce système fait de la souris un outils de visualisation très efficace et avec une poignée de fonctionnalités rapidement comprises par l'utilisateur.