function getConnection(connection) {
    var conn = require('mysql').createConnection(
            {
                host: '10.0.113.22',
                user: 'mohsun',
                password: 'mohsun',
                database: 'ivr_payment'
            }
    );
    connection(conn);
}
exports.connection = getConnection;