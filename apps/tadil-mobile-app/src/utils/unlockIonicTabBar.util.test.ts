/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { unlockIonicTabBar } from "./unlockIonicTabBar.util";

describe("unlockIonicTabBar", () => {
  it("clears Ionic's keyboard-hidden state on the tab bar", () => {
    const tabBar = document.createElement("ion-tab-bar");
    tabBar.classList.add("tab-bar-hidden");
    tabBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(tabBar);

    unlockIonicTabBar();

    expect(tabBar.classList.contains("tab-bar-hidden")).toBe(false);
    expect(tabBar.hasAttribute("aria-hidden")).toBe(false);

    tabBar.remove();
  });
});
