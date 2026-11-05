/**
 * Ionic hides `ion-tab-bar` on `keyboardWillShow` (`tab-bar-hidden`).
 * On iPhone the camera picker and some overlays fire that event without a
 * matching hide, so the bar stays gone after we navigate back to a tab page.
 */
export function unlockIonicTabBar() {
  window.dispatchEvent(new CustomEvent("keyboardWillHide"));
  window.dispatchEvent(new CustomEvent("keyboardDidHide"));

  const tabBar = document.querySelector("ion-tab-bar");
  if (!tabBar) return;

  tabBar.classList.remove("tab-bar-hidden");
  tabBar.removeAttribute("aria-hidden");
}
