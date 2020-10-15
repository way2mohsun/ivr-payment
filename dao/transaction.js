var connection = require('./connection.js').connection();

function hasObject(phone, tel) {
    var queryString = "INSERT INTO subscriber (phone, tel) " +
            "VALUES (" + phone + "," + tel + ")";
    connection.query(queryString, function(err, rows, fields) {
        if (err)
            throw err;
        for (var i in rows) {
            return rows[i].count > 0;
        }
        return false;
    });
    connection.end();
}
exports.setTransaction = hasObject;