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
  google.charts.load("current", { packages: ["corechart"] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Topping");
    data.addColumn("number", "Slices");
    data.addRows([
        ["Mushrooms", Number(spreadsheetData[0])],
        ["Onions",  Number(spreadsheetData[1])],
        ["Olives",  Number(spreadsheetData[2])],
        ["Zucchini",  Number(spreadsheetData[3])],
        ["Pepperoni", Number(spreadsheetData[4])]
    ]);

    // Set chart options
    var options = {
      title: "How Much Pizza I Ate Last Night",
      width: 400,
      height: 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById("chart_div")
    );
    chart.draw(data, options);
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
