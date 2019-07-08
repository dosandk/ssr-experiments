const isClient = typeof window === 'object' && typeof window.document === 'object';

const buttonComponent = () => {
  return {
    createElement () {
      this.$button = document.createElement('div');

      this.$button.innerText = 'Click me baby!';
      this.$button.classList.add('button');

      return this.$button;
    },
    initEventListeners (element) {
      const currentElement = element || document.querySelector('.button');
      let counter = 0;

      currentElement.addEventListener('click', () => {
        console.error('click', counter++);
      });
    },
    get client () {
      const $element = this.createElement();

      this.initEventListeners($element);

      return $element;
    },
    get server () {
      return `<div class="button">Click me baby!</div>`;
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

// ssr.render(buttonComponent(), document.getElementById('root'));
ssr.hydrate(buttonComponent());

if (!isClient) {
  module.exports = {
    ssr,
    buttonComponent
  };
}
