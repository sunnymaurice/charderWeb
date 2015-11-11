//Setday.js
function cnVeryCalendar() {
    //Style
    var border_frame = '#468DDD';
    var border_inner = '#f6f6f6';
    var fore_frameCaption = '#ffffff';
    var back_frameCaption = '#468DDD';
    var fore_currentMonth = '#ff0000';
    var back_weekName = '#e9e9e9';
    var back_nullDay = '#fafafa';
    var fore_dayMouseOver = '#ff6600';
    var back_dayMouseOver = '#eeeeee';
    //var font_cnChar = 'font-family:宋体,sans-serif; font-size:12px;';
	var font_cnChar = 'font-family:Microsoft JhengHei; font-size:12px;';
    var font_numChar = 'font-family:tahoma,arial,sans-seirf; font-size:11px;';
    var style_cell = 'line-height:14px; border-color:' + border_inner;
    var today_decoration = "font-weight:bold;"
	//var today_decoration = "font-weight:bold; background:url('images/calendar_today.gif') center no-repeat;"
    // "font-weight:bold"

    //Declare
    var reciever;
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1;



    //Return Max Days In The Month
    this.daysInMonth = function (y, m) {
        switch (m) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                //Is Leep Year
                if (y % 4 != 0) {
                    return 28;
                }
                if (y % 100 == 0) {
                    return y % 400 == 0 ? 29 : 28;
                }
                return 29;
        }
    }


    //Generate Codes
    this.generateCalendarTable = function () {
        var i;
        var j = new Date(y, m - 1, 1).getDay();
        var k = this.daysInMonth(y, m);
        var body = '';

        //Frame Table Header
        body += "<table align='center' cellpadding='2' cellspacing='1' width='100%' height='100%' style='border:1px " + border_frame + " solid; background:white;'>";
        body += " <tr>";
        body += "   <td style='background:" + back_frameCaption + ";" + font_cnChar + "' height='20'>";
        body += "    <div style='color:" + fore_frameCaption + "; float:left'><b>Select Date</b></div>";
        body += "    <div style='float:right'>";
        body += "     <a href=\"javascript:calendar.setValue('')\" style='color:" + fore_frameCaption + "; text-decoration:none;" + font_cnChar + "'>[Clear]</a> ";
        body += "     <a href='javascript:calendar.fadeOut()' style='color:" + fore_frameCaption + "; text-decoration:none;" + font_cnChar + "'>[Close]</a>";
        body += "    </div>";
        body += "   </td>";
        body += " </tr>";
        body += " <tr>";
        body += "   <td style='padding-bottom:0px'>";
        body += "    <table align='center' width='99%' cellpadding='0' cellspacing='0'>";
        body += "     <tr>";
        body += "      <td style='" + font_cnChar + "'><a href='javascript:calendar.loadPreviousYear()' style='text-decoration:none; color:" + fore_dayMouseOver + "'><font><<</font></a>Year<a href='javascript:calendar.loadNextYear()' style='text-decoration:none; color:" + fore_dayMouseOver + "'><font>>></font></a></td>";
        body += "      <td align='center' nowrap='nowrap' style='color:" + fore_currentMonth + ";" + font_cnChar + "'><b>" + y + "-" + m + "</b></td>";
        body += "      <td align='right' style='" + font_cnChar + "'><a href='javascript:calendar.loadPreviousMonth()' style='text-decoration:none; color:" + fore_dayMouseOver + "'><font><<</font></a>Month<a href='javascript:calendar.loadNextMonth()' style='text-decoration:none; color:" + fore_dayMouseOver + "'><font>>></font></a></td>";
        body += "     </tr>";
        body += "    </table>";
        body += "   </td>";
        body += " </tr>";
        body += " <tr>";
        body += "   <td>";

        //Calendar Table Header
        body += "<table align='center' width='99%' cellpadding='3' cellspacing='0' border='1' bordercolor='" + border_inner + "' style='border-collapse:collapse; table-layout:fixed;'>";
        body += " <tr align='center' style='background:" + back_weekName + "'>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Sun</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Mon</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Tue</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Wed</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Thu</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Fri</td>";
        body += "   <td style='" + font_cnChar + style_cell + "'>Sat</td>";
        body += " </tr>";

        //Insert Null Days Before The First Day In Current Month
        if (j != 0) {
            body += "<tr align='center'>";
            body += ("<td style='background:" + back_nullDay + style_cell + "' colspan='" + j + "'></td>");
        }

        //Loop Each Days In Current Month
        for (i = 1; i <= k; i++) {
            //Row Begin
            if ((i + j) % 7 == 1) {
                body += "<tr align='center'>";
            }

            //Cells Day By Day
            body += "<td";
            body += " onmouseover=\"this.style.backgroundColor='" + back_dayMouseOver + "'; this.style.color='" + fore_dayMouseOver + "'\"";
            //修改时期2009-8-14 修改人www(修改内容：当前日期中日显示为红色，鼠标移开后也显示为给红色)
            if (y == today.getFullYear() && m == today.getMonth() + 1 && i == today.getDate()) {
                //body += " style=\"cursor:hand; " + today_decoration + "; " + font_numChar + style_cell + "; color:"+ fore_currentMonth +"\"";
                body += " onmouseout=\"this.style.backgroundColor=''; this.style.color='" + fore_currentMonth + "'\"";
            }
            else {
                body += " onmouseout=\"this.style.backgroundColor=''; this.style.color=''\"";
            }
           
			function Appendzero(obj){
				if(obj<10) return "0" +""+ obj;
				else return obj; 
			}
            //Modified by Maurice, 2015/10/19, YYYYMMDD to YYYY-MM-DD
			body += " onclick=\"calendar.setValue('" + y + "-" + Appendzero(m) + "-" + Appendzero(i) + "')\"";
			//Modify by kimen, 2013/01/18, YYYY-MM-DD To YYYY/MM/DD
            //body += " onclick=\"calendar.setValue('" + y + "/" + m + "/" + i + "')\"";
            //修改时期2009-8-14 修改人www
            if (y == today.getFullYear() && m == today.getMonth() + 1 && i == today.getDate()) {
                body += " style=\"cursor:hand; " + today_decoration + "; " + font_numChar + style_cell + "; color:" + fore_currentMonth + "\"";
            }
            else {
                body += " style='cursor:hand; " + font_numChar + style_cell + "' ";
            }
            //修改时期2009-8-14 修改人www
            body += ">" + i + "</td>";

            //Row End
            if ((i + j) % 7 == 0) {
                body += ("</tr>");
            }
        }

        //Append Null Days After The Last Day In Current Month
        if ((i + j) % 7 != 0) {
            body += ("<td style='background:" + back_nullDay + style_cell + "' colspan='" + (8 - (i + j) % 7) + "'></td>");
            body += ("</tr>");
        }
        if (j < (36 - k)) {
            body += ("<tr><td colspan='7' style='background:" + back_nullDay + style_cell + "'>&nbsp;</td></tr>");
        }
        if (j == 0 && k == 28) {
            body += ("<tr><td colspan='7' style='background:" + back_nullDay + style_cell + "'>&nbsp;</td></tr>");
        }

        //End Calendar Table
        body += "</table>";

        //End Frame Table
        body += "</td></tr></table>";

        //Return
        return body;
    }


    //Load Previous Year
    this.loadPreviousYear = function () {
        y--;
        __cnVeryCalendarContainer.innerHTML = this.generateCalendarTable();
    }
    this.loadNextYear = function () {
        y++;
        __cnVeryCalendarContainer.innerHTML = this.generateCalendarTable();
    }
    this.loadPreviousMonth = function () {
        m--;
        if (m < 1) {
            m = 12;
            y--;
        }
        __cnVeryCalendarContainer.innerHTML = this.generateCalendarTable();
    }
    this.loadNextMonth = function () {
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
        __cnVeryCalendarContainer.innerHTML = this.generateCalendarTable();
    }


    //Get Position
    this.getAbsolutePosition = function (element) {
        var point = { x: element.offsetLeft, y: element.offsetTop };
        //Recursion
        if (element.offsetParent) {
            var parentPoint = this.getAbsolutePosition(element.offsetParent);
            point.x += parentPoint.x;
            point.y += parentPoint.y;
        }
        return point;
    };


    //Pop Layer
    this.setHook = function (dateField) {

        if (__cnVeryCalendarContainer.style.display != 'none' && reciever.id == dateField.id) {
            __cnVeryCalendarContainer.style.display = 'none';
            return;
        }
        reciever = dateField;

        //-- 如果不想在第二次打开日历时回归为当前月，则把下面两行注释掉或删掉 --
        y = today.getFullYear();
        m = today.getMonth() + 1;
        //----------------------------

        var point = this.getAbsolutePosition(dateField);
        // __cnVeryCalendarContainer.style.left = (point.x + dateField.offsetWidth + 5) + 'px';
        // __cnVeryCalendarContainer.style.top = point.y + 'px';
        __cnVeryCalendarContainer.style.left = (point.x + 1) + 'px';
        __cnVeryCalendarContainer.style.top = (point.y + 20) + 'px';
        __cnVeryCalendarContainer.innerHTML = this.generateCalendarTable();
        __cnVeryCalendarContainer.style.display = '';
    }


    //Hide Layer
    this.fadeOut = function () {
        __cnVeryCalendarContainer.style.display = 'none';
    }


    //Click a Day Cell To Add The Value
    this.setValue = function (date) {
        reciever.value = date;
        // 2015.11.09 by Maurice Sun
        // Since JQuery don't support input onchange event handler, we claim our own in refreshData.js
        // and call it here.
        if (typeof reciever.onchange === 'function') {
            reciever.onchange();
        }        
        this.fadeOut();
    }
}

//Render Instance
document.write("<div id='__cnVeryCalendarContainer' style='width:200px; height:190px; position:absolute; float:left; display:none; z-index:999'></div>");
var calendar = new cnVeryCalendar();
