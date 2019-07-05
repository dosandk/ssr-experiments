const isClient = typeof window === 'object' && typeof window.document === 'object';

const createButton = () => {
  return {
    _createElement () {
      this.$button = document.createElement('div');

      this.$button.innerText = 'Click me baby!';
      this.$button.classList.add('button');
      this.$button.dataset.hasEvent = "true";

      return this.$button;
    },
    _addEventListeners (element) {
      const currentElement = element || document.querySelector('.button');
      let counter = 0;

      currentElement.addEventListener('click', () => {
        console.error('click', counter++);
      });
    },
    initEventListeners () {
      this._addEventListeners();
    },
    get client () {
      const $element = this._createElement();
      this._addEventListeners($element);
      return this.$button;
    },
    get server () {
      return `<div class="button" data-has-event="true">Click me baby!</div>`;
    }
  };
};

const ssr = {
  render (elementObj, element) {
    console.error('render');
    if (isClient) {
      element.appendChild(elementObj.client);
    }
  },
  hydrate(elementObj) {
    console.error('hydrate');
    if (isClient) {
      elementObj.initEventListeners();
    }
  },
  renderToString (elementObj) {
    console.error('renderToString');
    return elementObj.server;
  }
};

ssr.render(createButton(), document.getElementById('root'));
// ssr.hydrate(createButton());

if (!isClient) {
  module.exports = {
    ssr,
    createButton
  };
}
