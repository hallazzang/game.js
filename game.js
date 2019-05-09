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

      this._canvas = document.createElement('canvas');
      this._canvas.width = canvasWidth;
      this._canvas.height = canvasHeight;
      this._canvas.tabIndex = 0;
      // this._canvas.style.outline = 'none';
      this._ctx = this._canvas.getContext('2d');

      this._loop = loop.bind(this);

      this._pressedKeys = new Set();
      this._canvas.addEventListener('keydown', e => {
        this._pressedKeys.add(e.key);
      });
      this._canvas.addEventListener('keyup', e => {
        this._pressedKeys.delete(e.key);
      });

      this._mousePos = {x: 0, y: 0};
      this._isMousePressed = false;
      this._canvas.addEventListener('pointerdown', e => {
        this._isMousePressed = true;
        this._canvas.setPointerCapture(e.pointerId);
      });
      this._canvas.addEventListener('pointerup', e => {
        this._isMousePressed = false;
        this._canvas.releasePointerCapture(e.pointerId);
      });
      this._canvas.addEventListener('pointermove', e => {
        this._mousePos.x = Math.min(this._canvas.width, Math.max(0, e.offsetX));
        this._mousePos.y = Math.min(this._canvas.height, Math.max(0, e.offsetY));
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

    mount(el) {
      let elem;
      if (typeof el === 'string') {
        elem = document.querySelector(el);
      } else {
        elem = el;
      }
      elem.replaceWith(this._canvas);
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
