<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <title>润乾产品试用微信登录入口</title>
</head>
<body>
<%
	String id = request.getParameter( "id" );
	String appmap = request.getContextPath();
%>
<script type="text/javascript" src="raqsoft/easyui/jquery.min.js"></script>
<script>
    $.ajax('<%=appmap%>/wxlogin?action=jm',{
        data:{ id: "<%=id%>"
        },
        dataType:'json',//服务器返回json格式数据
        type:'POST',//HTTP请求类型
        timeout:30000,//超时时间设置为30秒；
        success:function(data){//服务器返回响应，根据响应结果，分析是否登录成功；
            if( data.error ){
                alert( data.error.substring( 6 ) );
                return;
            }
            //data["action"] = "login";
             $.ajax({
            	data:{action:82,unionId:data.unionid},
            	type:'post',
            	url:'<%=appmap%>/reportCenterServlet',
            	success:function(){
            		
            	}
             });
        },
        error:function(xhr,type,errorThrown){//异常处理
        	alertError( xhr, type, errorThrown );
        }
    });
    
	function alertError( xhr, type, errorThrown ) {
		if( type == "abort" ) alert( "连不上服务器" );
		else if( type == "timeout" ) alert( "访问服务器超时" );
		else alert( xhr.status + "  " + type + ":" + errorThrown );
	}
    
</script>
</html>