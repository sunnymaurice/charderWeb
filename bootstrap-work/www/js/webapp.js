// 建立網頁要使用的javascript最上頭物件
// 使用的物件都累加至window.webapp這個物件底下
window.webapp = (function () {
	var webPageReady = function webPageReady() {
		console.log('Web Page is Ready');

		// 將資料透過ajax POST資料給指定的php，php處理完畢後回傳result，執行callback function: initBodyOnLoad
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理		
		webapp.handle_php_req.getDatafromPHP({
			action: 'init'
		}, webapp.handle_php_req.webReq_phpUrl)
		.done(function successGetResp(response) {
			/*
			 Description: callback function for bodyInit function in order to display the latest 5 records and init select options.
			 */
			var i, opt;

			console.log(JSON.stringify(response));	
			$('.UserID #id_list').empty();
			$('.UserID #id_list').append('<option value="0">Select a user ID:</option>');
			$('.DeviceID #dev_list').empty();			
			$('.DeviceID #dev_list').append('<option value="0">Select a device ID:</option>');
			
			// php會回傳帶有'id_list'的JSON物件，用for迴圈將所有資料庫現有的使用者ID加入到 id_list 選項中			
			for (i in response.id_list) 
			{
				opt = '<option value="' +response.id_list[i] + '">' + response.id_list[i] + '</option>';
				$('.UserID #id_list').append(opt);		
			}
			$('.UserID #id_list').append('<option value="all">ALL</option>');

			// php會回傳帶有'dev_list'的JSON物件，用for迴圈將所有資料庫現有的使用者ID加入到 id_list 選項中			
			for (i in response.dev_list) 
			{
				opt = '<option value="' + response.dev_list[i] + '">' + response.dev_list[i] + '</option>';								
				$('.DeviceID #dev_list').append(opt);
			}
			$('.DeviceID #dev_list').append('<option value="all">ALL</option>');
			
			/* 
			    Response format:
				"recent_data":[
					{"gSn":"M15000001","pId":"5123456789012345","gWeight":"15.568","tWeight":"1.01","nWeight":"14.558","pHeight":null,"pBMI":null,"measure_date":"2015-10-01","measure_time":"17:29:07"},
					{"Device_SN":"M15000001","Patient_ID":"6123456789012389","Gross_Weight":"21.03","Tare_Weight":"0","Net_Weight":"21.03","Height":null,"BMI":null,"mDate":"2015-10-14","mTime":"10:01:35"}
				]
			*/
			showTable(response);
		})
		.fail(webapp.handle_php_req.getDataError);
	};

	var bodyInit = function bodyInit() {
		$(document).ready(function webPageDomReady() {
			$('body')
			.addClass(webapp.browserDetect.OS)
			.addClass(webapp.browserDetect.browser + '_' + webapp.browserDetect.version);
			
			// 等待DOM載入完成後，載入各個頁面的html
			var templateUrls = [{
				parent: 'body',
				url: 'templates/header/nav-header.html'
			}, {
				parent: '.web-main-container',
				url: 'templates/main/home.html'
			}, {
				parent: '.web-main-container .query-factor',
				url: 'templates/main/query-form.html'
			}, {
				parent: 'body',
				url: 'templates/footer/footer.html'
			}];

			(function loadTemplates(templateIdx) {
				$.ajax({
					type: 'GET',
					url: templateUrls[templateIdx].url,
					dataType: 'text'
				}).done(function (respHtml) {
					// console.log(respHtml);
					
					// 以jquery選擇器根據給予的父容器選擇語法，選擇指定的父容器
					$(templateUrls[templateIdx].parent).append(respHtml); // 將html內容套用到指定的父容器底下

					// 遞回執行，直到加入完樣本html
					if (templateIdx + 1 < templateUrls.length) {
						loadTemplates(templateIdx + 1);
					} else { webPageReady(); } // 全部樣版載入完成，呼叫準備完成的Function
				});
			})(0);
		});
	};

	return {
		bodyInit: bodyInit
	};
})();
(function (app) {
	// 宣告目前市面上既有的瀏覽器
	var dataBrowser = [{
		string: navigator.userAgent,
		subString: 'Chrome',
		identity: 'Chrome'
	}, { 	string: navigator.userAgent,
		subString: 'OmniWeb',
		versionSearch: 'OmniWeb/',
		identity: 'OmniWeb'
	}, {
		string: navigator.vendor,
		subString: 'Apple',
		identity: 'Safari',
		versionSearch: 'Version'
	}, {
		prop: window.opera,
		identity: 'Opera',
		versionSearch: 'Version'
	}, {
		string: navigator.vendor,
		subString: 'iCab',
		identity: 'iCab'
	}, {
		string: navigator.vendor,
		subString: 'KDE',
		identity: 'Konqueror'
	}, {
		string: navigator.userAgent,
		subString: 'Firefox',
		identity: 'Firefox'
	}, {
		string: navigator.vendor,
		subString: 'Camino',
		identity: 'Camino'
	}, {	// for newer Netscapes (6+)
		string: navigator.userAgent,
		subString: 'Netscape',
		identity: 'Netscape'
	}, {
		string: navigator.userAgent,
		subString: 'MSIE',
		identity: 'Explorer',
		versionSearch: 'MSIE'
	}, {
		string: navigator.userAgent,
		subString: 'Gecko',
		identity: 'Mozilla',
		versionSearch: "rv"
	}, {   // for older Netscapes (4-)
		string: navigator.userAgent,
		subString: 'Mozilla',
		identity: 'Netscape',
		versionSearch: 'Mozilla'
	}];

	// 宣告目前市面上常見的OS
	var dataOS = [{
		string: navigator.platform,
		subString: 'Win',
		identity: 'Windows'
	}, {
		string: navigator.platform,
		subString: 'Mac',
		identity: 'Mac'
	}, {
		string: navigator.userAgent,
		subString: 'iPhone',
		identity: 'iPhone/iPod'
 	}, {
		string: navigator.userAgent,
		subString: 'Android',
		identity: 'Android'
 	}, {
		string: navigator.platform,
		subString: 'Linux',
		identity: 'Linux'
	}];

	app.browserDetect = {
		searchString: function searchString(data) {
			for (var i = 0 ; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				} else if (dataProp) {
					return data[i].identity;
				}
			}
		},
		searchVersion: function searchVersion(dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
		},
		init: function init() {
			this.browser = (this.searchString(dataBrowser) || 'unknown_browser');
			this.version = (this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'unknown_version');
			this.OS = this.searchString(dataOS) || 'unknown_OS';
		}
	};
	app.browserDetect.init();

	// 顯示連接用戶端的OS與瀏覽器種類及版本
	console.log('OS: ' + app.browserDetect.OS);
	console.log('Browser: ' + app.browserDetect.browser + ' ' + app.browserDetect.version);
})(window.webapp);
(function initAjaxRequest(app) {
	var serverAddr = 'http://localhost:8100/',
		webReq_phpUrl = 'php/handleWebRequest.php';

	var i, k;

	var getDataError = function getDataError(err) {
		// 將php的html tag消除後顯示錯誤警告
		err.responseText = err.responseText.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br \/>/g, '\n');	
		// console.log(JSON.stringify(err));
		console.log(err.responseText);
		// alert(err.responseText);
	};

	var getDatafromPHP = function getDatafromPHP(data, php_url) {
		// 沒傳入資料返回不執行
		if (!data) { return; }

		// 印出欲傳輸的資料內容數據
		console.log('***** Request Data Start *****');
		console.log('POST to --> ' + php_url);
		console.log('===== ' + data.action + ' =====');
		for (k in data) console.log(k + ': ' + data[k]);
		console.log('===== ' + data.action + ' =====');
		console.log('***** Request Data End *****');

		return $.ajax({
			type: 'POST',
			url: php_url,
			data: data,
			dataType: 'JSON'
		}); // 回傳promise
	};

	app.handle_php_req = {
		// 公開變數
		webReq_phpUrl: webReq_phpUrl,

		// 方法
		getDatafromPHP: getDatafromPHP,
		getDataError: getDataError
	};
})(window.webapp);
(function (app, phpReq) {
	var data, i; // 宣告會重複使用到的變數

	//Encode a set of form elements as an array of names and values, ready to be encoded as a JSON string.
	var creatJSONrequest = function creatJSONrequest(selectorStr) {
		var json_request = {};
		var fields = $(selectorStr).serializeArray();	

		$('#debug_prompt #results').empty();	//for trace the process

		$.each(fields, function() {
			if (json_request[this.name]) {
				if (!json_request[this.name].push) {
					json_request[this.name] = [json_request[this.name]];
				}
				json_request[this.name].push(this.value || '');
			} else {
				json_request[this.name] = this.value || '';
			}
			$('#debug_prompt #results' ).append( this.name + ':' + this.value + ' ' );//for trace the process
		});
		return json_request;
	};

	var showTable = function showTable(response) {
		$('.DisplayData').empty();
		$('.DisplayHeader').empty();
		var dispTable = '<table>';
		var dispHeader = '<table><tr><th>Device SN</th><th>User ID</th><th>Gross Weight</th><th>Tare Weight</th><th>Net Weight</th><th>Height</th><th>BMI</th><th>Date</th><th>Time</th></table>';

		for(i in response.data) {
			dispTable += '<tr>' + 
						 '<td>' + response.data[i].Device_SN + '</td>' + 
						 '<td>' + response.data[i].Patient_ID + '</td>' +
						 '<td>' + response.data[i].Gross_Weight + '</td>' +
						 '<td>' + response.data[i].Tare_Weight + '</td>' +
						 '<td>' + response.data[i].Net_Weight + '</td>' +					 
						 '<td>' + response.data[i].Height + '</td>' +
						 '<td>' + response.data[i].BMI + '</td>' +
						 '<td>' + response.data[i].mDate + '</td>' +
						 '<td>' + response.data[i].mTime + '</td>' +
						 '</tr>';
		}
		dispTable  += '</table>';

		$('.DisplayHeader').append(dispHeader);
		$('.DisplayData').append(dispTable);
	};

	var onChangeUserId = function onChangeUserId() {
		// 將資料透過ajax POST資料給指定的php，php執行完畢後回傳result，不執行callback function，主要記錄目前的patient id選項值
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理
		phpReq.getDatafromPHP({ 
			action: 'getUserID',
			userID: $('#SqlQueryForm #id_list').val()
		}, php_url).done().fail(phpReq.getDataError);		
	};

	var onChangeDeviceId = function onChangeDeviceId() {
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理
		// 將資料透過ajax POST資料給php，php執行完畢後回傳result，不執行callback function，主要記錄目前的device選項值
		phpReq.getDatafromPHP({ 
			action: 'getDevice',
			deviceSn: $('#SqlQueryForm #dev_list').val()
		}, php_url).done().fail(phpReq.getDataError);		
	};

	var queryformSubmit = function queryformSubmit() {
		// 將3種查詢條件的設定傳給php
		data = creatJSONrequest('#SqlQueryForm');
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理
		data.action = 'selectDb';
		// 將資料透過ajax POST資料給php，php執行完畢後回傳result，執行callback function
		getDatafromPHP(data, phpReq.webReq_phpUrl).done(showTable).fail(phpReq.getDataError);
	};

	app.formCtrl = {
		onChangeDeviceId: onChangeDeviceId,
		onChangeUserId: onChangeUserId,
		queryformSubmit: queryformSubmit
	};
})(window.webapp, window.webapp.handle_php_req);