(() => {
  const global = this;

  class Game {
    constructor(config = {}) {
      const {
        el,
        canvasWidth = 600,
        canvasHeight = 480,
        loop = () => {},
      } = config;

      this.canvas = document.createElement('canvas');
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.canvas.tabIndex = 0;
      // this.canvas.style.outline = 'none';
      this.ctx = this.canvas.getContext('2d');

      this.loop = loop.bind(this);

      this.pressedKeys = new Set();
      this.canvas.addEventListener('keydown', e => {
        this.pressedKeys.add(e.key);
      });
      this.canvas.addEventListener('keyup', e => {
        this.pressedKeys.delete(e.key);
      });

      this.mousePos = {x: 0, y: 0};
      this.isMousePressed = false;
      this.canvas.addEventListener('pointerdown', e => {
        this.isMousePressed = true;
        this.canvas.setPointerCapture(e.pointerId);
      });
      this.canvas.addEventListener('pointerup', e => {
        this.isMousePressed = false;
        this.canvas.releasePointerCapture(e.pointerId);
      });
      this.canvas.addEventListener('pointermove', e => {
        this.mousePos.x = Math.min(this.canvas.width, Math.max(0, e.offsetX));
        this.mousePos.y = Math.min(this.canvas.height, Math.max(0, e.offsetY));
      });

      if (el) {
        this.mount(el);
      }
    }

    mount(el) {
      let elem;
      if (typeof el === 'string') {
        elem = document.querySelector(el);
      } else {
        elem = el;
      }
      elem.replaceWith(this.canvas);
    }

    run() {
      let previousTick = undefined;
      const wrappedLoop = t => {
        if (previousTick !== undefined) {
          this.loop(t / 1000, (t - previousTick) / 1000);
        }
        previousTick = t;
        requestAnimationFrame(wrappedLoop);
      };
      requestAnimationFrame(wrappedLoop);
    }
  }

  global.Game = Game;
})();
