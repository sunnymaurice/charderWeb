function convertArrayOfObjectsToCSV(args) 
{  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;    
    //JSON response format {"data": {}, {}};
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
    //The header of columns in the csv file.
    keys = Object.keys(data[0]);        
    //console.log(keys);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    //Values of each column
    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            //第一個欄位之後才要加 ','
            if (ctr > 0) result += columnDelimiter;	
            // 2015/11/09 by Daisy Yu
            //Add [= "value"] can force the MS excel to treat it as string to avoid convert it as a number which mess up the format.
            result +=  '=\"' + item[key] + '\"'; 
            ctr++;
        });
        //一列的資料結尾加換行符號 '\n'
        result += lineDelimiter;
    });
    //console.log(result);
    return result;
}


function downloadCSV(filename, searchResult) 
{  
    var data, link;
    var csv = convertArrayOfObjectsToCSV(searchResult);

    if (csv === null) return;    

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }

    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


