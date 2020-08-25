
class Gradient {
  constructor(){
    this.gradient = document.querySelector('.gradient-container');
    this.sliders = document.querySelectorAll('.sliders');
    this.slidersInputs = document.querySelectorAll('.sliders input');
    this.angleInputs = document.querySelector('.slider-angle input');
    this.angleValue = document.querySelector('#angle-value');
    this.style = this.gradient.style;
    this.initialColors = [];
    this.colorStop = [0, 100];
    this.angle = '';
    this.buttons = document.querySelectorAll('.button button');
    this.gradientStyle = document.querySelector('#gradient-style');
    this.background = document.querySelector('.background');
  }

  init() {
    this.slidersInputs.forEach(s => {
      s.addEventListener('input', this.setControls.bind(this));
    });
    this.buttons.forEach(b => {
      b.addEventListener('click', this.randomColor.bind(this));
    });
    this.angleInputs.addEventListener('input', this.angleControl.bind(this));

    this.randomColors();
    this.angle = `${this.angleInputs.value}deg`;
    this.angleValue.textContent = this.angle;
    this.createGradient();
    
    
  }
  createGradient() {
    this.style.background = `linear-gradient(${this.angle}, ${this.initialColors[0]}  ${this.colorStop[0]}%, ${this.initialColors[1]} ${this.colorStop[1]}%)`;
    this.background.style.background = `linear-gradient(${this.angle}, ${this.initialColors[0]}  ${this.colorStop[0]}%, ${this.initialColors[1]} ${this.colorStop[1]}%)`;
    this.gradientStyle.textContent = this.style.background;
    
  }
  generateHex() {
    const hexColor = chroma.random();
    return hexColor;
  }
  randomColor(e) {
    const index = e.target.dataset.random;
    const randomColor = this.generateHex();
    this.initialColors[index] = chroma(randomColor).hex();
    const sliders = this.sliders[index].querySelectorAll('.sliders input');
    this.hslInputs(randomColor, sliders);
    this.resetInputs();
    this.createGradient();
  }
  randomColors() {
    this.initialColors = [];
    this.sliders.forEach((s, i) => {
      const randomColor = this.generateHex();
      this.initialColors.push(chroma(randomColor).hex());
      const sliders = s.querySelectorAll('.sliders input');
      this.hslInputs(randomColor, sliders);
    });
    this.resetInputs();
  }
  hslInputs(randomColor, sliders) {
    const color = chroma(randomColor);
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    this.colorizeSliders(color, hue, brightness, saturation);
  }
  colorizeSliders(color, hue, brightness, saturation) {
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color,fullSat]);
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, 
      rgb(204, 75, 75),
      rgb(204, 204, 75), 
      rgb(75, 204, 75), 
      rgb(75, 204, 204), 
      rgb(75, 75, 204), 
      rgb(204, 75, 204), 
      rgb(204, 75, 75))`;
  }
  resetInputs() {
    this.slidersInputs.forEach(s => {
      if (s.name === 'hue') {
        const hueColor = this.initialColors[s.dataset.hue];
        const hueValue = chroma(hueColor).hsl()[0];
        s.value = Math.floor(hueValue);
      }
      if (s.name === 'brightness') {
        const brightColor = this.initialColors[s.dataset.bright];
        const brightValue = chroma(brightColor).hsl()[2];
        s.value = Math.floor(brightValue * 100) / 100;
      }
      if (s.name === 'saturation') {
        const satColor = this.initialColors[s.dataset.sat];
        const satValue = chroma(satColor).hsl()[1];
        s.value = Math.floor(satValue * 100) / 100;
      }
    });
  }
  setControls(e) {
    const index = e.target.dataset.bright || e.target.dataset.hue || e.target.dataset.sat;
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const bright = sliders[1];
    const sat = sliders[2];
    const stop = sliders[3];
    let bgColor = this.initialColors[index];
    let color = chroma(bgColor)
      .set('hsl.s', sat.value)
      .set('hsl.l', bright.value)
      .set('hsl.h', hue.value);
    this.initialColors[index] = color.hex();
    this.colorStop[index] = stop.value;
    this.createGradient();
    this.colorizeSliders(color, hue, bright, sat);
  }
  angleControl(e) {
    this.angle = `${e.target.value}deg`;
    this.angleValue.textContent = this.angle;
    this.createGradient();
  }
}

const g = new Gradient()
g.init()

