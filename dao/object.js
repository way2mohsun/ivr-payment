function hasObject(code, callback) {
    var queryString = "SELECT count(*) as count from object "
            + "where code = " + code + " and status='true'";
    require('./connection.js').connection(function(connection) {
        connection.query(queryString, function(err, rows, fields) {
            if (err)
                throw err;
            if (rows[0].count > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
        connection.end();
    });
}
exports.hasObject = hasObject;