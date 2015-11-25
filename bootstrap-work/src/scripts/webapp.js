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