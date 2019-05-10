(() => {
  const global = this;

  class Canvas {
    constructor(canvasElement) {
      this._canvasElement = canvasElement;
      this._ctx = canvasElement.getContext('2d');
    }

    clear() {
      this._ctx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    drawRect(x, y, width, height, style) {
      this._ctx.save();
      this._ctx.strokeStyle = style;
      this._ctx.strokeRect(x, y, width, height);
      this._ctx.restore();
    }

    fillRect(x, y, width, height, style) {
      this._ctx.save();
      this._ctx.fillStyle = style;
      this._ctx.fillRect(x, y, width, height);
      this._ctx.restore();
    }
  }

  class Game {
    constructor(config = {}) {
      const {
        el,
        canvasWidth = 600,
        canvasHeight = 480,
        data = {},
        loop = function() { },
      } = config;

      this._canvasElement = document.createElement('canvas');
      this._canvasElement.width = canvasWidth;
      this._canvasElement.height = canvasHeight;
      this._canvasElement.tabIndex = 0;
      this._canvasElement.style.outline = 'none';
      this._canvas = new Canvas(this._canvasElement);

      this._data = data;
      this._loop = loop.bind(this);

      this._keys = new Set();
      this._canvasElement.addEventListener('keydown', e => {
        this._keys.add(e.key);
      });
      this._canvasElement.addEventListener('keyup', e => {
        this._keys.delete(e.key);
      });

      this._mouse = { pressed: false, x: 0, y: 0 };
      this._canvasElement.addEventListener('pointerdown', e => {
        this._mouse.pressed = true;
        this._canvasElement.setPointerCapture(e.pointerId);
      });
      this._canvasElement.addEventListener('pointerup', e => {
        this._mouse.pressed = false;
        this._canvasElement.releasePointerCapture(e.pointerId);
      });
      this._canvasElement.addEventListener('pointermove', e => {
        this._mouse.x = Math.min(this._canvasElement.width, Math.max(0, e.offsetX));
        this._mouse.y = Math.min(this._canvasElement.height, Math.max(0, e.offsetY));
      });

      if (el) {
        this.mount(el);
      }
    }

    get width() {
      return this._canvasElement.width;
    }

    get height() {
      return this._canvasElement.height;
    }

    get keys() {
      return this._keys;
    }

    get mouse() {
      return this._mouse;
    }

    get canvas() {
      return this._canvas;
    }

    mount(el) {
      let elem;
      if (typeof el === 'string') {
        elem = document.querySelector(el);
      } else {
        elem = el;
      }
      elem.replaceWith(this._canvasElement);
    }

    run() {
      let previousTick = undefined;
      const wrappedLoop = t => {
        if (previousTick !== undefined) {
          this._loop(t / 1000, (t - previousTick) / 1000);
        }
        previousTick = t;
        requestAnimationFrame(wrappedLoop);
      };
      requestAnimationFrame(wrappedLoop);
    }
  }

  global.Game = Game;
})();
