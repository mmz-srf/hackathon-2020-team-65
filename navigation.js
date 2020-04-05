
let firstChart = document.getElementById('first_chart_container');
let secondChart = document.getElementById('second_chart_container');
let thirdChart = document.getElementById('third_chart_container');

let btnChart1 = document.getElementById('btnChart1');
let btnChart2 = document.getElementById('btnChart2');
let btnChart3 = document.getElementById('btnChart3');

btnChart1.addEventListener("click", function(){
    firstChart.style.display = "block";
    secondChart.style.display = "none";
    thirdChart.style.display = "none";
});

btnChart2.addEventListener("click", function(){
    firstChart.style.display = "none";
    secondChart.style.display = "block";
    thirdChart.style.display = "none";
});

btnChart3.addEventListener("click", function(){
    firstChart.style.display = "none";
    secondChart.style.display = "block";
    thirdChart.style.display = "none";
});