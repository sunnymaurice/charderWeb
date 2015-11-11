var php_url = "php/handleWebRequest.php";
var searchResult = null;

//Encode a set of form elements as an array of names and values, ready to be encoded as a JSON string.
function creatJSONrequest(selectorStr)
{
	var json_request = {};
	var fields = $(selectorStr).serializeArray();	

	//$('#debug_prompt #results').empty();	//for trace the process

	$.each(fields, function() 
	{
		if (json_request[this.name]) 
		{
			if (!json_request[this.name].push) {
				json_request[this.name] = [json_request[this.name]];
			}
			json_request[this.name].push(this.value || '');
		} 
		else 
		{
			json_request[this.name] = this.value || '';
		}
		//$( '#debug_prompt #results' ).append( this.name + ':' + this.value + ' ' );//for trace the process
	});
	//console.log(json_request);
	return json_request;

}


/*
 *  Send request in JSON data:[data] type via HTTP post method to url:[php_url] 
 */
function getDatafromPHP(data, php_url)
{
	// 沒設定資料返回不執行
	if (!data) { return; }
	//console.log("Request data: "+data);
	return $.ajax(
		{
			type: "POST",
			url: php_url,
			data: data,					
			dataType: "JSON"
			//success: callback
		}
	);
}

function getDataError(err)
{
	// 將php的html tag消除後顯示錯誤警告
	err.responseText = err.responseText.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br \/>/g, '\n');	
	console.log(JSON.stringify(err));
	console.log(err.responseText);
	alert(err.responseText);
}


function showTable(response)
{
	searchResult = response;
	$('.DisplayData').empty();
	$('.DisplayHeader').empty();
	var dispHeader = '<table><tr><th>Device SN</th><th>User ID</th><th>Net Weight<br>(kg)</th><th>Tare Weight<br>(kg)</th><th>Gross Weight<br>(kg)</th><th>Height<br>(cm)</th><th>BMI</th><th>Measurement<br>Time</th></tr></table>';

	var dispTable = '<table>';
	for(var i in response.data)
	{
		dispTable += '<tr>' + 
					 '<td>' + response.data[i].Device_SN + '</td>' + 
					 '<td>' + response.data[i].Patient_ID + '</td>' +
					 '<td>' + response.data[i].Net_Weight + '</td>' +
					 '<td>' + response.data[i].Tare_Weight + '</td>' +
					 '<td>' + response.data[i].Gross_Weight + '</td>';
		if(response.data[i].Height === null)
		{
			dispTable += '<td>N/A</td>';
		}
		else
		{
			dispTable += '<td>' + response.data[i].Height + '</td>';
		}
		if(response.data[i].BMI === null)
		{
			dispTable += '<td>N/A</td>';
		}
		else
		{
			dispTable += '<td>' + response.data[i].BMI + '</td>';
		}
					 					
		dispTable += '<td>' + response.data[i].mDate +' '+response.data[i].mTime +'</td>' +
					 //'<td>' + response.data[i].mTime + '</td>' +
					 '</tr>';
	}
	dispTable  += '</table>';

	$('.DisplayHeader').append(dispHeader);
	$('.DisplayData').append(dispTable);
	
	var tableElem = $('.DisplayData table');
	if (tableElem.innerHeight() > tableElem.offsetParent().innerHeight()) {
		$('.DisplayHeader table').addClass('has-overflow');
	}
}


/*
	Description: callback function for bodyInit function in order to display the latest 5 records and init select options.
 */ 
function initBodyOnLoad(response)
{
	var opt, i; // 宣告會重複使用到的變數

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
	$('.UserID #id_list').append('<option value="ALL">ALL</option>');

	// php會回傳帶有'dev_list'的JSON物件，用for迴圈將所有資料庫現有的使用者ID加入到 id_list 選項中			
	for (i in response.dev_list) 
	{
		opt = '<option value="' + response.dev_list[i] + '">' + response.dev_list[i] + '</option>';								
		$('.DeviceID #dev_list').append(opt);
	}
	$('.DeviceID #dev_list').append('<option value="ALL">ALL</option>');
	
	/* 
	    Response format:
		"recent_data":[
			{"gSn":"M15000001","pId":"5123456789012345","gWeight":"15.568","tWeight":"1.01","nWeight":"14.558","pHeight":null,"pBMI":null,"measure_date":"2015-10-01","measure_time":"17:29:07"},
			{"Device_SN":"M15000001","Patient_ID":"6123456789012389","Gross_Weight":"21.03","Tare_Weight":"0","Net_Weight":"21.03","Height":null,"BMI":null,"mDate":"2015-10-14","mTime":"10:01:35"}
		]
	*/
	showTable(response);
}



function showQueryResult(response)
{
	console.log(JSON.stringify(response));	
	showTable(response);	
}



var handle_php_resp = (function(){
	
	var bodyInit = function bodyInit() 
	{	
		//console.log('do bodyInit...');	
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理
		var data = { action: 'init' };				
		// 將資料透過ajax POST資料給指定的php，php處理完畢後回傳result，執行callback function: initBodyOnLoad
		getDatafromPHP(data, php_url).done(initBodyOnLoad).fail(getDataError);
	};
	

	var queryformSubmit = function queryformSubmit() 
	{	// 將3種查詢條件的設定傳給php
		var data = creatJSONrequest('#SqlQueryForm');
		// 設定傳入php的action字串，php用來辨識做什麼相對應處理
		data.action = 'selectDb';
		// 將資料透過ajax POST資料給php，php執行完畢後回傳result，執行callback function
		getDatafromPHP(data, php_url).done(showQueryResult).fail(getDataError);
	};
	// Save Search Result as csv file.
	var saveQueryResultSubmit = function saveQueryResultSubmit()
	{	
		//var downloadFileName = 'exports.csv';
		
		RightNow = new Date();
		var timestamp = RightNow.getFullYear()+ (RightNow.getMonth()+1).zeroPad(10) + RightNow.getDate().zeroPad(10) + RightNow.getHours().zeroPad(10) + RightNow.getMinutes().zeroPad(10) + RightNow.getSeconds().zeroPad(10);
		
		var id_list = $('.UserID #id_list').val();
		var measure_date = $('.Date #measure_date').val();
		var dev_list = $('.DeviceID #dev_list').val();
		measure_date_split =  measure_date.split("-")[0] + measure_date.split("-")[1] + measure_date.split("-")[2];
			
		var downloadFileName;
		//全都沒選
		if((id_list === '0' || id_list === 'ALL') &&  !measure_date && (dev_list === '0' || dev_list === 'ALL')){			
			downloadFileName = 'ALL_' + timestamp + '.csv';
		} 
		//選UserID，其餘沒選
		else if(id_list && !measure_date && dev_list === '0'){			
			downloadFileName = id_list + '.csv';
		}
		//選日期，其餘沒選		
		else if(id_list === '0' && measure_date && dev_list === '0'){		
			downloadFileName = measure_date_split + '.csv';
		} 
		//選DeviceID，其餘沒選		
		else if(id_list === '0' && !measure_date && dev_list != '0'){			
			downloadFileName = dev_list + '.csv';
		} 
		//選UserID, 日期	
		else if(id_list != '0' && measure_date && dev_list === '0'){			
			downloadFileName = id_list + '_' + measure_date_split + '.csv';
		} 
		//選UserID, DeviceID
		else if(id_list != '0' && !measure_date && dev_list != '0'){			
			downloadFileName = id_list + '_' + dev_list + '.csv';
		} 
		//選日期, DeviceID
		else if(id_list === '0' && measure_date && dev_list != '0'){			
			downloadFileName = measure_date_split + '_' + dev_list + '.csv';
		} 
		//全選
		else if(id_list != '0' && measure_date && dev_list !='0'){		
			downloadFileName = id_list + '_' + measure_date_split + '_' + dev_list + '.csv';
		}
		downloadCSV(downloadFileName, searchResult);
	};

	Number.prototype.zeroPad = Number.prototype.zeroPad || 
	function(base){
		var nr = this, len = (String(base).length - String(nr).length) + 1;
		return len > 0? new Array(len).join('0') + nr : nr;
	};
	// TODO: Add the mechanism to identify if there is any new data to be shown in the web page after migration what PHP
	//       have done to nodejs application.
	/*
	var isDBupdated = function isDBupdated()
	{

	}
	*/

	return {
		bodyInit : bodyInit,		
		queryformSubmit	: queryformSubmit,
		saveQueryResultSubmit: saveQueryResultSubmit
		//isDBupdated: isDBupdated
	};
})();