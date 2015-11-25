<?php
require_once('./get_db_data.php');
    $self_test = false;
	$respJSON = array();
    
    if(!$self_test)
    {
        $request_action = $_POST["action"];
    }
    else
    {
        $request_action = 'selectDb'; //for test php correctness only
    }

	//echo "Action: " .$request_action."<br>";


	switch ($request_action) {
            case "init": 	
            /* 
             * Display $recordLimit record of table data on body loading
             * and init the select option.  
             */
                //$recordLimit = $_POST["numOfRecord"];
                $recordLimit = 5; 
                $respJSON["data"] = getRecentData($recordLimit);
                $respJSON["id_list"] = respFieldList("pId");
                $respJSON["dev_list"] = respFieldList("gSn");
                break;
            case "getUserID": 	//            	
                //$respJSON["patient_id"] = $_POST["userID"];
                break;
            case "getDevice":   //                
                //$respJSON["device_sn"] = $_POST["deviceSn"];
                break;    
            case "selectDb":    //
                $fArray = array();                
                $cKeys = array("pId", "measure_date", "gSn");
                //init the associative array with keys in $cKeys and all the default value: null
                $cArray = array_fill_keys($cKeys, "");
                //取得查詢的條件
                if(!$self_test)
                {
                    $cArray["pId"] = $_POST["id_list"];
                    $cArray["measure_date"] = $_POST["measure_date"];
                    $cArray["gSn"] = $_POST["dev_list"];
                }
                else
                {
                    $cArray["pId"] = "6123456789012389";
                    $cArray["measure_date"] = "2015-10-19";
                    $cArray["gSn"] = "0";   
                }
                //print_r($cArray);
                $respJSON["data"] = respDBData($fArray, $cArray);
                break;                               
            default: //Notice: Should not happen!!!       
                echo "Unknow request action! Check it out";
                return;
	} 

	echo json_encode($respJSON); //回傳JSON格式
?>	