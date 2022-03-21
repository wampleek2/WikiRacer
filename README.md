# WikiRacer

A node command line utility to wiki race.

## Description

This is a simple breadth first search from the starting point to (hopefully) the destination. It doesn't perform well if the target article
is more than 4 jumps away from the starting point.

### How to run

The entry point is racer.js. It expects two arguments. The first is the starting point. The second is the destination you would like to reach.
Both arguments can either be wikipedia links ("https://en.wikipedia.org/wiki/Kevin_Bacon") or just the title of the article ("Kevin Bacon").

```
node racer.js "Kevin Bacon" "Tom Cruise"
```

### Performance

We expand the search target by looking for all nodes linking out of the destination that also link back to it. This proved to be a significant time savings. As the third example shows we can search 4 levels deep in about a minute. After that we run into memory issues as the size of the breadth first search queue gets very large. I have some ideas to reduce the memory footprint, but they are not yet implemented.

```
Searched 183 articles to find a path.
Execution time: 3842ms
Path is Tom Cruise > A Few Good Men > Kevin Bacon

Searched 347 articles to find a path.
Execution time: 7590ms
Path is Battle of Crécy > Crécy-en-Ponthieu > Battle of France > Wehrmacht

node racer.js "Tom Cruise" "Art Deco"
Searched 2671 articles to find a path.
Execution time: 62651ms
Path is Tom Cruise > British Academy Film Award > Mitzi Cunliffe > Le Corbusier > Art Deco
```
