const DATA_URL =
  "https://docs.google.com/spreadsheets/d/1e774_OM0UWGInE252RC28uON9EgBK9CeFHucRi8CC4s/export?format=csv";

const DATA_URL_NPI =
  "https://docs.google.com/spreadsheets/d/1k4ajXFkkzY4zyVsJYXxTdGHwoiH-lBl7NLoLUObwhD8/export?format=csv";


class Diagram {
  constructor(domNode, npiDomNode, data, dataNpi, options = {}) {
    this.domNode = domNode;
    this.npiDomNode = npiDomNode;
    this.data = data;
    this.dataNpi = dataNpi;
    this.type = options && options.type ? options.type : "first";
    this.render()
  }
  render() {
    if (this.type === "first") {
      this.renderFirst();
    } else if (this.type === "second") {
      this.renderSecond();
    } else if (this.type === "third") {
      this.renderThird();
    } 
    this.renderNPITimeline();
  }
  renderFirst() {
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
      //console.log("dates " + this.data[day][1]);
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

    let googleChart = new google.visualization.AnnotatedTimeLine(
      document.getElementById(this.domNode)
    );
    googleChart.draw(data, {
      title: "Team 65",
      displayAnnotations: true,
    });
  }
  renderSecond() {
    // replace with custom code
    this.renderFirst();
  }

  renderThird() {
    // replace with custom code
    this.renderFirst();
  }

  renderNPITimeline() {
    let googleChart = new google.visualization.Timeline(
      document.getElementById(this.npiDomNode)
    );
    let dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "Term" });
    dataTable.addColumn({ type: "string", id: "Name" });
    dataTable.addColumn({ type: "date", id: "Start" });
    dataTable.addColumn({ type: "date", id: "End" });
    let timetableDate = [];
    let labels = [];
    this.dataNpi.npis.forEach((npi, index) => {
      if (npi && index !== 0) {
        labels.push(npi[0]);
      }
    });

    labels.forEach((label, index) => {
      let fromD = this.dataNpi.npis[index + 1][1];
      let toD = this.dataNpi.npis[index + 1][2];
      console.log(fromD, toD, parseDate(fromD),parseDate(toD) )
      dataTable.addRows([
        [String(index + 1), label, parseDate(fromD), parseDate(toD)],
      ]);
    });
   
    dataTable.addRows([
      [
        "all",
        "All NPIs",
        new Date(parseDate(this.dataNpi.dates[0])),
        new Date(parseDate(this.dataNpi.dates[this.dataNpi.dates.length - 1])),
      ],
    ]);

    googleChart.draw(dataTable);
  }
}

function parseDate(csvDate) {
  csvDate = csvDate.split(".");
  return new Date(Number(csvDate[2]), csvDate[1] - 1, csvDate[0]);
}

function loadSpreadsheets() {
  let spreadsheets = {};
  return new Promise((resolve, reject) => {
    loadSpreadsheet(DATA_URL).then((data) => {
      spreadsheets.data = data;
      loadSpreadsheet(DATA_URL_NPI).then((dataNpi) => {
        spreadsheets.dataNpi = dataNpi;
        resolve(spreadsheets);
      });
    });
  });
}

function loadSpreadsheet(url) {
  return fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return CSV.parse(data);
    })
    .catch((error) => {
      console.log("error: " + error);
    });
}

function initGoogleCharts(spreadsheets) {
  google.charts.load("current", {
    packages: ["annotatedtimeline", "timeline"],
  });
  google.charts.setOnLoadCallback(() => {
    renderDiagrams(spreadsheets);
  });
}

function renderDiagrams(spreadsheets) {
  let npiData = {
    dates: fetchDatesFromCsv(spreadsheets.data),
    npis: spreadsheets.dataNpi,
  }
  let diagram1 = new Diagram("chart_1", "chart_1_npi",spreadsheets.data, npiData, {type:"first"});
  let diagram2 = new Diagram("chart_2", "chart_2_npi",spreadsheets.data, npiData,{type:"second"})
  let diagram3 = new Diagram("chart_3", "chart_3_npi",spreadsheets.data, npiData,{type:"third"})

 
}

function fetchDatesFromCsv(data) {
  let dates = [];
  data.forEach((d) => {
    if (d[0] && d[0] !== "Date") dates.push(d[0]);
  });
  return dates;
}

function init() {
  loadSpreadsheets().then((spreadsheets) => {
    initGoogleCharts(spreadsheets);

    // responsive on resize window, lets forget about this now
    /*
    window.addEventListener("resize", () => {
      GOOGLE_CHARTS.forEach((chart) => {
        chart.render();
      });
    });
    */
  });
}
document.addEventListener("DOMContentLoaded", () => {
  init();
});
