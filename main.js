const dataUrl =  "https://docs.google.com/spreadsheets/d/1u25WTYj1JuCeIWqRSnI1FMmMfqvCcxtxHqZsFOZYptg/export?format=csv";

function loadSpreadsheet() {
  return fetch(
    dataUrl
  )
    .then(response => {
      // transform CSV
      console.log("b4", response);
      return response.text();
    })
    .then(data => {
      return data;
    })
    .catch(function(error) {
      console.log("error: " + error);
    });
}


function drawDiagram(spreadsheetData) {
  // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['annotatedtimeline']});
    google.charts.setOnLoadCallback(drawChart);

  // Set a callback to run when the Google Visualization API is loaded.

    function drawChart() {
   
  
        console.log("values "+Number(spreadsheetData[0]) );
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Sold Pencils');
        data.addColumn('string', 'title1');
        data.addColumn('string', 'text1');
        data.addColumn('number', 'Sold Pens');
        data.addColumn('string', 'title2');
        data.addColumn('string', 'text2');
        data.addRows([
          [new Date(2008, 1 ,1), Number(spreadsheetData[0]), undefined, undefined, 40645, undefined, undefined],
          [new Date(2008, 1 ,2), 14045, undefined, undefined, 20374, undefined, undefined],
          [new Date(2008, 1 ,3), 55022, undefined, undefined, 50766, undefined, undefined],
          [new Date(2008, 1 ,4), 75284, undefined, undefined, 14334, 'Out of Stock','Ran out of stock on pens at 4pm'],
          [new Date(2008, 1 ,5), 41476, 'Bought Pens','Bought 200k pens', 66467, undefined, undefined],
          [new Date(2008, 1 ,6), 33322, undefined, undefined, 39463, undefined, undefined]
        ]);

        var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
        chart.draw(data, {displayAnnotations: true});
      }
    }  

function init() {
  loadSpreadsheet().then(data => {
    // needs better parser later
    let dataArray = data.split("\n");
    console.log("data from spreadsheet "+dataUrl, dataArray); 
    drawDiagram(dataArray);
  });
}


init();
//init();