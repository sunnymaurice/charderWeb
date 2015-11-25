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