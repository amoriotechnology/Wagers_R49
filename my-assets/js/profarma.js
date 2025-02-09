var csrfName = "<?php echo $this->security->get_csrf_token_name();?>";
var csrfHash = "<?php echo $this->security->get_csrf_hash();?>";

$("#ProfarmaInvList").tablemanager({
  disable: ["last"],
  appendFilterby: true,
  dateFormat: [[4, "mm-dd-yyyy"]],
  debug: true,
  vocabulary: {
    voc_filter_by: "Filter By",
    voc_type_here_filter: "Filter...",
    voc_show_rows: "Rows Per Page",
  },
  pagination: true,
  showrows: [100, 50, 10, 5],
  disableFilterBy: [1],
});

$(".opt").change(function () {
  var states = [];
  $(".opt").each(function () {
    if (!$(this).is(":checked")) states.push($(this).data("control-column"));
  });
  setSates(states);
});

// when we need to set the sate of the UI, loop through the checkboxes checking if their "data-control-column" are in the "states" array
// if so, hide the specified column and uncheck the box
function setSates(states) {
  if (states) {
    if (!$.isArray(states)) states = JSON.parse(states); // if sates came from localstorage it will be a string, convert it to an array
    $(".opt").each(function (i, e) {
      var column = $(this).data("control-column");
      if ($.inArray(column, states) == -1) {
        $(this).attr("checked", true);
        $(
          "#ProfarmaInvList td:nth-child(" +
            column +
            "), #ProfarmaInvList th:nth-child(" +
            column +
            ")"
        ).show();
      } else {
        $(this).attr("checked", false);
        $(
          "#ProfarmaInvList td:nth-child(" +
            column +
            "), #ProfarmaInvList th:nth-child(" +
            column +
            ")"
        ).hide();
      }
    });
    localStorage.setItem("states", JSON.stringify(states));
  }
}
// this will read and set the initial states when the page loads
setSates(localStorage.getItem("states"));

/*

$(function() {
    var pressed = false;
    var start = undefined;
    var startX, startWidth;
    
    $("#ProfarmaInvList th").mousedown(function(e) {
        start = $(this);
        pressed = true;
        startX = e.pageX;
        startWidth = $(this).width();
        $(start).addClass("resizing");
    });
    
    $(document).mousemove(function(e) {
        if(pressed) {
            $(start).width(startWidth+(e.pageX-startX));
        }
    });
    
    $(document).mouseup(function() {
        if(pressed) {
            $(start).removeClass("resizing");
            pressed = false;
        }
    });
});
*/
$(".bootcol").click(function () {
  $(this).find("ul").toggleClass("show");
});
function generate() {
  $(".myButtonClass").hide();
  var doc = new jsPDF("p", "pt");
  var res = doc.autoTableHtmlToJson(document.getElementById("ProfarmaInvList"));
  var height = doc.internal.pageSize.height;
  //doc.text("Generated PDF", 50, 50);

  doc.autoTable(res.columns, res.data, {
    startY: doc.autoTableEndPosY() + 50,
  });
  doc.save("Generated PDF.pdf");
}

$('input[name="daterange"]').daterangepicker(
  {
    locale: {
      format: "YYYY-MM-DD",
    },
  },
  function (start, end, label) {
    // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  }
);

function columnSwitchMODAL() {
  var modal_colSwitch = document.getElementById("myModal_colSwitch");
  var btn_colSwitch = document.getElementById("myBtn");
  var span_colSwitch = document.getElementsByClassName("close_colSwitch")[0];

  btn_colSwitch.onclick = function () {
    modal_colSwitch.style.display = "block";
  };
  span_colSwitch.onclick = function () {
    modal_colSwitch.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal_colSwitch) {
      modal_colSwitch.style.display = "none";
    }
  };
}
/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
function highlight_row() {
  var table = document.getElementById("ProfarmaInvList");
  var tdsth = table.querySelectorAll("th");

  for (var i = 0; i < tdsth.length; i++) {
    var cell = tdsth[i];
    cell.onclick = function () {
      const children = this.parentElement.children;
      const clickedThIndex = [...children].findIndex((th) => th == this);
      const columns = document.querySelectorAll(
        `th:nth-child(${clickedThIndex + 1})`
      );
      columns.forEach((col) => {
        if (col.classList.contains("selected"))
          col.classList.remove("selected");
        else col.classList.add("selected");
      });
    };
  }
}

window.onload = highlight_row;
$(function () {
  $(".table th").resizable({
    minWidth: 100,
  });
});

(function ($) {
  $.fn.extend({
    tableExport: function (options) {
      var defaults = {
        separator: ",",
        ignoreColumn: [],
        tableName: "ProfarmaInvList",
        type: "csv",
        pdfFontSize: 14,
        pdfLeftMargin: 20,
        escape: "true",
        htmlContent: "false",
        consoleLog: "false",
      };

      var options = $.extend(defaults, options);
      var el = this;

      if (defaults.type == "csv" || defaults.type == "txt") {
        // Header
        var tdData = "";
        $(el)
          .find("thead")
          .find("tr")
          .each(function () {
            tdData += "\n";
            $(this)
              .filter(":visible")
              .find("th")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    tdData +=
                      '"' + parseString($(this)) + '"' + defaults.separator;
                  }
                }
              });
            tdData = $.trim(tdData);
            tdData = $.trim(tdData).substring(0, tdData.length - 1);
          });

        // Row vs Column
        $(el)
          .find("tbody")
          .find("tr")
          .each(function () {
            tdData += "\n";
            $(this)
              .filter(":visible")
              .find("td")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    tdData +=
                      '"' + parseString($(this)) + '"' + defaults.separator;
                  }
                }
              });
            //tdData = $.trim(tdData);
            tdData = $.trim(tdData).substring(0, tdData.length - 1);
          });

        //output
        if (defaults.consoleLog == "true") {
          console.log(tdData);
        }
        var base64data = "base64," + $.base64.encode(tdData);
        window.open(
          "data:application/" +
            defaults.type +
            ";filename=exportData;" +
            base64data
        );
      } else if (defaults.type == "sql") {
        // Header
        var tdData = "INSERT INTO `" + defaults.tableName + "` (";
        $(el)
          .find("thead")
          .find("tr")
          .each(function () {
            $(this)
              .filter(":visible")
              .find("th")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    tdData += "`" + parseString($(this)) + "`,";
                  }
                }
              });
            tdData = $.trim(tdData);
            tdData = $.trim(tdData).substring(0, tdData.length - 1);
          });
        tdData += ") VALUES ";
        // Row vs Column
        $(el)
          .find("tbody")
          .find("tr")
          .each(function () {
            tdData += "(";
            $(this)
              .filter(":visible")
              .find("td")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    tdData += '"' + parseString($(this)) + '",';
                  }
                }
              });

            tdData = $.trim(tdData).substring(0, tdData.length - 1);
            tdData += "),";
          });
        tdData = $.trim(tdData).substring(0, tdData.length - 1);
        tdData += ";";

        //output
        //console.log(tdData);

        if (defaults.consoleLog == "true") {
          console.log(tdData);
        }

        var base64data = "base64," + $.base64.encode(tdData);
        window.open("data:application/sql;filename=exportData;" + base64data);
      } else if (defaults.type == "json") {
        var jsonHeaderArray = [];
        $(el)
          .find("thead")
          .find("tr")
          .each(function () {
            var tdData = "";
            var jsonArrayTd = [];

            $(this)
              .filter(":visible")
              .find("th")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    jsonArrayTd.push(parseString($(this)));
                  }
                }
              });
            jsonHeaderArray.push(jsonArrayTd);
          });

        var jsonArray = [];
        $(el)
          .find("tbody")
          .find("tr")
          .each(function () {
            var tdData = "";
            var jsonArrayTd = [];

            $(this)
              .filter(":visible")
              .find("td")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    jsonArrayTd.push(parseString($(this)));
                  }
                }
              });
            jsonArray.push(jsonArrayTd);
          });

        var jsonExportArray = [];
        jsonExportArray.push({ header: jsonHeaderArray, data: jsonArray });

        //Return as JSON
        //console.log(JSON.stringify(jsonExportArray));

        //Return as Array
        //console.log(jsonExportArray);
        if (defaults.consoleLog == "true") {
          console.log(JSON.stringify(jsonExportArray));
        }
        var base64data =
          "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
        window.open("data:application/json;filename=exportData;" + base64data);
      } else if (defaults.type == "xml") {
        var xml = '<?xml version="1.0" encoding="utf-8"?>';
        xml += "<tabledata><fields>";

        // Header
        $(el)
          .find("thead")
          .find("tr")
          .each(function () {
            $(this)
              .filter(":visible")
              .find("th")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    xml += "<field>" + parseString($(this)) + "</field>";
                  }
                }
              });
          });
        xml += "</fields><data>";

        // Row Vs Column
        var rowCount = 1;
        $(el)
          .find("tbody")
          .find("tr")
          .each(function () {
            xml += '<row id="' + rowCount + '">';
            var colCount = 0;
            $(this)
              .filter(":visible")
              .find("td")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    xml +=
                      "<column-" +
                      colCount +
                      ">" +
                      parseString($(this)) +
                      "</column-" +
                      colCount +
                      ">";
                  }
                }
                colCount++;
              });
            rowCount++;
            xml += "</row>";
          });
        xml += "</data></tabledata>";

        if (defaults.consoleLog == "true") {
          console.log(xml);
        }

        var base64data = "base64," + $.base64.encode(xml);
        window.open("data:application/xml;filename=exportData;" + base64data);
      } else if (
        defaults.type == "excel" ||
        defaults.type == "doc" ||
        defaults.type == "powerpoint"
      ) {
        var utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
        var excel = "<table>";
        // Header
        $(el)
          .find("thead")
          .find("tr")
          .each(function () {
            excel += "<tr>";
            $(this)
              .filter(":visible")
              .find("th")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    excel += "<td>" + parseString($(this)) + "</td>";
                  }
                }
              });
            excel += "</tr>";
          });

        // Row Vs Column
        var rowCount = 1;
        $(el)
          .find("tbody")
          .find("tr")
          .each(function () {
            excel += "<tr>";
            var colCount = 0;
            $(this)
              .filter(":visible")
              .find("td")
              .each(function (index, data) {
                if ($(this).css("display") != "none") {
                  if (defaults.ignoreColumn.indexOf(index) == -1) {
                    excel += "<td>" + parseString($(this)) + "</td>";
                  }
                }
                colCount++;
              });
            rowCount++;
            excel += "</tr>";
          });
        excel += "</table>";

        if (defaults.consoleLog == "true") {
          console.log(excel);
        }

        var excelFile =
          "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" +
          defaults.type +
          "' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += "<head>";
        excelFile += "<!--[if gte mso 9]>";
        excelFile += "<xml>";
        excelFile += "<x:ExcelWorkbook>";
        excelFile += "<x:ExcelWorksheets>";
        excelFile += "<x:ExcelWorksheet>";
        excelFile += "<x:Name>";
        excelFile += "{worksheet}";
        excelFile += "</x:Name>";
        excelFile += "<x:WorksheetOptions>";
        excelFile += "<x:DisplayGridlines/>";
        excelFile += "</x:WorksheetOptions>";
        excelFile += "</x:ExcelWorksheet>";
        excelFile += "</x:ExcelWorksheets>";
        excelFile += "</x:ExcelWorkbook>";
        excelFile += "</xml>";
        excelFile += "<![endif]-->";
        excelFile += "</head>";
        excelFile += "<body>";
        excelFile += excel;
        excelFile += "</body>";
        excelFile += "</html>";

        var base64data = "base64," + $.base64.encode(excelFile);
        window.open(
          "data:application/vnd.ms-" +
            defaults.type +
            ";filename=exportData.doc;" +
            base64data
        );
      } else if (defaults.type == "png") {
        var resultDiv = document.getElementById("result");
        html2canvas(document.getElementById("#ProfarmaInvList"), {
          onrendered: function (canvas) {
            var img = canvas.toDataURL("image/png");
            result.innerHTML =
              '<a download="test.jpeg" href="' + img + '">test</a>';
          },
        });
      } else if (defaults.type == "pdf") {
        var pdf = new jsPDF("l", "mm", [300, 300]);
        var img = new Image();

        var res1 = document.getElementById("#ProfarmaInvList");
        var data2 = pdf.autoTableHtmlToJson(res1);

        var utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

        var header = function (data) {
          pdf.setFontSize(18);
          pdf.setTextColor(40);
          pdf.setFontStyle("bold");
          //  doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
          pdf.text("", data.settings.margin.left, 50);
          //pdf.addImage(img, 'png', 120, 0,'30','20');
        };

        //var endPos = pdf.autoTableEndPosY();

        // pdf.addPage();
        pdf.autoTable(data2.columns, data2.data, {
          startY: 40,
          pageBreak: "auto",
          theme: "grid",
          beforePageContent: header,

          headerStyles: {
            fontStyle: "normal",
            fillColor: [255, 255, 255],
            textColor: 20,
          },
          styles: {
            overflow: "linebreak",
            fontSize: 10,
            tableWidth: "auto",
            columnWidth: "auto",
            valign: "middle",
            rowHeight: 30,
          },
          drawHeaderRow: function (row, data) {
            row.height = 10;
          },
          margin: { horizontal: 10, top: 10, bottom: 10 },
        });

        pdf.save("Invoice_" + utc + ".pdf");
      }

      function parseString(data) {
        if (defaults.htmlContent == "true") {
          content_data = data.html().trim();
        } else {
          content_data = data.text().trim();
        }

        if (defaults.escape == "true") {
          content_data = escape(content_data);
        }

        return content_data;
      }
    },
  });
})(jQuery);
