const dataUrl =
  "https://docs.google.com/spreadsheets/d/1R_QKcbUc5h2oBdMd4dkanDsOjyrgZsgQSQGOUCFqQ58/export?format=csv";

// replace with a Ring class for all diagrams later..
let CHARTS = [];
 

class Diagram {
  constructor(domNode, data) {
    this.domNode = domNode;
    this.data = data; 
  }
  render() {
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "New Cases");
    data.addColumn("string", "title1");
    data.addColumn("string", "text1");
    data.addColumn("number", "Some Metric");
    data.addColumn("string", "title2");
    data.addColumn("string", "text2");
    for (let day = 1; day < 10; day++) {
    var res = this.data[day][0].split("-");
     console.log("dates " + this.data[day][1]);
    data.addRows([
      [
        new Date(Number(res[0]), res[1]-1, res[2]),
        Number(this.data[day][1]),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    ]);
}
    let chart = new google.visualization.AnnotatedTimeLine(
      document.getElementById(this.domNode)
    );
    chart.draw(data, { displayAnnotations: true });
    return chart; 
  }
}

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

function initGoogleCharts(data) {
  google.charts.load("current", { packages: ["annotatedtimeline"] });
  google.charts.setOnLoadCallback( () => {
    renderDiagrams(data);
  })
}

function renderDiagrams(data) {
  CHARTS.push( new Diagram("chart_div", data));
  CHARTS.forEach( (chart)=> {chart.render()}) 
}



function init() {
  loadSpreadsheet().then((data) => {
    console.log("data from spreadsheet " + dataUrl, data);
    initGoogleCharts(data); 
   
    //window.addEventListener("resize", () => {});
  });
}
document.addEventListener("DOMContentLoaded", () => {
  init();
});
