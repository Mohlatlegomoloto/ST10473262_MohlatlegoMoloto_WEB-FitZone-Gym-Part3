document.addEventListener("DOMContentLoaded", () => {
  // Responsive navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const opened = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
      menuButton.textContent = opened ? "×" : "☰";
    });
  }

  // Gallery lightbox: select any image with the gallery-image class.
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const largeImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll(".gallery-image").forEach(image => {
      image.addEventListener("click", () => {
        largeImage.src = image.src;
        largeImage.alt = image.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      largeImage.src = "";
    };
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  // Live class search and filtering.
  const classSearch = document.getElementById("classSearch");
  if (classSearch) {
    const classCards = [...document.querySelectorAll(".class-item")];
    const status = document.getElementById("searchStatus");
    classSearch.addEventListener("input", () => {
      const term = classSearch.value.trim().toLowerCase();
      let shown = 0;
      classCards.forEach(card => {
        const matches = card.dataset.search.includes(term) || card.textContent.toLowerCase().includes(term);
        card.hidden = !matches;
        if (matches) shown++;
      });
      status.textContent = `${shown} class${shown === 1 ? "" : "es"} found.`;
    });
  }

  // Enquiry form: validate and provide a response based on the selected plan.
  const enquiryForm = document.getElementById("enquiryForm");
  if (enquiryForm) {
    const params = new URLSearchParams(window.location.search);
    const requestedPlan = params.get("plan");
    if (requestedPlan) {
      const planSelect = document.getElementById("enqPlan");
      if (planSelect && [...planSelect.options].some(option => option.value.toLowerCase() === requestedPlan.toLowerCase())) {
        planSelect.value = requestedPlan[0].toUpperCase() + requestedPlan.slice(1).toLowerCase();
      }
    }
    enquiryForm.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = document.getElementById("enquiryFeedback");
      if (!enquiryForm.checkValidity()) {
        enquiryForm.reportValidity();
        feedback.textContent = "Please correct the highlighted fields and try again.";
        feedback.className = "form-status error";
        return;
      }
      const data = new FormData(enquiryForm);
      const prices = {Basic: "R299 per month", Standard: "R499 per month", Premium: "R799 per month"};
      const plan = data.get("plan");
      let response = `Thank you, ${data.get("name")}. Your ${data.get("type").toLowerCase()} enquiry has been received on this page.`;
      if (plan) response += ` You selected the ${plan} Plan (${prices[plan]}). Please contact the gym to confirm current availability and joining details.`;
      else response += " Our team can help you choose a suitable option. Please contact the gym to confirm availability.";
      feedback.textContent = response;
      feedback.className = "form-status success";
      enquiryForm.reset();
    });
  }

  // Contact form prepares an email in the visitor's default email application.
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = document.getElementById("contactFeedback");
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        feedback.textContent = "Please correct the highlighted fields before preparing your email.";
        feedback.className = "form-status error";
        return;
      }
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(`FitZone Gym website: ${data.get("type")}`);
      const body = encodeURIComponent(
        `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "Not supplied"}\nMessage type: ${data.get("type")}\n\nMessage:\n${data.get("message")}`
      );
      feedback.textContent = "Your email application should open with the message prepared. Please review it and press Send. If it does not open, email info@fitzonegym.co.za directly.";
      feedback.className = "form-status success";
      window.location.href = `mailto:info@fitzonegym.co.za?subject=${subject}&body=${body}`;
    });
  }
});
