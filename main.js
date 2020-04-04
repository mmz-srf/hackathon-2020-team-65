const dataUrl =
  "https://docs.google.com/spreadsheets/d/1e774_OM0UWGInE252RC28uON9EgBK9CeFHucRi8CC4s/export?format=csv";

// replace with a Ring class for all diagrams later..
let GOOGLE_CHARTS = [];

class Diagram {
  constructor(domNode, data, options = {}) {
    this.domNode = domNode;
    this.data = data;
    this.type = options && options.type ? options.type : "annotatedtimeline";
    this.googleChart = null;
  }
  render() {
    if (this.type === "annotatedtimeline") {
      this.renderAnnotatedtimeline();
    } else if (this.type === "timeline") {
      this.renderTimeline();
    } else {
      throw "invalid chart type" + this.type;
    }
  }
  renderAnnotatedtimeline() {
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "New Cases");
    data.addColumn("string", "title1");
    data.addColumn("string", "text1");
    data.addColumn("number", "Some Metric");
    data.addColumn("string", "title2");
    data.addColumn("string", "text2");
    var totdays = this.data.length;

    for (let day = 1; day < totdays; day++) {
      var res = this.data[day][0].split(".");
      console.log("dates " + this.data[day][1]);
      data.addRows([
        [
          new Date(Number(res[2]), res[1] - 1, res[0]),
          Number(this.data[day][1]),
          undefined,
          undefined,
          Number(this.data[day][3]),
          undefined,
          undefined,
        ],
      ]);
    }

    this.googleChart = new google.visualization.AnnotatedTimeLine(
      document.getElementById(this.domNode)
    );
    this.googleChart.draw(data, {
      title: "Team 65",
      displayAnnotations: true,
    });
    return this.googleChart;
  }
  renderTimeline() {
    let chart = new google.visualization.Timeline(document.getElementById(this.domNode));
    let dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Term' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    let timetableDate = [];
    // parse measures start/end 
    this.data.y.forEach( (npi, index)=>{
      console.log(npi, index)
    })
   
    dataTable.addRows([
      [ '1', 'Total shudown', new Date(1788, 3, 30), new Date(1799, 2, 9) ],
      [ '2', 'Schools closed',new Date(1781, 3, 30),  new Date(1801, 2, 4) ],
      [ '3', 'Travel Ban',  new Date(1789, 3, 30),  new Date(1809, 2, 4) ]]);

    chart.draw(dataTable);
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
  google.charts.load("current", {
    packages: ["annotatedtimeline", "timeline"],
  });
  google.charts.setOnLoadCallback(() => {
    renderDiagrams(data);
  });
}

function renderDiagrams(data) {
  GOOGLE_CHARTS.push(new Diagram("chart_div", data));

  let npiChartData = ["NPI1", "NPI1", "NPI1", "NPI1", "NPI2", "NPI2"];
  GOOGLE_CHARTS.push(
    new Diagram(
      "chart_div2",
      { x: fetchDatesFromCsv(data), y: npiChartData },
      { type: "timeline" }
    )
  );
  GOOGLE_CHARTS.forEach((chart) => {
    chart.render();
  });
}

function fetchDatesFromCsv(data) {
  let dates = [];
  data.forEach((d) => {
    if (d[0] && d[0] !== "Date") dates.push(d[0]);
  });
  return dates;
}

function init() {
  loadSpreadsheet().then((data) => {
    console.log("data from spreadsheet " + dataUrl, data);
    initGoogleCharts(data);

    window.addEventListener("resize", () => {
      GOOGLE_CHARTS.forEach((chart) => {
        chart.render();
      });
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  init();
});
