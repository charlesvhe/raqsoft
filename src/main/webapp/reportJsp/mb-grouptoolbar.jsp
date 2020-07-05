<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
%>
<div class="btnBar">
  <ul class="left">
    <li class="floatRight borderLeft">
      <ul class="fileOper">
        <Li><a class="ICOhover" href="#" onClick="group_firstPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.firstPage")%>' class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_prevPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.prevPage")%>' class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="group_nextPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.nextPage")%>' class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_lastPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.lastPage")%>' class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; "><%=ServerMsg.getMessage(request,"jsp.currPage1")%><span id="group1_currPage"></span><%=ServerMsg.getMessage(request,"jsp.currPage2")%>/<%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="group1_totalPage"></span><%=ServerMsg.getMessage(request,"jsp.totalPage2")%>&nbsp;&nbsp;</div></li>
  </ul>
</div>