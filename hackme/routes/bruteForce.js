let express = require('express');
let router = express.Router();
let evaluateAnswer = require("../server/bruteForce/EvaluateAnswer");
let areTooMuchInvalidConnexions = require("../server/bruteForce/areTooMuchInvalidConnexions.js");

function loginRendering(parameters, res, level) {
    if (!parameters.hasOwnProperty("username") || !parameters.hasOwnProperty("password")) {
        res.render('./bruteForce/bruteForceLvl' + level, {
            title: 'Hackme',
            failedLogin: false,
            successLogin: false,
            invalidLogin: false
        });
        return;
    }

    areTooMuchInvalidConnexions.evaluate(parameters.username, (canTryConnect, err) =>
    {
        if(err) {
            res.render('./bruteForce/bruteForceLvl' + level, {
                title: 'Hackme',
                failedLogin: true,
                successLogin: false,
                invalidLogin: false
            });
        }
        else if(!canTryConnect)
        {
            res.render('./bruteForce/bruteForceLvl' + level, {
                title: 'Hackme',
                failedLogin: false,
                successLogin: false,
                invalidLogin: true
            });
        }
        else //user has not tried too much times invalid password, now evaluate if the password is valid
        {
            evaluateAnswer.evaluate(parameters.username, parameters.password, (isAnswerValid, err) =>
            {
                if(err || !isAnswerValid)
                {
                    res.render('./bruteForce/bruteForceLvl' + level, {
                        title: 'Hackme',
                        failedLogin: true,
                        successLogin: false,
                        invalidLogin: false
                    });
                }
            else{
                    res.render('./bruteForce/bruteForceLvl' + level, {
                        title: 'Hackme',
                        failedLogin: false,
                        successLogin: true,
                        invalidLogin: false
                    });
                }
            });
        }});
}

router.get("/lvl1", function (req, res, next) {
    res.render('./bruteForce/bruteForceLvl1', {title: 'Hackme', failedLogin: false, successLogin: false});
});

router.post("/lvl1/EvaluateAnswer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    loginRendering(parameters, res, 1);
});

router.get("/lvl2", function (req, res, next) {
    res.render('./bruteForce/bruteForceLvl2', {title: 'Hackme', failedLogin: false, successLogin: false});
});

router.post("/lvl2/EvaluateAnswer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    //User cracked at passed level
    if (parameters.username == "gryzay") {
        res.render('./bruteForce/bruteForceLvl2', {title: 'Hackme', failedLogin: true, successLogin: false});
    }
    else if (parameters.username == "arkyblueyes1257" && parameters.password == "mhch415") {
        res.render('./bruteForce/bruteForceLvl2', {title: 'Hackme', failedLogin: false, successLogin: true});
    }
    else {
        res.render('./bruteForce/bruteForceLvl2', {title: 'Hackme', failedLogin: true, successLogin: false});
    }

});

router.get("/lvl3", function (req, res, next) {
    res.render('./bruteForce/bruteForceLvl3', {title: 'Hackme', failedLogin: false, successLogin: false});
});

router.post("/lvl3/EvaluateAnswer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));

    //Do not accept users cracked at passed levels
    if (parameters.username == "arkyblueyes1257" || parameters.username == "gryzay") {
        res.render('./bruteForce/bruteForceLvl3', {title: 'Hackme', failedLogin: true, successLogin: false});
    }
    else {
        loginRendering(parameters, res, 3);
    }
});

router.get("/lvl3/UsersSample.txt", function (req, res, next) {
    var file = __dirname.replace("routes", "views") + "/bruteForce/usersSample.txt";
    res.download(file); // Set disposition and send it.
});


module.exports = router;
