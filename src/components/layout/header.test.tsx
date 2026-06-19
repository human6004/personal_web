import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/lib/site";
import { Header } from "./header";

const usePathnameMock = vi.hoisted(() => vi.fn(() => "/"));

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock()
}));

describe("Header", () => {
  it("keeps desktop nav and mobile toggle on separate breakpoints", () => {
    render(<Header name="Nhan" />);

    expect(screen.getByRole("navigation", { name: /primary navigation/i })).toHaveClass(
      "hidden",
      "md:flex"
    );
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveClass("md:hidden");
  });

  it("opens the mobile menu and closes it after choosing a link", async () => {
    const user = userEvent.setup();
    render(<Header name="Nhan" />);

    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    const mobileNav = screen.getByRole("navigation", { name: /mobile navigation/i });
    for (const item of siteConfig.navItems) {
      expect(within(mobileNav).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href
      );
    }

    const projectsLink = within(mobileNav).getByRole("link", { name: "Projects" });
    projectsLink.addEventListener("click", (event) => event.preventDefault());

    await user.click(projectsLink);

    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("closes the mobile menu when the route changes", async () => {
    const user = userEvent.setup();
    usePathnameMock.mockReturnValue("/");
    const { rerender } = render(<Header name="Nhan" />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();

    usePathnameMock.mockReturnValue("/blog");
    rerender(<Header name="Nhan" />);

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
    });
  });
});
