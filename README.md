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
