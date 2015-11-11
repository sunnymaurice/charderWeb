var refreshInterval = 3000; 	//Run reloading page every 3 seconds
var refreshTimerID;
var timer_is_on = false;

function doRefreshData()
{	
	handle_php_resp.bodyInit();

	refreshTimerID = setTimeout( function() {
		//console.log('Time is up! doRefreshData');
		doRefreshData();
	}, refreshInterval);	
}

function startRefreshData()
{
	if (!timer_is_on) {
		console.log('start to refresh data');
        timer_is_on = true;
        doRefreshData();
    }
}

function stopRefreshData()
{
	if (timer_is_on)
	{
		console.log('stop refressing data');
		clearTimeout(refreshTimerID);
		timer_is_on = false;
	}
}

function shouldDoRefresh(userID, date, deviceID)
{
	//console.log('uID: '+userID + ', date: ' + date + ', dID: '+ deviceID);
	//if(!date) console.log("TEST DATE!!!");

	if( (userID === '0' || userID === 'ALL') && (date === "") && (deviceID === '0' || deviceID === 'ALL'))
	{
		startRefreshData();
	}
	else
	{
		stopRefreshData();
	}
}

$(document).ready(function(){
	//console.log(browserDetect);
	//console.log($('body'));

	$('body').addClass(browserDetect.OS).addClass(browserDetect.browser + '_' + browserDetect.version);
	startRefreshData();  	

	/* Change background color in input field between focus/blur event */
	$("input").focus(function(){
        $(this).css("background-color", "#cccccc");
    });
    $("input").blur(function(){
        $(this).css("background-color", "#ffffff");
    }); 

    /* Detect the selected option in id_list */
    $('.UserID #id_list').on('change', function() {    	    	
    	/* Act on the event */
    	shouldDoRefresh($(this).find(":selected").val(), $('.Date #measure_date').val(), $('.DeviceID #dev_list').val());
    	//alert( 'ID:' + $(this).find(":selected").val() + ' Date:'+ $('.Date #measure_date').val() + ' Device:' + $('.DeviceID #dev_list').val());
    }); 
    /* Detect the selected option in dev_list */
   
    $('.DeviceID #dev_list').on('change', function() {	    
    	shouldDoRefresh($('.UserID #id_list').val(), $('.Date #measure_date').val(), $(this).find(":selected").val());
    	//alert( $(this).find(":selected").val() + 'Date:' + $('.Date #measure_date').val() );
    });

    /* Input handler after datePicker setup the date */
    document.querySelector('#measure_date').onchange = function() {	
    	shouldDoRefresh($('.UserID #id_list').val(), $('.Date #measure_date').val(), $('.DeviceID #dev_list').val());  
    	//alert( 'Date:' + $('.Date #measure_date').val() );
    };
    // Onchange event is not supported in JQuery
    // $('#measure_date').on('change', function() {	    
    // 	alert( 'Date:' + $('.Date #measure_date').val() );
    // });
	
});