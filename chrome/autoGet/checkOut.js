(function(){
	var goCheckout = "#J_goCheckout";
	var count = 0 ;
	function submitOrder(){
		console.log("begin goto goCheckout");
		try{
			document.querySelector(goCheckout).click();
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