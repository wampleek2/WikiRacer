const WTF = require('wtf_wikipedia')

function WikiNode(article, subpath) {
    var self = this;
    self._article = article;
    if(subpath && subpath.length > 0) {
        var path = [...subpath];
        path.push(article);
        this._path = path;
        
    } else {
        self._path = [article];
    }
};

WikiNode.prototype.getArticle = function () {
    return this._article
};

WikiNode.prototype.setArticle = function (article) {
    this._article = article
};

WikiNode.prototype.getPath = function() {
    return this._path;
}

WikiNode.prototype.getPrintablePath = function() {
    return this._path.join(' > ');
}

WikiNode.prototype.fetchArticle = async function() {
    if(this._article) {
        this._wtf = await WTF.fetch(this._article);
    }
}

WikiNode.prototype.getAdjacentArticles = function() {
    // console.log('Finding adjacent articles.');

    if(!this._wtf) {
        return [];
    }

    function onlyUnique(value, index, self) {
        return !!value.trim() && self.indexOf(value) === index;
    }

    var links = this._wtf.links();

    // console.log('Prefiltered count ' + links.length);

    var uniqueLinks = links
                        .filter((link) => link.type() == 'internal')
                        .map((link) => link.page())
                        .filter(onlyUnique);
                        
    // console.log("Unique links: ")
    // console.log(uniqueLinks);
    // console.log('Filtered count ' + uniqueLinks.length);
    return uniqueLinks;
}



module.exports = WikiNode