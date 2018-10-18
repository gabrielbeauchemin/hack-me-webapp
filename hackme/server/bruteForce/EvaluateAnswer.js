
exports.evaluate = function(username, password, callback) {
  const sqlite3 = require('sqlite3').verbose();
  const sha256 = require('sha256');
 
  let dbPath = __dirname.replace('server/bruteForce',"dbs") + "/bruteForce.sqlite";
  let db = new sqlite3.Database(dbPath);

  let hashedPassword = sha256(username + password);
  let sql = `SELECT *
              FROM user
              WHERE name = ? AND password = ?`;
  db.get(sql, [username,hashedPassword], (err, row) => {
    if (err) {
      db.close();
      return callback(null, err.message);
    }
    //The user or password is not good
    isAnswerValid = true;
    if (typeof row === "undefined") {
      isAnswerValid = false;
    }

    if(isAnswerValid)
    {
      db.close();
      return callback(isAnswerValid, null);
    }
    //If connexion is invalid, increments the counter of invalid connexion
    else
    {
      let sql = `UPDATE user
      SET nbrLastFailedConnexions = nbrLastFailedConnexions + 1,
          lastFailedConnexion = ?
      WHERE name = ?`;
      let currentdate = new Date(); 
      let datetimeNow = currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes();
      db.run(sql, [datetimeNow,username], function(err) {
        if (err) {
          db.close();
          return callback(false, err.message);
        }
        db.close();
        return callback(false, null);
      });
    }
    
  });

    
  
};