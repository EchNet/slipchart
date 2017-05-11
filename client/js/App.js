define([ "hexxdata", "base" ],
  function(hexxdata) {

	var config = hexxdata.config;

	function withElement(id, func) {
		return func(document.getElementById(id));
	}

	function withContext(canvas, func) {
		if (typeof canvas == "string") {
			canvas = document.getElementById(canvas);
		}
		return func(canvas.getContext("2d"), canvas);
	}

	function clearCanvas(canvas) {
		withContext(canvas, function(context, canvas) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		});
	}

	function init() {

		function renderCanvasContents(z) {
      var strokeStyle = "rgba(0,0,0,1)";
			withContext("drawing-canvas", function(context, canvas) {
				clearCanvas(canvas);
        context.save();
        context.strokeStyle = strokeStyle;
        context.lineWidth = 1;
        config.horizontalGridLines.forEach(function(gridLine) {
          context.save();
          switch (gridLine.style) {
          case "dashed":
            context.setLineDash([ 14, 9 ]);
            break;
          }
          context.beginPath();
          context.moveTo(config.left - 4, gridLine.y);
          context.lineTo(canvas.width - config.right, gridLine.y);
          context.stroke();
          context.closePath();
          context.restore();
          if (gridLine.label) {
            context.save();
            context.font = "24px Courier";
            context.fillText(gridLine.label, config.left - 50, gridLine.y + 8);
            context.restore();
          }
        });
        config.verticalGridLines.forEach(function(gridLine) {
          context.save();
          context.beginPath();
          context.moveTo(gridLine.x, config.top);
          context.lineTo(gridLine.x, canvas.height - config.bottom);
          context.stroke();
          context.closePath();
          context.restore();
        });
        context.restore();
        config.metrics.forEach(function(metric) {
          context.save();
          context.beginPath();
          context.fillStyle = metric.fillStyle;
          y = metric.f(z);
          y0 = Math.min(y, config.zero);
          y1 = Math.max(y, config.zero);
          context.fillRect(metric.x - config.barWidth / 2, y0, config.barWidth, y1 - y0);
          context.closePath();
          context.restore();
          if (metric.label) {
            context.save();
            context.font = "24px Courier";
            context.fillText(metric.label, metric.x - 40, canvas.height - config.bottom + 25);
            context.restore();
          }
        });
      });
		}

    function createDrawingCanvas() {
			var drawingCanvas = document.createElement("canvas");
			drawingCanvas.id = "drawing-canvas";
			drawingCanvas.className = "drawing";
			drawingCanvas.width = config.width;
			drawingCanvas.height = config.height;
      return drawingCanvas;
    }

    function createDateDisplay() {
      var dateDisplay = document.createElement("div");
      dateDisplay.id = "date-display";
      return dateDisplay;
    }

    function renderDate(z) {
      var date = new Date();
      date.setDate(date.getDate() - (100 - z));
      var str = date.toString().split(/ /).slice(0, 4).join(' ');
      withElement("date-display", function(dateDisplay) {
        while (dateDisplay.firstChild) {
          dateDisplay.removeChild(dateDisplay.firstChild);
        }
        dateDisplay.appendChild(document.createTextNode(str));
      });
    }

    function render(z) {
      renderDate(z);
      renderCanvasContents(z);
    }

    function createSlider() {
      var slider = document.createElement("input");
      slider.id = "slider";
      slider.type = "range";
      slider.value = 100;
      slider.addEventListener("input", function() {
        render(slider.value);
      }, false);
      slider.addEventListener("change", function() {
        render(slider.value);
      }, false);
      return slider;
    }

    function animate(done) {
      withElement("slider", function(slider) {
        slider.value = 0;
        var interval = setInterval(function() {
          var newValue = Math.min(100, parseInt(slider.value) + 1);
          slider.value = newValue;
          render(newValue);
          if (newValue >= 100) {
            clearInterval(interval);
            done();
          }
        }, 50);
      });
    }

    function createButtonBar() {
      var div = document.createElement("div");
      var playButton = document.createElement("button");
      playButton.appendChild(document.createTextNode("Play"));
      playButton.addEventListener("click", function() {
        playButton.disabled = true;
        animate(function() {
          playButton.disabled = false;
        });
      });
      div.appendChild(playButton);
      return div;
    }

		withElement("canvas", function(container) {
      container.appendChild(createDrawingCanvas());
			withElement("toolbar", function(div) {
        div.appendChild(createDateDisplay());
        div.appendChild(createSlider());
        div.appendChild(createButtonBar());
      });
		});
    render(100);
	}

	function open() {
    init();
	}

	return function() {
		this.open = open;
	};
});
