let express = require('express');
let router = express.Router();
let queryHandler = require("../server/sqlInjection/queryHandler");

function loginRendering(parameters, res, level) {
    console.log('je rentre dans loginRendering');
    queryHandler.authentication(parameters.username, parameters.password, (isAnswerValid, username, errCode, errMessage) => {
        if (errCode) {  // If query caused an error
            console.log(errCode);
            res.render('./sqlInjection/sqlInjectionLvl' + level, {
                title: 'Hackme',
                failedLogin: true,
                errCode: errCode,
                errMessage: errMessage.replace(/"/g, "\\\"")
            });
        }
        else if (!isAnswerValid) {  // No error in query but no record returned by query
            res.render('./sqlInjection/sqlInjectionLvl' + level, {
                title: 'Hackme',
                invalidLogin: true,
            });
        }
        else {  // Record(s) returned by query
            res.render('./sqlInjection/sqlInjectionLvl' + level, {
                title: 'Hackme',
                successLogin: true,
                username: username
            });
        }
    });
}

function validatingAnswer(parameters, res, answerCheckFunction, level) {
    answerCheckFunction(parameters, (isAnswerValid) => {
        res.render('./sqlInjection/sqlInjectionLvl' + level, {
            title: 'Hackme',
            validAnswer: isAnswerValid,
            invalidAnswer: !isAnswerValid
        });
    });
}

function displayUserInfo(parameters, res, level) {
    queryHandler.fetchClientInfo(parameters.username, (username, userinfo, errCode, errMessage) => {
        if (errCode) {  // If query caused an error
            res.render('./sqlInjection/sqlInjectionLvl' + level, {
                title: 'Hackme',
                failedInfoQuery: true,
                errCode: errCode,
                errMessage: errMessage.replace(/"/g, "\\\"")
            });
        }
        else {
            res.render('./sqlInjection/sqlInjectionLvl' + level, {
                title: 'Hackme',
                username: username,
                userinfo: userinfo
            });
        }
    });
}

router.get('/lvl1', function (req, res, next) {
    res.render('./sqlInjection/sqlInjectionLvl1', { title: 'Hackme' });
});

router.post("/lvl1/Answer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    loginRendering(parameters, res, 1);
});

router.get('/lvl2', function (req, res, next) {
    res.render('./sqlInjection/sqlInjectionLvl2', { title: 'Hackme' });
});

router.post("/lvl2/Login", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    loginRendering(parameters, res, 2);
});

router.post("/lvl2/Answer", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    validatingAnswer(parameters, res, queryHandler.checkLvl2Answer, 2);
});

router.get('/lvl3', function (req, res, next) {
    res.render('./sqlInjection/sqlInjectionLvl3', { title: 'Hackme' });
});

router.post("/lvl3/Display", function (req, res, next) {
    parameters = JSON.parse(JSON.stringify(req.body));
    displayUserInfo(parameters, res, 3);
});

module.exports = router;
