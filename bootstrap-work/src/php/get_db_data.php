<?php
require_once ('./db_connect.php');

$unit_test = false; //for debug prompt     

/*
 *   Do the essential unit test to ensure all the functions in this script work correctly. 
 *   Test Mehtod: type the exact path of this php file in the browser url block. 
 *                For example: localhost/charder/php/get_db_data.php
 *   Case 1: show all data in table: record_list
 *   Case 2: show all pId in table: record_list
 *   Case 3: show all gSn in table: record_list
 *   Case 4: 
 *   Case 5:
 */
function do_unit_test($case)
{

    switch ($case) {
        case 1:
            $fArray = array();
            $cArray = array();
            respDBData($fArray, $cArray);
            break;
        case 2:
            respFieldList("pId");
            break;
        case 3:
            respFieldList("gSn");
            break;        
        case 4: 

            break;    
    }
}

/*  
   Function :Pack data in a JSON object and return it to the JS to process.

   Content of returned JSON object 
   {
        "data": array of objects containing rows of all columns in the table: "record_list"
                [{"key1":"val1", ..., "key8":"val8"},{... ...}]
        "success": 0/1
        "prompt": "Query successfully"/"Table is empty"
   }
*/
function packDataInJson($rowData){
    
    $dataValue = array();
    $dataValue["Device_SN"] = $rowData["gSn"];
    $dataValue["Patient_ID"] = $rowData["pId"];
    $dataValue["Gross_Weight"] = $rowData["gWeight"];
    $dataValue["Tare_Weight"] = $rowData["tWeight"];
    $dataValue["Net_Weight"] = $rowData["nWeight"];
    $dataValue["Height"] = $rowData["pHeight"];
    $dataValue["BMI"] = $rowData["pBMI"];
    $dataValue["mDate"] = $rowData["measure_date"];
    $dataValue["mTime"] = $rowData["measure_time"];
            
    return $dataValue;    
}


function createSqlstring($fieldArray, $condArray)
{
    global $unit_test;
    $field_num = count($fieldArray);
    $condition_num = 0;
    $sql = "SELECT "; 
    $con_clause = "";  
    
    if($field_num == 0)
    {  
        $sql = $sql."*";        
    }
    else
    {
        for($i = 0; $i < $field_num; $i++)
        {   
            $sql = $sql.$fieldArray[$i];
            if($i != $field_num - 1) $sql = $sql.', ';            
        }
    }

    $sql = $sql." FROM record_list"; 

    reset($condArray);    

    while(list($key, $val) = each($condArray))
    {
        if($val != "0" && $val != "all" && $val != "")
        {
            if($condition_num > 0)
            {
                $con_clause = $con_clause." AND ";
            }         
            $con_clause = $con_clause.$key."='".$val."'";               
            $condition_num++;
        }
    }

    if($con_clause != "")
    {
        $sql = $sql." WHERE ".$con_clause; 
    }    

    if($unit_test)  printf("SQL String: %s", $sql);

    return $sql;
}

/*
 *  Return the latest $recordNum records
 */
function getRecentData($recordNum) 
{
    global $unit_test;
    $recentRecords = array();
    $conn = createLocalDBconn();
    $recentRecordSql = "SELECT * FROM record_list ORDER BY measure_date DESC LIMIT ".$recordNum;

    $result = mysqli_query($conn, $recentRecordSql);

    while($row = mysqli_fetch_assoc($result))
    {
        array_push($recentRecords, packDataInJson($row));
    }
    mysqli_close($conn);
    return $recentRecords;
}


/*
 * Following code will get all collected measured details
 *     fieldArray: fields to be selected from the 'record_list' table
 *     condArray: conditions in WHERE clause which we support [cond1 AND cond2 AND ...] only)
 */ 
function respDBData($fieldArray, $condArray)
{
    global $unit_test;
    // array for store intended select data
    $selectRecords = array(); 
    $conn = createLocalDBconn();   
    $sql = createSqlstring($fieldArray, $condArray);
    // get all columns from products table
    $result = mysqli_query($conn, $sql);
   
    // Return the number of rows in result set
    $rowcount = mysqli_num_rows($result);
    if($unit_test)
    {
        printf("Result set has %d rows.\n",$rowcount); 
        //echo "<br>";
    }

    
    if ($rowcount > 0) {
         // output data of each row
        //$respJSON["data"] = array(); 
        //if($unit_test) echo "<table><tr><th>User ID</th><th>Gross Weight</th><th>Date</th><th>Time</th></tr>";
       
        while($row = mysqli_fetch_assoc($result)) 
        {
            //if($unit_test) echo "<tr><td>".$row["pId"]."</td><td><center>".$row["gWeight"]."</td><td>".$row["measure_date"]."</td><td>".$row["measure_time"]."</td></tr>";            
            
            array_push($selectRecords, packDataInJson($row));         
        }       
        //if($unit_test) echo "</table>";

        // success      
        //$respJSON["success"] = 1;
        //$respJSON["prompt"] = "Query successfully";         

    }else {
        //$respJSON["success"] = 0;
        //$respJSON["prompt"] = "Table is empty";
        if($unit_test) echo "0 results";
    }

    // echo JSON
    //if($unit_test) echo json_encode($respJSON);

    mysqli_close($conn);   
    return $selectRecords;
} 

/*
    Function to response all the distinct options in the fieldname
    of the DB table, record_list.
 */
function respFieldList($fieldName)
{
    global $unit_test;
    //if($unit_test) echo "respFieldList:".$fieldName."<br>";    
    $optionsArray = array();   
    $conn = createLocalDBconn();   
    $sql = "SELECT DISTINCT ".$fieldName." FROM record_list;";
   
    // get all columns from products table
    $result = mysqli_query($conn, $sql);

    // Return the number of rows in result set
    //$rowcount = mysqli_num_rows($result);
    //if($unit_test) printf("There are %d %s.\n",$rowcount, $fieldName); 
  
    while($row = mysqli_fetch_array($result)) 
    {
        array_push($optionsArray, $row[$fieldName]);
    }
   
    mysqli_close($conn);       
    return $optionsArray;    
}

if($unit_test) {
    //do_unit_test(1);
    //do_unit_test(2);
    //do_unit_test(3);
}
?>