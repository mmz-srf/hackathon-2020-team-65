const dataUrl =
  "https://docs.google.com/spreadsheets/d/1R_QKcbUc5h2oBdMd4dkanDsOjyrgZsgQSQGOUCFqQ58/export?format=csv";

function loadSpreadsheet() {
  return fetch(dataUrl)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return CSV.parse(data);
    })
    .catch(function (error) {
      console.log("error: " + error);
    });
}

function drawDiagram(spreadsheetData) {
  // Load the Visualization API and the corechart package.
  google.charts.load("current", { packages: ["annotatedtimeline"] });
  google.charts.setOnLoadCallback(drawChart);

  // Set a callback to run when the Google Visualization API is loaded.

  function drawChart() {
    console.log("values " + Number(spreadsheetData[0]));
    var data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "New Cases");
    data.addColumn("string", "title1");
    data.addColumn("string", "text1");
    data.addColumn("number", "Some Metric");
    data.addColumn("string", "title2");
    data.addColumn("string", "text2");
    for (let day = 1; day < 10; day++) {
    var res = spreadsheetData[day][0].split("-");
     console.log("dates " + spreadsheetData[day][1]);
    data.addRows([
      [
        new Date(Number(res[0]), res[1]-1, res[2]),
        Number(spreadsheetData[day][1]),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    ]);
}

    var chart = new google.visualization.AnnotatedTimeLine(
      document.getElementById("chart_div")
    );
    chart.draw(data, { displayAnnotations: true });
  }
}

function init() {
  loadSpreadsheet().then((data) => {
    console.log("data from spreadsheet " + dataUrl, data);
    drawDiagram(data);
  });
}

init();
