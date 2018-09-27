var host='http://192.168.1.228:8878';
/*
* @Author: hzhh123
* @Date:   2018-09-06 18:19:09
* @Last Modified by:   hzhh123
* @Last Modified time: 2018-09-18 09:48:33
*/
/**
 * [isDefine 判断值是否定义]
 * @param  {[string]}  value
 * @return {Boolean}
 */
function isDefine(value) {
	if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
		return false;
	} else {
		value = value + "";
		value = value.replace(/\s/g, ""); //全局匹配空白字符
		if (value == "") {
			return false;
		}
		return true;
	}
}

/**
 * [verifyMobile 检测手机号是否合法]
 * @param  {[int]} mobile
 * @return {[Boolean]}
 */
function verifyMobile(mobile) {
	api.toast({
		msg: '请输入手机号',
		duration: 2000,
		location: 'bottom'
	});
	var myreg = /^1[3578][0-9]\d{8}$/;
	if (!myreg.test(mobile)) {
		api.toast({
			msg: '请输入有效的手机号码！',
			duration: 2000,
			location: 'bottom'
		});
		return false;
	}
	return true;
}

/**
 * verifyPassword 验证密码和确认密码是否一致
 * @param  {[string]} password   [密码]
 * @param  {[string]} repassword [重复密码]
 * @return {[Boolean]}
 */
function verifyPassword(password, repassword) {
	if (!isDefine(password)) {
		api.toast({
			msg: '请输入密码',
			duration: 2000,
			location: 'bottom'
		});
		return false;
	}

	if (!isDefine(repassword)) {
		api.toast({
			msg: '请输入确认密码',
			duration: 2000,
			location: 'bottom'
		});
		return false;
	}

	if (password != repassword) {
		api.toast({
			msg: '请确认两次密码输入一致',
			duration: 2000,
			location: 'bottom'
		});
		return false;
	}

	return true;
}

/**
 * [VerifyRegion 验证区域]
 * @param {[Boolean]} region [description]
 */
function VerifyRegion(region) {
	if (region.length == 0) {
		showToast('请选择所在地');
		return false;
	}
	return true;
}

/**
 * [jsonToStr //json对象转字符串]
 * @param  {[object]}  j [json对象]
 * @return {[string]}    [json字符串]
 */
function jsonToStr(j) {
	return JSON.stringify(j);
}

/**
 * [strToJson json字符串转json对象]
 * @param  {[string]} s [json字符串]
 * @return {[object}    [json对象]
 */
function strToJson(s) {
	var json = eval('(' + s + ')');
	return json;
}

/**
 * [isJson 判断是否是json对象]
 * @param  {[object]}  obj [对象]
 * @return {Boolean}
 */
function isJson(obj) {
	var isJson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isJson;
}

/**
 * [showToast 显示模态提示]
 * @param  {[string]} msg      [消息内容]
 * @param  {[string]} duration [模态框显示时间]
 * @param  {[string]} location [模态框显示位置,top/middle/bottom]
 */
function showToast(msg, duration, location) {
	var msg = msg ? msg : '错误';
	var duration = duration ? duration : '2000';
	var location = location ? location : 'bootom';
	api.toast({
		msg: msg,
		duration: duration,
		location: location
	});
}



/**
 * [uploadPhoto 上传图片模块封装]
 * @param {[string]} idName [img标签的id名称]
 */
function uploadPhoto(idName) {
	api.actionSheet({
		cancelTitle: '取消',
		buttons: ['拍照', '打开相册']
	}, function(ret, err) {
		if (ret.buttonIndex == 3) {
			return;
		}
		var sourceType = (ret.buttonIndex == 1) ? 'camera' : 'album';
		api.getPicture({
			sourceType: sourceType,
			destinationType: 'url',
			allowEdit: true,
			quality: 70,
			targetWidth: 100,
			targetHeight: 100
		}, function(ret, err) {
			if (ret) {
				var img = ret.data;
				$api.attr($api.byId(idName), 'src', img);
			} else {
				alert(JSON.stringify(err));
			}
		});
	});
}

/**
 * [selectCity 选择城市函数封装]
 * @param  {[type]} idName [要设置城市信息的表单的id]
 */
function selectCity(idName) {
	UIActionSelector = api.require('UIActionSelector');
	UIActionSelector.open({
		datas: 'widget://res/city.json', //必须包含此json文件
		layout: {
			row: 5,
			col: 3,
			height: 30,
			size: 13,
			sizeActive: 13,
			rowSpacing: 5,
			colSpacing: 10,
			maskBg: 'rgba(0,0,0,0.2)',
			bg: '#fff',
			color: '#888',
			colorActive: '#f00',
			colorSelected: '#f00'
		},
		animation: true,
		cancel: {
			text: '取消',
			size: 12,
			w: 90,
			h: 35,
			bg: '#fff',
			bgActive: '#ccc',
			color: '#888',
			colorActive: '#fff'
		},
		ok: {
			text: '确定',
			size: 12,
			w: 90,
			h: 35,
			bg: '#fff',
			bgActive: '#ccc',
			color: '#888',
			colorActive: '#fff'
		},
		title: {
			text: '请选择',
			size: 12,
			h: 44,
			bg: '#eee',
			color: '#888'
		},
		fixedOn: api.frameName
	}, function(ret, err) {
		if (ret) {
			if (ret.level3 == null) {
				var region = ret.level1 + ret.level2;
				$api.val($api.byId(idName), region);
			} else {
				var region = ret.level1 + ret.level2 + ret.level3;
				// alert($api.jsonToStr(ret));
				$api.val($api.byId(idName), region);
				$api.setStorage('pid', ret.selectedInfo[0].province_id);
				$api.setStorage('cid', ret.selectedInfo[1].city_id);
				$api.setStorage('did', ret.selectedInfo[2].district_id);
			}
		} else {
			alert(JSON.stringify(err));
		}
	});
}

/**
 * [openWin 打开新窗口]
 * @param  {[string]} name      [win名称]
 * @param  {[string]} url       [页面地址]
 * @param  {[object]} pageParam [对象参数组]
 */
function openWin(name, url, pageParam) {
	if (isDefine(pageParam)) {
		var pageParam = pageParam;
	} else {
		pageParam = new Object();
	}
	api.openWin({
		name: name,
		url: url,
		pageParam: pageParam
	});
}

/**
 * [openFrame 打开frame]
 * @param  {[string]}	name      	[frame名称]
 * @param  {[string]} 	url      	[页面地址]
 * @param  {[object]} 	pageParam 	[对象参数组]
 * @param  {[string]} 	isBounces 	[是否弹动]
 * @link http://www.kancloud.cn/hongweizhiyuan/apicloud_function/270222
 */
function openFrame(name, url, pageParam,isBounces) {
	if (isDefine(pageParam)) {
		var pageParam = pageParam;
	} else {
		pageParam = new Object();
	}
	var header =document.querySelector('header');
	$api.fixStatusBar(header);
	var headerPos = $api.offset(header);
	api.openFrame({
		name: name,
		url: url,
		pageParam: pageParam,
		bounces: isBounces ? isBounces:true,
		slidBackEnabled: 'false',
		rect: {
			x: 0,
			y: headerPos.h,
			w: 'auto',
			h: 'auto'
		}
	})
}

/**
 * [confirm 确认提示函数封装]
 * @param  {[string]}   title    [标题]
 * @param  {[string]}   msg      [提示信息]
 * @param  {Function} callback   [回调的方法]
 */
function confirm(title, msg, callback) {
	api.confirm({
		title: title,
		msg: msg,
		buttons: ['确定', '取消']
	}, function(ret, err) {
		if (ret.buttonIndex == 1) {
			callback();
		}
	});
}

/* 倒计时功能 start */
// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数;
var total_micro_second;
// 毫秒级倒计时
function countDown(that,callback) {
	// 渲染倒计时时钟
	document.getElementById('clock').innerHTML = date_format(total_micro_second);
	if (total_micro_second <= 0) {
		document.getElementById('clock').innerHTML = '已经截止';
		// timeout则跳出递归
		// auctionResult(auctionId);
		callback();
		return;
	}
	setTimeout(function() {
		// 放在最后--
		total_micro_second -= 10;
		countDown(that,callback);
	}, 10)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
	// 秒数
	var second = Math.floor(micro_second / 1000);
	// 小时位
	var hr = Math.floor(second / 3600);
	// 分钟位
	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
	// 秒位
	var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
	// 毫秒位，保留2位
	var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

	return hr + "时: " + min + "分: " + sec + "秒 " + micro_sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}

/**
  * [RemainingTime 计算时间差]
  * @param {[type]} endDate [结束时间的秒级时间戳]
  */
 function RemainingTime(endDate){
 	var nowDate = new Date();    //当前时间  
    var endDate = endDate * 1000;  //变成毫秒级结束时间
    // 时间差的毫秒数        
    var date3 = new Date(endDate).getTime() - nowDate.getTime();//时间差的毫秒数        
    //计算出相差天数  
    var days=Math.floor(date3/(24*3600*1000))  
    //计算出小时数  
    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
    var hours=Math.floor(leave1/(3600*1000))  
    //计算相差分钟数  
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
    var minutes=Math.floor(leave2/(60*1000))  
    //计算相差秒数  
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
    var seconds=Math.round(leave3/1000)  
    // console.log(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒") 
     total_micro_second = (hours * 60 * 60 + minutes * 60  + seconds) * 1000; //剩余毫秒数
 }

/*倒计时功能 end */

/* 键盘自动弹出功能 start */
//弹出输入框
function popupInput(){
	var UIInput = api.require('UIInput');
	UIInput.open({
	rect: {
		x: 10,
		y: 10,
		w: api.winWidth,
		h: 100
	},
	styles: {
		bgColor: '#fff',
		size: 14,
		color: '#000',
		placeholder: {
			color: '#ccc'
		}
	},
	autoFocus: true,
	maxRows: 4,
	placeholder: '说点什么吧',
	keyboardType: 'default',
	fixedOn: api.frameName
	}, function(ret, err) {
		if (ret) {
		} else {
			alert(JSON.stringify(err));
		}
	});
}

// 获取输入框的值
function getInputValue(callback){
	 var UIInput = api.require('UIInput');
	 UIInput.value(function(ret, err) {
		if (ret) {
			if(!isDefine(ret.msg)){
				showToast('请输入微博内容',2000,'middle');
				return;
			}else{
				callback();
			}
		} else {
			alert(JSON.stringify(err));
		}
	});
}

//退出监听
function exitApp() {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.toast({
			msg : '再按一次退出' + api.appName,
			duration : 2000,
			location : 'bottom'
		});
		api.addEventListener({
			name : 'keyback'
		}, function(ret, err) {
			api.closeWidget({
				silent : true
			});
		});
		//2秒后重新调用当前函数
		setTimeout(function() {
			exitApp();
		}, 2000)
	});
 }

 //关闭窗口
function closeWin() {
	api.closeWin();
}

/**
 * [fix_android_ios 解决沉浸式的问题]
 * @author Hongwei
 * @param {[obj]} color [头部颜色 | darkgray 深灰色 | black 黑色 | green 绿色，如果不是以上这几种颜色，可以自定义颜色 ]
 * @link http://www.kancloud.cn/hongweizhiyuan/apicloud_function/270056
 * @eg fix_android_ios('darkgray')  or fix_android_ios('FF0000')
 */
function fix_android_ios(color){
	switch(color)
	{
		case 'darkgray':
			color = "#303247"
			break;
		case 'black':
			color = "#000000"
			break;
		case 'white':
			color = "#FFFFFF"
			break;
		case 'green':
			color = "#01b980"
			break;
		default:
			color = color
	}
	api.setStatusBarStyle({
		style : 'light',
		color: color
	});
	var header = document.querySelector('header');
	$api.fixIos7Bar(header);
	$api.fixStatusBar(header);
}

/**
 * [isNumber 是否为数字]
 * @param  {[type]}  String [description]
 * @return {Boolean}        [description]
 */
function isNumber(String) {
	var Letters = "1234567890";
	//可以自己增加可输入值
	var i;
	var c;
	if (String.charAt(0) == '-')
		return false;
	if (String.charAt(String.length - 1) == '-')
		return false;
	for ( i = 0; i < String.length; i++) {
		c = String.charAt(i);
		if (Letters.indexOf(c) < 0)
			return false;
	}
	return true;
}