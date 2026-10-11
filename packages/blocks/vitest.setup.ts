import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

expect.extend(toHaveNoViolations);
afterEach(() => cleanup());

// jsdom shims for Radix primitives.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver });
}
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
if (!Element.prototype.hasPointerCapture) Element.prototype.hasPointerCapture = () => false;
if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = () => {};
