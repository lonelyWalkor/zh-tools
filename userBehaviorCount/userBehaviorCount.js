/**
 * 用户行为统计 js
 * zhanghong
 * 2017/4/25
 */
/**
 * 此js 不依赖 任何 插件
 */
(function(Utils) {
	var userAgent = Utils.getUserAgent();
	if (Utils.isNull(userAgent)) {
		userAgent = "unknow";
	}
	var config = {
		timeSpan: 1000, //发送请求的 定时器的间隔时间
		url: '/node/behavior',
		configUrl: '/node/getConfig',
		userAgent: userAgent,
		terminal: "PC",
		urlRoot:"http://operate.xiaodingwangplatform.com"
	};
	/**
	 * 方法区
	 */
	/*******************/
	var Methods = {
		tur: true,
		hasInit:false
	};
	Methods.init = function(e) {
		if(Methods.hasInit){
			return;
		}
        Methods.hasInit = true;

		var url = Utils.parseURL(window.location.href);
		config.urlRoot = url.protocol +"://node." + url.host.split(".").slice(1).join(".");
		Utils.getDataByAjax(config.urlRoot + config.configUrl, null, function(data) {
			if (data.status) {
				config.timeSpan = data.timeSpan || 2000;
				config.urlRoot = data.urlRoot;

				document.addEventListener('click', Methods.clickHandel);
				Methods.beginTimeout(Methods.timeoutCall, config.timeSpan);
				window.addEventListener('scroll', Methods.scrollHandel);
				window.addEventListener('unload', Methods.unloadHander);

				Methods.reloadData();

			}
		});
		var guid = new Utils.GUID();
		config.guid = guid.newGUID();
		config.holdtime = new Date().getTime();
		config.initTime = config.holdtime;
	};
	//滚动 事件的 回调函数
	Methods.scrollHandel = function() {
		if (Methods.tur) {
			setTimeout(function() {
				var scrollTop = Methods.getScrollTop();
				//console.log(scrollTop);
                var time = new Date().getTime() - config.holdtime;
                config.holdtime = new Date().getTime();
				var temp = {
					stop: scrollTop,
					t: new Date().getTime(),
					type: "scroll",
					st:time,
					guid:config.guid
				};
				Utils.setData('userBehaviorCount', temp, 1);

				/*Utils.setData('userBehaviorCount', {
					t: time,
					type: "hold",
					guid: config.guid
				}, 1);*/
				Methods.tur = true;
			}, 200);
			Methods.tur = false;
		}
	};
	//点击事件的会调函数
	Methods.clickHandel = function(e) {
		//console.log(e);
		var target = e.target;
		var nodeName = target.nodeName;
		var temp = {
			id: target.id,
			class: target.className,
			x: e.pageX,
			y: e.pageY,
			node: nodeName,
			type: e.type,
			t: new Date().getTime(),
			guid: config.guid
		};
		var area = target.clientHeight * target.clientWidth;
		if (area < 50000) {
			temp.text = target.innerText;
		}
		if (nodeName == "A") {
			temp.href = target.href;
		} else if (nodeName == "IMG") {
			temp.src = target.src;
		}
        var time = new Date().getTime() - config.holdtime;
        config.holdtime = new Date().getTime();
		temp.st = time;
		Utils.setData('userBehaviorCount', temp, 1);
	};

	//页面关闭时 将数据本地存储
	Methods.unloadHander = function() {
		//console.log('unload');
		//数据持久化
		var list = Utils.getData('userBehaviorCount');

		if (Utils.isNull(list)) {
			return;
		}
		Utils.setData('userBehaviorCount', []);
		Utils.insert(list);
	};

	//当页面加载完成 恢复数据
	Methods.reloadData = function() {
		var list = Utils.select(list);
		if (Utils.isNull(list)) {
			return;
		}
		Utils.insert([]);
		Utils.setData('userBehaviorCount', list, 1);
	};

	//发送请求的 定时器
	Methods.beginTimeout = function(call, time) {
		setTimeout(call, config.timeSpan);
	};
	//定时器 的调用的 函数
	Methods.timeoutCall = function() {
		var list = Utils.getData('userBehaviorCount');

		if (Utils.isNull(list)) {
			Methods.beginTimeout(Methods.timeoutCall);
			return;
		}


		Utils.setData('userBehaviorCount', []);
		var now = new Date().getTime();
		var data = {
			key: JSON.stringify(list),
			time: now,
			guid: config.guid,
			holdtime: now - config.initTime,
			userAgent: config.userAgent,
			terminal: config.terminal
		}
		Utils.getDataByAjax(config.urlRoot + config.url, data, function(data) {
			//console.log(data);
			Methods.beginTimeout(Methods.timeoutCall);
		}, function() {
			Methods.beginTimeout(Methods.timeoutCall);
		})
	};
	Methods.getScrollTop = function() {
		var scrollTop = 0;
		if (document.documentElement && document.documentElement.scrollTop) {
			scrollTop = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollTop = document.body.scrollTop;
		}
		return scrollTop;
	}



	/***绑定事件****/
	window.addEventListener('load', Methods.init);



})((function() {
	/**
	 * 工具区
	 */
	/********************************************/

	var Utils = {};
	(function(Utils) {
		var utilsData = {};
		//获取 数据
		Utils.getData = function(key) {
			if (Utils.isNull(key)) {
				return utilsData;
			} else {
				return utilsData[key];
			}
		};
		//设置数据
		Utils.setData = function(k, v, concat) {
			if (concat === 1) {
				if (Utils.isNull(utilsData[k])) {
					utilsData[k] = [];
				}
				utilsData[k].push(v);
				return utilsData[k];
			}
			utilsData[k] = v;
			return utilsData[k];
		};
		//判断数据是否存在
		Utils.isHaveKey = function(k) {
			if (Utils.isNull(utilsData[k])) {
				return false;
			} else {
				return true;
			}
		};
	})(Utils)
	/**
	 * [isNull description] 判断 传入的 参数 是否是 空或 空字符串 或者为空数组,空对象
	 * @return {Boolean} [description]
	 */
	Utils.isNull = function() {
		var args = arguments;
		var is = false;
		for (var i = 0; i < args.length; i++) {
			var temp = args[i];
			if (temp == null || temp == "") {
				is = true;
				break;
			}
			if (typeof temp === "object") {
				if (Array.isArray(temp)) {
					temp.length == 0 && (is = true);
					break;
				} else {
					Utils.isEmptyObject(temp) && (is = true);
					break;
				}
			}

		}
		return is;
	};
	//判断一个对象 是否是空对象
	Utils.isEmptyObject = function(obj) {
		for (var key in obj) {
			return false;
		}
		return true;
	};
	/**
	 * [getDataByAjax description]
	 * @param  {[type]} url     [description] 发起请求的url
	 * @param  {[type]} data    [description] 需要提交的数据对象
	 * @param  {[type]} success [description] 请求成功以后的回调函数
	 * @param  {[type]} error   [description] 请求失败的回调
	 * @param  {[type]} tab     [description] 对防止重复提交的 key 通过这个 key 限制重复提交
	 * @return {[type]}         [description] null
	 */
	Utils.getDataByAjax = function(url, data, success, error, tab) {
		if (!Utils.isNull(tab)) {
			if (Utils.getData(tab)) {
				return;
			} else {
				Utils.setData(tab, true);
			}
		}
		//加载成功的 回调函数
		var suc = function(data) {
				!Utils.isNull(tab) && Utils.setData(tab, false);
				if (Utils.isNull(success)) {
					if (data.status) {

					} else {
						//layer.msg(data.info);
					}
				} else {
					success(data);
				}

			}
			//加载失败的 回调函数
		var err = function(e) {
			!Utils.isNull(tab) && Utils.setData(tab, false);
			if (Utils.isNull(error)) {
				//layer.msg("数据加载失败(" + e.status + ")");
			} else {
				error();
			}

		}
		if (Utils.isNull(data)) {

			Utils.ajax({
				type: "GET",
				jsonp: 'nodeJsonpCallback'+Math.floor(Math.random() * 10000 + 500),
				url: url,
				success: suc,
				error: err
			});
		} else {
			Utils.ajax({
				type: "GET",
				jsonp: 'nodeJsonpCallback'+Math.floor(Math.random() * 10000 + 500),
				url: url,
				data: data,
				success: suc,
				error: err
			});
		}

	};
	Utils.insert = function(data) {
		if (window.localStorage) {
			localStorage["userBehaviorCount"] = JSON.stringify(data);
		} else {
			Utils.setData("userBehaviorCount", data, 1);
		}
	};
	Utils.select = function() {
		if (window.localStorage) {
			var string = localStorage["userBehaviorCount"];
			if (Utils.isNull(string)) {
				return [];
			}
			return JSON.parse(string);
		} else {
			return Utils.getData("userBehaviorCount");
		}
	};

	Utils.parseURL = function(url) {
		var a = document.createElement('a');
		a.href = url;
		var obj = {
			source: url,
			protocol: a.protocol.replace(':', ''),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function() {
				var ret = {},
					seg = a.search.replace(/^\?/, '').split('&'),
					len = seg.length,
					i = 0,
					s;
				for (; i < len; i++) {
					if (!seg[i]) {
						continue;
					}
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
			hash: a.hash.replace('#', ''),
			path: a.pathname.replace(/^([^\/])/, '/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
			segments: a.pathname.replace(/^\//, '').split('/')
		};
		obj.rootpath = obj.protocol + "://" + obj.host + (obj.port == "" ? "" : (":" + obj.port)) + "/" + obj.segments[0] + "/";
		return obj;
	};

	var GUID = function() {
		this.date = new Date(); /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
		if (typeof this.newGUID != 'function') { /* 生成GUID码 */
			GUID.prototype.newGUID = function() {
					this.date = new Date();
					var guidStr = '';
					sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
					sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
					for (var i = 0; i < 9; i++) {
						guidStr += Math.floor(Math.random() * 16).toString(16);
					}
					guidStr += sexadecimalDate;
					guidStr += sexadecimalTime;
					while (guidStr.length < 32) {
						guidStr += Math.floor(Math.random() * 16).toString(16);
					}
					return this.formatGUID(guidStr);
				}
				/* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
			GUID.prototype.getGUIDDate = function() {
					return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
				}
				/* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
			GUID.prototype.getGUIDTime = function() {
					return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
				}
				/* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
			GUID.prototype.addZero = function(num) {
					if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
						return '0' + Math.floor(num);
					} else {
						return num.toString();
					}
				}
				/*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
			GUID.prototype.hexadecimal = function(num, x, y) {
					if (y != undefined) {
						return parseInt(num.toString(), y).toString(x);
					} else {
						return parseInt(num.toString()).toString(x);
					}
				}
				/* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
			GUID.prototype.formatGUID = function(guidStr) {
				var str1 = guidStr.slice(0, 8) + '-',
					str2 = guidStr.slice(8, 12) + '-',
					str3 = guidStr.slice(12, 16) + '-',
					str4 = guidStr.slice(16, 20) + '-',
					str5 = guidStr.slice(20);
				return str1 + str2 + str3 + str4 + str5;
			}
		}
	};
	Utils.GUID = GUID;
	Utils.getUserAgent = function() {
		var explorer = window.navigator.userAgent.toLowerCase();
		//ie 
		if (explorer.indexOf("msie") >= 0) {
			var ver = explorer.match(/msie ([\d.]+)/)[1];
			return "IE " + ver;
		}
		//firefox 
		else if (explorer.indexOf("firefox") >= 0) {
			var ver = explorer.match(/firefox\/([\d.]+)/)[1];
			return "Firefox " + ver;
		}
		//Chrome
		else if (explorer.indexOf("chrome") >= 0) {
			var ver = explorer.match(/chrome\/([\d.]+)/)[1];
			return "Chrome " + ver;
		}
		//Opera
		else if (explorer.indexOf("opera") >= 0) {
			var ver = explorer.match(/opera.([\d.]+)/)[1];
			return "Opera " + ver;
		}
		//Safari
		else if (explorer.indexOf("Safari") >= 0) {
			var ver = explorer.match(/version\/([\d.]+)/)[1];
			return "Safari " + ver;
		}
	}

	Utils.ajax = function(params) {  
		params = params || {};  
		params.data = params.data || {};  
		var json = params.jsonp ? jsonp(params) : json(params);    // jsonp请求  
		 
		function jsonp(params) {    //创建script标签并加入到页面中  
			  
			var callbackName = params.jsonp;   
			var head = document.getElementsByTagName('head')[0];    // 设置传递给后台的回调参数名  
			  
			params.data['callback'] = callbackName;   
			var data = formatParams(params.data);   
			var script = document.createElement('script');   

			  
			window[callbackName] = function(json) {   
				head.removeChild(script);   
				clearTimeout(script.timer);   
				window[callbackName] = null;   
				params.success && params.success(json);   
			}; 　　 //发送请求 
			//console.log(params.url + '?' + data);
			script.src = params.url + '?' + data;    //为了得知此次请求是否成功，设置超时处理  
            head.appendChild(script);    //创建jsonp回调函数 

			if (params.time) {    
				script.timer = setTimeout(function() {     
					window[callbackName] = null;     
					head.removeChild(script);     
					params.error && params.error({      
						message: '超时'     
					});    
				}, time);   
			}  
		}   //格式化参数 
		 
		function formatParams(data) {   
			var arr = [];   
			for (var name in data) {    
				arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));   
			}    // 添加一个随机数，防止缓存  
			  
			arr.push('v=' + random());  
			return arr.join('&');  
		}   // 获取随机数 
		 
		function random() {   
			return Math.floor(Math.random() * 10000 + 500);  
		}
	}

	return Utils;
})());