const navButtons = document.querySelectorAll(".nav-item");
const cards = document.querySelectorAll(".feature-card");

// This helper keeps the selected nav button and card visually connected.
function setActiveSection(sectionName) {
  navButtons.forEach((button) => {
    const isActive = button.dataset.target === sectionName;
    button.classList.toggle("active", isActive);
  });

  cards.forEach((card) => {
    const isActive = card.dataset.card === sectionName;
    card.classList.toggle("active", isActive);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.target);
  });
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    setActiveSection(card.dataset.card);
  });
});
