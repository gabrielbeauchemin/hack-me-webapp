var express = require('express');
var router = express.Router();

var lvl2TextPosts = ["Hello", "Ca va^"];

router.get('/lvl1', function(req, res, next) {
    res.render('./xss/xssLvl1', { title: 'Hackme' });
});

router.get('/lvl2', function(req, res, next) {
    res.render('./xss/xssLvl2', { title: 'Hackme', posts: lvl2TextPosts });
});

router.get('/lvl3', function(req, res, next) {
    res.render('./xss/xssLvl3', { title: 'Hackme'});
});

router.get("/search", function (req, res, next) {
    var iframeUrl = "http://www.allume-feu-sacre.net";
    var resultat = "";
    if(req.query.recherche) {
        filteredRecherche = req.query.recherche.replace(new RegExp(" ", 'g'), "%20");
        iframeUrl += "?recherche=" + filteredRecherche;
    }

    res.render('./xss/level1/search', { 
        title: 'page de recherche', 
        innerurl: iframeUrl, 
        layout: './xss/level1/iframeLayout' 
    });
});

router.get("/blog", function (req, res, next) {
    if(req.query.post) {
        lvl2TextPosts.push(req.query.post);
    }
    if(typeof(req.query.clear) !== "undefined") {
        lvl2TextPosts = [];
    }

    res.render('./xss/level2/blog', { 
        title: 'blog de texts', 
        posts: lvl2TextPosts,
        layout: './xss/level2/iframeLayout' 
    });
});

router.get("/article", function (req, res, next) {
    url = "http://www.faitsinutiles.io";
    res.render('./xss/level3/article', { 
        title: 'article',
        innerurl: url,
        layout: './xss/level3/iframeLayout' 
    });
});
  
module.exports = router;
