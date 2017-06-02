(function(){
	var goCheckout = "#shipping th input";
	var goCheckoutA = "#payment #_normal_payment #yunqipay";
	var count = 0 ;
	function submitOrder(){
		console.log("begin goto goCheckout");
		try{
			document.querySelector(goCheckout).click();
			document.querySelector(goCheckoutA).click();//order_ct_dgc
			document.querySelector('#order_ct_dgc').click();
		}catch(e){
			if(count < 10){
				count++;
				setTimeout(submitOrder,100);
			}
		}
		
	}
	setTimeout(submitOrder,500);
	console.log("bagin");
})()