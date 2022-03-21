const WikiNode = require('./WikiNode')
const async = require('async')

function WikiRacer(startingArticle, targetArticle) {
    this._start = startingArticle;
    this._target = targetArticle;
    this._queue = [];
    this._visited = {};
    this._articleCount = 0;
    this._targetList = [];
}

WikiRacer.prototype.race = async function(startingArticle, targetArticle) {
    await this.expandTarget();
    var root = new WikiNode(startingArticle);
    await root.fetchArticle();
    this._queue.push(root);
    return await this.raceHelper(0);
}

WikiRacer.prototype.raceHelper = async function(count) {
    var self = this;
    if(self._queue.length == 0) {
        return false;
    }

    if(count > 1000) {
        return false;
    }

    var node = self._queue.shift();
    var page = node.getArticle();

    // console.log('Visiting node: ');
    // console.log(node);

    if(page === self._target) {
        console.log('Searched ' + count + ' articles.')
        return node.getPrintablePath();
    }

    self._visited[page] = true;
    console.log('Visiting article ' + node.getPrintablePath());

    var adjacent = node.getAdjacentArticles();
    // console.log('Adjacent count is ' + adjacent.length);
    var toLoad = [];

    var searchDepth = Math.min(adjacent.length, 20);
    for(let i = 0; i < searchDepth; i++) {
        var adjPage = adjacent[i];
        var adjNode = new WikiNode(adjPage, node.getPath());
        var toDest = self.findPath(adjPage);
        if(toDest) {
            console.log("Searched " + this._articleCount + " articles to find a path.");
            return node.getPath().concat(toDest);
        }
        if(!self._visited[adjPage]) {
            self._visited[adjPage] = true;
            toLoad.push(adjNode)
            self._queue.push(adjNode);
        }
    }

    //console.log(this._queue)
    //console.log('Found ' + toLoad.length + ' articles to load.');
    await this.fetchArticles(toLoad);

    //console.log(this._queue)
    return this.raceHelper(count + 1);
}

WikiRacer.prototype.fetchArticles = async function(articleList) {
    var self = this;
    // console.log("Fetching articles");
    // console.log(articleList.length);
    var applyFetchArticle = async function(article) {
        self._articleCount++;
        await article.fetchArticle();
    };

    await async.eachLimit(articleList, 20, applyFetchArticle);

}

WikiRacer.prototype.expandTarget = async function() {
    var self = this;
    var target = new WikiNode(self._target);
    await target.fetchArticle();
    var nearTarget = target.getAdjacentArticles().map((link) => {
        return new WikiNode(link);
    });
    await self.fetchArticles(nearTarget);
    for(let i = 0; i < nearTarget.length; i++) {
        var adjNode = nearTarget[i];
        var links = adjNode.getAdjacentArticles();
        var testLinkBack = function(link) {
            return link == self._target;
        }
        if(links.some(testLinkBack)) {
            this._targetList.push(adjNode.getArticle());
        }
    }

    console.log("Found " + self._targetList.length + " targets.");
    
}

WikiRacer.prototype.findPath = function(article) {
    var self = this;
    if(article == self._target) {
        return [article];
    } else if(self._targetList.includes(article)) {
        return [article, self._target];
    } else {
        return;
    }
}

module.exports = WikiRacer