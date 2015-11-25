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