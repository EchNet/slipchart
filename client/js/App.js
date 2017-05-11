define([ "chart1", "chart2", "BarChart" ],
  function(chart1, chart2, BarChart) {

	return function() {
    BarChart(chart1);
    BarChart(chart2);
	};
});
