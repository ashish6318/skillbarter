import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock environment variables
vi.mock("../config/env", () => ({
  API_BASE_URL: "http://localhost:5000/api",
  SOCKET_URL: "http://localhost:5000",
}));

// Mock React Router
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn(() => ({ pathname: "/" }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
    BrowserRouter: ({ children }) => children,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: true,
    disconnect: vi.fn(),
  })),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock Heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  HomeIcon: () => <svg data-testid="home-icon" />,
  MagnifyingGlassIcon: () => <svg data-testid="search-icon" />,
  ChatBubbleLeftRightIcon: () => <svg data-testid="chat-icon" />,
  CalendarDaysIcon: () => <svg data-testid="calendar-icon" />,
  CreditCardIcon: () => <svg data-testid="credit-icon" />,
  UserCircleIcon: () => <svg data-testid="user-icon" />,
  ArrowRightOnRectangleIcon: () => <svg data-testid="logout-icon" />,
  Bars3Icon: () => <svg data-testid="menu-icon" />,
  XMarkIcon: () => <svg data-testid="close-icon" />,
  ChevronDownIcon: () => <svg data-testid="chevron-down-icon" />,
  PencilIcon: () => <svg data-testid="pencil-icon" />,
  TrashIcon: () => <svg data-testid="trash-icon" />,
  PlusIcon: () => <svg data-testid="plus-icon" />,
  StarIcon: () => <svg data-testid="star-icon" />,
}));

// Mock global fetch
globalThis.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("localStorage", localStorageMock);

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("sessionStorage", sessionStorageMock);

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  sessionStorageMock.getItem.mockReturnValue(null);
});
