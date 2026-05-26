const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const modal = document.querySelector("[data-consultation-modal]");
const modalOpenButtons = document.querySelectorAll("[data-consultation-open]");
const modalCloseButtons = document.querySelectorAll("[data-consultation-close]");
let lastFocusedElement = null;

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  header.classList.toggle("nav-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    document.body.classList.remove("nav-open");
    header.classList.remove("nav-active");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const closeConsultationForm = () => {
  if (!modal || modal.hidden) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

const openConsultationForm = (event) => {
  event.preventDefault();

  if (!modal) {
    return;
  }

  lastFocusedElement = event.currentTarget;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  document.body.classList.remove("nav-open");
  header.classList.remove("nav-active");
  navToggle.setAttribute("aria-expanded", "false");

  const firstInput = modal.querySelector("input:not([type='hidden']):not(.form-hidden), select, textarea");
  firstInput?.focus();
};

modalOpenButtons.forEach((button) => {
  button.addEventListener("click", openConsultationForm);
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeConsultationForm);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeConsultationForm();
  }
});
