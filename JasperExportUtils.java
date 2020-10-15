public class JasperExportUtils {

    public void getPdf(javax.servlet.http.HttpServletResponse response,
            net.sf.jasperreports.engine.JasperPrint jasperPrint,
            String fileName) {
        try {
            response.setContentType("application/pdf");
            response.setHeader("Content-disposition", 
                    "attachment; filename=\"" + fileName + "\"");
            net.sf.jasperreports.engine.JasperExportManager.exportReportToPdfStream(jasperPrint,
                    response.getOutputStream());
            response.getOutputStream().flush();
            response.getOutputStream().close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getExcel(javax.servlet.http.HttpServletResponse response,
            net.sf.jasperreports.engine.JasperPrint jasperPrint,
            String fileName) {
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", 
                    "attachment; filename=" + fileName);
            net.sf.jasperreports.engine.export.JRXlsExporter exporter =
                    new net.sf.jasperreports.engine.export.JRXlsExporter();
            exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.OUTPUT_STREAM, response.getOutputStream());
            exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
            exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
            exporter.setParameter(net.sf.jasperreports.engine.export.JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
            exporter.exportReport();
            response.getOutputStream().flush();
            response.getOutputStream().close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getHtml(javax.servlet.http.HttpServletResponse response,
            net.sf.jasperreports.engine.JasperPrint jasperPrint) {
        try {
            response.setContentType("text/html");
            net.sf.jasperreports.engine.export.JRHtmlExporter exporter =
                    new net.sf.jasperreports.engine.export.JRHtmlExporter();
            exporter.setParameter(
                    net.sf.jasperreports.engine.export.JRHtmlExporterParameter.IS_USING_IMAGES_TO_ALIGN,
                    Boolean.FALSE);
            exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
            exporter.setParameter(net.sf.jasperreports.engine.JRExporterParameter.OUTPUT_STREAM, response.getOutputStream());
            exporter.exportReport();
            response.getOutputStream().flush();
            response.getOutputStream().close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void ifEmpty(javax.servlet.http.HttpServletResponse response) {
        try {
            java.io.PrintWriter out = response.getWriter();
            out.print("<html><head><title></title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></head><body><div style=\"font-family: Tahoma ; font-size: 15px ; text-align: center\">");
            out.print("داده ای وجود ندارد");
            out.print("</div></body></html>");
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}