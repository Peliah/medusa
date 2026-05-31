import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import * as React from "react"
import { afterEach, beforeEach, vi } from "vitest"

function createStorage() {
  let store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear() {
      store = new Map()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    },
    removeItem(key: string) {
      store.delete(key)
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
  }
}

const localStorageMock = createStorage()

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  configurable: true,
})

Object.defineProperty(globalThis, "ResizeObserver", {
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  configurable: true,
})

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock("framer-motion", () => {
  const createMockComponent = (tag: string) => {
    const Mock = React.forwardRef<
      HTMLElement,
      React.HTMLAttributes<HTMLElement> & Record<string, unknown>
    >(({ children, ...props }, ref) =>
      React.createElement(tag, { ...props, ref }, children as React.ReactNode)
    )
    Mock.displayName = `motion.${tag}`
    return Mock
  }

  return {
    motion: new Proxy(
      {},
      {
        get: (_target, property) => createMockComponent(String(property)),
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    LayoutGroup: ({ children }: { children: React.ReactNode }) => children,
  }
})

beforeEach(() => {
  localStorageMock.clear()
})

afterEach(() => {
  cleanup()
  localStorageMock.clear()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
