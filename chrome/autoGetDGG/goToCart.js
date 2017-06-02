(function(){
	var cartElem = "#form-cart input[type=submit]";//shipping
	var count = 0 ;
	function goToCart(){
		console.log("begin goto cart");
		try{
			document.querySelector(cartElem).click();
		}catch(e){
			if(count < 10){
				count++;
				setTimeout(goToCart,100);
			}
		}
		
	}
	setTimeout(goToCart,500);
	console.log("bagin");
})()
//_msq.push(['trackEvent', 'aced7247b1c2768d-0e0460e3953e2713', '//static.mi.com/cart/', 'pcpid']);