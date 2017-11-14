var http = require('http');

var options = process.argv;

var status = options[2];

var serverPath = "http://192.168.254.60:5000/v2/";

var url = serverPath + "_catalog";

var tags_list = [];
var tags_name_list;

http.get(url,function(res){
	var html = "";
	res.on('data',function(data){
		html += data;
	})

	res.on('end',function(){
		//console.log(html);

		var registry = JSON.parse(html);

		tags_name_list = registry.repositories;
		//console.log(registry);
		//console.log(tags_name_list);

		for (var i = 0; i < tags_name_list.length; i++) {
			var tag_name = tags_name_list[i];
			
			if(status){

				console.log(tag_name);

			}else{
				
				if(tags_name_list.length == i+1){
					getTagVersionList(tag_name,true);
				}else{
					getTagVersionList(tag_name,false);
				}
			}

		}

	})

	res.on('error',function(){
		console.log('error');
	})

})


function getTagVersionList(tag_name,state){
	http.get(serverPath + tag_name + "/tags/list",function(res){
		var html = "";
		res.on('data',function(data){
			html += data;
		})

		res.on('end',function(){
			//console.log(html);
			var temp;
			try{
				var temp = JSON.parse(html);
			}catch(e){
				temp = {};
			}
		

			tags_list.push(temp);

			if(state){
				console.log(tags_list);
			}

		})

		res.on('error',function(){
			console.log('error');
		})

	})
}
