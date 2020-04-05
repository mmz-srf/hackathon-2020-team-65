const DATA_URL =
  "https://docs.google.com/spreadsheets/d/1e774_OM0UWGInE252RC28uON9EgBK9CeFHucRi8CC4s/export?format=csv";

const DATA_URL_NPI =
  "https://docs.google.com/spreadsheets/d/1k4ajXFkkzY4zyVsJYXxTdGHwoiH-lBl7NLoLUObwhD8/export?format=csv";

const DEFAULT_NPI_OPTIONS = [];

class Diagram {
  constructor(
    domNode,
    npiDomNode,
    npiSelectDomNode,
    data,
    dataNpi,
    options = {}
  ) {
    this.domNode = domNode;
    this.npiDomNode = npiDomNode;
    this.npiDomSelectNode = npiSelectDomNode;
    this.data = data;
    this.dataNpi = dataNpi;
    this.selectedOptions = DEFAULT_NPI_OPTIONS;

    this.type = options && options.type ? options.type : "first";
    this.render();
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
    //Assumed daily cases
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "Daily confirmed new cases");
    data.addColumn("number", "Assumed daily cases");
    data.addColumn("number", "Daily fatalities");
    data.addColumn("string", "title1");
    var totdays = this.data.length;

    for (let day = 1; day < totdays; day++) {
      var res = this.data[day][0].split(".");
      //console.log("dates " + this.data[day][1]);

      data.addRows([
        [
          new Date(Number(res[2]), res[1] - 1, res[0]),
          Number(this.data[day][1]),
          Number(this.data[day][3]),
          Number(this.data[day][2]),
          undefined,
        ],
      ]);
    }

    let googleChart = new google.visualization.AnnotatedTimeLine(
      document.getElementById(this.domNode)
    );
    googleChart.draw(data, {
      title: " ",
      displayAnnotations: true,
      displayZoomButtons: false,
    });
  }

  renderSecond() {
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "Unemployment");
    data.addColumn("string", "title1");
    var totdays = this.data.length;
    for (let day = 1; day < totdays; day++) {
      var res = this.data[day][0].split(".");
      //console.log("dates " + this.data[day][1]);

      data.addRows([
        [
          new Date(Number(res[2]), res[1] - 1, res[0]),
          Number(this.data[day][5]),
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
      displayZoomButtons: false,
    });
  }

  renderThird() {
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "Electricity");
    data.addColumn("string", "title1");
    var totdays = this.data.length;

    for (let day = 1; day < totdays; day++) {
      var res = this.data[day][0].split(".");
      //console.log("dates " + this.data[day][1]);

      data.addRows([
        [
          new Date(Number(res[2]), res[1] - 1, res[0]),
          Number(this.data[day][6]),
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
      displayZoomButtons: false,
    });
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
    let allLabels = [];
    this.dataNpi.npis.forEach((npi, index) => {
      if (npi && index !== 0) {
        labels.push(npi[0]);
      }
    });

    this.renderNpiSelect(labels);

    labels.forEach((label, index) => {
      if (this.selectedOptions.includes(index)) {
        let fromD = this.dataNpi.npis[index + 1][1];
        let toD = this.dataNpi.npis[index + 1][2];
        dataTable.addRows([
          [String(index + 1), label, parseDate(fromD), parseDate(toD)],
        ]);
      }
    });

   

    dataTable.addRows([
      [
        "all",
        "Indicator Values Timeframe",
        new Date(parseDate(this.dataNpi.dates[0])),
        new Date(parseDate(this.dataNpi.dates[this.dataNpi.dates.length - 1])),
      ],
    ]);
    var options = {
      // colors: colors,
      timeline: { showBarLabels: true, enableInteractivity: false },
    };
    googleChart.draw(dataTable, options);
  }

  renderNpiSelect(labels) {
    let $node = $(this.npiDomSelectNode);

    labels.forEach((label, index) => {
      let isSelected = this.selectedOptions.includes(index);
      $node.append("<option "+ (isSelected ? 'selected': '') + "value=" + index + ">" + label + "</option>");
    });
    let select2 = $node.select2({
      placeholder: "Select non pharmaceutical interventions",
    });
    select2.off("change");
    select2.on("change", (e) => {
      this.selectedOptions = [];
      let selected = $node.find(":selected");
      selected.each((i, s) => {
        this.selectedOptions.push(Number(s.value));
      });
      
      this.renderNPITimeline();
    });
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
  };
  let diagram1 = new Diagram(
    "chart_1",
    "chart_1_npi",
    "#npi_multi_select1",
    spreadsheets.data,
    npiData,
    { type: "first" }
  );
  let diagram2 = new Diagram(
    "chart_2",
    "chart_2_npi",
    "#npi_multi_select2",
    spreadsheets.data,
    npiData,
    { type: "second" }
  );
  let diagram3 = new Diagram(
    "chart_3",
    "chart_3_npi",
    "#npi_multi_select3",
    spreadsheets.data,
    npiData,
    { type: "third" }
  );
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
