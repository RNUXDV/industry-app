const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const saveButtons = document.querySelectorAll(".save-button");
const communityButtons = document.querySelectorAll(".community-button");

// Show one section at a time and keep the matching nav button highlighted.
function setActiveSection(sectionName) {
  navButtons.forEach((button) => {
    const isActive = button.dataset.target === sectionName;
    button.classList.toggle("active", isActive);
  });

  appSections.forEach((section) => {
    const isActive = section.dataset.section === sectionName;
    section.classList.toggle("active", isActive);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.target);
  });
});

// Toggle save state so testers can tell their tap worked.
saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.classList.toggle("saved");
    button.textContent = isSaved ? "Saved" : "Save";
  });
});

// Give community actions a quick confirmation without leaving the page.
communityButtons.forEach((button) => {
  const defaultLabel = button.textContent;

  button.addEventListener("click", () => {
    button.classList.add("is-tapped");
    button.textContent = "Opened";

    window.setTimeout(() => {
      button.classList.remove("is-tapped");
      button.textContent = defaultLabel;
    }, 1200);
  });
});
