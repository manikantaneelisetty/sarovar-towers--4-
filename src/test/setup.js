import '@testing-library/jest-dom';

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    this.callback([{ isIntersecting: true, target: element }]);
  }
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver;
global.IntersectionObserver = MockIntersectionObserver;

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver;
global.ResizeObserver = MockResizeObserver;
