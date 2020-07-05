/**
 *  Copyright (C) 2006 zhangbo (freeeob@gmail.com)
 *
 *  This product is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation; either version 2.1 of the License, or
 *  (at your option) any later version.
 * 
 *  This product is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 * 
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA.
 *
 *  author:zhangbo
 *  Email:jsjava@gmail.com
 */
 
 
/**  The NumberFormat class references to java.text.NumberFormat of J2SE1.4 */
 
/**
 * constructor
 */
 function NumberFormat(){
     this.jsjava_class="jsjava.text.NumberFormat";
 }
 
 NumberFormat.prototype=new Format();
 NumberFormat.prototype.constructor=NumberFormat;
 
 /**
 * format the number
 * @param number
 */
 NumberFormat.prototype.format=function(number){
	if(isNaN(number)){
		return "0";
	}
	var pattern=this.pattern;
	if(pattern==""){
		return number;
	}
	//alert(number);
	var strNum=new String(number);
	var numNum=parseFloat(number);
	var isNegative=false;
	if(numNum<0){
		isNegative=true;
	}
	if(isNegative){
		strNum=strNum.substring(1,strNum.length);
		numNum=-numNum;
	}
	//alert(isNegative);
	var fPos=pattern.indexOf("$");
	if(fPos==-1) fPos=pattern.indexOf("￥");
	var prefix="";
	if(fPos!=-1){
		prefix=pattern.substring(fPos,fPos+1);
		pattern=pattern.substring(1,pattern.length);
    }
     var ePos=pattern.indexOf("E");
     var pPos=pattern.indexOf("%");
     if(ePos!=-1&&pPos!=-1){
     	throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed exponential pattern : E and % can not be existed at the same time");
     }
     if(ePos!=-1){
     	if(ePos==pattern.length-1){
     		throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed exponential pattern "+this.pattern);
     	}
     	beStr=pattern.substring(0,ePos);
     	aeStr=pattern.substring(ePos+1);
     	var dPos=beStr.indexOf(".");
     	var dPosOfNum=strNum.indexOf(".");
     	if(dPos!=-1){     		
     		if(dPosOfNum==-1){
     			dPosOfNum=strNum.length-1;
     		}
     		var strNumBuffer=new StringBuffer(strNum);
     		strNumBuffer.deleteCharAt(dPosOfNum);
     		strNumBuffer.insert(dPos,".");
     		var snbStr=strNumBuffer.getValue();
     		var adStrLength=beStr.length-dPos;
     		var snbFixed=new Number(parseFloat(snbStr)).toFixed(adStrLength-1);     		
     		var aeLabel=dPosOfNum-dPos;
	     	if(isNegative){
	     		return "-"+snbFixed+"E"+(aeLabel);
	     	}else{
	     		return snbFixed+"E"+(aeLabel);
	     	}
     	}else{
     		if(dPosOfNum==-1){
     			dPosOfNum=strNum.length-1;
     		}
     		var strNumBuffer=new StringBuffer(strNum);
     		strNumBuffer.deleteCharAt(dPosOfNum);
     		strNumBuffer.insert(beStr.length,".");
     		var snbStr=strNumBuffer.getValue();
     		var adStrLength=beStr.length-beStr.length;
     		var snbFixed=-1;
     		if(adStrLength==0){
     			snbFixed=new Number(parseFloat(snbStr)).toFixed();     		
     		}else{
     			snbFixed=new Number(parseFloat(snbStr)).toFixed(adStrLength-1);
     		}
     		var aeLabel=dPosOfNum-beStr.length;
	     	if(isNegative){
	     		return "-"+snbFixed+"E"+(aeLabel);
	     	}else{
	     		return snbFixed+"E"+(aeLabel);
	     	}
     	}    	
     }
     if(pPos!=-1){
     	if(pPos!=pattern.length-1){
     		throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed exponential pattern "+this.pattern);
     	}
   	 	pattern=pattern.substring(0,pattern.length-1);
   	 	numNum=parseFloat(number)*100;
     	strNum=new String(numNum);
     	if(isNegative){
	     	strNum=strNum.substring(1,strNum.length);
	     	numNum=-numNum;
	    }
   	 }    
     var dPos=pattern.indexOf(".");
   	 var dPosOfNum=strNum.indexOf(".");   
   	 var cPos=pattern.indexOf(",");
   	 if(cPos!=-1){
   		 if(dPos!=-1){
   			 if(dPos-cPos!=4) throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed pattern "+this.pattern);
   		 }else{
   			 if(pattern.length-cPos!=4)  throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed pattern "+this.pattern);
   		 }
   		 if(ePos!=-1) throw new IllegalArgumentException(IllegalArgumentException.ERROR,"Malformed exponential pattern : E and , can not be existed at the same time");
   	 }
   	 var result=""; 
   	 //2019.12.2
   	 var dotFormat = pattern.substr(dPos+1);
   	 var allSharpAfterDot = dotFormat.indexOf('0') == -1;
   	 if(dPos!=-1){     		
   		 var adStrLength=pattern.length-dPos;
   		if(dPosOfNum==-1){
   			if(allSharpAfterDot) adStrLength = 1;//格式为***.# 真实值小数点后无值 此时不显示小数点后位数
   			dPosOfNum=strNum.length-1;
   		}
   		var snbFixed=new Number(parseFloat(strNum)).toFixed(adStrLength-1);   
     	result=snbFixed;

   	 }else{
   	 	if(dPosOfNum==-1){
   			dPosOfNum=strNum.length-1;
   		}
   		var snbFixed=new Number(parseFloat(strNum)).toFixed();   
     	result=snbFixed;
     	
   	 }
   	 if(cPos!=-1){
   		 dPos=result.indexOf(".");
   		 if(dPos==-1) dPos=result.length;
   		 var tmp="";
   		 var i;
   		 for(i=dPos-3;i>0; i-=3){
   			 tmp=","+result.substring(i, i+3)+tmp;
   		 }
   		 tmp=result.substring(0, i+3)+tmp+result.substring(dPos);
   		 if(isNegative) result="-"+prefix+tmp;
   		 else result=prefix+tmp;
   	 }else{
   		if(isNegative) result="-"+prefix+result;
  		 else result=prefix+result;
   	 }
   	 if(pPos!=-1){
   	 	result+="%";
   	 }
   	 return result;
 };