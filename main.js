const dataUrl =  "  https://docs.google.com/spreadsheets/d/1u25WTYj1JuCeIWqRSnI1FMmMfqvCcxtxHqZsFOZYptg/export?format=csv";

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
        data.addColumn('number', 'New Cases');
        data.addColumn('string', 'title1');
        data.addColumn('string', 'text1');
        data.addColumn('number', 'Some Metric');
        data.addColumn('string', 'title2');
        data.addColumn('string', 'text2');
        data.addRows([
          [new Date(2020, 3 ,21), Number(spreadsheetData[0]), undefined, undefined, undefined, undefined, undefined],
          [new Date(2020, 3 ,22), Number(spreadsheetData[1]), undefined, undefined, undefined, undefined, undefined],
          [new Date(2020, 3 ,23), Number(spreadsheetData[2]), undefined, undefined, undefined, undefined, undefined],
          [new Date(2020, 3 ,24), Number(spreadsheetData[3]), undefined, undefined, undefined, 'Closed Schools','Extra information'],
          [new Date(2020, 3 ,25), Number(spreadsheetData[4]), 'Closed shops','information', undefined, undefined, undefined],
          [new Date(2020, 3 ,26), Number(spreadsheetData[5]), undefined, undefined, undefined, undefined, undefined]
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