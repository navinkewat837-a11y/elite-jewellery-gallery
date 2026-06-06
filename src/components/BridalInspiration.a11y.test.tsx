import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect, test, beforeAll, vi } from "vitest";

vi.mock("@/assets/bridal-lehenga.jpg.asset.json", () => ({
  default: { url: "/test-lehenga.jpg" },
}));
vi.mock("@/assets/bridal-inspiration.mp4.asset.json", () => ({
  default: { url: "/test-bridal.mp4" },
}));

beforeAll(() => {
  expect.extend(toHaveNoViolations);
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: () => Promise.resolve(),
  });
});

test("BridalInspiration has no detectable a11y violations", async () => {
  const { BridalInspiration } = await import("./BridalInspiration");
  const { container } = render(<BridalInspiration />);
  const results = await axe(container, {
    rules: { region: { enabled: false } },
  });
  expect(results).toHaveNoViolations();
});

test("Bridal cards expose accessible names, roles, and keyboard support", async () => {
  const { BridalInspiration } = await import("./BridalInspiration");
  const { getAllByRole } = render(<BridalInspiration />);
  const cards = getAllByRole("button");
  expect(cards).toHaveLength(2);
  for (const card of cards) {
    expect(card).toHaveAttribute("aria-label");
    expect(card).toHaveAttribute("tabindex", "0");
    expect(card.getAttribute("aria-labelledby")).toBeTruthy();
    expect(card.getAttribute("aria-describedby")).toBeTruthy();
  }
});