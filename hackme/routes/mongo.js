let express = require('express');
let router = express.Router();
let evaluateAnswer = require("../server/mongo/mongolvl1");

router.get('/lvl1', function (req, res, next) {
    res.render('./mongo/mongolvl1', {title: 'Hackme'});
});

router.post("/lvl1/EvaluateAnswer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    evaluateAnswer.evaluate(parameters.username, parameters.password, (isAnswerValid, err) => {
        if (err || !isAnswerValid) {
            res.render('./mongo/mongolvl1', {
                title: 'Hackme',
                failedLogin: true,
                successLogin: false
            });
        }
        else {
            res.render('./mongo/mongolvl1', {
                title: 'Hackme',
                failedLogin: false,
                successLogin: true
            });
        }
    });
});

module.exports = router;
