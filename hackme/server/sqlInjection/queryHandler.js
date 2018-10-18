
exports.authentication = function (username, password, callback) {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = __dirname + "/sqlInjection.sqlite";
  let db = new sqlite3.Database(dbPath);
  console.log('salut nathan!');
  console.log(db);
  console.log(dbPath);

  let query = "SELECT user FROM users WHERE user = '" + username + "' AND password = '" + password + "'";

  // Validate query
  db.get(query, (err, row) => {
    if (err) {
      db.close();
      return callback(null, null, err.code, err.message + " in query: " + query);
    }

    isAnswerValid = true;
    username = null;
    if (typeof row === "undefined") { // If no matching rows were found
      isAnswerValid = false;
    }
    else {
      username = row.user;
    }

    db.close();
    return callback(isAnswerValid, username, null, null);
  });
}

exports.checkLvl2Answer = function (parameters, callback) {
  return callback(parameters.tablename == "users");
}

exports.fetchClientInfo = function (username, callback) {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = __dirname + "/sqlInjection.sqlite";
  let db = new sqlite3.Database(dbPath);
  let query = "SELECT user, information FROM users WHERE user = '" + username + "'";

  // Run the query to fetch results (in case of expected single select statement in the query)
  db.get(query, (err, row) => {
    if (err) {
      db.close();
      return callback(null, null, err.code, err.message + " in query: " + query);
    }

    // Execute query (to execute possible modifications injected in the query)
    db.exec(query, (err) => {
      if (err) {
        db.close();
        return callback(null, null, err.code, err.message + " in query: " + query);
      }
    });

    username = "";
    userinfo = "";
    if (typeof row !== "undefined") { // If no matching rows were found
      userinfo = row.information;
      username = row.user;
    }

    db.close();
    return callback(username, userinfo, null, null);
  });
}