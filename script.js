const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const navCards = document.querySelectorAll(".nav-card");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const goToFeedbackButton = document.querySelector("#go-to-feedback-button");
const saveShiftButton = document.querySelector("#save-shift-button");
const shiftBoardList = document.querySelector("#shift-board-list");
const shiftBoardStatus = document.querySelector("#shift-board-status");
const postShiftStatus = document.querySelector("#post-shift-status");
const connectionButtons = document.querySelectorAll(".connection-button");
const connectionStatusPanel = document.querySelector("#connection-status-panel");
const connectionStatusMessage = document.querySelector("#connection-status-message");
const connectionStatusDetail = document.querySelector("#connection-status-detail");
const importedShiftsPanel = document.querySelector("#imported-shifts-panel");
const importedShiftList = document.querySelector("#imported-shift-list");
const saveProfileButton = document.querySelector("#save-profile-button");
const profileStatus = document.querySelector("#profile-status");
const profileSummaryCard = document.querySelector("#profile-summary-card");
const profileRoleSummary = document.querySelector("#profile-role-summary");
const profileNeighborhoodSummary = document.querySelector("#profile-neighborhood-summary");
const profileGoalSummary = document.querySelector("#profile-goal-summary");
const profileNameInput = document.querySelector("#profile-name");
const profileRoleSelect = document.querySelector("#profile-role");
const profileNeighborhoodSelect = document.querySelector("#profile-neighborhood");
const profileGoalSelect = document.querySelector("#profile-goal");
const feedbackAnswerButtons = document.querySelectorAll(".feedback-answer-button");
const feedbackNote = document.querySelector("#feedback-note");
const saveFeedbackButton = document.querySelector("#save-feedback-button");
const feedbackStatus = document.querySelector("#feedback-status");
const openFeedbackFormButton = document.querySelector("#open-feedback-form-button");

const themeStorageKey = "industry-v2-theme";
const shiftsStorageKey = "industry-v2-shifts";
const interestedStorageKey = "industry-v2-interest";
const profileStorageKey = "industry-v2-profile";
const feedbackStorageKey = "industry-v2-feedback";
const feedbackFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScLUIuiBZ_a771qFUt_wRreHaN9pugo0OcDQ1zHVO3Y4q4wwQ/viewform?usp=publish-editor";

const sampleShifts = [
  {
    id: "sample-1",
    restaurant: "Ava Gene's",
    role: "Server",
    day: "Thursday",
    time: "4:30 PM - 10:30 PM",
    neighborhood: "Division",
    note: "Dinner service. Strong wine knowledge helps.",
  },
  {
    id: "sample-2",
    restaurant: "Hey Love",
    role: "Bartender",
    day: "Saturday",
    time: "6:00 PM - close",
    neighborhood: "Eastside",
    note: "Busy cocktail shift with patio traffic.",
  },
  {
    id: "sample-3",
    restaurant: "Screen Door",
    role: "Brunch Server",
    day: "Sunday",
    time: "8:00 AM - 3:00 PM",
    neighborhood: "Burnside",
    note: "High-volume brunch shift. Fast feet matter.",
  },
];

const importedScheduleShifts = [
  {
    id: "imported-1",
    day: "Thu, July 9",
    role: "Server",
    time: "5 PM-Close",
    neighborhood: "Division",
  },
  {
    id: "imported-2",
    day: "Fri, July 10",
    role: "Bartender",
    time: "6 PM-Close",
    neighborhood: "Eastside",
  },
  {
    id: "imported-3",
    day: "Sun, July 12",
    role: "Brunch",
    time: "9 AM-3 PM",
    neighborhood: "Burnside",
  },
];

let selectedFeedbackAnswer = "";

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

navCards.forEach((card) => {
  const openCardSection = () => {
    setActiveSection(card.dataset.targetSection);
  };

  card.addEventListener("click", openCardSection);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCardSection();
    }
  });
});

if (goToFeedbackButton) {
  goToFeedbackButton.addEventListener("click", () => {
    setActiveSection("feedback");
  });
}

function applyTheme(themeName) {
  // Theme switching works by saving a simple word in localStorage.
  // On refresh, we read that word back and re-apply the same theme.
  document.body.dataset.theme = themeName;
  themeToggleButton.textContent =
    themeName === "dark" ? "Light / Dark: Dark" : "Light / Dark: Light";
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const nextTheme =
      document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

function readLocalJson(storageKey, fallbackValue) {
  const savedValue = localStorage.getItem(storageKey);

  if (!savedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(savedValue);
  } catch (error) {
    localStorage.removeItem(storageKey);
    return fallbackValue;
  }
}

function saveLocalJson(storageKey, value) {
  localStorage.setItem(storageKey, JSON.stringify(value));
}

function getAllShifts() {
  const savedShifts = readLocalJson(shiftsStorageKey, []);
  return [...savedShifts, ...sampleShifts];
}

function renderShiftBoard() {
  const interestedShiftIds = readLocalJson(interestedStorageKey, []);
  const shifts = getAllShifts();

  shiftBoardList.innerHTML = "";

  shifts.forEach((shift) => {
    const isInterested = interestedShiftIds.includes(shift.id);
    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";
    shiftCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">Open shift</p>
        <h3>${shift.restaurant}</h3>
        <p>${shift.role}</p>
        <ul class="shift-meta">
          <li>${shift.day}</li>
          <li>${shift.time}</li>
          <li>${shift.neighborhood}</li>
        </ul>
        <p>${shift.note}</p>
      </div>
      <button class="action-button interest-button${isInterested ? " sent" : ""}" type="button" data-shift-id="${shift.id}">
        ${isInterested ? "Interest sent" : "I'm interested"}
      </button>
    `;

    shiftBoardList.appendChild(shiftCard);
  });

  document.querySelectorAll(".interest-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shiftId = button.dataset.shiftId;
      const interestedShiftIds = readLocalJson(interestedStorageKey, []);

      if (!interestedShiftIds.includes(shiftId)) {
        interestedShiftIds.push(shiftId);
        saveLocalJson(interestedStorageKey, interestedShiftIds);
      }

      button.classList.add("sent");
      button.textContent = "Interest sent";
      shiftBoardStatus.textContent = "Interest sent. The shift owner would see this in a full product.";
    });
  });
}

function createBoardPostFromImportedShift(shift, postType) {
  const savedShifts = readLocalJson(shiftsStorageKey, []);
  const restaurantName = `${postType} from connected schedule`;
  const newShift = {
    id: `shift-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    restaurant: restaurantName,
    role: shift.role,
    day: shift.day,
    time: shift.time,
    neighborhood: shift.neighborhood,
    note: `${postType} created from ${shift.source}. Imported schedule mock.`,
  };

  savedShifts.unshift(newShift);
  saveLocalJson(shiftsStorageKey, savedShifts);
  renderShiftBoard();
  shiftBoardStatus.textContent = "Added to Shift Board.";
}

function renderImportedShifts(sourceName) {
  importedShiftList.innerHTML = "";

  importedScheduleShifts.forEach((shift) => {
    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";
    shiftCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">Imported shift</p>
        <h3>${shift.day}</h3>
        <p>${shift.role}</p>
        <ul class="shift-meta">
          <li>${shift.time}</li>
          <li>${shift.neighborhood}</li>
          <li>${sourceName}</li>
        </ul>
      </div>
      <div class="shift-action-row">
      <button class="action-button imported-shift-button" type="button" data-shift-id="${shift.id}" data-post-type="Release shift">
          Release shift
        </button>
        <button class="action-button imported-shift-button" type="button" data-shift-id="${shift.id}" data-post-type="Request swap">
          Request swap
        </button>
        <button class="action-button imported-shift-button" type="button" data-shift-id="${shift.id}" data-post-type="Offer pickup">
          Offer pickup
        </button>
      </div>
    `;

    importedShiftList.appendChild(shiftCard);
  });

  document.querySelectorAll(".imported-shift-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = importedScheduleShifts.find(
        (item) => item.id === button.dataset.shiftId
      );

      if (!shift) {
        return;
      }

      createBoardPostFromImportedShift({ ...shift, source: sourceName }, button.dataset.postType);
      button.textContent = "Added to board";
    });
  });
}

function getPostShiftFormData() {
  return {
    restaurant: document.querySelector("#shift-restaurant").value.trim(),
    role: document.querySelector("#shift-role").value,
    day: document.querySelector("#shift-day").value.trim(),
    time: document.querySelector("#shift-time").value.trim(),
    neighborhood: document.querySelector("#shift-neighborhood").value,
    note: document.querySelector("#shift-note").value.trim() || "No extra note shared.",
  };
}

function clearPostShiftForm() {
  document.querySelector("#shift-restaurant").value = "";
  document.querySelector("#shift-role").value = "";
  document.querySelector("#shift-day").value = "";
  document.querySelector("#shift-time").value = "";
  document.querySelector("#shift-neighborhood").value = "";
  document.querySelector("#shift-note").value = "";
}

if (saveShiftButton) {
  saveShiftButton.addEventListener("click", () => {
    const formData = getPostShiftFormData();

    if (
      !formData.restaurant ||
      !formData.role ||
      !formData.day ||
      !formData.time ||
      !formData.neighborhood
    ) {
      postShiftStatus.textContent = "Add the main shift details before posting.";
      return;
    }

    const savedShifts = readLocalJson(shiftsStorageKey, []);
    const newShift = {
      id: `shift-${Date.now()}`,
      ...formData,
    };

    // localStorage keeps the posted shifts in this browser only.
    // That makes the prototype easy to test without needing a backend yet.
    savedShifts.unshift(newShift);
    saveLocalJson(shiftsStorageKey, savedShifts);

    clearPostShiftForm();
    renderShiftBoard();
    postShiftStatus.textContent = "Shift posted to the local prototype board.";
    setActiveSection("shift-board");
  });
}

connectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sourceName = button.dataset.source;

    connectionButtons.forEach((connectionButton) => {
      const isActive = connectionButton === button;
      connectionButton.classList.toggle("active", isActive);
    });

    connectionStatusPanel.classList.remove("hidden-panel");
    importedShiftsPanel.classList.remove("hidden-panel");
    connectionStatusMessage.textContent = "Schedule imported";
    connectionStatusDetail.textContent = `3 upcoming shifts found from ${sourceName}`;
    renderImportedShifts(sourceName);
  });
});

function getProfileFormData() {
  return {
    name: profileNameInput.value.trim(),
    role: profileRoleSelect.value,
    neighborhood: profileNeighborhoodSelect.value,
    goal: profileGoalSelect.value,
  };
}

function updateProfileSummary(profileData) {
  const hasSummary = profileData.role || profileData.neighborhood || profileData.goal;
  profileSummaryCard.classList.toggle("visible", Boolean(hasSummary));

  if (hasSummary) {
    profileRoleSummary.textContent = profileData.role || "Not set yet";
    profileNeighborhoodSummary.textContent =
      profileData.neighborhood || "Not set yet";
    profileGoalSummary.textContent = profileData.goal || "Not set yet";
  }
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
    saveLocalJson(profileStorageKey, profileData);
    updateProfileSummary(profileData);
    profileStatus.textContent = "Profile saved for this prototype.";
  });
}

feedbackAnswerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFeedbackAnswer = button.dataset.answer;

    feedbackAnswerButtons.forEach((answerButton) => {
      const isActive = answerButton === button;
      answerButton.classList.toggle("active", isActive);
    });
  });
});

if (saveFeedbackButton) {
  saveFeedbackButton.addEventListener("click", () => {
    const feedbackData = {
      answer: selectedFeedbackAnswer,
      note: feedbackNote.value.trim(),
    };

    saveLocalJson(feedbackStorageKey, feedbackData);
    feedbackStatus.textContent = "Feedback saved for this prototype.";
  });
}

if (openFeedbackFormButton) {
  openFeedbackFormButton.href = feedbackFormUrl;
}

const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
applyTheme(savedTheme);

const savedProfile = readLocalJson(profileStorageKey, {});
fillProfileForm(savedProfile);
updateProfileSummary(savedProfile);

const savedFeedback = readLocalJson(feedbackStorageKey, {});
selectedFeedbackAnswer = savedFeedback.answer || "";
feedbackNote.value = savedFeedback.note || "";

feedbackAnswerButtons.forEach((button) => {
  const isActive = button.dataset.answer === selectedFeedbackAnswer;
  button.classList.toggle("active", isActive);
});

renderShiftBoard();
