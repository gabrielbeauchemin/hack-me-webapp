const MongoClient = require('mongodb').MongoClient;

exports.evaluate = function (username, password, callback) {
    const uri = 'mongodb://localhost:27017';
    MongoClient.connect(uri, function (err, client) {
            const db = client.db('lvl1');

        let query = {
            $where: "this.username === '" + username + "' && this.password === '" + password + "'"
        }

            db.collection('users').find(query).each(function(err, doc) {
                if (doc) {
                    isAnswerValid = true;
                    return callback(true, null);
                } else return callback(false, err);
            });
            client.close();
        }
    );
};