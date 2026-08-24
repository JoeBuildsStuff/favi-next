import { afterEach } from "vitest"

afterEach(() => {
  if (typeof localStorage !== "undefined") {
    localStorage.clear()
  }
})

if (typeof window !== "undefined") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver ??= ResizeObserverStub
  window.Element.prototype.hasPointerCapture ??= () => false
  window.Element.prototype.setPointerCapture ??= () => {}
  window.Element.prototype.releasePointerCapture ??= () => {}
  window.Element.prototype.scrollIntoView ??= () => {}
  window.Element.prototype.getAnimations ??= () => []
  window.HTMLElement.prototype.getAnimations ??= () => []
  window.matchMedia ??= ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    })) as typeof window.matchMedia
  URL.createObjectURL ??= () => "blob:test"
  URL.revokeObjectURL ??= () => {}
}
