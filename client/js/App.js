define([ "config", "BarChart" ],
  function(config, BarChart) {

	function open() {
    BarChart(config);
	}

	return function() {
		this.open = open;
	};
});
