define([ "base" ], function() {

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

	return function(config) {

		function renderChart(z) {
      var strokeStyle = "rgba(0,0,0,1)";
			withContext(config.prefix + "-drawing-canvas", function(context, canvas) {
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
            context.textAlign = "center";
            context.fillText(metric.label, metric.x, canvas.height - config.bottom + 25);
            context.restore();
          }
        });
      });
		}

    function createDrawingCanvas() {
			var drawingCanvas = document.createElement("canvas");
			drawingCanvas.id = config.prefix + "-drawing-canvas";
			drawingCanvas.className = "drawing";
			drawingCanvas.width = config.width;
			drawingCanvas.height = config.height;
      return drawingCanvas;
    }

    function renderDate(z) {
      if (config.zToString) {
        z = config.zToString(z);
      }
			withContext(config.prefix + "-drawing-canvas", function(context, canvas) {
        context.save();
        context.font = "48px Arial";
        context.textAlign = "center";
        context.fillText(z, canvas.width / 2, config.top / 2);
        context.restore();
      });
    }

    function render(z) {
      clearCanvas(config.prefix + "-drawing-canvas");
      renderChart(z);
      renderDate(z);
    }

    function createSlider() {
      var slider = document.createElement("input");
      slider.id = config.prefix + "-slider";
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

    function animate(once, done) {
      var interval;
      var pause = 0;

      function stop() {
        clearInterval(interval);
        done();
      }

      withElement(config.prefix + "-slider", function(slider) {
        if (once || parseInt(slider.value) == 100) {
          slider.value = 0;
          render(0);
        }
      });

      interval = setInterval(function() {
        withElement(config.prefix + "-slider", function(slider) {
          var newValue = 0;
          if (pause > 0) {
            if (--pause > 0) return;
          }
          else {
            newValue = Math.min(100, parseInt(slider.value) + 1);
          }
          slider.value = newValue;
          render(newValue);
          if (newValue == 100) {
            if (once) {
              stop();
            }
            else {
              pause = 15;
            }
          }
        });
      }, 50);

      return { stop: stop }
    }

    function createButtonBar() {
      var div = document.createElement("div");

      var onceButton = document.createElement("button");
      onceButton.appendChild(document.createTextNode("Once Through"));
      var playButton = document.createElement("button");
      playButton.appendChild(document.createTextNode("Play"));
      var stopButton = document.createElement("button");
      stopButton.appendChild(document.createTextNode("Stop"));
      stopButton.disabled = true;

      function enablePlay(enable) {
        onceButton.disabled = !enable;
        playButton.disabled = !enable;
        stopButton.disabled = enable;
      }

      function play(once) {
        enablePlay(false);
        animation = animate(once, function() {
          enablePlay(true);
        });
      }

      var animation;

      onceButton.addEventListener("click", function() {
        play(true);
      });

      playButton.addEventListener("click", function() {
        play();
      });

      stopButton.addEventListener("click", function() {
        animation.stop();
      });

      div.appendChild(onceButton);
      div.appendChild(playButton);
      div.appendChild(stopButton);
      return div;
    }

		withElement(config.prefix + "-canvas", function(container) {
      container.appendChild(createDrawingCanvas());
			withElement(config.prefix + "-toolbar", function(div) {
        div.appendChild(createSlider());
        div.appendChild(createButtonBar());
      });
		});
    render(100);
	}
});
