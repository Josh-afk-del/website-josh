/* Email capture for The Off Switch guide.
 * Subscribes to the shared Kit form, then reveals the download immediately
 * so the value lands before the email does.
 */
(function () {
  const form = document.querySelector("[data-capture-form]");
  const success = document.querySelector("[data-capture-success]");
  const errorEl = document.querySelector("[data-capture-error]");
  if (!form || !success) return;

  function track(event, props) {
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(event, props);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const firstName = (fd.get("firstName") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const consent = fd.get("consent") === "on";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!firstName || !emailOk || !consent) {
      if (errorEl) errorEl.textContent = "Add your first name and a valid email, and tick the box.";
      return;
    }
    if (errorEl) errorEl.textContent = "";

    if (window.kitSubscribe) {
      window.kitSubscribe({ email, firstName, source: "off-switch" });
    }
    track("off_switch_captured");

    const nameSlot = success.querySelector("[data-success-name]");
    if (nameSlot) nameSlot.textContent = firstName;
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
