<%@ page contentType="text/html;charset=UTF-8" %>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
%>
<div class="btnBar">
  <ul class="left">
    <!--<li class="borderRight submitLi" onClick="_submitTable( report1 );return false;" href="#"> <a title="提交" href="#" class="submit"></a></li>-->
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="group_print('group1');return false;"><span title="打印" class="print2"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_exportExcel('group1');return false;"><span title="导出excel" class="excel"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_exportPdf('group1');return false;"><span title="导出pdf" class="pdf"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="group_exportWord('group1');return false;"><span title="导出word" class="word"></span></a></li>
      </ul>
    </li>
    <li class="floatRight borderLeft">
      <ul class="fileOper">
        <Li><a class="ICOhover" href="#" onClick="group_firstPage('group1');return false;"><span title="首页" class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_prevPage('group1');return false;"><span title="上一页" class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="group_nextPage('group1');return false;"><span title="下一页" class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_lastPage('group1');return false;"><span title="尾页" class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; ">第<span id="group1_currPage"></span>页/共<span id="group1_totalPage"></span>页&nbsp;&nbsp;</div></li>
  </ul>
</div>