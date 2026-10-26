window.handleNewsletterSubmit = function (event) {
  event.preventDefault();
  const email = event.target.email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    window.alert("Please enter a valid email address.");
    return;
  }

  window.alert("Thank you for subscribing! You will receive updates about scholarship opportunities.");
  event.target.reset();
};

document.addEventListener("click", function (event) {
  const backToTopLink = event.target.closest(".nsmas-footer__back-top a");
  if (!backToTopLink) return;

  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
