const WikiNode = require('./WikiNode')
const async = require('async')

function WikiRacer() {
    this._queue = [];
    this._visited = {};
}

WikiRacer.prototype.race = async function(startingArticle, targetArticle) {
    // console.log(startingArticle);
    // console.log(targetArticle);
    this._start = startingArticle;
    this._target = targetArticle;
    var root = new WikiNode(startingArticle);
    await root.fetchArticle();
    this._queue.push(root);
    return await this.raceHelper(0);
}

WikiRacer.prototype.raceHelper = async function(count) {
    if(this._queue.length == 0) {
        return false;
    }

    if(count > 1000) {
        return false;
    }

    var node = this._queue.shift();
    var page = node.getArticle();

    // console.log('Visiting node: ');
    // console.log(node);

    if(page === this._target) {
        console.log('Searched ' + count + ' articles.')
        return node.getPrintablePath();
    }

    this._visited[page] = true;
    console.log('Visiting article ' + node.getPrintablePath());

    var adjacent = node.getAdjacentArticles();
    // console.log('Adjacent count is ' + adjacent.length);
    var toLoad = [];

    var searchDepth = Math.min(adjacent.length, 20);
    for(let i = 0; i < searchDepth; i++) {
        var adjPage = adjacent[i];
        if(!this._visited[adjPage]) {
            this._visited[adjPage] = true;
            adjNode = new WikiNode(adjPage, node.getPath());
            toLoad.push(adjNode)
            this._queue.push(adjNode);
        }
    }

    //console.log(this._queue)
    //console.log('Found ' + toLoad.length + ' articles to load.');
    await this.fetchArticles(toLoad);

    //console.log(this._queue)
    return this.raceHelper(count + 1);
}

WikiRacer.prototype.fetchArticles = async function(articleList) {
    // console.log("Fetching articles");
    // console.log(articleList.length);
    var applyFetchArticle = async function(article) {
        await article.fetchArticle();
    };
    await async.eachLimit(articleList, 10, applyFetchArticle);
}

module.exports = WikiRacer