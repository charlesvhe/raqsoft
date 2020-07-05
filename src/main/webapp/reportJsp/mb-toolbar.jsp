<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<div class="btnBar">
  <ul class="left">
    <li class="floatRight borderLeft">
      <ul class="fileOper">
         <Li><a class="ICOhover" href="#" onClick="try{toPage('report1',1);}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.firstPage")%>' class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{prevPage('report1');}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.prevPage")%>' class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="try{nextPage('report1');}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.nextPage")%>' class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{toPage('report1',getPageCount('report1'));}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.lastPage")%>' class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; "><%=ServerMsg.getMessage(request,"jsp.currPage1")%><span id="report1_currPage"></span><%=ServerMsg.getMessage(request,"jsp.currPage2")%>/<%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="t_page_span"></span><%=ServerMsg.getMessage(request,"jsp.totalPage2")%>&nbsp;&nbsp;</div></li>
  </ul>

</div>
