define([], function() {

  var ZERO = 700;

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
		config: {
      width: 1600,
      height: 1000, 
      left: 100,
      right: 100,
      top: 100,
      bottom: 100,
      zero: ZERO,
      horizontalGridLines: [
        {
          y: 100,
          style: "dashed",
          label: " 60"
        },
        {
          y: 200,
          style: "dashed",
          label: " 50"
        },
        {
          y: 300,
          style: "dashed",
          label: " 40"
        },
        {
          y: 400,
          style: "dashed",
          label: " 30"
        },
        {
          y: 500,
          style: "dashed",
          label: " 20"
        },
        {
          y: 600,
          style: "dashed",
          label: " 10"
        },
        {
          y: 700,
          style: "solid",
          label: "  0"
        },
        {
          y: 800,
          style: "dashed",
          label: "-10"
        },
        {
          y: 900,
          style: "dashed",
          label: "-20"
        }
      ],
      verticalGridLines: [
        {
          x: 100,
          style: "solid"
        }
      ],
      barWidth: 120,
      metrics: [
        {
          fillStyle: "rgba(0,0,90,0.7)",
          label: " Web",
          x: 250,
          f: newStepFunction([ 320, 260, 320, 360, 370, 350, 340, 330, 330, 320, 310, 250, 201, 325, 400 ])
        },
        {
          fillStyle: "rgba(120,40,20,0.7)",
          label: "Email",
          x: 475,
          f: newLinearFunction(850, 130)
        },
        {
          fillStyle: "rgba(30,120,100,0.7)",
          label: "Reports",
          x: 700,
          f: newStepFunction([
            newLinearFunction(680, 690, 0, 20),
            newLinearFunction(690, 744, 20, 40),
            newLinearFunction(744, 573, 40, 60),
            newLinearFunction(573, 377, 60, 80),
            newLinearFunction(377, 460, 80, 100) ])
        },
        {
          fillStyle: "rgba(0,0,90,0.7)",
          label: "Logging",
          x: 925,
          f: newStepFunction([ newLinearFunction(910, 400, 0, 50), newLinearFunction(400, 300, 50, 100) ])
        },
        {
          fillStyle: "rgba(120,40,20,0.7)",
          label: "Crunch",
          x: 1150,
          f: newStepFunction([
            newLinearFunction(710, 815, 0, 33),
            newLinearFunction(815, 521, 33, 67),
            newLinearFunction(521, 477, 67, 100) ])
        },
        {
          fillStyle: "rgba(30,120,100,0.7)",
          label: "Munch",
          x: 1375,
          f: newLinearFunction(550, 720)
        }
      ]
		},

		data: {}
	}
})
