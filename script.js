const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const navCards = document.querySelectorAll(".nav-card");
const scheduleViewCards = document.querySelectorAll(".schedule-view-card");
const scheduleSubviews = document.querySelectorAll(".schedule-subview");
const homeLogoButton = document.querySelector("#home-logo-button");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const goToFeedbackButton = document.querySelector("#go-to-feedback-button");
const startHereButton = document.querySelector("#start-here-button");
const saveShiftButton = document.querySelector("#save-shift-button");
const shiftBoardList = document.querySelector("#shift-board-list");
const shiftBoardStatus = document.querySelector("#shift-board-status");
const postShiftStatus = document.querySelector("#post-shift-status");
const shiftWorkplaceSelect = document.querySelector("#shift-workplace");
const workplacePreviewPanel = document.querySelector("#workplace-preview-panel");
const workplacePreviewMessage = document.querySelector("#workplace-preview-message");
const workplacePreviewNeighborhood = document.querySelector("#workplace-preview-neighborhood");
const connectionButtons = document.querySelectorAll(".connection-button");
const connectionStatusPanel = document.querySelector("#connection-status-panel");
const connectionStatusMessage = document.querySelector("#connection-status-message");
const connectionStatusDetail = document.querySelector("#connection-status-detail");
const importedShiftsPanel = document.querySelector("#imported-shifts-panel");
const importedShiftList = document.querySelector("#imported-shift-list");
const crewShiftDate = document.querySelector("#crew-shift-date");
const crewShiftWorkplace = document.querySelector("#crew-shift-workplace");
const crewShiftTime = document.querySelector("#crew-shift-time");
const crewShiftRole = document.querySelector("#crew-shift-role");
const crewShiftStatus = document.querySelector("#crew-shift-status");
const frontOfHouseList = document.querySelector("#front-of-house-list");
const backOfHouseList = document.querySelector("#back-of-house-list");
const managerList = document.querySelector("#manager-list");
const crewActionStatus = document.querySelector("#crew-action-status");
const shiftMessageStatus = document.querySelector("#shift-message-status");
const profileSummaryCard = document.querySelector("#profile-summary-card");
const profileRoleSummary = document.querySelector("#profile-role-summary");
const profileNeighborhoodSummary = document.querySelector("#profile-neighborhood-summary");
const profileGoalSummary = document.querySelector("#profile-goal-summary");
const mockPreviewButtons = document.querySelectorAll(".mock-preview-button");

const themeStorageKey = "industry-v2-theme";
const shiftsStorageKey = "industry-v2-shifts";
const shiftResponseStorageKey = "industry-v2-shift-responses";
const profileStorageKey = "industry-v2-profile";
const feedbackFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScLUIuiBZ_a771qFUt_wRreHaN9pugo0OcDQ1zHVO3Y4q4wwQ/viewform?usp=publish-editor";

const workplaces = {
  "Departure Lounge|Pearl District": {
    name: "Departure Lounge",
    neighborhood: "Pearl District",
  },
  "Cafe Luna|SE Portland": {
    name: "Cafe Luna",
    neighborhood: "SE Portland",
  },
  "Event Pool|Portland Metro": {
    name: "Event Pool",
    neighborhood: "Portland Metro",
  },
};

const sampleShifts = [
  {
    id: "sample-1",
    workplace: "Departure Lounge",
    role: "Server",
    day: "Thursday",
    time: "4:30 PM - 10:30 PM",
    neighborhood: "Pearl District",
    note: "Dinner service. Strong wine knowledge helps.",
    postType: "Release shift",
    postedTo: "Workplace crew",
    status: "Open",
  },
  {
    id: "sample-2",
    workplace: "Cafe Luna",
    role: "Bartender",
    day: "Saturday",
    time: "6:00 PM - Close",
    neighborhood: "SE Portland",
    note: "Busy cocktail shift with patio traffic.",
    postType: "Release shift",
    postedTo: "Workplace crew",
    status: "Open",
  },
  {
    id: "sample-3",
    workplace: "Event Pool",
    role: "Brunch",
    day: "Sunday",
    time: "9:00 AM - 3:00 PM",
    neighborhood: "Portland Metro",
    note: "High-volume brunch shift. Fast feet matter.",
    postType: "Request swap",
    lookingFor: "Open to offers",
    postedTo: "Workplace crew",
    status: "Open",
  },
];

const importedScheduleShifts = [
  {
    id: "imported-1",
    day: "Thu, July 9",
    workplace: "Departure Lounge",
    role: "Server",
    time: "5 PM-Close",
    neighborhood: "Pearl District",
  },
  {
    id: "imported-2",
    day: "Fri, July 10",
    workplace: "Departure Lounge",
    role: "Bartender",
    time: "6 PM-Close",
    neighborhood: "Pearl District",
  },
  {
    id: "imported-3",
    day: "Sun, July 12",
    workplace: "Cafe Luna",
    role: "Brunch",
    time: "9 AM-3 PM",
    neighborhood: "SE Portland",
  },
];

const workplaceCrews = {
  "Departure Lounge": {
    frontOfHouse: [
      { name: "Jordan", position: "Bartender", status: "Scheduled" },
      { name: "Maya", position: "Server", status: "Scheduled" },
      { name: "Alex", position: "Host", status: "Scheduled" },
      { name: "Chris", position: "Barback", status: "Scheduled" },
    ],
    backOfHouse: [
      { name: "Luis", position: "Line Cook", status: "Scheduled" },
      { name: "Nia", position: "Prep Cook", status: "Scheduled" },
      { name: "Sam", position: "Dishwasher", status: "Scheduled" },
    ],
    managers: [
      { name: "Dana", position: "Floor Manager", status: "On duty" },
      { name: "Renee", position: "General Manager", status: "Approval contact" },
    ],
  },
  "Cafe Luna": {
    frontOfHouse: [
      { name: "Tori", position: "Server", status: "Scheduled" },
      { name: "Elena", position: "Host", status: "Scheduled" },
      { name: "Micah", position: "Support", status: "Scheduled" },
    ],
    backOfHouse: [
      { name: "Andre", position: "Line Cook", status: "Scheduled" },
      { name: "Viv", position: "Prep Cook", status: "Scheduled" },
      { name: "Noah", position: "Dishwasher", status: "Scheduled" },
    ],
    managers: [
      { name: "Kira", position: "Floor Manager", status: "On duty" },
      { name: "Paul", position: "General Manager", status: "Approval contact" },
    ],
  },
  "Event Pool": {
    frontOfHouse: [
      { name: "Ari", position: "Event Server", status: "Scheduled" },
      { name: "Becca", position: "Banquet Captain", status: "Scheduled" },
      { name: "Theo", position: "Barback", status: "Scheduled" },
    ],
    backOfHouse: [
      { name: "Marco", position: "Line Cook", status: "Scheduled" },
      { name: "June", position: "Prep Cook", status: "Scheduled" },
      { name: "Eli", position: "Dishwasher", status: "Scheduled" },
    ],
    managers: [
      { name: "Sonia", position: "Event Manager", status: "On duty" },
      { name: "Harper", position: "Operations Manager", status: "Approval contact" },
    ],
  },
};

const swapPreferences = [
  "Earlier shift",
  "Later shift",
  "Different day",
  "Open to offers",
];

let selectedScheduleSource = "";
let activeScheduleAction = null;
let activeCrewShiftId = "";

function setActiveScheduleView(viewName) {
  scheduleViewCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.scheduleView === viewName);
  });

  scheduleSubviews.forEach((subview) => {
    subview.classList.toggle("active", subview.dataset.scheduleSubview === viewName);
  });
}

function setActiveSection(sectionName) {
  navButtons.forEach((button) => {
    const isActive = button.dataset.target === sectionName;
    button.classList.toggle("active", isActive);
  });

  if (homeLogoButton) {
    homeLogoButton.classList.toggle("active", sectionName === "home");
  }

  appSections.forEach((section) => {
    const isActive = section.dataset.section === sectionName;
    section.classList.toggle("active", isActive);
  });
}

function applyHashSection() {
  const sectionName = window.location.hash.replace("#", "");

  if (!sectionName) {
    return;
  }

  const allowedSections = ["home", "schedule", "jobs", "people"];

  if (allowedSections.includes(sectionName)) {
    setActiveSection(sectionName);
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.target);
  });
});

if (homeLogoButton) {
  homeLogoButton.addEventListener("click", () => {
    setActiveSection(homeLogoButton.dataset.target);
  });
}

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
    window.open(feedbackFormUrl, "_blank", "noopener,noreferrer");
  });
}

if (startHereButton) {
  startHereButton.addEventListener("click", () => {
    setActiveSection("schedule");
  });
}

scheduleViewCards.forEach((card) => {
  const openScheduleView = () => {
    setActiveScheduleView(card.dataset.scheduleView);
  };

  card.addEventListener("click", openScheduleView);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openScheduleView();
    }
  });
});

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
  if (shift.postType === "Swap" || shift.postType === "Request swap") {
    return "Offer swap";
  }

  if (shift.postType === "Offer pickup") {
    return "Message worker";
  }

  return "I can take this";
}

function getBoardRequestLabel(shift) {
  if (shift.postType === "Swap" || shift.postType === "Request swap") {
    return "Swap request";
  }

  if (shift.postType === "Offer pickup") {
    return "Pickup opportunity";
  }

  return "Release request";
}

function getDisplayedShiftStatus(shift, responses) {
  if (responses[shift.id]?.status) {
    return responses[shift.id].status;
  }

  return shift.status || "Open";
}

function getCrewShiftSummary(shift) {
  return `${shift.role} ${getBoardRequestLabel(shift).toLowerCase()}`;
}

function renderCrewMembers(listElement, members, actionLabel) {
  listElement.innerHTML = members
    .map(
      (member) => `
        <article class="stack-card crew-member-card">
          <div class="stack-copy">
            <h3>${member.name}</h3>
            <p>${member.position}</p>
            <p>Status: ${member.status}</p>
          </div>
          <button
            class="action-button secondary-action crew-member-action-button"
            type="button"
            data-action-label="${actionLabel}"
          >
            ${actionLabel}
          </button>
        </article>
      `
    )
    .join("");
}

function bindCrewMemberActions() {
  document.querySelectorAll(".crew-member-action-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.actionLabel === "Approval needed") {
        crewActionStatus.textContent =
          "Manager approval will be required before this shift is final.";
        return;
      }

      crewActionStatus.textContent = "Availability request sent.";
    });
  });
}

function openCrewShift(shift, shouldNavigate = true) {
  const crew = workplaceCrews[shift.workplace] || workplaceCrews["Departure Lounge"];

  activeCrewShiftId = shift.id;
  crewShiftDate.textContent = shift.day;
  crewShiftWorkplace.textContent = shift.workplace;
  crewShiftTime.textContent = shift.time;
  crewShiftRole.textContent = getCrewShiftSummary(shift);
  crewShiftStatus.textContent = `Status: ${getDisplayedShiftStatus(shift, getShiftResponses())}`;
  crewActionStatus.textContent = `Viewing Shift Crew for ${shift.workplace}.`;

  renderCrewMembers(frontOfHouseList, crew.frontOfHouse, "Ask availability");
  renderCrewMembers(backOfHouseList, crew.backOfHouse, "Ask availability");
  renderCrewMembers(managerList, crew.managers, "Approval needed");
  bindCrewMemberActions();

  if (shouldNavigate) {
    setActiveSection("schedule");
    setActiveScheduleView("shift-crew");
  }
}

function createBoardPost(postData) {
  const savedShifts = readLocalJson(shiftsStorageKey, []);
  const newShift = {
    id: `shift-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    status: "Open",
    ...postData,
  };

  savedShifts.unshift(newShift);
  saveLocalJson(shiftsStorageKey, savedShifts);
  renderShiftBoard();
  shiftBoardStatus.textContent = "Added to Catch Board.";
  setActiveSection("schedule");
  setActiveScheduleView("catch");
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
          <p class="status-text">Keep messages tied to the shift so coverage decisions stay clear.</p>
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
        <p class="stack-kicker">Catch Board</p>
        <h3>${shift.workplace}</h3>
        <p>${shift.role} - ${getBoardRequestLabel(shift)}</p>
        <ul class="shift-meta">
          <li>${shift.day}</li>
          <li>${shift.time}</li>
        </ul>
        <ul class="shift-meta">
          <li>${shift.neighborhood}</li>
        </ul>
        ${
          shift.lookingFor
            ? `<p>Looking for: ${shift.lookingFor}</p>`
            : ""
        }
        <p>Posted to: ${shift.postedTo || "Workplace crew"}</p>
        <p>Status: ${displayedStatus}</p>
        <p>${shift.note}</p>
      </div>
      <div class="shift-action-row">
        <button class="action-button board-action-button" type="button" data-shift-id="${shift.id}">
          ${getBoardButtonLabel(shift)}
        </button>
        <button class="action-button secondary-action view-crew-button" type="button" data-shift-id="${shift.id}">
          View shift crew
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
      shiftBoardStatus.textContent = "Coworker response added on Catch Board.";
    });
  });

  document.querySelectorAll(".shift-message-button").forEach((button) => {
    button.addEventListener("click", () => {
      shiftMessageStatus.textContent = "Shift message preview updated from an active response.";
      setActiveSection("schedule");
      setActiveScheduleView("shift-message");
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
      shiftBoardStatus.textContent = "Status updated to Pending confirmation.";
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
      shiftBoardStatus.textContent = "Status returned to Open.";
    });
  });

  document.querySelectorAll(".view-crew-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = shifts.find((item) => item.id === button.dataset.shiftId);

      if (!shift) {
        return;
      }

      openCrewShift(shift);
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
        workplace: shift.workplace || "Departure Lounge",
        role: shift.role,
        day: shift.day,
        time: shift.time,
        neighborhood: shift.neighborhood,
        note: `Released from ${selectedScheduleSource || "imported schedule"}.`,
        postType: "Release shift",
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
        workplace: shift.workplace || "Departure Lounge",
        role: shift.role,
        day: shift.day,
        time: shift.time,
        neighborhood: shift.neighborhood,
        note: `Swap request from ${selectedScheduleSource || "imported schedule"}.`,
        postType: "Request swap",
        lookingFor: button.dataset.preference,
        postedTo: "Workplace crew",
      });
      activeScheduleAction = null;
      renderImportedShifts();
    });
  });
}

function getPostShiftFormData() {
  const selectedWorkplace = workplaces[shiftWorkplaceSelect.value];

  return {
    workplace: selectedWorkplace ? selectedWorkplace.name : "",
    role: document.querySelector("#shift-role").value,
    day: document.querySelector("#shift-day").value.trim(),
    time: document.querySelector("#shift-time").value.trim(),
    neighborhood: selectedWorkplace ? selectedWorkplace.neighborhood : "",
    postType: document.querySelector("#shift-coverage-type").value,
    note: "Posted from Need coverage? flow.",
    postedTo: "Workplace crew",
  };
}

function clearPostShiftForm() {
  document.querySelector("#shift-workplace").value = "";
  document.querySelector("#shift-role").value = "";
  document.querySelector("#shift-day").value = "";
  document.querySelector("#shift-time").value = "";
  document.querySelector("#shift-coverage-type").value = "";
  workplacePreviewPanel.classList.add("hidden-panel");
}

if (saveShiftButton) {
  saveShiftButton.addEventListener("click", () => {
    const formData = getPostShiftFormData();

    if (
      !formData.workplace ||
      !formData.role ||
      !formData.day ||
      !formData.time ||
      !formData.neighborhood ||
      !formData.postType
    ) {
      postShiftStatus.textContent = "Choose the workplace and shift details before posting.";
      return;
    }

    const savedShifts = readLocalJson(shiftsStorageKey, []);
    const newShift = {
      id: `shift-${Date.now()}`,
      ...formData,
      status: "Open",
    };

    // localStorage keeps the posted shifts in this browser only.
    // That makes the prototype easy to test without needing a backend yet.
    savedShifts.unshift(newShift);
    saveLocalJson(shiftsStorageKey, savedShifts);

    clearPostShiftForm();
    renderShiftBoard();
    postShiftStatus.textContent = "Shift posted to the local prototype board.";
    setActiveSection("schedule");
    setActiveScheduleView("catch");
  });
}

if (shiftWorkplaceSelect) {
  shiftWorkplaceSelect.addEventListener("change", () => {
    const selectedWorkplace = workplaces[shiftWorkplaceSelect.value];

    if (!selectedWorkplace) {
      workplacePreviewPanel.classList.add("hidden-panel");
      return;
    }

    workplacePreviewPanel.classList.remove("hidden-panel");
    workplacePreviewMessage.textContent = `Posting to: ${selectedWorkplace.name} crew`;
    workplacePreviewNeighborhood.textContent = `Neighborhood: ${selectedWorkplace.neighborhood}`;
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

function updateProfileSummary(profileData) {
  if (!profileSummaryCard || !profileRoleSummary || !profileNeighborhoodSummary || !profileGoalSummary) {
    return;
  }

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

mockPreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    const statusPanel = button.closest(".app-section").querySelector(".status-text");

    if (statusPanel) {
      statusPanel.textContent = message;
    }
  });
});

const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
applyTheme(savedTheme);

const savedProfile = readLocalJson(profileStorageKey, {});
updateProfileSummary(savedProfile);

renderShiftBoard();
setActiveScheduleView("my-shifts");
openCrewShift({
  id: "crew-default",
  workplace: "Departure Lounge",
  role: "Bartender",
  day: "Friday, July 10",
  time: "6 PM-Close",
  postType: "Release shift",
  status: "Open",
}, false);
crewActionStatus.textContent = "Select a shift to review the active Shift Crew.";

applyHashSection();
window.addEventListener("hashchange", applyHashSection);
