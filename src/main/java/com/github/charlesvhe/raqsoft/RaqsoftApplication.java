package com.github.charlesvhe.raqsoft;

import com.raqsoft.center.CenterInitServlet;
import com.raqsoft.center.console.LoginFilter;
import com.raqsoft.center.console.ReportCenterServlet;
import com.raqsoft.center.console.file.UploadFilesServlet;
import com.raqsoft.center.console.mobile.MobileLoginFilter;
import com.raqsoft.center.listener.UserSessionListener;
import com.raqsoft.guide.web.DataSphereServlet;
import com.raqsoft.guide.web.GuideSessionListener;
import com.raqsoft.guide.web.dl.DLServlet;
import com.raqsoft.input.view.InputServlet;
import com.raqsoft.report.usermodel.PrintSetupServlet;
import com.raqsoft.report.view.PagedPrint;
import com.raqsoft.report.view.ReportServlet;
import com.raqsoft.report.webutil.setContextServlet;
import com.raqsoft.weixin.WeixinLoginServlet;
import org.apache.catalina.Context;
import org.apache.tomcat.util.scan.StandardJarScanner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RaqsoftApplication {
    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        return new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                ((StandardJarScanner) context.getJarScanner()).setScanManifest(false);
            }
        };
    }

    // 按润乾web.xml顺序
    @Bean
    public ServletListenerRegistrationBean userSessionListener() {
        return new ServletListenerRegistrationBean(new UserSessionListener());
    }

    @Bean
    public ServletListenerRegistrationBean guideSessionListener() {
        return new ServletListenerRegistrationBean(new GuideSessionListener());
    }

    @Bean
    public FilterRegistrationBean mobileLoginFilter() {
        FilterRegistrationBean reg = new FilterRegistrationBean(new MobileLoginFilter());
        reg.setName("mobileLoginFilter");
        reg.addUrlPatterns("/raqsoft/center/mobile/jsp/*");
        return reg;
    }

    @Bean
    public FilterRegistrationBean loginFilter() {
        FilterRegistrationBean reg = new FilterRegistrationBean(new LoginFilter());
        reg.setName("loginFilter");
        reg.addUrlPatterns("/raqsoft/center/*", "/reportCenterServlet");
        return reg;
    }

//    @Bean
//    public FilterRegistrationBean characterEncodingFilter(){
//        FilterRegistrationBean reg = new FilterRegistrationBean(new CharacterEncodingFilter());
//        reg.setName("encodingFilter");
//        reg.addInitParameter("encoding", "UTF-8");
//        reg.addUrlPatterns("/*");
//        return reg;
//    }

    @Bean
    public ServletRegistrationBean dlServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new DLServlet());
        reg.setName("DLServlet");
        reg.setLoadOnStartup(1);
        reg.addUrlMappings("/DLServlet", "/DLServletAjax");
        return reg;
    }

    @Bean
    public ServletRegistrationBean dataSphereServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new DataSphereServlet());
        reg.setName("dataSphereServlet");
        reg.setLoadOnStartup(2);
        reg.addUrlMappings("/servlet/dataSphereServlet");
        return reg;
    }

    @Bean
    public ServletRegistrationBean reportCenterServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new ReportCenterServlet());
        reg.setName("reportCenterServlet");
        reg.addUrlMappings("/reportCenterServlet", "/raqsoft/center/mobile/jsp/reportCenterServlet");
        return reg;
    }

    @Bean
    public ServletRegistrationBean uploadFilesServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new UploadFilesServlet());
        reg.setName("centerUpload");
        reg.addUrlMappings("/reportCenterServlet/upload");
        return reg;
    }

    @Bean
    public ServletRegistrationBean reportServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new ReportServlet());
        reg.setName("reportServlet");
        reg.setLoadOnStartup(1);
        reg.addInitParameter("configFile", "/WEB-INF/raqsoftConfig.xml");
        reg.addInitParameter("headless", "none");
        reg.addUrlMappings("/reportServlet");
        com.raqsoft.report.view.ServletMappings.mappings.put(ReportServlet.class.getName(), "/reportServlet");
        return reg;
    }

    @Bean
    public ServletRegistrationBean setContextServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new setContextServlet());
        reg.setName("setContext");
        reg.setLoadOnStartup(4);
        reg.addUrlMappings("/servlet/setContext");    // 不写url会拦截所有请求
        return reg;
    }

    @Bean
    public ServletRegistrationBean printSetupServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new PrintSetupServlet());
        reg.setName("com.raqsoft.report.usermodel.PrintSetupServlet");
        reg.addInitParameter("saveDisplayScale", "yes");
        reg.addUrlMappings("/servlet/PrintSetupServlet");
        return reg;
    }

    @Bean
    public ServletRegistrationBean pagedPrint() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new PagedPrint());
        reg.setName("com.raqsoft.report.view.PagedPrint");
        reg.addUrlMappings("/servlet/pagedPrintServer");
        return reg;
    }

    @Bean
    public ServletRegistrationBean inputServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new InputServlet());
        reg.setName("InputServlet");
        reg.setLoadOnStartup(1);
        reg.addInitParameter("configFile", "/WEB-INF/raqsoftConfig.xml");
        reg.addUrlMappings("/InputServlet");
        com.raqsoft.input.view.ServletMappings.mappings.put(InputServlet.class.getName(), "/InputServlet");
        return reg;
    }

    @Bean
    public ServletRegistrationBean centerInitServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new CenterInitServlet());
        reg.setName("CenterInitServlet");
        reg.setLoadOnStartup(1);
        reg.addInitParameter("configFile", "/WEB-INF/reportCenter.xml");
        reg.addUrlMappings("/servlet/centerInitServlet");  // 不写url会拦截所有请求
        return reg;
    }

    @Bean
    public ServletRegistrationBean weixinLoginServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new WeixinLoginServlet());
        reg.setName("weixinLogin");
        reg.setLoadOnStartup(10);
        reg.addInitParameter("config", "/WEB-INF/weixin.properties");
        reg.addUrlMappings("/wxlogin", "/raqsoft/center/wxlogin");
        return reg;
    }

    @Bean
    public ServletRegistrationBean ideReportCenterServlet() {
        ServletRegistrationBean reg = new ServletRegistrationBean(new com.raqsoft.center.console.ide.ReportCenterServlet());
        reg.setName("ReportCenterServletIde");
        reg.addInitParameter("configFile", "/WEB-INF/raqsoftConfig.xml");
        reg.addUrlMappings("/servlet/ideReportCenterServlet");  // 不写url会拦截所有请求
        return reg;
    }

    public static void main(String[] args) {
        SpringApplication.run(RaqsoftApplication.class, args);
    }
}
