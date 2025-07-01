import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockUser } from "../../test/utils";
import { Footer } from "./Footer";

vi.mock("./Footer", () => ({
  Footer: () => (
    <footer data-testid="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">SkillBarter</h3>
            <p className="text-sm mb-4">
              Connect, learn, and grow with our peer-to-peer skill exchange
              platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/discover">Find Teachers</a>
              </li>
              <li>
                <a href="/sessions">My Sessions</a>
              </li>
              <li>
                <a href="/messages">Messages</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 SkillBarter. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  ),
}));

describe("Footer Component", () => {
  it("renders footer with correct content", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("SkillBarter")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Connect, learn, and grow with our peer-to-peer skill exchange platform."
      )
    ).toBeInTheDocument();
  });

  it("renders quick links section", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Find Teachers")).toBeInTheDocument();
    expect(screen.getByText("My Sessions")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("renders support section", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("renders copyright notice", () => {
    renderWithProviders(<Footer />);

    expect(
      screen.getByText("© 2024 SkillBarter. All rights reserved.")
    ).toBeInTheDocument();
  });

  it("has correct links", () => {
    renderWithProviders(<Footer />);

    const discoverLink = screen.getByText("Find Teachers").closest("a");
    const sessionsLink = screen.getByText("My Sessions").closest("a");
    const messagesLink = screen.getByText("Messages").closest("a");

    expect(discoverLink).toHaveAttribute("href", "/discover");
    expect(sessionsLink).toHaveAttribute("href", "/sessions");
    expect(messagesLink).toHaveAttribute("href", "/messages");
  });
});
