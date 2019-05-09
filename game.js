(() => {
  const global = this;

  class Canvas {
    constructor(ctx) {
      this._ctx = ctx;
      this._width = ctx.canvas.width;
      this._height = ctx.canvas.height;
    }

    clear() {
      this._ctx.clearRect(0, 0, this._width, this._height);
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
        loop = () => {},
      } = config;

      this._canvasElem = document.createElement('canvas');
      this._canvasElem.width = canvasWidth;
      this._canvasElem.height = canvasHeight;
      this._canvasElem.tabIndex = 0;
      // this._canvasElem.style.outline = 'none';
      this._ctx = this._canvasElem.getContext('2d');
      this._canvas = new Canvas(this._ctx);

      this._loop = loop.bind(this);

      this._pressedKeys = new Set();
      this._canvasElem.addEventListener('keydown', e => {
        this._pressedKeys.add(e.key);
      });
      this._canvasElem.addEventListener('keyup', e => {
        this._pressedKeys.delete(e.key);
      });

      this._mousePos = {x: 0, y: 0};
      this._isMousePressed = false;
      this._canvasElem.addEventListener('pointerdown', e => {
        this._isMousePressed = true;
        this._canvasElem.setPointerCapture(e.pointerId);
      });
      this._canvasElem.addEventListener('pointerup', e => {
        this._isMousePressed = false;
        this._canvasElem.releasePointerCapture(e.pointerId);
      });
      this._canvasElem.addEventListener('pointermove', e => {
        this._mousePos.x = Math.min(this._canvasElem.width, Math.max(0, e.offsetX));
        this._mousePos.y = Math.min(this._canvasElem.height, Math.max(0, e.offsetY));
      });

      if (el) {
        this.mount(el);
      }
    }

    get pressedKeys() {
      return this._pressedKeys;
    }

    get isMousePressed() {
      return this._isMousePressed;
    }

    get mousePos() {
      return this._mousePos;
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
      elem.replaceWith(this._canvasElem);
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
