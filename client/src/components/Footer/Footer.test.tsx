import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

test("renders footer with links and social icons", () => {
  render(<Footer />);

  expect(screen.getByText(/© 2025 furlink/i)).toBeInTheDocument();
  expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
  expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  expect(screen.getByText(/facebook/i)).toBeInTheDocument();
  expect(screen.getByText(/instagram/i)).toBeInTheDocument();
  expect(screen.getByText(/email/i)).toBeInTheDocument();
});
