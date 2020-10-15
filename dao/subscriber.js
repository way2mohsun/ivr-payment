function setSubsctiber(phone, tel, callback) {
    var queryString = "INSERT INTO subscriber (phone, tel) " +
            "VALUES (" + phone + "," + tel + ")";
    require('./connection.js').connection(function(connection) {
        connection.query(queryString, function(err, rows, fields) {
            if (err)
                throw err;
        });
        connection.end();
    });
}
exports.setSubsctiber = setSubsctiber;