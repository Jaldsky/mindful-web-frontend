import '@testing-library/jest-dom';

// Recharts (ResponsiveContainer) relies on ResizeObserver in JSDOM.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver ?? ResizeObserverMock;

// IntersectionObserver is used by infinite scroll table.
class IntersectionObserverMock {
  root: Element | Document | null = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ?? IntersectionObserverMock;
