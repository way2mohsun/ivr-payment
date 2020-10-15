package cra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Report800 {

    public static void main(String[] args)
            throws Exception {
        Connection dbConnection = null;
        Statement statement = null;
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        String format = formatter.format(date);
        String sql = "SELECT operation_name , case when result_code = '0' then 'Success' else 'Fail' end as status, count(*) as cnt FROM mw_esb_trans_logs partition (p" + format + ") "
                + "where operation_name in ('getBlockList','getProductList','unSubscribeProduct') "
                + "group by operation_name, result_code";
        try {
            dbConnection = getDBConnection();
            statement = dbConnection.createStatement();
            ResultSet rs = statement.executeQuery(sql);
            String res = "";
            while (rs.next()) {
                res = res + rs.getString("operation_name") + ", " + rs.getString("status") + ", " + rs.getString("cnt") + "\\n";
            }
            String[] command = {"/bin/sh", "-c", "printf '" + res + "' | mail -s '800 report' nina.ha@mtnirancell.ir,fatemeh.ebra@mtnirancell.ir,behrouz.n@mtnirancell.ir"};
            Runtime.getRuntime().exec(command);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            if (statement != null) {
                statement.close();
            }
            if (dbConnection != null) {
                dbConnection.close();
            }
        }
    }

    private static Connection getDBConnection() {
        Connection dbConnection = null;
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        try {
            return DriverManager.getConnection("jdbc:oracle:thin:@10.132.59.79:1521:port4p", "dportal", "Dp0rTa$");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return dbConnection;
    }
}
