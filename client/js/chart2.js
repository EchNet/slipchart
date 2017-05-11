define([], function() {

  var ZERO = 500;

  function zToString(z) {
    return "Day #" + z;
  }

  function newStepFunction(array) {
    return function(z) {
      var entry = array[Math.floor(Math.max(0, Math.min(array.length - 1, (z/100) * array.length)))];
      if (typeof entry == "function") {
        return entry(z);
      }
      return entry;
    }
  }

  function newLinearFunction(y0, y1, z0, z1) {
    if (z0 == null) z0 = 0;
    if (z1 == null) z1 = 100;
    return function(z) {
      return y0 + (y1 - y0) * (z - z0) / (z1 - z0);
    }
  }

	return {
    prefix: "chart2",
    zToString: zToString,
    width: 1400,
    height: 1000, 
    left: 200,
    right: 200,
    top: 100,
    bottom: 100,
    zero: ZERO,
    horizontalGridLines: [
      {
        y: 100,
        style: "dashed",
        label: " 50"
      },
      {
        y: 300,
        style: "dashed",
        label: " 25"
      },
      {
        y: 500,
        style: "solid",
        label: "  0"
      },
      {
        y: 700,
        style: "dashed",
        label: "-25"
      },
      {
        y: 900,
        style: "dashed",
        label: "-50"
      }
    ],
    verticalGridLines: [
      {
        x: 200,
        style: "solid"
      }
    ],
    barWidth: 240,
    metrics: [
      {
        fillStyle: "rgba(100,45,40,0.7)",
        label: "Boston",
        x: 350,
        f: newStepFunction([ 220, 260, 320, 360, 370, 150, 340, 330, 230, 320, 310, 250, 201, 325, 400 ])
      },
      {
        fillStyle: "rgba(100,45,40,0.7)",
        label: "Rome",
        x: 700,
        f: newStepFunction([
          newLinearFunction(780, 690, 0, 20),
          newLinearFunction(690, 144, 20, 40),
          newLinearFunction(144, 573, 40, 60),
          newLinearFunction(573, 377, 60, 80),
          newLinearFunction(377, 460, 80, 100) ])
      },
      {
        fillStyle: "rgba(100,45,40,0.7)",
        label: "Lincoln",
        x: 1050,
        f: newStepFunction([
          newLinearFunction(710, 815, 0, 33),
          newLinearFunction(815, 521, 33, 67),
          newLinearFunction(521, 477, 67, 100) ])
      }
    ]
	}
})
