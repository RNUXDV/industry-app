const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const saveButtons = document.querySelectorAll(".save-button");
const workCard = document.querySelector(".work-card");
const jobsCard = document.querySelector(".jobs-card");
const openProfileButton = document.querySelector("#open-profile-button");
const backHomeButton = document.querySelector("#back-home-button");
const backHomeFromJobsButton = document.querySelector("#back-home-from-jobs");
const backHomeFromProfileButton = document.querySelector("#back-home-from-profile");
const workStatus = document.querySelector("#work-status");
const workActionButtons = document.querySelectorAll(".work-action-button");
const saveNoteButton = document.querySelector("#save-note-button");
const noteInput = document.querySelector("#shift-note");
const noteStatus = document.querySelector("#note-status");
const tipInput = document.querySelector("#tip-amount");
const addTipButton = document.querySelector("#add-tip-button");
const tipTotalValue = document.querySelector("#tip-total-value");
const filterButtons = document.querySelectorAll(".jobs-toolbar .filter-button");
const jobCards = document.querySelectorAll(".job-card");
const jobsStatus = document.querySelector("#jobs-status");
const interestButtons = document.querySelectorAll(".interest-button");
const networkButtons = document.querySelectorAll(".network-button");
const networkPanels = document.querySelectorAll(".network-panel");
const networkStatus = document.querySelector("#network-status");
const moodButtons = document.querySelectorAll(".mood-button");
const checkinStatus = document.querySelector("#checkin-status");
const profileNameInput = document.querySelector("#profile-name");
const profileRoleSelect = document.querySelector("#profile-role");
const profileNeighborhoodSelect = document.querySelector("#profile-neighborhood");
const profileGoalSelect = document.querySelector("#profile-goal");
const saveProfileButton = document.querySelector("#save-profile-button");
const profileStatus = document.querySelector("#profile-status");
const homeWelcomeMessage = document.querySelector("#home-welcome-message");
const profileSummaryCard = document.querySelector("#profile-summary-card");
const profileRoleSummary = document.querySelector("#profile-role-summary");
const profileNeighborhoodSummary = document.querySelector("#profile-neighborhood-summary");
const profileGoalSummary = document.querySelector("#profile-goal-summary");
const feedbackButtons = document.querySelectorAll(".feedback-button");
const feedbackStatus = document.querySelector("#feedback-status");
let tipTotal = 0;
const profileStorageKey = "industry-profile";

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

function openProfileSection() {
  setActiveSection("profile");
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

if (openProfileButton) {
  openProfileButton.addEventListener("click", openProfileSection);
}

if (backHomeFromProfileButton) {
  backHomeFromProfileButton.addEventListener("click", () => {
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

// Show one network detail panel at a time.
networkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelName = button.dataset.panel;

    networkPanels.forEach((panel) => {
      const isActive = panel.dataset.panelContent === panelName;
      panel.classList.toggle("active", isActive);
    });

    const buttonLabel = button.textContent.trim();
    networkStatus.textContent = `${buttonLabel} opened.`;
  });
});

// Save a simple check-in mood for the prototype.
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((moodButton) => {
      const isActive = moodButton === button;
      moodButton.classList.toggle("active", isActive);
    });

    checkinStatus.textContent = "Check-in saved.";
    networkStatus.textContent = `${button.textContent} check-in saved.`;
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

function updateHomeProfileView(profileData) {
  const nickname = profileData.name ? profileData.name : "Maya";
  homeWelcomeMessage.textContent = `Welcome back, ${nickname}`;

  const hasProfileDetails =
    profileData.role || profileData.neighborhood || profileData.goal;

  profileSummaryCard.classList.toggle("visible", Boolean(hasProfileDetails));

  if (hasProfileDetails) {
    profileRoleSummary.textContent = profileData.role || "Not set yet";
    profileNeighborhoodSummary.textContent =
      profileData.neighborhood || "Not set yet";
    profileGoalSummary.textContent = profileData.goal || "Not set yet";
  }
}

function getProfileFormData() {
  return {
    name: profileNameInput.value.trim(),
    role: profileRoleSelect.value,
    neighborhood: profileNeighborhoodSelect.value,
    goal: profileGoalSelect.value,
  };
}

function fillProfileForm(profileData) {
  profileNameInput.value = profileData.name || "";
  profileRoleSelect.value = profileData.role || "";
  profileNeighborhoodSelect.value = profileData.neighborhood || "";
  profileGoalSelect.value = profileData.goal || "";
}

if (saveProfileButton) {
  saveProfileButton.addEventListener("click", () => {
    const profileData = getProfileFormData();

    // localStorage lets this prototype remember small bits of data in the browser.
    // That means a coworker can refresh the page and still see the saved setup.
    localStorage.setItem(profileStorageKey, JSON.stringify(profileData));

    updateHomeProfileView(profileData);
    profileStatus.textContent = "Profile saved for this prototype.";
  });
}

feedbackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    feedbackStatus.textContent = "Feedback noted for this prototype.";
  });
});

// When the page loads, read any saved profile back out of localStorage.
// If nothing has been saved yet, we just keep the default sample home view.
const savedProfile = localStorage.getItem(profileStorageKey);

if (savedProfile) {
  try {
    const profileData = JSON.parse(savedProfile);
    fillProfileForm(profileData);
    updateHomeProfileView(profileData);
  } catch (error) {
    localStorage.removeItem(profileStorageKey);
  }
}
