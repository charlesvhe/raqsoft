package com.github.charlesvhe.raqsoft.service;

import com.raqsoft.common.Area;
import com.raqsoft.report.model.ReportDefine;
import com.raqsoft.report.usermodel.Context;
import com.raqsoft.report.usermodel.Engine;
import com.raqsoft.report.usermodel.INormalCell;
import com.raqsoft.report.usermodel.IReport;
import com.raqsoft.report.util.ReportUtils;
import com.raqsoft.report.view.html.HtmlReport;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportService {
    @RequestMapping("/html")
    public String html(String rpx) throws Exception {
        String reportFile = "d:/test.rpx";
        ReportDefine rd = (ReportDefine) ReportUtils.read(reportFile);

        Engine engine = new Engine(rd, Context.getInitCtx());
        IReport iReport = engine.calc();
        HtmlReport htmlReport = new HtmlReport(iReport, "reportDS.htm");

        return htmlReport.generateHtml();
    }

    @RequestMapping("/xml")
    public String xml(String rpx) throws Exception {
        String reportFile = "d:/test.rpx";
        ReportDefine rd = (ReportDefine) ReportUtils.read(reportFile);

        Engine engine = new Engine(rd, Context.getInitCtx());
        IReport iReport = engine.calc();

        return generateXml("test", iReport);
    }

    private static String generateXml(String reportName, IReport report) {
        StringBuilder sb = new StringBuilder();
        sb.append("<" + reportName + ">");
        int rows = report.getRowCount();
        int cols = report.getColCount();
        int startRow = 1;
        int endRow = rows;

        for (int row = startRow; row <= endRow; ++row) {
            StringBuffer sRow = new StringBuffer(1024);

            for (int col = 1; col <= cols; ++col) {
                INormalCell nc = report.getCell(row, col);
                if (nc != null) {
                    if (!nc.isMerged()) {
                        sRow.append(getCellTag(col, nc));
                    } else {
                        Area area = nc.getMergedArea();
                        int r = area.getBeginRow();
                        int c = area.getBeginCol();
                        if (r == row && c == col) {
                            sRow.append(getCellTag(col, nc));
                        }
                    }
                }
            }

            if (sRow.length() > 0) {
                sb.append("\t<row pos=\"" + row + "\">\n");
                sb.append(sRow);
                sb.append("\t</row>\n");
            }
        }

        sb.append("</" + reportName + ">");
        return sb.toString();
    }

    private static String getCellTag(int col, INormalCell nc) {
        byte dataType = nc.getCellType();
        if (dataType != -64) {
            return "";
        } else {
            StringBuffer buf = new StringBuffer(128);
            String tmp = getCellRawText(nc) + getCellText(nc);
            if (tmp.trim().length() == 0) {
                return "";
            } else {
                buf.append("\t\t<col pos=\"" + col + "\"");
                tmp = getCellRawText(nc);
                if (tmp.trim().length() >= 0) {
                    buf.append(" value=\"" + tmp + "\"");
                }

                tmp = getCellText(nc);
                if (tmp.trim().length() >= 0) {
                    buf.append(" disp=\"" + tmp + "\"");
                }

                buf.append("/>\n");
                return buf.toString();
            }
        }
    }

    private static String getCellText(INormalCell nc) {
        String text = "";
        Object obj = nc.getDispValue();
        if (obj != null) {
            text = (String) obj;
        }

        return text.trim().length() == 0 ? getCellRawText(nc) : text;
    }

    private static String getCellRawText(INormalCell nc) {
        Object obj = nc.getValue();
        if (obj == null) {
            return "";
        } else {
            String text = obj.toString();
            if (obj instanceof byte[]) {
                try {
                    text = new String((byte[]) ((byte[]) obj), "GBK");
                } catch (Exception var5) {
                    text = new String((byte[]) ((byte[]) obj));
                }
            }

            if (text.trim().length() == 0) {
                text = "";
            }

            return text;
        }
    }
}
