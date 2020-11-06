function main(analyser) {

  this.canvasId = "music-canvas";
  this.settings = require('./settings.json');

  //Build and append the canvas
  this.buildCanvas = function () {

    this.canvas = !document.getElementById(this.canvasId) ? document.createElement("canvas") : document.getElementById(this.canvasId);
    this.canvas2D = this.canvas.getContext("2d");
    this.canvas.style.cssText = "position:fixed;z-index:999999;pointer-events: none;display:block;width:100%;bottom:1px;";
    this.canvas.setAttribute("id", this.canvasId)
    this.canvas.setAttribute("width", String(window.innerWidth));
    this.canvas.setAttribute("height", String(window.innerHeight));
    document.body.appendChild(this.canvas);
    this.barWidth2 = this.canvas.width / this.settings.barCount;
  }

  this.buildCanvas();

  this.capYPositionArray = [];
  this.capHeight = this.settings.capHeight;
  this.meterStep = this.settings.meterStep;


  this.array = new Uint8Array(analyser.frequencyBinCount);
  analyser.fftSize = this.settings.analyzerSettings.fftSize;
  analyser.minDecibels = this.settings.analyzerSettings.minDecibels;
  analyser.maxDecibels = this.settings.analyzerSettings.maxDecibels;
  this.analyser = analyser;

  this.randomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
  }
  this.render = function () {
    var l = this.canvas2D.createLinearGradient(0, 75, 0, this.canvas.height);
    if (!this.settings.randomColorOnStartup) {
      l.addColorStop(1, this.settings.bottom);
      l.addColorStop(.7, this.settings.middle);
      l.addColorStop(0.5, this.settings.top);
    }
    else {
      l.addColorStop(1, `rgb(${this.randomNumber(10, 200)},${this.randomNumber(10, 200)},${this.randomNumber(10, 200)})`);
      l.addColorStop(0.2, `rgb(${this.randomNumber(10, 200)},${this.randomNumber(10, 200)},${this.randomNumber(10, 200)})`);
      l.addColorStop(0.5, `rgb(${this.randomNumber(10, 200)},${this.randomNumber(10, 200)},${this.randomNumber(10, 200)})`);
    }

    this.canvas2D.fillStyle = l;
    this.canvas2D.globalAlpha = this.settings.opacity;
    this.canvas.style.height = window.innerHeight * (this.settings.barHeight / 100) + "px";
    this.barWidth2 = this.canvas.width / this.settings.barCount;
  }
  this.render();


  this.drawRect = function (x, y, h) {
    y = this.canvas.height - y * this.canvas.height / 255;
    this.canvas2D.fillRect(x * (this.barWidth2 + this.meterStep), y, this.barWidth2 - this.meterStep, h);
  }

  this.start = function () {
    this.analyser.getByteFrequencyData(this.array);
    this.canvas2D.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var j = 0;
    for (; j < this.settings.barCount; j++) {
      if (this.settings.capsEnabled) {
        this.drawCaps(j);
      }
      this.drawRect(j, this.array[j], this.canvas.height);
    }
    main.call = requestAnimationFrame(this.start.bind(this));
  }
  this.drawCaps = function (i) {
    if (this.array[i] < this.capYPositionArray[i]) {
      this.drawRect(i, --this.capYPositionArray[i], this.capHeight);
    } else {
      this.drawRect(i, this.canvas.height, this.capHeight);
      this.capYPositionArray[i] = this.array[i];
    }
  }
  this.stop = function (allowFailure) {
    this.canvas2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
    cancelAnimationFrame(main.call);
  }

}