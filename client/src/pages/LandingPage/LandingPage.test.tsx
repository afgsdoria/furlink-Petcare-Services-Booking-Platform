import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

describe("Landing Page", () => {
  test("renders navbar with logo and buttons", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/furlink/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("renders hero section with book now button", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/link with service providers in just one click/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /book now/i })
    ).toBeInTheDocument();
  });

  test("renders footer with links and social icons", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/© 2025 furlink/i)).toBeInTheDocument();
    expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });
});
