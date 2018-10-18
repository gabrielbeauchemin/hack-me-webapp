// If it has been less than 10 minutes since last failed Connexion
//     Return true if the user did not failed 3 times
//     Return false otherwise
//If it has been less more 10 minutes since last failed Connexion
//     Reset the count of number of failed connexion and return true
exports.evaluate = function(username, callback) {
  const sqlite3 = require('sqlite3').verbose();
 
  var dbPath = __dirname.replace('server/bruteForce',"dbs") + "/bruteForce.sqlite";
  console.log(dbPath);
  console.log(__dirname);
  let db = new sqlite3.Database(dbPath);

  let sql = `SELECT *
              FROM user
              WHERE name = ?`;
  db.get(sql, username, (err, row) => {
    if (err) {
      db.close();
      return callback(false, err.message);
    }

    //The user does not exist
    if (typeof row === "undefined") {
      db.close();
      return callback(false, "user does not exist in the db");
    }
   
    let lastFailedConnexion = row.lastFailedConnexion;
    if(!lastFailedConnexion)
    {
      db.close();
      return callback(true, null);
    }

     //If it has been more than 10 minutes since the last failed login, reset its counter
    let currentdate = new Date(); 
    let datetimeNow =  currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes();
    let msPassed = Math.abs(new Date(datetimeNow) - new Date(lastFailedConnexion));

    if(msPassed < 600000)
    {
      isConnexionValid = row.nbrLastFailedConnexions < 3;
      db.close();
      return callback(isConnexionValid, null);
    }
    else
    {
      let sql = `UPDATE user
            SET nbrLastFailedConnexions = 0
            WHERE name = ?`;
 
      db.run(sql, username, function(err) {
        if (err) {
          db.close();
          return callback(false, err.message);
        }
        db.close();
        return callback(true, null);
      });
    }
  });
};