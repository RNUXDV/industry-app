const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const saveButtons = document.querySelectorAll(".save-button");
const communityButtons = document.querySelectorAll(".community-button");
const workCard = document.querySelector(".work-card");
const jobsCard = document.querySelector(".jobs-card");
const backHomeButton = document.querySelector("#back-home-button");
const backHomeFromJobsButton = document.querySelector("#back-home-from-jobs");
const workStatus = document.querySelector("#work-status");
const workActionButtons = document.querySelectorAll(".work-action-button");
const saveNoteButton = document.querySelector("#save-note-button");
const noteInput = document.querySelector("#shift-note");
const noteStatus = document.querySelector("#note-status");
const tipInput = document.querySelector("#tip-amount");
const addTipButton = document.querySelector("#add-tip-button");
const tipTotalValue = document.querySelector("#tip-total-value");
const filterButtons = document.querySelectorAll(".filter-button");
const jobCards = document.querySelectorAll(".job-card");
const jobsStatus = document.querySelector("#jobs-status");
const interestButtons = document.querySelectorAll(".interest-button");
let tipTotal = 0;

// Show one section at a time and keep the matching nav button highlighted.
function setActiveSection(sectionName) {
  navButtons.forEach((button) => {
    const isHomeDetail = sectionName === "work" && button.dataset.target === "home";
    const isActive = button.dataset.target === sectionName || isHomeDetail;
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

// Open the Work detail screen from the Home card.
function openWorkSection() {
  setActiveSection("work");
}

function openJobsSection() {
  setActiveSection("jobs");
}

if (workCard) {
  workCard.addEventListener("click", openWorkSection);

  workCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWorkSection();
    }
  });
}

if (backHomeButton) {
  backHomeButton.addEventListener("click", () => {
    setActiveSection("home");
  });
}

if (jobsCard) {
  jobsCard.addEventListener("click", openJobsSection);

  jobsCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openJobsSection();
    }
  });
}

if (backHomeFromJobsButton) {
  backHomeFromJobsButton.addEventListener("click", () => {
    setActiveSection("home");
  });
}

// Toggle save state so testers can tell their tap worked.
saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.classList.toggle("saved");
    button.textContent = isSaved ? "Saved" : "Save";

    if (button.closest(".job-card")) {
      const restaurantName = button
        .closest(".job-card")
        .querySelector("h3").textContent;
      jobsStatus.textContent = isSaved
        ? `${restaurantName} saved.`
        : `${restaurantName} removed from saved jobs.`;
    }
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

// Filter the jobs board by common service role types.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
    });

    jobCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const showCard =
        selectedFilter === "all" || categories.includes(selectedFilter);
      card.classList.toggle("is-hidden", !showCard);
    });

    jobsStatus.textContent =
      selectedFilter === "all"
        ? "Showing all Portland jobs."
        : `Showing ${selectedFilter} jobs.`;
  });
});

// Let a worker mark interest without leaving the prototype.
interestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("sent");
    button.textContent = "Interest sent";

    const restaurantName = button.closest(".job-card").querySelector("h3").textContent;
    jobsStatus.textContent = `Interest sent to ${restaurantName}.`;
  });
});

// Show a simple status message for shift actions.
workActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    workStatus.textContent = button.dataset.statusMessage;
  });
});

// Saving a note only updates the UI for this prototype.
if (saveNoteButton) {
  saveNoteButton.addEventListener("click", () => {
    noteStatus.textContent = "Shift note saved.";
  });
}

// Keep a running total in memory for quick tip tracking.
if (addTipButton) {
  addTipButton.addEventListener("click", () => {
    const tipAmount = Number.parseFloat(tipInput.value);

    if (Number.isNaN(tipAmount) || tipAmount < 0) {
      return;
    }

    tipTotal += tipAmount;
    tipTotalValue.textContent = `$${tipTotal.toFixed(2)}`;
    tipInput.value = "";
  });
}
