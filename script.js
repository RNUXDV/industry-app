const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const navCards = document.querySelectorAll(".nav-card");
const scheduleViewCards = document.querySelectorAll("[data-schedule-view]");
const dashboardLinks = document.querySelectorAll("[data-dashboard-section]");
const dashboardViewScheduleButton = document.querySelector(
  "#dashboard-view-schedule",
);
const dashboardShiftDetailsButton = document.querySelector(
  "#dashboard-shift-details-button",
);
const dashboardCountdownTime = document.querySelector(
  "#dashboard-countdown-time",
);

const dashboardShiftDay = document.querySelector("#dashboard-shift-day");

const dashboardShiftDate = document.querySelector("#dashboard-shift-date");

const dashboardShiftTime = document.querySelector("#dashboard-shift-time");

const dashboardShiftRole = document.querySelector("#dashboard-shift-role");

const dashboardShiftWorkplace = document.querySelector(
  "#dashboard-shift-workplace",
);
const activityFeedList = document.querySelector("#activity-feed-list");
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
const workplacePreviewPanel = document.querySelector(
  "#workplace-preview-panel",
);
const mockCalendarPanel = document.querySelector("#mock-calendar-panel");
const mockCalendarGrid = document.querySelector("#mock-calendar-grid");
const scheduleHub = document.querySelector("#schedule-hub");
const backToScheduleButtons = document.querySelectorAll(
  "[data-back-to-schedule]",
);

const resetDemoDataButton = document.querySelector("#reset-demo-data-button");

const backToToolsButtons = document.querySelectorAll("[data-back-to-tools]");
const workplacePreviewMessage = document.querySelector(
  "#workplace-preview-message",
);
const workplacePreviewNeighborhood = document.querySelector(
  "#workplace-preview-neighborhood",
);
const connectionButtons = document.querySelectorAll(".connection-button");
const connectionStatusPanel = document.querySelector(
  "#connection-status-panel",
);
const importScheduleDetails = document.querySelector(
  "#import-schedule-details",
);
const scheduleStatusHeading = document.querySelector(
  ".schedule-status-panel .panel-heading h3",
);
const scheduleStatusCopy = document.querySelector(
  ".schedule-status-panel .panel-heading p:last-child",
);
const connectionStatusMessage = document.querySelector(
  "#connection-status-message",
);
const connectionStatusDetail = document.querySelector(
  "#connection-status-detail",
);
const importedShiftsPanel = document.querySelector("#imported-shifts-panel");
const importedShiftList = document.querySelector("#imported-shift-list");
const crewShiftDate = document.querySelector("#crew-shift-date");
const crewShiftWorkplace = document.querySelector("#crew-shift-workplace");
const crewShiftTime = document.querySelector("#crew-shift-time");
const crewShiftRole = document.querySelector("#crew-shift-role");
const crewShiftStatus = document.querySelector("#crew-shift-status");
const demoUserSelect = document.querySelector("#demo-user-select");
const frontOfHouseList = document.querySelector("#front-of-house-list");
const backOfHouseList = document.querySelector("#back-of-house-list");
const managerList = document.querySelector("#manager-list");
const crewActionStatus = document.querySelector("#crew-action-status");
const shiftMessageStatus = document.querySelector("#shift-message-status");
const profileSummaryCard = document.querySelector("#profile-summary-card");
const profileRoleSummary = document.querySelector("#profile-role-summary");
const profileNeighborhoodSummary = document.querySelector(
  "#profile-neighborhood-summary",
);

const releaseSummaryWorkplace = document.querySelector(
  "#release-summary-workplace",
);
const releaseSummaryRole = document.querySelector("#release-summary-role");
const releaseSummaryDay = document.querySelector("#release-summary-day");
const releaseSummaryTime = document.querySelector("#release-summary-time");

const shiftDetailsTime = document.querySelector("#shift-details-time");
const shiftDetailsRole = document.querySelector("#shift-details-role");
const shiftDetailsWorkplace = document.querySelector(
  "#shift-details-workplace",
);
const shiftDetailsActivity = document.querySelector("#shift-details-activity");
const shiftDetailsManager = document.querySelector("#shift-details-manager");
const shiftDetailsStatus = document.querySelector("#shift-details-status");
const shiftDetailsNotes = document.querySelector("#shift-details-notes");
const shiftDetailsCrewButton = document.querySelector(
  "#shift-details-crew-button",
);
const shiftDetailsReleaseButton = document.querySelector(
  "#shift-details-release-button",
);

const profileGoalSummary = document.querySelector("#profile-goal-summary");
const mockPreviewButtons = document.querySelectorAll(".mock-preview-button");

const totalTipsInput = document.querySelector("#total-tips-input");
const tipoutPercentInput = document.querySelector("#tipout-percent-input");
const calculateTipoutButton = document.querySelector(
  "#calculate-tipout-button",
);
const tipoutResult = document.querySelector("#tipout-result");
const tipoutTotal = document.querySelector("#tipout-total");
const tipoutRemaining = document.querySelector("#tipout-remaining");

const tipDateInput = document.querySelector("#tip-date-input");
const tipWorkplaceInput = document.querySelector("#tip-workplace-input");
const tipRoleInput = document.querySelector("#tip-role-input");
const cashTipsInput = document.querySelector("#cash-tips-input");
const creditTipsInput = document.querySelector("#credit-tips-input");
const tipNotesInput = document.querySelector("#tip-notes-input");
const saveTipEntryButton = document.querySelector("#save-tip-entry-button");
const tipEntryStatus = document.querySelector("#tip-entry-status");

const liveEarningsTotal = document.querySelector("#live-earnings-total");
const liveCashTotal = document.querySelector("#live-cash-total");
const liveCreditTotal = document.querySelector("#live-credit-total");

const tipSummaryPanel = document.querySelector("#tip-summary-panel");
const tipSummaryTotal = document.querySelector("#tip-summary-total");
const tipSummaryDetail = document.querySelector("#tip-summary-detail");
const tipEntryList = document.querySelector("#tip-entry-list");

const tipAnalyticsPanel = document.querySelector("#tip-analytics-panel");
const tipWeekTotal = document.querySelector("#tip-week-total");
const tipMonthTotal = document.querySelector("#tip-month-total");
const tipBestShiftTotal = document.querySelector("#tip-best-shift-total");
const tipBestShiftDetail = document.querySelector("#tip-best-shift-detail");

const releaseToBoardButton = document.querySelector("#release-to-board-button");

const directReleaseButton = document.querySelector("#direct-release-button");

const developerToggle = document.querySelector("#developer-toggle");
const developerSwitcher = document.querySelector("#developer-switcher");

const themeStorageKey = "industry-v2-theme";
const shiftsStorageKey = "industry-v2-shifts";
const shiftResponseStorageKey = "industry-v2-shift-responses";
const profileStorageKey = "industry-v2-profile";
const tipEntriesStorageKey = "industry-v2-tip-entries";
const demoUserStorageKey = "industry-v2-demo-user";
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
    note: "Extra brunch shift available. Fast feet matter.",
    postType: "Offer pickup",
    postedTo: "Workplace crew",
    status: "Open",
  },
];

const importedScheduleShifts = [
  {
    id: "imported-1",
    day: "Thu, July 16",
    workplace: "Departure Lounge",
    role: "Server",
    time: "5:00 PM - Close",
    neighborhood: "Pearl District",
    station: "Dining room",
    manager: "Dana",
    notes: "Dinner service. Patio may stay open if weather holds.",
  },
  {
    id: "imported-2",
    day: "Fri, July 17",
    workplace: "Departure Lounge",
    role: "Bartender",
    time: "6:00 PM - Close",
    neighborhood: "Pearl District",
    station: "Main bar",
    manager: "Dana",
    notes: "High-volume cocktail shift. Barback scheduled.",
  },
  {
    id: "imported-3",
    day: "Sun, July 19",
    workplace: "Cafe Luna",
    role: "Brunch Server",
    time: "9:00 AM - 3:00 PM",
    neighborhood: "SE Portland",
    station: "Brunch floor",
    manager: "Kira",
    notes: "Busy brunch block. Good shift for swap or release testing.",
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
      {
        name: "Renee",
        position: "General Manager",
        status: "Approval contact",
      },
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
      {
        name: "Harper",
        position: "Operations Manager",
        status: "Approval contact",
      },
    ],
  },
};

const DEMO_USERS = {
  original: {
    id: "current-user",
    name: "Original Worker",
  },
  maya: {
    id: "worker-maya",
    name: "Maya Chen",
  },
  chris: {
    id: "worker-chris",
    name: "Chris Hall",
  },
  sam: {
    id: "worker-sam",
    name: "Sam Ortiz",
  },
};

const DEMO_NOW = new Date("2026-07-16T15:42:00");

const savedDemoUser = localStorage.getItem(demoUserStorageKey) || "maya";

let CURRENT_USER = DEMO_USERS[savedDemoUser] || DEMO_USERS.maya;

let selectedScheduleSource = "";
let activeScheduleAction = null;
let selectedReleaseShift = null;
let activeCrewShiftId = "";
let activeTipEntryId = "";

function setActiveScheduleView(viewName) {
  if (viewName === "my-shifts") {
    renderImportedShifts();
  }
  if (viewName === "activity-feed") {
    renderActivityFeed();
  }
  if (scheduleHub) {
    scheduleHub.classList.add("hidden-panel");
  }

  scheduleViewCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.scheduleView === viewName);
  });

  scheduleSubviews.forEach((subview) => {
    subview.classList.toggle(
      "active",
      subview.dataset.scheduleSubview === viewName,
    );
  });
}

function getShiftDateValue(shift) {
  const dateText = shift.day.replace(/^[A-Za-z]{3},\s*/, "");

  return new Date(`${dateText}, 2026`).getTime();
}

function getShiftStartDate(shift) {
  const dateText = shift.day.replace(/^[A-Za-z]{3},\s*/, "");
  const startTimeText = shift.time.split(/\s*[–—-]\s*/)[0].trim();

  return new Date(`${dateText}, 2026 ${startTimeText}`);
}

function getCountdownText(shift) {
  const shiftStart = getShiftStartDate(shift);
  const differenceMs = shiftStart.getTime() - DEMO_NOW.getTime();

  if (differenceMs <= 0) {
    return "Starting soon";
  }

  const totalMinutes = Math.floor(differenceMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function getShiftDayLabel(shift) {
  const shiftDate = getShiftStartDate(shift);

  const demoDay = new Date(DEMO_NOW);
  demoDay.setHours(0, 0, 0, 0);

  const targetDay = new Date(shiftDate);
  targetDay.setHours(0, 0, 0, 0);

  const differenceInDays = Math.round((targetDay - demoDay) / 86400000);

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Tomorrow";
  }

  return targetDay.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function renderDashboardShift() {
  if (
    !dashboardCountdownTime ||
    !dashboardShiftDay ||
    !dashboardShiftDate ||
    !dashboardShiftTime ||
    !dashboardShiftRole ||
    !dashboardShiftWorkplace
  ) {
    return;
  }

  const upcomingShift = getShiftStore()
    .filter((shift) => shift.owner === CURRENT_USER.id)
    .sort((shiftA, shiftB) => {
      return getShiftDateValue(shiftA) - getShiftDateValue(shiftB);
    })[0];

  if (!upcomingShift) {
    dashboardShiftDetailsButton.hidden = true;
    dashboardCountdownTime.textContent = "--";
    dashboardShiftDay.textContent = "No shift";
    dashboardShiftDate.textContent = "";
    dashboardShiftTime.textContent = "";
    dashboardShiftRole.textContent = "";
    dashboardShiftWorkplace.textContent = "";
    return;
  }

  dashboardShiftDetailsButton.hidden = false;
  dashboardShiftDetailsButton.dataset.shiftId = upcomingShift.id;
  dashboardShiftDetailsButton.dataset.shiftId = upcomingShift.id;

  dashboardCountdownTime.textContent = getCountdownText(upcomingShift);
  dashboardShiftDay.textContent = getShiftDayLabel(upcomingShift);
  dashboardShiftDate.textContent = upcomingShift.day;
  dashboardShiftTime.textContent = upcomingShift.time;
  dashboardShiftRole.textContent = upcomingShift.role;
  dashboardShiftWorkplace.textContent = upcomingShift.workplace;
}

scheduleViewCards.forEach((card) => {
  const openScheduleView = () => {
    setActiveScheduleView(card.dataset.scheduleView);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  };

  card.addEventListener("click", openScheduleView);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openScheduleView();
    }
  });
});

function showScheduleHub() {
  if (scheduleHub) {
    scheduleHub.classList.add("hidden-panel");
  }

  scheduleSubviews.forEach((subview) => {
    subview.classList.toggle(
      "active",
      subview.dataset.scheduleSubview === "my-shifts",
    );
  });

  scheduleViewCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.scheduleView === "my-shifts");
  });
}

backToScheduleButtons.forEach((button) => {
  button.addEventListener("click", showScheduleHub);
});

backToToolsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveScheduleView("earnings-tools");
  });
});

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
    const targetSection = button.dataset.target;

    setActiveSection(targetSection);

    if (targetSection === "schedule") {
      showScheduleHub();
    }
  });
});

if (dashboardShiftDetailsButton) {
  dashboardShiftDetailsButton.addEventListener("click", () => {
    const shiftId = dashboardShiftDetailsButton.dataset.shiftId;

    const shift = getShiftStore().find((item) => item.id === shiftId);

    if (!shift) {
      return;
    }

    openShiftDetails(shift);
  });
}
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

/* Shift transfer actions */

if (releaseToBoardButton) {
  releaseToBoardButton.addEventListener("click", () => {
    if (!selectedReleaseShift) {
      return;
    }

    const storedOriginalShift = findShiftById(selectedReleaseShift.id);

    const updatedOriginalShift = {
      ...storedOriginalShift,
      ...selectedReleaseShift,
      owner: CURRENT_USER.id,
      source: storedOriginalShift?.source || "imported",
      status: "Pending Coverage",
    };

    updateShift(updatedOriginalShift);
    selectedReleaseShift = updatedOriginalShift;

    addActivity({
      type: "shift-released",
      title: "Shift released",
      message: `${updatedOriginalShift.role} at ${updatedOriginalShift.workplace} was released to Catch.`,
      workerId: updatedOriginalShift.owner,
      shiftId: updatedOriginalShift.id,
      workplace: updatedOriginalShift.workplace,
    });

    const { id, status, owner, source, ...shiftData } = selectedReleaseShift;

    createBoardPost({
      ...shiftData,
      sourceShiftId: id,
      source: "catch-board",
      requestType: "release",
    });

    renderImportedShifts();
  });
}

if (directReleaseButton) {
  directReleaseButton.addEventListener("click", () => {
    console.log("Send Directly to Coworker");
  });
}

/* Dashboard direct links */

dashboardLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const sectionName = link.dataset.dashboardSection;
    const scheduleView = link.dataset.dashboardView;
    const scrollTarget = link.dataset.scrollTarget;

    if (!sectionName) {
      return;
    }

    setActiveSection(sectionName);

    if (sectionName === "schedule" && scheduleView) {
      setActiveScheduleView(scheduleView);
    }

    if (scrollTarget) {
      requestAnimationFrame(() => {
        const targetElement = document.getElementById(scrollTarget);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

function applyTheme(themeName) {
  // Theme switching works by saving a short label in localStorage.
  // On refresh, we read that label back and restore the same look.
  document.body.dataset.theme = themeName;
  themeToggleButton.textContent =
    themeName === "dark" ? "Light / Dark: Dark" : "Light / Dark: Light";
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

if (resetDemoDataButton) {
  resetDemoDataButton.addEventListener("click", () => {
    localStorage.removeItem("industry-v2-shifts");
    localStorage.removeItem("industry-v2-shift-responses");
    localStorage.removeItem("industry-v2-tip-entries");
    localStorage.removeItem("industry-v2-activity");

    location.reload();
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

function saveShiftResponses(responses) {
  saveLocalJson(shiftResponseStorageKey, responses);
}

function getAllShifts() {
  const savedShifts = getShiftStore();
  return [...savedShifts, ...sampleShifts];
}

function getShiftStore() {
  return readLocalJson(shiftsStorageKey, []);
}

function saveShiftStore(shifts) {
  saveLocalJson(shiftsStorageKey, shifts);
}

function initializeShiftStore() {
  const savedShifts = getShiftStore();

  if (savedShifts.length > 0) {
    return;
  }

  const initializedShifts = importedScheduleShifts.map((shift) => ({
    ...shift,
    owner: DEMO_USERS.original.id,
    source: "imported",
    status: "Scheduled",
  }));

  saveShiftStore(initializedShifts);
}

function findShiftById(shiftId) {
  return getShiftStore().find((shift) => shift.id === shiftId);
}

function updateShift(updatedShift) {
  const shifts = getShiftStore();

  const index = shifts.findIndex((shift) => shift.id === updatedShift.id);

  if (index === -1) {
    return;
  }

  shifts[index] = updatedShift;

  saveShiftStore(shifts);
}

const ACTIVITY_STORAGE_KEY = "industry-v2-activity";

function getActivityFeed() {
  return readLocalJson(ACTIVITY_STORAGE_KEY, []);
}

function saveActivityFeed(feed) {
  saveLocalJson(ACTIVITY_STORAGE_KEY, feed);
}

function addActivity(activity) {
  const feed = getActivityFeed();

  feed.unshift({
    id: `activity-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...activity,
  });

  saveActivityFeed(feed);
}

function clearActivityFeed() {
  saveActivityFeed([]);
}

function getBoardButtonLabel(shift) {
  if (shift.postType === "Offer pickup") {
    return "Message worker";
  }

  return "I can take this";
}

function getBoardRequestLabel(shift) {
  if (shift.postType === "Offer pickup") {
    return "Pickup opportunity";
  }

  return "Release request";
}

function getDisplayedShiftStatus(shift, responses) {
  const response = responses[shift.id];

  if (response?.confirmed) {
    return "Confirmed";
  }

  if (response?.accepted) {
    return "Pending approval";
  }

  if (response?.interested) {
    return "Interest received";
  }

  return shift.status || "Open";
}

function getCatchEventTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRelativeReleaseTime(timestamp) {
  if (!timestamp) {
    return "Posted earlier";
  }

  const minutes = Math.floor((Date.now() - timestamp) / 60000);

  if (minutes < 1) {
    return "Posted just now";
  }

  if (minutes === 1) {
    return "Posted 1 minute ago";
  }

  if (minutes < 60) {
    return `Posted ${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours === 1) {
    return "Posted 1 hour ago";
  }

  if (hours < 24) {
    return `Posted ${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Posted yesterday";
  }

  return `Posted ${days} days ago`;
}

function getCatchTimeline(shift, responses) {
  const response = responses[shift.id] || {};
  const events = [];

  events.push({
    time: shift.releasedAt || "Posted earlier",
    label: "Shift released",
    detail: "Made available for coworkers to claim.",
  });

  if (response.interested) {
    events.push({
      time: response.interestedAt || "Time unavailable",
      label: "Interest received",
      detail: "A coworker offered to take the shift.",
    });
  }

  if (response.accepted) {
    events.push({
      time: response.acceptedAt || "Time unavailable",
      label: "Worker selected",
      detail: "A coworker was selected for coverage.",
    });
  }

  if (response.confirmed) {
    events.push({
      time: response.confirmedAt || "Time unavailable",
      label: "Coverage confirmed",
      detail: "Manager approval completed the shift transfer.",
    });
  }

  return events;
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
      `,
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
  const crew =
    workplaceCrews[shift.workplace] || workplaceCrews["Departure Lounge"];

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
  const savedShifts = getShiftStore();
  const newShift = {
    id: `shift-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    status: "Open",
    ...postData,
    releasedAt: getCatchEventTime(),
    releasedTimestamp: Date.now(),
  };

  savedShifts.unshift(newShift);

  saveShiftStore(savedShifts);
  renderShiftBoard();
  shiftBoardStatus.textContent = "Added to Catch Board.";
  setActiveSection("schedule");
  setActiveScheduleView("catch");
}

// IDL-002 — Avatar
// Props: label, selected
// States: default, selected
// Used by: Presence Card

function renderAvatar({ label, selected = false }) {
  const initial = label?.charAt(0) || "?";

  return `
        <span
            class="interested-worker-avatar"
            aria-hidden="true"
        >
            ${selected ? "✓" : initial}
        </span>
    `;
}

// IDL-001 — Status Pill
// Props: label, status
// States: available, working, off
// Used by: Presence Card

function renderStatusPill(label, status) {
  return `
        <span class="interested-worker-availability status-${status}">
            <span
                class="interested-worker-availability-dot"
                aria-hidden="true"
            ></span>

            ${label}
        </span>
    `;
}

// IDL-003 — Presence Card
// Props: worker, workerIndex, shiftId
// States: default, hover, selected
// Composes: Avatar, Status Pill

function renderPresenceCard(worker, workerIndex, shiftId) {
  return `
        <div
            class="interested-worker ${worker.selected ? "is-selected" : ""}"
            data-shift-id="${shiftId}"
            data-worker-index="${workerIndex}"
            role="button"
            tabindex="0"
            aria-pressed="${worker.selected}"
        >
            ${renderAvatar({
              label: worker.name,
              selected: worker.selected,
            })}

            <div>
                <p class="interested-worker-name">
                    ${worker.name}
                </p>

                <div class="interested-worker-meta">
                    <p class="interested-worker-role">
                        ${worker.role}
                    </p>

                    ${renderStatusPill(
                      worker.availability.label,
                      worker.availability.status,
                    )}
                </div>
            </div>
        </div>
    `;
}

function prefillReleaseForm(shift) {
  if (!shift) {
    return;
  }

  selectedReleaseShift = shift;

  releaseSummaryWorkplace.textContent =
    shift.workplace || "Workplace not provided";

  releaseSummaryRole.textContent = shift.role || "Role not provided";

  releaseSummaryDay.textContent = shift.day || "Date not provided";

  releaseSummaryTime.textContent = shift.time || "Time not provided";
}

function openShiftDetails(shift) {
  if (!shift) {
    return;
  }

  const responses = getShiftResponses();
  const response = responses[shift.id];

  const status = response?.confirmed
    ? "Confirmed Catch"
    : shift.status || "Scheduled";

  shiftDetailsTime.textContent = `${shift.day} · ${shift.time}`;
  shiftDetailsRole.textContent = shift.role || "Role not provided";
  shiftDetailsWorkplace.textContent =
    shift.workplace || "Workplace not provided";
  shiftDetailsManager.textContent = shift.manager || "Manager not provided";
  shiftDetailsStatus.textContent = status;
  shiftDetailsNotes.textContent =
    shift.notes || shift.note || "No notes provided.";
  const activityItems = [];

  if (shift.source === "imported") {
    activityItems.push("Imported from ScheduleFly");
  }

  if (shift.status === "Pending Coverage") {
    activityItems.push("Released to Catch");
  }

  if (shift.transferredAt) {
    activityItems.push(
      `Coverage transferred to ${shift.ownerName || "another worker"}`,
    );
  }

  if (shift.previousOwner) {
    activityItems.push("Ownership updated through Catch");
  }

  shiftDetailsActivity.innerHTML =
    activityItems.length > 0
      ? activityItems
          .map(
            (item) => `
            <p class="shift-activity-item">
              ${item}
            </p>
          `,
          )
          .join("")
      : "<p>No activity recorded.</p>";

  shiftDetailsCrewButton.dataset.shiftId = shift.id;
  shiftDetailsReleaseButton.dataset.shiftId = shift.id;
  const releaseLocked =
    status === "Pending Coverage" ||
    status === "Pending Approval" ||
    status === "Confirmed Catch" ||
    Boolean(shift.transferredAt);
  shiftDetailsReleaseButton.hidden = releaseLocked;
  shiftDetailsReleaseButton.disabled = releaseLocked;

  setActiveSection("schedule");
  setActiveScheduleView("shift-details");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

if (shiftDetailsReleaseButton) {
  shiftDetailsReleaseButton.addEventListener("click", () => {
    const shiftId = shiftDetailsReleaseButton.dataset.shiftId;

    const shift =
      importedScheduleShifts.find((item) => item.id === shiftId) ||
      getAllShifts().find((item) => item.id === shiftId);

    if (!shift) {
      return;
    }

    setActiveSection("schedule");
    setActiveScheduleView("need-coverage");
    prefillReleaseForm(shift);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  });
}

function renderActivityFeed() {
  if (!activityFeedList) {
    return;
  }

  const activities = getActivityFeed().filter((activity) => {
    return activity.workerId === CURRENT_USER.id;
  });

  if (activities.length === 0) {
    activityFeedList.innerHTML = `
      <p class="status-text">No activity yet.</p>
    `;
    return;
  }

  activityFeedList.innerHTML = activities
    .map((activity) => {
      const activityTime = new Date(activity.createdAt).toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      );

      const approvalMarkup =
        activity.type === "shift-approved"
          ? `
            <p class="activity-feed-detail">
              Approved by ${activity.approvedBy || "Manager"}
            </p>
          `
          : "";

      return `
        <article class="activity-feed-item">
          <div class="activity-feed-marker" aria-hidden="true">✓</div>

          <div class="activity-feed-content">
            <div class="activity-feed-header">
              <p class="activity-feed-type">${activity.title}</p>
              <p class="activity-feed-time">${activityTime}</p>
            </div>

            <h3>${activity.message}</h3>

            ${approvalMarkup}

            <p class="activity-feed-meta">
              ${activity.workplace || "Workplace not provided"}
            </p>
          </div>
        </article>
      `;
    })
    .join("");
}
function renderShiftBoard() {
  const shifts = getAllShifts();
  const responses = getShiftResponses();

  shiftBoardList.innerHTML = "";

  if (shifts.length === 0) {
    shiftBoardList.innerHTML = `
    <div class="catch-empty-state">
      <p class="catch-empty-title">No open shifts right now.</p>
      <p class="catch-empty-text">
        Released shifts and pickup opportunities will appear here.
      </p>
    </div>
  `;

    return;
  }

  shifts.forEach((shift) => {
    const displayedStatus = getDisplayedShiftStatus(shift, responses);
    const interestedCount = responses[shift.id]?.interestedCount || 1;
    const interestedWorkers = responses[shift.id]?.interestedWorkers || [];
    const confirmedWorkerId = responses[shift.id]?.confirmedWorkerId;

    const confirmedWorker = interestedWorkers.find(
      (worker) => worker.id === confirmedWorkerId,
    );

    const hasInterest = Boolean(responses[shift.id]?.interested);
    const isAccepted = Boolean(responses[shift.id]?.accepted);
    const catchTimeline = getCatchTimeline(shift, responses);
    const isConfirmed = Boolean(responses[shift.id]?.confirmed);

    const interestedWorkersMarkup = interestedWorkers.length
      ? isConfirmed && confirmedWorker
        ? `
      <section class="interested-workers confirmed-worker-summary">
        <h4 class="interested-workers-heading">Shift transferred to</h4>

        <div class="interested-workers-list">
          ${renderPresenceCard(
            {
              ...confirmedWorker,
              selected: true,
            },
            interestedWorkers.findIndex(
              (worker) => worker.id === confirmedWorker.id,
            ),
            shift.id,
          )}
        </div>

        <p class="shift-helper-text">
          Transfer Complete.
        </p>
      </section>
    `
        : `
      <section class="interested-workers">
        <h4 class="interested-workers-heading">
          Interested coworkers
        </h4>

        <div class="interested-workers-list">
          ${interestedWorkers
            .map((worker, workerIndex) =>
              renderPresenceCard(worker, workerIndex, shift.id),
            )
            .join("")}
        </div>
      </section>
    `
      : "";

    const interestedLabel =
      interestedCount === 1
        ? "1 coworker is interested."
        : `${interestedCount} coworkers are interested.`;

    const catchTimelineMarkup = catchTimeline
      .map(
        (event, index) => `
      <div
        class="catch-timeline-event ${
          index === catchTimeline.length - 1 ? "is-current" : ""
        }"
      >
        <span class="catch-timeline-marker" aria-hidden="true"></span>

        <div>
  <p class="catch-timeline-time">${event.time}</p>
  <p class="catch-timeline-label">${event.label}</p>
  <p class="catch-timeline-detail">${event.detail}</p>
</div>
      </div>
    `,
      )
      .join("");
    const boardButtonLabel = isConfirmed
      ? "Coverage confirmed"
      : isAccepted
        ? "Waiting for approval"
        : hasInterest
          ? "Interest sent"
          : getBoardButtonLabel(shift);
    const responsePanel = hasInterest
      ? `
        <div class="response-panel">
         ${interestedWorkersMarkup}
         ${
           hasInterest
             ? `
      <div class="catch-timeline">
        <h4 class="catch-timeline-heading">Coverage History</h4>

        ${catchTimelineMarkup}
      </div>
    `
             : ""
         }
          <p class="status-text">Keep messages tied to the shift so coverage decisions stay clear.</p>
          <div class="message-preview">
            <p>I can take this if manager approves.</p>
            <p>Perfect. I'll mark it as pending.</p>
          </div>
         ${
           isConfirmed
             ? `
      <div class="schedule-action-panel">
        <p class="status-text">Coverage confirmed.</p>
        <p class="shift-helper-text">
          This shift has been filled and is no longer available.
        </p>

        <button
          class="action-button secondary-action shift-message-button"
          type="button"
        >
          Open shift message
        </button>
      </div>
    `
             : isAccepted
               ? `
        <div class="schedule-action-panel">
          <p class="status-text">Worker selected.</p>
          <p class="shift-helper-text">Awaiting manager approval.</p>

          <button
            class="action-button manager-approve-button"
            type="button"
            data-shift-id="${shift.id}"
          >
            Approve coverage
          </button>

          <button
            class="action-button secondary-action shift-message-button"
            type="button"
          >
            Open shift message
          </button>
        </div>
      `
               : `
        <div class="shift-action-row">
          <button
            class="action-button secondary-action shift-message-button"
            type="button"
          >
            Shift message
          </button>

          <button
            class="action-button accept-button"
            type="button"
            data-shift-id="${shift.id}"
          >
            Accept
          </button>

          <button
            class="action-button secondary-action decline-button"
            type="button"
            data-shift-id="${shift.id}"
          >
            Decline
          </button>
        </div>
      `
         } 
        </div>
      `
      : "";

    const releasedTimeLabel = getRelativeReleaseTime(shift.releasedTimestamp);

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";

    let statusClass = "status-open";

    if (isConfirmed) {
      statusClass = "status-confirmed";
    } else if (isAccepted) {
      statusClass = "status-pending";
    } else if (hasInterest) {
      statusClass = "status-interest";
    }

    shiftCard.innerHTML = `
      <div class="stack-copy">
  <p class="stack-kicker">${getBoardRequestLabel(shift)}</p>
  <h3>${shift.workplace}</h3>
<p class="detail-label">Position</p>
<p>${shift.role}</p>

  <ul class="shift-meta">
    <li>${shift.day}</li>
    <li>${shift.time}</li>
  </ul>

  <ul class="shift-meta">
    <li>${shift.neighborhood}</li>
  </ul>

  <p class="shift-release-time">
  ${releasedTimeLabel}
</p>

  


 <div class="catch-status-chip ${statusClass}">
  <span class="catch-status-dot" aria-hidden="true"></span>
  <span>${displayedStatus}</span>
</div>
 <div class="catch-progress ${statusClass}" aria-label="Shift coverage progress">
  <div class="catch-progress-step ${hasInterest ? "is-complete" : ""} ${
    hasInterest && !isAccepted ? "is-current" : ""
  }">
    <span class="catch-progress-dot"></span>
    <span>Interest</span>
  </div>

  <div class="catch-progress-step ${isAccepted ? "is-complete" : ""} ${
    isAccepted && !isConfirmed ? "is-current" : ""
  }">
  <span class="catch-progress-dot"></span>
  <span>Selected</span>
</div>

 <div class="catch-progress-step ${isConfirmed ? "is-complete is-current" : ""}">
    <span class="catch-progress-dot"></span>
    <span>Confirmed</span>
  </div>
</div>

<p>Shared with ${shift.postedTo || "Workplace crew"}</p>
<p>${shift.notes || shift.note || "No additional notes."}</p>
</div>
      <div class="shift-action-row">
        <button class="action-button board-action-button" type="button" data-shift-id="${shift.id}"
        ${hasInterest ? "disabled" : ""}
        >
          ${boardButtonLabel}
        </button>
        ${
          isConfirmed
            ? ""
            : `
      <button
        class="action-button secondary-action view-crew-button"
        type="button"
        data-shift-id="${shift.id}"
      >
        View shift crew
      </button>
    `
        }
      </div>
      ${responsePanel}
    `;

    shiftBoardList.appendChild(shiftCard);
  });

  document.querySelectorAll(".board-action-button").forEach((button) => {
    button.addEventListener("click", () => {
      const responses = getShiftResponses();
      const shiftId = button.dataset.shiftId;

      const currentCount = responses[shiftId]?.interestedCount || 0;

      responses[shiftId] = {
        ...responses[shiftId],
        interested: true,
        interestedAt: getCatchEventTime(),
        interestedCount: currentCount + 1,
        interestedWorkers: [
          {
            id: "worker-maya",
            name: "Maya Chen",
            role: "Server",
            availability: {
              label: "Available",
              status: "available",
            },
            selected: false,
          },
          {
            id: "worker-chris",
            name: "Chris Hall",
            role: "Bartender",
            availability: {
              label: "Working",
              status: "working",
            },
            selected: false,
          },
          {
            id: "worker-sam",
            name: "Sam Ortiz",
            role: "Host",
            availability: {
              label: "Off Today",
              status: "off",
            },
            selected: false,
          },
        ],
        status: "Open",
      };

      const caughtByWorker = {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        role: CURRENT_USER.role || "Worker",
      };

      responses[shiftId] = {
        ...responses[shiftId],
        accepted: true,
        acceptedAt: getCatchEventTime(),
        status: "Pending Approval",
        caughtByWorkerId: caughtByWorker.id,
        caughtByWorkerName: caughtByWorker.name,
      };

      const boardPost = findShiftById(shiftId);

      if (boardPost) {
        const updatedBoardPost = {
          ...boardPost,
          status: "Pending Approval",
          caughtByWorkerId: caughtByWorker.id,
          caughtByWorkerName: caughtByWorker.name,
          caughtAt: getCatchEventTime(),
        };

        updateShift(updatedBoardPost);

        if (boardPost.sourceShiftId) {
          const originalShift = findShiftById(boardPost.sourceShiftId);

          if (originalShift) {
            const updatedOriginalShift = {
              ...originalShift,
              status: "Pending Approval",
              pendingWorkerId: caughtByWorker.id,
              pendingWorkerName: caughtByWorker.name,
            };

            updateShift(updatedOriginalShift);
          }
        }
      }

      saveShiftResponses(responses);
      renderShiftBoard();
      renderImportedShifts();

      shiftBoardStatus.textContent = "Shift caught. Waiting for approval.";
    });
  });

  document.querySelectorAll(".shift-message-button").forEach((button) => {
    button.addEventListener("click", () => {
      shiftMessageStatus.textContent =
        "Shift message preview updated from an active response.";
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
        accepted: true,
        acceptedAt: getCatchEventTime(),
        declined: false,
        status: "Pending confirmation",
      };

      saveShiftResponses(responses);
      renderShiftBoard();
      shiftBoardStatus.textContent = "Status updated to Pending confirmation.";
    });
  });

  document.querySelectorAll(".interested-worker").forEach((workerRow) => {
    const selectWorker = () => {
      const responses = getShiftResponses();
      const shiftId = workerRow.dataset.shiftId;
      const workerIndex = Number(workerRow.dataset.workerIndex);
      const response = responses[shiftId];

      if (!response?.interestedWorkers?.[workerIndex]) {
        return;
      }

      const updatedWorkers = response.interestedWorkers.map(
        (worker, index) => ({
          ...worker,
          selected: index === workerIndex,
        }),
      );

      responses[shiftId] = {
        ...response,
        interested: true,
        interestedWorkers: updatedWorkers,
        accepted: true,
        acceptedAt: getCatchEventTime(),
        declined: false,
        status: "Pending confirmation",
      };

      saveShiftResponses(responses);
      renderShiftBoard();

      shiftBoardStatus.textContent = `${updatedWorkers[workerIndex].name} selected for coverage.`;
    };

    workerRow.addEventListener("click", selectWorker);

    workerRow.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectWorker();
      }
    });
  });

  document.querySelectorAll(".manager-approve-button").forEach((button) => {
    button.addEventListener("click", () => {
      const responses = getShiftResponses();
      const shiftId = button.dataset.shiftId;
      const currentResponse = responses[shiftId] || {};

      const selectedWorker = currentResponse.interestedWorkers?.find(
        (worker) => worker.selected,
      ) || {
        id: currentResponse.caughtByWorkerId,
        name: currentResponse.caughtByWorkerName,
        role: currentResponse.caughtByWorkerRole || "Worker",
      };

      if (!selectedWorker.id || !selectedWorker.name) {
        console.error("No valid worker selected for approval.", {
          shiftId,
          currentResponse,
        });

        shiftBoardStatus.textContent =
          "Unable to approve coverage because no worker was selected.";

        return;
      }
      responses[shiftId] = {
        ...currentResponse,
        accepted: true,
        confirmed: true,
        confirmedAt: getCatchEventTime(),
        status: "Confirmed",
        confirmedWorkerId: selectedWorker.id,
        confirmedWorkerName: selectedWorker.name,
      };

      const boardPost = findShiftById(shiftId);

      if (boardPost) {
        const updatedBoardPost = {
          ...boardPost,
          status: "Confirmed",
          approvedAt: getCatchEventTime(),
          confirmedWorkerId: selectedWorker.id,
          confirmedWorkerName: selectedWorker.name,
        };

        updateShift(updatedBoardPost);

        if (boardPost.sourceShiftId) {
          const originalShift = findShiftById(boardPost.sourceShiftId);

          if (originalShift) {
            const transferredShift = {
              ...originalShift,
              previousOwner: originalShift.owner,
              owner: selectedWorker.id,
              ownerName: selectedWorker.name,
              status: "Scheduled",
              transferredAt: getCatchEventTime(),
              transferredFromWorkerId: CURRENT_USER.id,
            };

            delete transferredShift.pendingWorkerId;
            delete transferredShift.pendingWorkerName;

            updateShift(transferredShift);
            addActivity({
              type: "shift-approved",
              title: "Coverage approved",
              message: `${selectedWorker.name} was approved for ${transferredShift.role} at ${transferredShift.workplace}.`,
              workerId: selectedWorker.id,
              shiftId: transferredShift.id,
              workplace: transferredShift.workplace,
              approvedBy: transferredShift.manager || "Manager",
            });
          }
        }
      }

      saveShiftResponses(responses);
      renderShiftBoard();
      renderImportedShifts();

      shiftBoardStatus.textContent = `Coverage approved. Shift transferred to ${selectedWorker.name}.`;
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

      saveShiftResponses(responses);
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
function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatSavedDate(dateString) {
  if (!dateString) {
    return "Date not added";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function updateLiveEarnings() {
  const cashTips = Number(cashTipsInput?.value) || 0;
  const creditTips = Number(creditTipsInput?.value) || 0;
  const totalTips = cashTips + creditTips;

  if (liveCashTotal) {
    liveCashTotal.textContent = formatMoney(cashTips);
  }

  if (liveCreditTotal) {
    liveCreditTotal.textContent = formatMoney(creditTips);
  }

  if (liveEarningsTotal) {
    liveEarningsTotal.textContent = formatMoney(totalTips);
  }
}

if (cashTipsInput) {
  cashTipsInput.addEventListener("input", updateLiveEarnings);
}

if (creditTipsInput) {
  creditTipsInput.addEventListener("input", updateLiveEarnings);
}

function getTipEntries() {
  return readLocalJson(tipEntriesStorageKey, []);
}

function renderTipAnalytics(entries) {
  if (
    !tipAnalyticsPanel ||
    !tipWeekTotal ||
    !tipMonthTotal ||
    !tipBestShiftTotal ||
    !tipBestShiftDetail
  ) {
    return;
  }

  if (!entries.length) {
    tipAnalyticsPanel.classList.add("hidden-panel");
    return;
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay();

  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const normalizedEntries = entries.map((entry) => ({
    ...entry,
    entryDate: new Date(`${entry.date}T00:00:00`),
    total: entry.cashTips + entry.creditTips,
  }));

  const weekTotal = normalizedEntries
    .filter((entry) => entry.entryDate >= startOfWeek)
    .reduce((sum, entry) => sum + entry.total, 0);

  const monthTotal = normalizedEntries
    .filter((entry) => entry.entryDate >= startOfMonth)
    .reduce((sum, entry) => sum + entry.total, 0);

  const bestShift = normalizedEntries.reduce((best, entry) => {
    if (!best || entry.total > best.total) {
      return entry;
    }

    return best;
  }, null);

  tipAnalyticsPanel.classList.remove("hidden-panel");
  tipWeekTotal.textContent = formatMoney(weekTotal);
  tipMonthTotal.textContent = formatMoney(monthTotal);
  tipBestShiftTotal.textContent = formatMoney(bestShift.total);
  tipBestShiftDetail.textContent = `${
    bestShift.workplace || "Workplace not added"
  } · ${formatSavedDate(bestShift.date)}`;
}

function renderTipEntries() {
  if (
    !tipEntryList ||
    !tipSummaryPanel ||
    !tipSummaryTotal ||
    !tipSummaryDetail
  ) {
    return;
  }

  const entries = [...getTipEntries()].sort((entryA, entryB) => {
    const dateDifference =
      new Date(`${entryB.date}T00:00:00`) - new Date(`${entryA.date}T00:00:00`);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return entryB.id.localeCompare(entryA.id);
  });

  renderTipAnalytics(entries);
  tipEntryList.innerHTML = "";

  if (!entries.length) {
    tipSummaryPanel.classList.add("hidden-panel");
    tipSummaryTotal.textContent = "$0.00";
    tipSummaryDetail.textContent =
      "Save your first shift to start tracking your earnings over time.";

    renderTipAnalytics([]);
    return;
  }

  const totalEarned = entries.reduce(
    (sum, entry) => sum + entry.cashTips + entry.creditTips,
    0,
  );

  tipSummaryPanel.classList.remove("hidden-panel");
  tipSummaryTotal.textContent = formatMoney(totalEarned);
  tipSummaryDetail.textContent = `${entries.length} saved ${
    entries.length === 1 ? "shift" : "shifts"
  }.`;

  entries.forEach((entry) => {
    const entryTotal = entry.cashTips + entry.creditTips;
    const card = document.createElement("article");

    card.className = "stack-card tip-entry-card";

    card.innerHTML = `
  <div class="stack-copy">
    <p class="stack-kicker">${formatSavedDate(entry.date)}</p>
    <h3 class="tip-entry-workplace">
  <span aria-hidden="true">📍</span>
  ${entry.workplace || "Workplace not added"}
</h3>

<p class="tip-entry-role">
  <span aria-hidden="true">👤</span>
  ${entry.role || "Role not added"}
</p>
    <div class="tip-entry-breakdown">
      <div>
        <span><span aria-hidden="true">💵</span> Cash</span>
        <strong>${formatMoney(entry.cashTips)}</strong>
      </div>

      <div>
        <span><span aria-hidden="true">💳</span> Credit</span>
        <strong>${formatMoney(entry.creditTips)}</strong>
      </div>
    </div>

   <div class="tip-entry-total">
  <span>Shift Total</span>
  <strong>${formatMoney(entryTotal)}</strong>
</div>

    ${entry.notes ? `<p>${entry.notes}</p>` : ""}

    <div class="tip-entry-actions">
  <button
    class="action-button secondary-action edit-tip-entry-button"
    type="button"
    data-entry-id="${entry.id}"
  >
    Edit entry
  </button>

  <button
    class="action-button secondary-action delete-tip-entry-button"
    type="button"
    data-entry-id="${entry.id}"
  >
    Delete entry
  </button>
</div>
`;

    tipEntryList.appendChild(card);
  });

  document.querySelectorAll(".edit-tip-entry-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = getTipEntries().find(
        (item) => item.id === button.dataset.entryId,
      );

      if (!entry) {
        return;
      }

      activeTipEntryId = entry.id;

      tipDateInput.value = entry.date || "";
      tipWorkplaceInput.value = entry.workplace || "";
      tipRoleInput.value = entry.role || "";
      cashTipsInput.value = entry.cashTips || "";
      creditTipsInput.value = entry.creditTips || "";
      tipNotesInput.value = entry.notes || "";

      saveTipEntryButton.textContent = "Update shift";
      tipEntryStatus.textContent = "Editing saved shift.";

      updateLiveEarnings();

      tipDateInput.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  });

  document.querySelectorAll(".delete-tip-entry-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entries = getTipEntries();

      const entryToDelete = entries.find(
        (entry) => entry.id === button.dataset.entryId,
      );

      if (!entryToDelete) {
        return;
      }

      const confirmed = window.confirm(
        `Delete the ${formatSavedDate(entryToDelete.date)} shift from ${
          entryToDelete.workplace || "this workplace"
        }?`,
      );

      if (!confirmed) {
        return;
      }

      const updatedEntries = entries.filter(
        (entry) => entry.id !== button.dataset.entryId,
      );

      saveLocalJson(tipEntriesStorageKey, updatedEntries);
      renderTipEntries();
    });
  });
}

if (saveTipEntryButton) {
  saveTipEntryButton.addEventListener("click", () => {
    const cashTips = Number(cashTipsInput?.value) || 0;
    const creditTips = Number(creditTipsInput?.value) || 0;

    if (!tipDateInput?.value) {
      tipEntryStatus.textContent = "Add the shift date before saving.";
      return;
    }

    if (cashTips <= 0 && creditTips <= 0) {
      tipEntryStatus.textContent =
        "Enter cash tips, credit-card tips, or both before saving.";
      return;
    }

    const entries = getTipEntries();

    const newEntry = {
      id: `tip-${Date.now()}`,
      date: tipDateInput.value,
      workplace: tipWorkplaceInput?.value.trim() || "",
      role: tipRoleInput?.value.trim() || "",
      cashTips,
      creditTips,
      notes: tipNotesInput?.value.trim() || "",
    };

    if (activeTipEntryId) {
      const entryIndex = entries.findIndex(
        (entry) => entry.id === activeTipEntryId,
      );

      if (entryIndex !== -1) {
        entries[entryIndex] = {
          ...newEntry,
          id: activeTipEntryId,
        };
      }
    } else {
      entries.unshift(newEntry);
    }

    saveLocalJson(tipEntriesStorageKey, entries);
    tipEntryStatus.textContent = activeTipEntryId
      ? `Shift updated — ${formatMoney(cashTips + creditTips)} earned.`
      : `Shift saved — ${formatMoney(cashTips + creditTips)} earned.`;

    cashTipsInput.value = "";
    creditTipsInput.value = "";
    tipNotesInput.value = "";

    activeTipEntryId = "";
    saveTipEntryButton.textContent = "Save today’s shift";

    updateLiveEarnings();
    renderTipEntries();
  });
}

if (calculateTipoutButton) {
  calculateTipoutButton.addEventListener("click", () => {
    const totalTips = Number(totalTipsInput.value);
    const rawTipoutPercent = Number(tipoutPercentInput.value);

    if (
      !totalTipsInput.value ||
      !tipoutPercentInput.value ||
      totalTips < 0 ||
      rawTipoutPercent < 0
    ) {
      tipoutResult.classList.remove("hidden-panel");
      tipoutTotal.textContent = "$0.00";
      tipoutRemaining.textContent =
        "Enter your total tips and tip-out percentage to calculate.";
      return;
    }

    const tipoutRate =
      rawTipoutPercent <= 1 ? rawTipoutPercent : rawTipoutPercent / 100;

    const tipoutAmount = totalTips * tipoutRate;
    const remainingTips = Math.max(totalTips - tipoutAmount, 0);

    tipoutResult.classList.remove("hidden-panel");
    tipoutTotal.textContent = formatMoney(tipoutAmount);
    tipoutRemaining.textContent =
      "Remaining after tip-out: " + formatMoney(remainingTips);
  });
}
function renderMockCalendar() {
  if (!mockCalendarPanel || !mockCalendarGrid) {
    return;
  }

  const calendarDays = [
    { label: "Mon", date: "Jul 13", shifts: [] },
    { label: "Tue", date: "Jul 14", shifts: [] },
    { label: "Wed", date: "Jul 15", shifts: [] },
    {
      label: "Thu",
      date: "Jul 16",
      shifts: importedScheduleShifts.filter((shift) =>
        shift.day.includes("Thu"),
      ),
    },
    {
      label: "Fri",
      date: "Jul 17",
      shifts: importedScheduleShifts.filter((shift) =>
        shift.day.includes("Fri"),
      ),
    },
    { label: "Sat", date: "Jul 18", shifts: [] },
    {
      label: "Sun",
      date: "Jul 19",
      shifts: importedScheduleShifts.filter((shift) =>
        shift.day.includes("Sun"),
      ),
    },
  ];

  mockCalendarGrid.innerHTML = calendarDays
    .map((day) => {
      const shiftBlocks = day.shifts.length
        ? day.shifts
            .map(
              (shift) => `
                <div class="mock-calendar-shift">
                  <strong>${shift.role}</strong>
                  <span>${shift.time}</span>
                  <span>${shift.workplace}</span>
                </div>
              `,
            )
            .join("")
        : `<p class="mock-calendar-empty">No shift</p>`;

      return `
        <article class="mock-calendar-day ${day.shifts.length ? "has-shift" : ""}">
          <div class="mock-calendar-date">
            <span>${day.label}</span>
            <strong>${day.date}</strong>
          </div>
          ${shiftBlocks}
        </article>
      `;
    })
    .join("");

  mockCalendarPanel.classList.remove("hidden-panel");
}

function renderImportedShifts() {
  importedShiftList.innerHTML = "";

  const responses = getShiftResponses();

  const confirmedCatchShifts = getShiftStore().filter((shift) => {
    return (
      shift.owner === CURRENT_USER.id &&
      shift.status === "Transferred" &&
      shift.previousOwner !== CURRENT_USER.id
    );
  });

  const scheduledShifts = getShiftStore().filter((shift) => {
    return shift.owner === CURRENT_USER.id && shift.status !== "Transferred";
  });
  const myShifts = [...scheduledShifts, ...confirmedCatchShifts];
  myShifts.forEach((shift) => {
    const isReleaseActive =
      activeScheduleAction?.shiftId === shift.id &&
      activeScheduleAction.type === "release";

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

    const isConfirmedCatch =
      shift.owner === CURRENT_USER.id &&
      shift.previousOwner &&
      shift.previousOwner !== CURRENT_USER.id &&
      Boolean(shift.transferredAt);
    const shiftSourceLabel = isConfirmedCatch
      ? "Caught shift"
      : shift.status === "Pending Approval"
        ? "Pending Approval"
        : shift.status === "Pending Coverage"
          ? "Pending Coverage"
          : "Imported shift";
    const station = shift.station || "Station not provided";
    const manager = shift.manager || "Manager not provided";
    const notes = shift.notes || shift.note || "No notes provided.";

    const transferContextMarkup = isConfirmedCatch
      ? `
    <p class="shift-transfer-context">
      Coverage approved through Catch
    </p>
  `
      : "";

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";
    shiftCard.innerHTML = `
      <div class="stack-copy">
       <p class="stack-kicker">${shiftSourceLabel}</p>
        <h3>${shift.day}</h3>
        
<p>${shift.role}</p>

${transferContextMarkup}
        <ul class="shift-meta">
  <li>${shift.time}</li>
  <li>${shift.neighborhood}</li>
</ul>
<ul class="shift-meta">
  <li>${shift.workplace}</li>
  <li>${station}</li>
</ul>
<p>Manager: ${manager}</p>
<p>${notes}</p>
      </div>
      <div class="shift-action-row">
    <button
  class="action-button imported-details-button"
  type="button"
  data-shift-id="${shift.id}"
>
  View details

  
  
</div>
      ${releasePrompt}
     
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
      renderMockCalendar();
    });
  });

  document.querySelectorAll(".imported-details-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shiftId = button.dataset.shiftId;

      const shift =
        myShifts.find((item) => item.id === shiftId) ||
        getAllShifts().find((item) => item.id === shiftId);

      if (!shift) {
        return;
      }

      openShiftDetails(shift);
    });
  });

  document.querySelectorAll(".post-to-crew-button").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = importedScheduleShifts.find(
        (item) => item.id === button.dataset.shiftId,
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
        (item) => item.id === button.dataset.shiftId,
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
        note: `Pickup opportunity from ${
          selectedScheduleSource || "imported schedule"
        }.`,
        postType: "Offer pickup",
        postedTo: "Workplace crew",
      });
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
      postShiftStatus.textContent =
        "Choose the workplace and shift details before posting.";
      return;
    }

    const savedShifts = readLocalJson(shiftsStorageKey, []);
    const newShift = {
      id: `shift-${Date.now()}`,
      ...formData,
      status: "Open",
      releasedAt: getCatchEventTime(),
      releasedTimestamp: Date.now(),
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

if (developerToggle && developerSwitcher) {
  developerToggle.addEventListener("click", () => {
    const isCollapsed = developerSwitcher.classList.toggle("is-collapsed");

    developerToggle.setAttribute("aria-expanded", String(!isCollapsed));
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
    if (importScheduleDetails) {
      importScheduleDetails.open = false;
    }

    if (scheduleStatusHeading) {
      scheduleStatusHeading.textContent = "Schedule connected";
    }

    if (scheduleStatusCopy) {
      scheduleStatusCopy.textContent = `${selectedScheduleSource} is connected. Your upcoming shifts are ready below.`;
    }

    activeScheduleAction = null;

    connectionButtons.forEach((connectionButton) => {
      const isActive = connectionButton === button;
      connectionButton.classList.toggle("active", isActive);
    });

    connectionStatusPanel.classList.remove("hidden-panel");
    importedShiftsPanel.classList.remove("hidden-panel");
    connectionStatusMessage.textContent = "Schedule imported";
    connectionStatusDetail.textContent = `3 upcoming shifts found from ${selectedScheduleSource}.`;
    renderImportedShifts();
    renderMockCalendar();
  });
});

function updateProfileSummary(profileData) {
  if (
    !profileSummaryCard ||
    !profileRoleSummary ||
    !profileNeighborhoodSummary ||
    !profileGoalSummary
  ) {
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

if (demoUserSelect) {
  demoUserSelect.value = savedDemoUser;
  demoUserSelect.addEventListener("change", () => {
    const selectedUser = DEMO_USERS[demoUserSelect.value];

    if (!selectedUser) {
      return;
    }

    CURRENT_USER = selectedUser;

    localStorage.setItem(demoUserStorageKey, demoUserSelect.value);

    renderImportedShifts();
    renderShiftBoard();
    renderDashboardShift();
  });
}

mockPreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    const statusPanel = button
      .closest(".app-section")
      .querySelector(".status-text");

    if (statusPanel) {
      statusPanel.textContent = message;
    }
  });
});

const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
applyTheme(savedTheme);

const savedProfile = readLocalJson(profileStorageKey, {});
updateProfileSummary(savedProfile);

initializeShiftStore();

renderShiftBoard();
renderImportedShifts();
renderDashboardShift();
renderTipEntries();
setActiveScheduleView("my-shifts");
openCrewShift(
  {
    id: "crew-default",
    workplace: "Departure Lounge",
    role: "Bartender",
    day: "Friday, July 10",
    time: "6 PM-Close",
    postType: "Release shift",
    status: "Open",
  },
  false,
);
crewActionStatus.textContent =
  "Select a shift to review the active Shift Crew.";

applyHashSection();
window.addEventListener("hashchange", applyHashSection);

/* ==================================================
   JOBS PILLAR — SCREEN NAVIGATION
   Connects the Jobs Home, Explore Intro,
   and Explore Categories screens.
================================================== */

(() => {
  /* ----------------------------------------------
     STEP 1: FIND THE JOBS PILLAR
  ---------------------------------------------- */

  const jobsSection = document.querySelector(
    '.app-section[data-section="jobs"]',
  );

  /* Stop if the Jobs pillar does not exist */
  if (!jobsSection) return;

  /* ----------------------------------------------
     STEP 2: FIND ALL JOBS SCREENS
  ---------------------------------------------- */

  const jobsViews = jobsSection.querySelectorAll("[data-jobs-view]");

  /* ----------------------------------------------
     STEP 3: CREATE THE SCREEN-SWITCHING FUNCTION
  ---------------------------------------------- */

  function showJobsView(viewName) {
    jobsViews.forEach((view) => {
      const isSelectedView = view.dataset.jobsView === viewName;

      /* Show the selected screen */
      view.hidden = !isSelectedView;

      /* Add animation class to selected screen */
      view.classList.toggle("is-active", isSelectedView);
    });

    /* Return the user to the top of Jobs */
    jobsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /* ----------------------------------------------
     STEP 4: LISTEN FOR JOBS BUTTON CLICKS
  ---------------------------------------------- */

  jobsSection.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-jobs-view]");

    /* Ignore clicks that are not navigation buttons */
    if (!trigger) return;

    /* Read the destination from the HTML */
    const destination = trigger.dataset.openJobsView;

    /* Open the requested Jobs screen */
    showJobsView(destination);
  });

  /* ----------------------------------------------
     STEP 5: RESET JOBS WHEN BOTTOM NAV IS CLICKED
  ---------------------------------------------- */

  const jobsNavButton = document.querySelector('.nav-item[data-target="jobs"]');

  if (jobsNavButton) {
    jobsNavButton.addEventListener("click", () => {
      showJobsView("home");
    });
  }
})();

/* ==================================================
   JOBS APPLICATION — STATE MANAGEMENT

   Controls:
   - Resume readiness
   - Submit button availability
   - Application heading and guidance
   - Saving the application draft
================================================== */

(() => {
  /* ----------------------------------------------
     STEP 1: FIND THE APPLICATION CONTROLS
  ---------------------------------------------- */

  const applicationPrepView = document.querySelector(
    '[data-jobs-view="juniper-application-prep"]',
  );

  /* Stop if the Application Preparation screen is missing */
  if (!applicationPrepView) return;

  /* Temporary controls used while building Industry */
  const INDUSTRY_TRACK_DEV_MODE = false;

  /* Resume readiness elements */
  const resumeItem = applicationPrepView.querySelector(
    '[data-readiness-item="resume"]',
  );

  const resumeStatus = applicationPrepView.querySelector(
    "[data-resume-status]",
  );

  const addResumeButton = applicationPrepView.querySelector(
    '[data-action="add-resume"]',
  );

  /* Final application elements */
  const applicationHeading = applicationPrepView.querySelector(
    "[data-application-heading]",
  );

  const applicationGuidance = applicationPrepView.querySelector(
    "[data-application-guidance]",
  );

  const applicationEyebrow = applicationPrepView.querySelector(
    "[data-application-eyebrow]",
  );

  const submitApplicationButton = applicationPrepView.querySelector(
    '[data-action="submit-application"]',
  );

  const saveApplicationButton = applicationPrepView.querySelector(
    '[data-action="save-application"]',
  );

  /* Optional application message */
  const applicationMessage = applicationPrepView.querySelector(
    "#juniper-application-message",
  );

  /* Application Preparation hero and navigation */
  const applicationBackButton = applicationPrepView.querySelector(
    "[data-application-back]",
  );

  const applicationHeroEyebrow = applicationPrepView.querySelector(
    "[data-application-hero-eyebrow]",
  );

  const applicationTitle = applicationPrepView.querySelector(
    "[data-application-title]",
  );

  const applicationLead = applicationPrepView.querySelector(
    "[data-application-lead]",
  );

  /* Buttons inside the Application Readiness cards */
  const applicationReadinessButtons = applicationPrepView
    ? applicationPrepView.querySelectorAll(".jobs-readiness-item button")
    : [];

  /* ------------------------------------------------
   TRACK APPLICATION: STATUS OUTPUTS

   These elements live on the My Applications screen,
   so they are searched from the full document.
------------------------------------------------ */

  const trackApplicationStatus = document.querySelector(
    "[data-track-application-status]",
  );

  const trackApplicationNextStep = document.querySelector(
    "[data-track-application-next-step]",
  );

  const trackApplicationBadge = document.querySelector(
    "[data-track-application-badge]",
  );

  const trackApplicationGuidance = document.querySelector(
    "[data-track-guidance]",
  );

  const trackApplicationAction = document.querySelector(
    "[data-track-application-action]",
  );

  /* Track application update timestamp */
  const trackApplicationUpdatedRow = document.querySelector(
    "[data-track-updated-row]",
  );

  const trackApplicationUpdated = document.querySelector(
    "[data-track-application-updated]",
  );

  /* ------------------------------------------------
   TRACK APPLICATION: DEV STATUS CONTROL

   Finds the temporary dropdown used to simulate
   employer updates during development.
------------------------------------------------ */

  const trackStatusControl = document.querySelector(
    "[data-track-status-control]",
  );

  const trackDevControl = document.querySelector("[data-track-dev-control]");

  /* ----------------------------------------------
     STEP 2: CREATE THE APPLICATION STATE
  ---------------------------------------------- */

  const APPLICATION_STORAGE_KEY = "industry-juniper-application";

  /* Starting state used when no saved application exists */
  const defaultApplicationState = {
    resumeComplete: false,
    draftSaved: false,
    submitted: false,

    /* Application tracking information */
    statusKey: "submitted",
    status: "Submitted",
    nextStep: "Waiting for employer response",
    guidance: "Your application has been submitted to Juniper House.",
    updatedAt: null,

    message: "",
  };

  /* Look for an existing application saved in the browser */
  function loadApplicationState() {
    const savedState = localStorage.getItem(APPLICATION_STORAGE_KEY);

    /* Use the starting state when nothing has been saved */
    if (!savedState) {
      return { ...defaultApplicationState };
    }

    try {
      const parsedState = JSON.parse(savedState);

      /* Combine saved information with the default structure */
      return {
        ...defaultApplicationState,
        ...parsedState,
      };
    } catch (error) {
      console.warn("Industry could not load the saved application.", error);

      return { ...defaultApplicationState };
    }
  }

  /* This object becomes the current application data */
  const applicationState = loadApplicationState();

  /* Convert the saved timestamp into readable text */
  function formatApplicationUpdatedAt(timestamp) {
    if (!timestamp) return "";

    const updatedDate = new Date(timestamp);

    if (Number.isNaN(updatedDate.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(updatedDate);
  }

  /* ----------------------------------------------
     STEP 3: UPDATE THE APPLICATION INTERFACE
  ---------------------------------------------- */

  const trackApplicationActionLabels = {
    submitted: "View application",
    viewed: "View application",
    "interview-requested": "Review interview",
    "offer-received": "Review offer",
    "not-selected": "Explore opportunities",
  };

  function updateApplicationInterface() {
    const resumeIsComplete = applicationState.resumeComplete;
    const applicationIsSubmitted = applicationState.submitted;

    /* ------------------------------------------------
   TRACK APPLICATION: RENDER CURRENT PROGRESS

   Reads the application tracking state and places
   it into the My Applications status card.
------------------------------------------------ */

    if (trackApplicationStatus) {
      trackApplicationStatus.textContent = applicationState.status;
    }

    if (trackApplicationNextStep) {
      trackApplicationNextStep.textContent = applicationState.nextStep;
    }

    /* Update the application card badge */
    if (trackApplicationBadge) {
      trackApplicationBadge.textContent = applicationState.status;
      trackApplicationBadge.dataset.trackStatus = applicationState.statusKey;
    }

    /* Update the application card guidance */
    if (trackApplicationGuidance) {
      trackApplicationGuidance.textContent = applicationState.guidance;
    }

    /* Update the Track application action */
    if (trackApplicationAction) {
      const actionLabel =
        trackApplicationActionLabels[applicationState.statusKey] ||
        "View application";

      let actionDestination = "juniper-application-prep";

      if (applicationState.statusKey === "interview-requested") {
        actionDestination = "juniper-interview";
      }

      if (applicationState.statusKey === "offer-received") {
        actionDestination = "juniper-offer";
      }

      if (applicationState.statusKey === "not-selected") {
        actionDestination = "explore-intro";
      }

      trackApplicationAction.textContent = actionLabel;
      trackApplicationAction.dataset.openJobsView = actionDestination;
    }

    /* Update the application timestamp */
    const formattedUpdatedAt = formatApplicationUpdatedAt(
      applicationState.updatedAt,
    );

    if (trackApplicationUpdatedRow) {
      trackApplicationUpdatedRow.hidden =
        !applicationIsSubmitted || !formattedUpdatedAt;
    }

    if (trackApplicationUpdated) {
      trackApplicationUpdated.textContent =
        formattedUpdatedAt || "Status date unavailable";
    }

    /* Show temporary employer controls only in development mode */
    if (trackDevControl) {
      trackDevControl.hidden = !INDUSTRY_TRACK_DEV_MODE;
    }

    if (trackStatusControl) {
      trackStatusControl.disabled = !INDUSTRY_TRACK_DEV_MODE;
    }

    /* Keep the DEV dropdown synchronized with saved state */
    if (trackStatusControl) {
      trackStatusControl.value = applicationState.statusKey;
    }

    /* ------------------------------------------------
     APPLICATION SCREEN MODE

     Before submission:
     - Returns to Server role
     - Shows preparation language

     After submission:
     - Returns to My Applications
     - Shows application-detail language
  ------------------------------------------------ */

    if (applicationBackButton) {
      applicationBackButton.textContent = applicationIsSubmitted
        ? "← My Applications"
        : "← Server role";

      applicationBackButton.dataset.openJobsView = applicationIsSubmitted
        ? "track"
        : "juniper-server-role";

      applicationBackButton.setAttribute(
        "aria-label",
        applicationIsSubmitted
          ? "Return to My Applications"
          : "Return to Server role",
      );
    }

    if (applicationHeroEyebrow) {
      applicationHeroEyebrow.textContent = applicationIsSubmitted
        ? "Application Details"
        : "Application Preparation";
    }

    if (applicationTitle) {
      applicationTitle.textContent = applicationIsSubmitted
        ? "Your submitted application."
        : "Get ready to apply.";
    }

    if (applicationLead) {
      applicationLead.textContent = applicationIsSubmitted
        ? "Review the materials sent to Juniper House and follow its current status in My Applications."
        : "Review what Juniper House will receive and complete anything that still needs attention.";
    }

    /* ------------------------------------------------
   SUBMITTED APPLICATION: READ-ONLY MODE
------------------------------------------------ */

    if (applicationPrepView) {
      applicationPrepView.classList.toggle(
        "is-submitted",
        applicationIsSubmitted,
      );
    }

    applicationReadinessButtons.forEach((button) => {
      button.hidden = applicationIsSubmitted;
      button.disabled = applicationIsSubmitted;
    });

    /* Update the Resume readiness card */
    if (resumeItem) {
      resumeItem.classList.toggle("is-complete", resumeIsComplete);
    }

    /* Update the Resume status label */
    if (resumeStatus) {
      resumeStatus.textContent = resumeIsComplete
        ? "Complete"
        : "Needs attention";
    }

    /* Update the Resume action button */
    if (addResumeButton) {
      addResumeButton.textContent = resumeIsComplete ? "Review" : "Add resume";
    }

    /* Update the final application heading */
    if (applicationHeading) {
      if (applicationIsSubmitted) {
        applicationHeading.textContent = "Application submitted.";
      } else {
        applicationHeading.textContent = resumeIsComplete
          ? "Your application is ready."
          : "Complete your resume to continue.";
      }
    }

    /* Update the final application guidance */
    if (applicationGuidance) {
      if (applicationIsSubmitted) {
        applicationGuidance.textContent =
          "Juniper House has received your application.";
      } else {
        applicationGuidance.textContent = resumeIsComplete
          ? "Review your materials and submit when you are ready."
          : "Industry will keep this application here while you finish preparing your materials.";
      }
    }
    /* Update the final application eyebrow */
    if (applicationEyebrow) {
      if (applicationIsSubmitted) {
        applicationEyebrow.textContent = "Application Sent";
      } else {
        applicationEyebrow.textContent = resumeIsComplete
          ? "Ready to Apply"
          : "Almost Ready";
      }
    }

    /* Control the Submit button */
    if (submitApplicationButton) {
      submitApplicationButton.disabled =
        !resumeIsComplete || applicationIsSubmitted;

      submitApplicationButton.textContent = applicationIsSubmitted
        ? "Application submitted"
        : "Submit application →";
    }
    /* Hide Save for later after submission */
    if (saveApplicationButton) {
      saveApplicationButton.hidden = applicationIsSubmitted;
    }
    /* Restore and control the introduction message */
    if (applicationMessage) {
      applicationMessage.value = applicationState.message;
      applicationMessage.readOnly = applicationIsSubmitted;

      applicationMessage.setAttribute(
        "aria-readonly",
        String(applicationIsSubmitted),
      );
    }
  } // closes updateApplicationInterface()

  /* Draw the current state when the page loads */
  updateApplicationInterface();

  /* ----------------------------------------------
     STEP 4: COMPLETE THE RESUME REQUIREMENT
  ---------------------------------------------- */

  if (addResumeButton) {
    addResumeButton.addEventListener("click", () => {
      /* Simulate adding a resume */
      applicationState.resumeComplete = true;

      /* Save the updated state in the browser */
      localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify(applicationState),
      );

      /* Redraw the interface with the new state */
      updateApplicationInterface();
    });
  }

  /* ----------------------------------------------
   STEP 5: SAVE THE APPLICATION DRAFT
---------------------------------------------- */

  /* Keep the message in the current state while typing */
  if (applicationMessage) {
    applicationMessage.addEventListener("input", () => {
      applicationState.message = applicationMessage.value;

      /* New typing means the latest version is not saved yet */
      applicationState.draftSaved = false;
    });
  }

  /* Save the application when Save for later is clicked */
  if (saveApplicationButton) {
    saveApplicationButton.addEventListener("click", () => {
      /* Capture the latest introduction message */
      if (applicationMessage) {
        applicationState.message = applicationMessage.value.trim();
      }

      applicationState.draftSaved = true;

      /* Store the complete application state */
      localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify(applicationState),
      );

      /* Give the user visible confirmation */
      saveApplicationButton.textContent = "Saved";

      window.setTimeout(() => {
        saveApplicationButton.textContent = "Save for later";
      }, 1600);
    });
  }

  /* ------------------------------------------------
   | | STEP 6: SUBMIT THE APPLICATION
   ------------------------------------------------ */

  if (submitApplicationButton) {
    submitApplicationButton.addEventListener("click", () => {
      /* Stop submission if the Resume is incomplete */
      if (!applicationState.resumeComplete) return;

      /* Prevent the same application from being submitted twice */
      if (applicationState.submitted) return;

      /* Capture the latest optional message */
      if (applicationMessage) {
        applicationState.message = applicationMessage.value.trim();
      }

      /* Mark the application as submitted */
      applicationState.submitted = true;
      applicationState.draftSaved = true;
      applicationState.updatedAt = new Date().toISOString();

      /* Save the submitted state in the browser */
      localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify(applicationState),
      );

      /* Redraw the screen as a confirmation state */
      updateApplicationInterface();
    });
  }

  /* ------------------------------------------------
   STEP 7: SIMULATE EMPLOYER STATUS UPDATES

   Temporary development logic that updates the
   application status without requiring a backend.
------------------------------------------------ */

  const trackStatusOptions = {
    submitted: {
      status: "Submitted",
      nextStep: "Waiting for employer response",
      guidance: "Your application has been submitted to Juniper House.",
    },

    viewed: {
      status: "Viewed",
      nextStep: "Employer is reviewing your application",
      guidance: "Juniper House has viewed your application.",
    },

    "interview-requested": {
      status: "Interview requested",
      nextStep: "Review the interview details and respond",
      guidance: "Juniper House would like to schedule an interview.",
    },

    "offer-received": {
      status: "Offer received",
      nextStep: "Review the offer and decide your next step",
      guidance: "Juniper House has sent you an employment offer.",
    },

    "not-selected": {
      status: "Not selected",
      nextStep: "Continue exploring other opportunities",
      guidance:
        "Juniper House has completed its review and selected another candidate.",
    },
  };
  if (trackStatusControl) {
    trackStatusControl.addEventListener("change", () => {
      const selectedStatusKey = trackStatusControl.value;
      const selectedStatus = trackStatusOptions[selectedStatusKey];

      /* Stop if the selected option is not recognized */
      if (!selectedStatus) return;

      /* Update the current application state */
      applicationState.statusKey = selectedStatusKey;
      applicationState.status = selectedStatus.status;
      applicationState.nextStep = selectedStatus.nextStep;
      applicationState.guidance = selectedStatus.guidance;
      applicationState.updatedAt = new Date().toISOString();

      /* Save the employer update in the browser */
      localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify(applicationState),
      );

      /* Redraw the Track application card */
      updateApplicationInterface();
    });
  }
})();

/* ==================================================
   | | JOBS TRACK APPLICATIONS — STATE SYNC

   Reads submitted application data from localStorage
   and controls the Track Applications screen.
================================================== */

(() => {
  /* ------------------------------------------------
     | | STEP 1: FIND THE TRACK APPLICATIONS SCREEN
  ------------------------------------------------ */

  const jobsSection = document.querySelector(
    '.app-section[data-section="jobs"]',
  );

  if (!jobsSection) return;

  const trackView = jobsSection.querySelector('[data-jobs-view="track"]');

  if (!trackView) return;

  /* ------------------------------------------------
     | | STEP 2: FIND THE TRACK SCREEN ELEMENTS
  ------------------------------------------------ */

  const trackEmptyState = trackView.querySelector("[data-track-empty]");

  const trackApplicationList = trackView.querySelector("[data-track-list]");

  const juniperApplicationCard = trackView.querySelector(
    '[data-track-application="juniper-house"]',
  );

  /* ------------------------------------------------
     | | STEP 3: CONNECT TO THE SAVED APPLICATION
  ------------------------------------------------ */

  const TRACK_APPLICATION_STORAGE_KEY = "industry-juniper-application";

  function loadTrackedApplication() {
    const savedApplication = localStorage.getItem(
      TRACK_APPLICATION_STORAGE_KEY,
    );

    if (!savedApplication) {
      return null;
    }

    try {
      return JSON.parse(savedApplication);
    } catch (error) {
      console.warn("Industry could not load the tracked application.", error);

      return null;
    }
  }

  /* ------------------------------------------------
     | | STEP 4: UPDATE THE TRACK SCREEN
  ------------------------------------------------ */

  function updateTrackApplications() {
    const savedApplication = loadTrackedApplication();

    const applicationWasSubmitted = Boolean(
      savedApplication && savedApplication.submitted,
    );

    /* Show the empty state when no application was submitted */
    if (trackEmptyState) {
      trackEmptyState.hidden = applicationWasSubmitted;
    }

    /* Show the application list after submission */
    if (trackApplicationList) {
      trackApplicationList.hidden = !applicationWasSubmitted;
    }

    /* Show the Juniper House card after submission */
    if (juniperApplicationCard) {
      juniperApplicationCard.hidden = !applicationWasSubmitted;
    }
  }

  /* ------------------------------------------------
     | | STEP 5: DRAW THE INITIAL TRACK STATE
  ------------------------------------------------ */

  updateTrackApplications();

  /* ------------------------------------------------
     | | STEP 6: REFRESH WHEN TRACK IS OPENED
  ------------------------------------------------ */

  jobsSection.addEventListener("click", (event) => {
    const trackTrigger = event.target.closest('[data-open-jobs-view="track"]');

    if (!trackTrigger) return;

    updateTrackApplications();
  });
})();

/* =================================================
   JOBS: USER PROFILE
================================================== */

(() => {
  const PROFILE_STORAGE_KEY = "industry-user-profile";

  const profileForm = document.querySelector("[data-jobs-profile-form]");

  const profileNameInput = document.querySelector("[data-profile-name]");

  const profileRoleInput = document.querySelector("[data-profile-role]");

  const profileExperienceInput = document.querySelector(
    "[data-profile-experience]",
  );

  const profileLocationInput = document.querySelector(
    "[data-profile-location]",
  );

  const profileMessage = document.querySelector("[data-profile-message]");

  const profileDashboardStatus = document.querySelector(
    "[data-profile-dashboard-status]",
  );

  const profileDashboardAction = document.querySelector(
    "[data-profile-dashboard-action]",
  );

  const jobsHomeGreeting = document.querySelector("[data-jobs-home-greeting]");

  if (
    !profileForm ||
    !profileNameInput ||
    !profileRoleInput ||
    !profileExperienceInput ||
    !profileLocationInput
  ) {
    return;
  }

  const defaultProfileState = {
    preferredName: "",
    currentRole: "",
    experienceYears: "",
    location: "",
    completed: false,
    updatedAt: null,
  };

  function loadProfileState() {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

      if (!savedProfile) {
        return { ...defaultProfileState };
      }

      return {
        ...defaultProfileState,
        ...JSON.parse(savedProfile),
      };
    } catch (error) {
      console.warn("Unable to load Industry profile.", error);

      return { ...defaultProfileState };
    }
  }

  let profileState = loadProfileState();

  function profileIsComplete(profile) {
    return Boolean(
      profile.preferredName.trim() &&
      profile.currentRole.trim() &&
      String(profile.experienceYears).trim() &&
      profile.location.trim(),
    );
  }

  function saveProfileState() {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileState));
  }

  function updateProfileInterface() {
    profileNameInput.value = profileState.preferredName;
    profileRoleInput.value = profileState.currentRole;
    profileExperienceInput.value = profileState.experienceYears;
    profileLocationInput.value = profileState.location;

    if (profileDashboardStatus) {
      profileDashboardStatus.textContent = profileState.completed
        ? "Complete"
        : "Not started";

      profileDashboardStatus.dataset.profileStatus = profileState.completed
        ? "complete"
        : "not-started";
    }

    if (profileDashboardAction) {
      profileDashboardAction.textContent = profileState.completed
        ? "Edit my profile"
        : "Build my profile";
    }

    if (jobsHomeGreeting) {
      const preferredName = profileState.preferredName.trim();

      jobsHomeGreeting.textContent = preferredName
        ? `How can Industry help today, ${preferredName}?`
        : "How can Industry help today?";
    }
  }

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!profileForm.checkValidity()) {
      profileForm.reportValidity();
      return;
    }

    profileState = {
      preferredName: profileNameInput.value.trim(),
      currentRole: profileRoleInput.value.trim(),
      experienceYears: profileExperienceInput.value.trim(),
      location: profileLocationInput.value.trim(),
      completed: false,
      updatedAt: new Date().toISOString(),
    };

    profileState.completed = profileIsComplete(profileState);

    saveProfileState();
    updateProfileInterface();

    if (profileMessage) {
      profileMessage.textContent =
        "Profile saved. Industry can now use this information to personalize your experience.";

      profileMessage.hidden = false;
    }
  });

  updateProfileInterface();
})();
