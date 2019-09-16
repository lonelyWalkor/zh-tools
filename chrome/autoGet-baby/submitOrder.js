(function(){
	var checkSdress = "#J_addressList";
	var goSubmit = "#J_checkoutToPay";
	var count = 0 ;
	function submitOrder(){
		console.log("begin goto goSubmit");
		try{
			//
			document.querySelector(checkSdress).firstElementChild.click();
			var timer  = setTimeout(function(){
				document.querySelector(goSubmit).click();
			},50);
		}catch(e){
			clearTimeout(timer);
			if(count < 10){
				count++;
				setTimeout(submitOrder,100);
			}
		}
	}
	setTimeout(submitOrder,500);
	console.log("bagin");
})()