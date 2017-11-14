/**
 * zhanghong 2017-03-25
 *
 * 使用方法
 * Iframeupload("#文件上传按钮","文件上传的url",function(data){
 * 	//成功或失败的回调函数
 * 	通过 data.status  判断成功或者失败
 * 	{"imgPath":[{"path":"group1/M00/00/21/wKj-PVjWBheARokmAADmkUObqSA784.jpg"}],
 * 		"info":"文件上传成功!",
 * 		"status":true,
 * 		"url":"http://192.168.254.61:8888/"
 * 	}
 * });
 * 
 * 
 * 
 */


(function() {
	var contentStr = '<form name="multiform"style="position: absolute;left:0px;top:0px;cursor: pointer;" id="multiform" action="" method="POST" enctype="multipart/form-data">';
	contentStr += '<input type="file" id="Iframeupload_File_Input" name="file" style="position: absolute !important;clip: rect(1px,1px,1px,1px);" />';
	contentStr += '<label for="Iframeupload_File_Input" style="opacity: 0; width: 100%; height: 100%; display: block; cursor: pointer; background: rgb(255, 255, 255);"></label>';
	contentStr += '</form>';



	var Iframeupload = function(selector, url, callback) {
		if(!Boolean(selector)){
			throw new Error('这里需要文件上传按钮的selector');
		}
		if(!Boolean(url)){
			throw new Error('这里需要一个url');
		}

		var $elem = $(selector);
		var html = $(contentStr);
		$elem.css("position", "relative")
		html.css("width", $elem.width());
		html.css("height", $elem.height());
		html.attr("action", url);
		$elem.append(html);
		//console.log($elem.html());
		return init(html.find("input"),callback);
	}

	function init(selector,callback) {
		var iframeupload = {};

		//iframeupload.url = url;
		iframeupload.selector = selector;

		iframeupload.callback = callback;
		
		iframeupload.$File = $(selector);
		
		iframeupload.isCreat = true;

		//将文件域的那么属性设置为file 和后端java 的接受相匹配
		iframeupload.$File.attr("name", "file");
		iframeupload.$form = iframeupload.$File.closest("form");
		iframeupload.$File.on('change', function(e) {
			$("#multiform").submit();
		})

		iframeupload.$form.on('submit', function(e) { //提交数据到Iframe中并返回数据
			//此处的this指form 对象
			postToIframe($(this), function(data) {
				/*<pre style="word-wrap: break-word; white-space: pre-wrap;">

		    	{"status":true,"imgPath":[],"data":null,"url":"http://192.168.254.61:8888/","info":"文件上传成功!"}

		    	</pre>*/
				try {
					var reStr = $(data).html();
					var rst = JSON.parse(reStr);
					//当文件上传成功以后重置表单，否则已经选择过的温江将会无法再次上传。
					iframeupload.$form[0].reset();
				} catch (e) {
					callback && callback({status:false,info:"文件上传失败"});
					return;
				}
				callback && callback(rst);
				//清理刚刚创建的iframe
				//console.log($("iframe[name*=unique]"));
				$("iframe[name*=unique]").remove();
				//console.log($("iframe[name*=unique]"));
				
			});
		});
		return iframeupload;
	}

	//获取返回的document
	function getDoc(frame) {
		var doc = null;
		// IE8 cascading access check
		try {
			if (frame.contentWindow) {
				doc = frame.contentWindow.document;
			}
		} catch (err) {

		}

		if (doc) { // successful getting content
			return doc;
		}

		try { // simply checking may throw in ie8 under ssl or mismatched protocol
			doc = frame.contentDocument ? frame.contentDocument : frame.document;
		} catch (err) {
			// last attempt
			doc = frame.document;
		}

		return doc;
	}

	function postToIframe(formObj, callback) {
		// $("#multi-msg").html("<img src='loading.gif'/>");
		var formURL = formObj.attr("action");
		//生成随机id
		var iframeId = 'unique' + (new Date().getTime());
		//生成空白的iframe
		var iframe = $('<iframe src="javascript:false;" name="' + iframeId + '" />');
		//掩藏iframe
		iframe.hide();
		//给iframe设置target
		formObj.attr('target', iframeId);
		//添加iframe 到 body
		iframe.appendTo('body');



		iframe.load(function(e) {
			var doc = getDoc(iframe[0]);
			var docRoot = doc.body ? doc.body : doc.documentElement;
			var data = docRoot.innerHTML;
			//回调函数 用于接收 iframe 中的返回值
			callback.call(this, data);
		});


	}
	window.Iframeupload = Iframeupload;
})()