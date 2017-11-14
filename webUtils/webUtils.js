(function() {
	var webUtils = {
		//通过a标签解析URL
		parseURL: function(url) {
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
				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
				hash: a.hash.replace('#', ''),
				path: a.pathname.replace(/^([^\/])/, '/$1'),
				relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
				segments: a.pathname.replace(/^\//, '').split('/')
			};
			obj.rootpath = obj.protocol + "://" + obj.host + (obj.port == "" ? "" : (":" + obj.port)) + "/" + obj.segments[0] + "/";
			return obj;
		},
		simpleParseUrl: function(url) {
			var a = document.createElement('a');
			a.href = url;
			var obj = {
				source: url,
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
				path: a.pathname.replace(/^([^\/])/, '/$1'),
			};
			return obj;
		},
		REGX_HTML_ENCODE: /<|>|[\x00-\x19]|[\x7F-\xFF]|[\u0100-\u2700]/g, ///"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g
		encodeHtml: function(s) {
			return (typeof s != "string") ? s :
				s.replace(this.REGX_HTML_ENCODE,
					function($0) {
						var c = $0.charCodeAt(0),
							r = ["&#"];
						//c = (c == 0x20) ? 0xA0 : c;//如果是空格，就替换成汉字的开始字符
						//r.push(c); r.push(";");
						//console.log(r.join(""));
						//return r.join("");
						if (c == 0x20) { //如果是空格就原样返回
							return " ";
						} else {
							r.push(c);
							r.push(";");
							return r.join("");
						}
					}
				);
		},
		//格式化时间格式
		dateFormat: function(date) {
			date = new Date(date);
			var time = "";
			time += date.getFullYear() + "-";
			time += ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : String((date.getMonth() + 1) + 100).substring(1)) + "-";
			time += (date.getDate() > 10 ? date.getDate() : String(date.getDate() + 100).substring(1)) + " ";
			var hours = date.getHours();
			//time+=hours>12?" 下午 ":" 上午 ";
			time += (hours % 12 > 10 ? hours % 12 : String(hours % 12 + 100).substring(1)) + ":";
			time += (date.getMinutes() > 10 ? date.getMinutes() : String(date.getMinutes() + 100).substring(1)) + ":";
			time += (date.getSeconds() > 10 ? date.getSeconds() : String(date.getSeconds() + 100).substring(1));
			//time+=days[date.getDay()];
			return time;
		},
		timeFormat: function(date) {
			date = new Date(date);
			var time = "";
			time += date.getFullYear() + "-";
			time += ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : String((date.getMonth() + 1) + 100).substring(1)) + "-";
			time += (date.getDate() > 10 ? date.getDate() : String(date.getDate() + 100).substring(1));
			return time;
		}, //创建表单同步提交 数据
		Post: function(URL, PARAMTERS) {
			//创建form表单
			var temp_form = document.createElement("form");
			temp_form.action = URL;
			//如需打开新窗口，form的target属性要设置为'_blank'
			temp_form.target = "_self";
			temp_form.method = "post";
			temp_form.style.display = "none";
			//添加参数
			for (var item in PARAMTERS) {
				var opt = document.createElement("textarea");
				opt.name = PARAMTERS[item].name;
				opt.value = PARAMTERS[item].value;
				temp_form.appendChild(opt);
			}
			document.body.appendChild(temp_form);
			//提交数据
			temp_form.submit();
		}
	}
	window.webUtils = webUtils;
})()