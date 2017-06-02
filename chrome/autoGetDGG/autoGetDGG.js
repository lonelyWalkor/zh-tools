
(function(){
	//var isDebug=true;
	//var endTime = '20170110 10:00:00';
	//var endTime = '2017-03-07 13:19:00';
	var endTime = ' 12:40:00';//每天这个时间，前面的空格不能去掉
	var endDate = null;
	var intervalTime = 0;
	var infoSelector = ".addcart a";
	var beginSelector = "#mini-cart-dialog a";
	//var getServiceTime = "http://tptm.hd.mi.com/gettimestamp?_=1484020517760";
	function BeginTarget(){
		/*if(isDebug){
			//$("ul .J_stepItem.active").trigger("click");
			
		}else{
			//$("#J_chooseResult a").trigger("click");
			document.querySelector("#J_chooseResult a").click();
		}*/
		document.querySelectorAll(infoSelector)[0].click();
		setTimeout(function(){
			document.querySelector(beginSelector).click();
		},120);
	}
	function transdate(){
		var date=new Date(); 
		var time = endTime;
		var ts = time.split(" ");
		var one = ts[0];
		if(one.length != 0){
			var ymd = one.split("-");
			date.setFullYear(ymd[0]); 
			date.setMonth(parseInt(ymd[1])-1);
			date.setDate(ymd[2]); 
		}	
		var hms = ts[1].split(":");
		date.setHours(hms[0]);
		date.setMinutes(hms[1]); 
		date.setSeconds(hms[2]);		
		return Date.parse(date);
	}
	function beginInterVal(){
		if(endDate == null){
			endDate = transdate();// 获取指定时间的时间戳
		}
		var cha = endDate - Date.parse(Date());
		console.log(cha);
		if(cha > 2000){
			beginSetTimeout(1000);
		}else if(cha>0 && cha<=2000){
			beginSetTimeout(cha+1000);
		}else if(cha<=0 && cha>-10000){
			//location.reload();
			console.log('aaa');
			//document.querySelector(".list_index").click();
			window.location.href = window.location.href;
		}
		if(cha<-1000 && cha>-2000){
			document.querySelectorAll(infoSelector)[0].click();
			setTimeout(function(){
				document.querySelector(beginSelector).click();
			},100);
		}

		/*else if(cha <=0 && cha>20000){
			beginSetTimeout(500);
			BeginTarget();
		}*/
	}
	function beginSetTimeout(time){
		intervalTime = time;
		setTimeout(beginInterVal,intervalTime);
	}
	console.log("begin");
	setTimeout(beginInterVal,intervalTime);
	/*
	setTimeout(ajax(getServiceTime,function(data){
		console.log(data)
	}),3000);
	
	function ajax(url,successFunc){
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open("POST",url,true);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					successFunc(xhr.responseText);
				}else{
					console.log(xhr.responseText);
				}
			}
		};
	 xhr.send();
	}*/
})()