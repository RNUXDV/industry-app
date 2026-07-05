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
const shiftResponseStorageKey = "industry-v2-shift-responses";
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
    postType: "Release",
    postedTo: "Workplace crew",
    status: "Open",
  },
  {
    id: "sample-2",
    restaurant: "Hey Love",
    role: "Bartender",
    day: "Saturday",
    time: "6:00 PM - Close",
    neighborhood: "Eastside",
    note: "Busy cocktail shift with patio traffic.",
    postType: "Release",
    postedTo: "Workplace crew",
    status: "Open",
  },
  {
    id: "sample-3",
    restaurant: "Screen Door",
    role: "Brunch",
    day: "Sunday",
    time: "9:00 AM - 3:00 PM",
    neighborhood: "Burnside",
    note: "High-volume brunch shift. Fast feet matter.",
    postType: "Swap",
    lookingFor: "Open to offers",
    postedTo: "Workplace crew",
    status: "Open",
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

const swapPreferences = [
  "Earlier shift",
  "Later shift",
  "Different day",
  "Open to offers",
];

let selectedFeedbackAnswer = "";
let selectedScheduleSource = "";
let activeScheduleAction = null;

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
  // Theme switching works by saving a short label in localStorage.
  // On refresh, we read that label back and restore the same look.
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

function getShiftResponses() {
  return readLocalJson(shiftResponseStorageKey, {});
}

function getAllShifts() {
  const savedShifts = readLocalJson(shiftsStorageKey, []);
  return [...savedShifts, ...sampleShifts];
}

function getBoardButtonLabel(shift) {
  return shift.postType === "Swap" ? "Offer swap" : "I can take this";
}

function getDisplayedShiftStatus(shift, responses) {
  if (responses[shift.id]?.status) {
    return responses[shift.id].status;
  }

  return shift.status || "Open";
}

function createBoardPost(postData) {
  const savedShifts = readLocalJson(shiftsStorageKey, []);
  const newShift = {
    id: `shift-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    restaurant: "Workplace crew",
    status: "Open",
    ...postData,
  };

  savedShifts.unshift(newShift);
  saveLocalJson(shiftsStorageKey, savedShifts);
  renderShiftBoard();
  shiftBoardStatus.textContent = "Added to Shift Board.";
  setActiveSection("shift-board");
}

function renderShiftBoard() {
  const shifts = getAllShifts();
  const responses = getShiftResponses();

  shiftBoardList.innerHTML = "";

  shifts.forEach((shift) => {
    const displayedStatus = getDisplayedShiftStatus(shift, responses);
    const hasInterest = Boolean(responses[shift.id]?.interested);
    const responsePanel = hasInterest
      ? `
        <div class="response-panel">
          <p class="status-text">Jordan is interested.</p>
          <div class="message-preview">
            <p>I can take this if manager approves.</p>
            <p>Perfect. I'll mark it as pending.</p>
          </div>
          <div class="shift-action-row">
            <button class="action-button secondary-action shift-message-button" type="button">
              Shift message
            </button>
            <button class="action-button accept-button" type="button" data-shift-id="${shift.id}">
              Accept
            </button>
            <button class="action-button secondary-action decline-button" type="button" data-shift-id="${shift.id}">
              Decline
            </button>
          </div>
        </div>
      `
      : "";

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";
    shiftCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">Shift Board</p>
        <h3>${shift.role}</h3>
        <ul class="shift-meta">
          <li>${shift.day}</li>
          <li>${shift.time}</li>
          <li>${shift.neighborhood}</li>
        </ul>
        <p>Post type: ${shift.postType}</p>
        ${
          shift.lookingFor
            ? `<p>Looking for: ${shift.lookingFor}</p>`
            : ""
        }
        <p>Posted to: ${shift.postedTo || "Workplace crew"}</p>
        <p>Status: ${displayedStatus}</p>
      </div>
      <div class="shift-action-row">
        <button class="action-button board-action-button" type="button" data-shift-id="${shift.id}">
          ${getBoardButtonLabel(shift)}
        </button>
      </div>
      ${responsePanel}
    `;

    shiftBoardList.appendChild(shiftCard);
  });

  document.querySelectorAll(".board-action-button").forEach((button) => {
    button.addEventListener("click", () => {
      const responses = getShiftResponses();
      const shiftId = button.dataset.shiftId;

      responses[shiftId] = {
        ...(responses[shiftId] || {}),
        interested: true,
        status: "Open",
      };

      saveLocalJson(shiftResponseStorageKey, responses);
      renderShiftBoard();
    });
  });

  document.querySelectorAll(".shift-message-button").forEach((button) => {
    button.addEventListener("click", () => {
      shiftBoardStatus.textContent = "Shift message preview opened below the card.";
    });
  });

  document.querySelectorAll(".accept-button").forEach((button) => {
    button.addEventListener("click", () => {
      const responses = getShiftResponses();
      const shiftId = button.dataset.shiftId;

      responses[shiftId] = {
        ...(responses[shiftId] || {}),
        interested: true,
        status: "Pending confirmation",
      };

      saveLocalJson(shiftResponseStorageKey, responses);
      renderShiftBoard();
    });
  });

  document.querySelectorAll(".decline-button").forEach((button) => {
    button.addEventListener("click", () => {
      const responses = getShiftResponses();
      const shiftId = button.dataset.shiftId;

      responses[shiftId] = {
        ...(responses[shiftId] || {}),
        interested: false,
        status: "Open",
      };

      saveLocalJson(shiftResponseStorageKey, responses);
      renderShiftBoard();
    });
  });
}

function renderImportedShifts() {
  importedShiftList.innerHTML = "";

  importedScheduleShifts.forEach((shift) => {
    const isReleaseActive =
      activeScheduleAction?.shiftId === shift.id &&
      activeScheduleAction.type === "release";
    const isSwapActive =
      activeScheduleAction?.shiftId === shift.id &&
      activeScheduleAction.type === "swap";

    const releasePrompt = isReleaseActive
      ? `
        <div class="schedule-action-panel">
          <p class="status-text">Post this shift to your workplace crew?</p>
          <button class="action-button post-to-crew-button" type="button" data-shift-id="${shift.id}">
            Post to crew
          </button>
        </div>
      `
      : "";

    const swapPrompt = isSwapActive
      ? `
        <div class="schedule-action-panel">
          <p class="status-text">Choose a swap preference.</p>
          <div class="shift-action-row">
            ${swapPreferences
              .map(
                (preference) => `
                  <button
                    class="filter-button swap-preference-button"
                    type="button"
                    data-shift-id="${shift.id}"
                    data-preference="${preference}"
                  >
                    ${preference}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      `
      : "";

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
        </ul>
      </div>
      <div class="shift-action-row">
        <button class="action-button imported-action-button" type="button" data-shift-id="${shift.id}" data-action="release">
          Release shift
        </button>
        <button class="action-button secondary-action imported-action-button" type="button" data-shift-id="${shift.id}" data-action="swap">
          Request swap
        </button>
      </div>
      ${releasePrompt}
      ${swapPrompt}
    `;

    importedShiftList.appendChild(shiftCard);
  });

  document.querySelectorAll(".imported-action-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeScheduleAction = {
        shiftId: button.dataset.shiftId,
        type: button.dataset.action,
      };
      renderImportedShifts();
    });
  });

  document.querySelectorAll(".post-to-crew-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = importedScheduleShifts.find(
        (item) => item.id === button.dataset.shiftId
      );

      if (!shift) {
        return;
      }

      createBoardPost({
        role: shift.role,
        day: shift.day,
        time: shift.time,
        neighborhood: shift.neighborhood,
        note: `Released from ${selectedScheduleSource || "imported schedule"}.`,
        postType: "Release",
        postedTo: "Workplace crew",
      });
      activeScheduleAction = null;
      renderImportedShifts();
    });
  });

  document.querySelectorAll(".swap-preference-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = importedScheduleShifts.find(
        (item) => item.id === button.dataset.shiftId
      );

      if (!shift) {
        return;
      }

      createBoardPost({
        role: shift.role,
        day: shift.day,
        time: shift.time,
        neighborhood: shift.neighborhood,
        note: `Swap request from ${selectedScheduleSource || "imported schedule"}.`,
        postType: "Swap",
        lookingFor: button.dataset.preference,
        postedTo: "Workplace crew",
      });
      activeScheduleAction = null;
      renderImportedShifts();
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
    note:
      document.querySelector("#shift-note").value.trim() ||
      "No extra note shared.",
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
      postType: "Release",
      postedTo: "Workplace crew",
      status: "Open",
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
    selectedScheduleSource = button.dataset.source;
    activeScheduleAction = null;

    connectionButtons.forEach((connectionButton) => {
      const isActive = connectionButton === button;
      connectionButton.classList.toggle("active", isActive);
    });

    connectionStatusPanel.classList.remove("hidden-panel");
    importedShiftsPanel.classList.remove("hidden-panel");
    connectionStatusMessage.textContent = "Schedule imported";
    connectionStatusDetail.textContent = "3 upcoming shifts found";
    renderImportedShifts();
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
  const hasSummary =
    profileData.role || profileData.neighborhood || profileData.goal;
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
