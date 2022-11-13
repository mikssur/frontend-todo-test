import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders add todo button", () => {
  render(<App />);
  const toDoButton = screen.getByText(/Add todo/i);
  expect(toDoButton).toBeInTheDocument();
});
