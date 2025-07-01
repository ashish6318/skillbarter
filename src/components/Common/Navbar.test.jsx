import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { mockUser } from "../../test/utils";
import Navbar from "./Navbar";

// Mock the context hooks
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../context/SocketContext", () => ({
  useSocket: vi.fn(),
}));

// Mock the router hooks
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Mock components
vi.mock("../Notifications/NotificationCenter", () => ({
  default: () => <div data-testid="notification-center">Notifications</div>,
}));

vi.mock("./ThemeToggle", () => ({
  default: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

describe("Navbar Component", () => {
  const mockAuthContextValue = {
    isAuthenticated: true,
    user: mockUser,
    logout: vi.fn(),
  };

  const mockSocketContextValue = {
    isConnected: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue(mockAuthContextValue);
    useSocket.mockReturnValue(mockSocketContextValue);
  });

  it("renders navbar with authenticated user", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("SkillBarter")).toBeInTheDocument();
    expect(screen.getByTestId("notification-center")).toBeInTheDocument();
    expect(screen.getByText(mockUser.firstName)).toBeInTheDocument();
  });

  it("shows navigation links for authenticated users", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("Credits")).toBeInTheDocument();
  });

  it("toggles mobile menu when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const hamburgerButton = screen.getByLabelText("Toggle mobile menu");
    await user.click(hamburgerButton);

    // Mobile menu should be visible
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument();
  });

  it("handles logout when logout button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Open profile dropdown
    const profileButton = screen.getByText(mockUser.firstName);
    await user.click(profileButton);

    // Click logout
    const logoutButton = screen.getByText("Logout");
    await user.click(logoutButton);

    expect(mockAuthContextValue.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders unauthenticated navbar correctly", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("SkillBarter")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});
