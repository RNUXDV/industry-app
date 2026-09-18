const { escapeHtml } = window.IndustrySecurity;

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

const dashboardShiftKicker = document.querySelector("#dashboard-shift-kicker");

const dashboardCountdownCopy = document.querySelector(
  "#dashboard-countdown-copy",
);

const dashboardShiftCommuteStrip = document.getElementById(
  "dashboard-shift-commute-strip",
);

const dashboardShiftDay = document.querySelector("#dashboard-shift-day");

const dashboardShiftDate = document.querySelector("#dashboard-shift-date");

const dashboardShiftTime = document.querySelector("#dashboard-shift-time");

const dashboardShiftRole = document.querySelector("#dashboard-shift-role");

const dashboardShiftWorkplace = document.querySelector(
  "#dashboard-shift-workplace",
);

const dashboardNextShiftPanel = document.getElementById(
  "dashboard-next-shift-panel",
);

const myShiftsNextCard = document.querySelector("#my-shifts-next-card");

const myShiftsNextTime = document.querySelector("#my-shifts-next-time");
const myShiftsNextStatus = document.querySelector("#my-shifts-next-status");
const myShiftsNextLabel = document.getElementById("my-shifts-next-label");
const myShiftsNextRole = document.querySelector("#my-shifts-next-role");
const myShiftsNextWorkplace = document.querySelector(
  "#my-shifts-next-workplace",
);

const activityFeedList = document.querySelector("#activity-feed-list");
const scheduleSubviews = document.querySelectorAll(".schedule-subview");
const homeLogoButton = document.querySelector("#home-logo-button");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const goToFeedbackButton = document.querySelector("#go-to-feedback-button");
const startHereButton = document.querySelector("#start-here-button");
const saveShiftButton = document.querySelector("#save-shift-button");

const shiftBoardList = document.querySelector("#shift-board-list");

const caughtShiftsPanel = document.querySelector("#caught-shifts-panel");
const caughtShiftsList = document.querySelector("#caught-shifts-list");

const shiftBoardStatus = document.querySelector("#shift-board-status");
const postShiftStatus = document.querySelector("#post-shift-status");

function showActionFailure(target, message) {
  if (!target) {
    return;
  }

  target.textContent = message;
  target.hidden = false;
}

const shiftWorkplaceSelect = document.querySelector("#shift-workplace");
const workplacePreviewPanel = document.querySelector(
  "#workplace-preview-panel",
);

const managerTeamScheduleButton = document.getElementById(
  "manager-team-schedule-button",
);

const managerCreateShiftButton = document.getElementById(
  "manager-create-shift-button",
);

const managerCrewButton = document.getElementById("manager-crew-button");

const managerActivityButton = document.getElementById(
  "manager-activity-button",
);

const managerCoverageRequestsButton = document.getElementById(
  "manager-coverage-requests-button",
);

const managerTeamScheduleList = document.getElementById(
  "manager-team-schedule-list",
);

const managerCrewList = document.getElementById("manager-crew-list");

const managerInviteForm = document.getElementById("manager-invite-form");
const managerInviteEmail = document.getElementById("manager-invite-email");
const managerInviteRole = document.getElementById("manager-invite-role");
const managerVolunteerConfirmed = document.getElementById(
  "manager-volunteer-confirmed",
);
const managerInviteStatus = document.getElementById("manager-invite-status");
const managerInviteResult = document.getElementById("manager-invite-result");
const managerInviteResultCopy = document.getElementById(
  "manager-invite-result-copy",
);
const managerCopyInviteButton = document.getElementById(
  "manager-copy-invite-button",
);
const managerInviteList = document.getElementById("manager-invite-list");

const PILOT_CONSENT_VERSION = "pilot-privacy-v1";

function getSafeAuthFailureMessage(action) {
  const messages = {
    login: "We couldn't sign you in. Check your details and try again.",
    signup:
      "We couldn't finish signup here. Check the private invitation, or sign in if you already have an account.",
    recovery:
      "We couldn't send a reset link right now. Please try again later.",
    password:
      "We couldn't update your password. Please check it and try again.",
    invitation:
      "We couldn't accept this invitation. Check the private link and signed-in email, then try again.",
    createInvitation:
      "We couldn't create this invitation. Check the details and try again.",
    revokeInvitation:
      "We couldn't revoke this invitation. Please try again.",
  };

  return messages[action] || "We couldn't complete that request. Please try again.";
}

function getMembershipBlockMessage(reason, action = "leave") {
  const prefix = action === "remove" ? "This participant" : "You";
  const timing = action === "remove"
    ? "before they can be removed"
    : "before leaving the pilot";
  const messages = {
    active_shift: `${prefix} must finish the active shift ${timing}.`,
    future_shift: `${prefix} must resolve upcoming shifts ${timing}.`,
    coverage_responsibility: `${prefix} must resolve open coverage ${timing}.`,
    shift_interest: `${prefix} must withdraw or resolve shift interest ${timing}.`,
    direct_offer: `${prefix} must resolve direct shift offers ${timing}.`,
    last_manager: "The last active Manager cannot leave or be removed.",
    use_leave_pilot: "Use Leave pilot to remove your own workplace access.",
    no_active_membership: "This workplace membership is no longer active.",
  };

  return messages[reason] ||
    "The workplace membership cannot be changed until outstanding schedule responsibilities are resolved.";
}

const managerShiftWorkerSelect = document.getElementById(
  "manager-shift-worker",
);

const managerCreateShiftStatus = document.getElementById(
  "manager-create-shift-status",
);

const managerShiftRoleInput = document.getElementById("manager-shift-role");

const managerShiftDateInput = document.getElementById("manager-shift-date");

const managerShiftStartInput = document.getElementById("manager-shift-start");

const managerShiftEndInput = document.getElementById("manager-shift-end");

const managerSaveShiftButton = document.getElementById(
  "manager-save-shift-button",
);

const managerCancelShiftButton = document.getElementById(
  "manager-cancel-shift-button",
);

const managerShiftFormTitle = document.getElementById(
  "manager-shift-form-title",
);

const managerShiftFormCopy = document.getElementById("manager-shift-form-copy");

const managerShiftFormLabel = document.getElementById(
  "manager-shift-form-label",
);

const managerShiftFormPanelTitle = document.getElementById(
  "manager-shift-form-panel-title",
);

let editingManagerShiftId = null;

function setManagerShiftFormMode(mode = "create") {
  const isEdit = mode === "edit";

  if (managerShiftFormTitle) {
    managerShiftFormTitle.textContent = isEdit ? "Edit Shift" : "Create Shift";
  }

  if (managerShiftFormCopy) {
    managerShiftFormCopy.textContent = isEdit
      ? "Update this scheduled shift for your workplace crew."
      : "Assign a new shift to a member of your workplace crew.";
  }

  if (managerShiftFormLabel) {
    managerShiftFormLabel.textContent = isEdit
      ? "Scheduled Shift"
      : "New Shift";
  }

  if (managerShiftFormPanelTitle) {
    managerShiftFormPanelTitle.textContent = isEdit
      ? "Edit shift details"
      : "Shift details";
  }

  if (managerSaveShiftButton) {
    managerSaveShiftButton.textContent = isEdit
      ? "Save Changes"
      : "Create Shift";
  }

  if (managerCancelShiftButton) {
    managerCancelShiftButton.hidden = !isEdit;
  }
}

function getManagerShiftInputValues(shift) {
  const timeZone =
    shift.workplaceTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getParts = (isoString) => {
    if (!isoString) {
      return null;
    }

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(isoString));

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );

    return {
      date: `${values.year}-${values.month}-${values.day}`,
      time: `${values.hour}:${values.minute}`,
    };
  };

  const start = getParts(shift.startsAt);
  const end = getParts(shift.endsAt);

  const runsUntilClose = String(shift.endLabel || "").toLowerCase() === "close";

  return {
    date: start?.date || "",
    startTime: start?.time || "",
    endTime: runsUntilClose ? "" : end?.time || "",
  };
}

const catchBackButton = document.getElementById("catch-back-button");
const catchSectionLabel = document.getElementById("catch-section-label");
const catchViewTitle = document.getElementById("catch-view-title");
const catchViewCopy = document.getElementById("catch-view-copy");
const catchViewHelper = document.getElementById("catch-view-helper");

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

const directReleaseDivider =
  document.querySelector("#direct-release-divider");

const developerToggle = document.querySelector("#developer-toggle");
const developerSwitcher = document.querySelector("#developer-switcher");

/* Global developer tools visibility */
const INDUSTRY_DEVELOPER_TOOLS_ENABLED = false;

if (developerToggle) {
  developerToggle.hidden = !INDUSTRY_DEVELOPER_TOOLS_ENABLED;
  developerToggle.setAttribute("aria-expanded", "false");
}

if (developerSwitcher) {
  developerSwitcher.hidden = !INDUSTRY_DEVELOPER_TOOLS_ENABLED;
  developerSwitcher.classList.add("is-collapsed");
}

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
    day: "Thu, July 16",

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
    day: "Sat, July 18",

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
    day: "Sun, July 19",
    time: "9:00 AM - 3:00 PM",
    neighborhood: "Portland Metro",
    note: "Extra brunch shift available. Fast feet matter.",
    postType: "Release shift",
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
    notes: "Busy brunch block. Fast-paced service with a strong crew.",
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

const savedDemoUser = "original";

let CURRENT_USER = DEMO_USERS.original;
let authenticatedScheduleShifts = undefined;
let authenticatedEndedScheduleShifts = undefined;
let authenticatedCatchShifts = undefined;
let authenticatedShiftInterests = undefined;
let authenticatedCoverageEvents = undefined;
let authenticatedTeamScheduleShifts = undefined;
let authenticatedManagerCrew = [];
let authenticatedWorkplaceCrew = [];
let authenticatedManagerDirectApprovals = [];
let authenticatedWorkplaceId = null;
let authenticatedWorkplaceRole = null;
let authenticatedUserId = null;
let authenticatedDisplayName = "";
let activePilotObserverWorkplace = null;
let pilotObserverRealtimeChannel = null;
let pilotObserverAuthorizationTimer = null;
let pilotObserverStaleTimer = null;
let selectedScheduleSource = "";
let activeScheduleAction = null;
let selectedReleaseShift = null;
let activeCrewShiftId = "";
let activeTipEntryId = "";
let industryRealtimeChannel = null;

function setActiveScheduleView(viewName) {
  const resolvedViewName =
    viewName === "my-shifts" &&
      authenticatedWorkplaceRole?.toLowerCase() === "manager"
      ? "manager-schedule"
      : viewName;

  if (resolvedViewName === "my-shifts") {
    renderImportedShifts();
  }

  if (resolvedViewName === "activity-feed") {
    renderActivityFeed();
  }

  if (scheduleHub) {
    scheduleHub.classList.add("hidden-panel");
  }

  scheduleViewCards.forEach((card) => {
    card.classList.toggle(
      "active",
      card.dataset.scheduleView === resolvedViewName,
    );
  });

  scheduleSubviews.forEach((subview) => {
    subview.classList.toggle(
      "active",
      subview.dataset.scheduleSubview === resolvedViewName,
    );
  });
}

function getShiftDateValue(shift) {
  if (shift.startsAt) {
    return new Date(shift.startsAt).getTime();
  }

  const dateText = shift.day.replace(/^[A-Za-z]{3},\s*/, "");

  return new Date(`${dateText}, 2026`).getTime();
}

function getShiftStartDate(shift) {
  // Real backend shifts use an ISO timestamp.
  if (shift.startsAt) {
    return new Date(shift.startsAt);
  }

  // Existing prototype/demo shifts keep using day + time.
  const dateText = shift.day.replace(/^[A-Za-z]{3},\s*/, "");
  const startTimeText = shift.time.split(/\s*[—-]\s*/)[0].trim();

  return new Date(`${dateText}, 2026 ${startTimeText}`);
}

function isCurrentShift(shift) {
  if (!shift?.startsAt || shift.actualEndedAt) {
    return false;
  }

  const now = new Date();
  const start = new Date(shift.startsAt);

  if (start > now) {
    return false;
  }

  // If an exact end time exists, use it.
  if (shift.endsAt) {
    const end = new Date(shift.endsAt);
    return now < end;
  }

  // For open-ended shifts such as "Close", allow the shift
  // to continue past midnight, but never indefinitely.
  const maxOpenShiftHours = 18;
  const maxOpenShiftEnd = new Date(
    start.getTime() + maxOpenShiftHours * 60 * 60 * 1000,
  );

  return now < maxOpenShiftEnd;
}

function getCountdownText(shift) {
  const shiftStart = getShiftStartDate(shift);
  const referenceNow = shift.startsAt ? new Date() : DEMO_NOW;
  const differenceMs = shiftStart.getTime() - referenceNow.getTime();
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

  const referenceNow = shift.startsAt ? new Date() : DEMO_NOW;
  const demoDay = new Date(referenceNow);
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

async function loadAuthenticatedDashboardShift() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  const nowIso = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from("shifts")
    .select(
      `
      id,
      assigned_profile_id,
      role,
      starts_at,
      ends_at,
      end_label,
      status,
actual_started_at,
reported_started_at,
start_recorded_at,
start_time_source,
actual_ended_at,
      workplace:workplaces (
        name,
        time_zone
      )
    `,
    )
    .eq("assigned_profile_id", user.id)
    .eq("status", "scheduled")
    .is("actual_ended_at", null)
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return;
  }

  if (!data) {
    renderDashboardShift(null);
    return;
  }

  const timeZone =
    data.workplace?.time_zone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startDate = new Date(data.starts_at);

  const day = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  });

  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });

  let endText = data.end_label || "";

  if (data.ends_at) {
    endText = new Date(data.ends_at).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
  }

  const dashboardShift = {
    id: data.id,
    owner: user.id,
    day,
    time: endText ? `${startTime} – ${endText}` : startTime,
    role: data.role || "",
    workplace: data.workplace?.name || "",
    status: data.status,
    startsAt: data.starts_at,
    endsAt: data.ends_at || null,
    endLabel: data.end_label || "",
    actualStartedAt: data.actual_started_at || null,
    reportedStartedAt: data.reported_started_at || null,
    startRecordedAt: data.start_recorded_at || null,
    startTimeSource: data.start_time_source || null,
    actualEndedAt: data.actual_ended_at || null,
  };

  renderDashboardShift(dashboardShift);
}

async function loadAuthenticatedSchedule() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayStartIso = todayStart.toISOString();

  const scheduleLookbackIso = new Date(
    Date.now() - 18 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabaseClient
    .from("shifts")
    .select(
      `
    id,
    assigned_profile_id,
        manager_profile:profiles!shifts_manager_profile_id_fkey (
      full_name
    ),
    role,
    starts_at,
    ends_at,
    end_label,
    status,
    actual_started_at,
    reported_started_at,
    start_recorded_at,
    start_time_source,
    actual_ended_at,
    workplace:workplaces (
      name,
      time_zone
    )
  `,
    )
    .eq("assigned_profile_id", user.id)
    .in("status", ["scheduled", "coverage_needed"])
    .is("actual_ended_at", null)
    .gte("starts_at", scheduleLookbackIso)
    .order("starts_at", { ascending: true });

  const { data: endedData, error: endedError } = await supabaseClient
    .from("shifts")
    .select(
      `
      id,
      assigned_profile_id,
          manager_profile:profiles!shifts_manager_profile_id_fkey (
      full_name
    ),
      role,
      starts_at,
      ends_at,
      end_label,
      status,
      actual_started_at,
      reported_started_at,
start_recorded_at,
start_time_source,
      actual_ended_at,
      reported_ended_at,
      end_recorded_at,
      end_time_source,
      workplace:workplaces (
        name,
        time_zone
      )
    `,
    )
    .eq("assigned_profile_id", user.id)
    .not("actual_ended_at", "is", null)
    .gte("actual_ended_at", todayStartIso)
    .order("actual_ended_at", { ascending: false });

  if (error) {
    return;
  }

  if (endedError) {
    authenticatedEndedScheduleShifts = [];
  }

  authenticatedScheduleShifts = (data || [])
    .map((shift) => {
      const timeZone =
        shift.workplace?.time_zone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      const startDate = new Date(shift.starts_at);

      const day = startDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone,
      });

      const startTime = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      });

      let endText = shift.end_label || "";

      if (shift.ends_at) {
        endText = new Date(shift.ends_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone,
        });
      }

      return {
        id: shift.id,
        owner: shift.assigned_profile_id,
        manager: shift.manager_profile?.full_name || "",
        day,
        time: endText ? `${startTime} – ${endText}` : startTime,
        role: shift.role || "",
        workplace: shift.workplace?.name || "",
        status: shift.status,
        startsAt: shift.starts_at,
        endsAt: shift.ends_at || null,
        endLabel: shift.end_label || "",
        actualStartedAt: shift.actual_started_at || null,
        reportedStartedAt: shift.reported_started_at || null,
        startRecordedAt: shift.start_recorded_at || null,
        startTimeSource: shift.start_time_source || null,
        actualEndedAt: shift.actual_ended_at || null,
      };
    })
    .filter((shift) => {
      const now = new Date();
      const start = new Date(shift.startsAt);

      return start > now || isCurrentShift(shift);
    });

  authenticatedEndedScheduleShifts = (endedData || []).map((shift) => {
    const timeZone =
      shift.workplace?.time_zone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startDate = new Date(shift.starts_at);

    const day = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone,
    });

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });

    let endText = shift.end_label || "";

    if (shift.ends_at) {
      endText = new Date(shift.ends_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      });
    }

    const clockedOutTime = shift.reported_ended_at
      ? new Date(shift.reported_ended_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      })
      : "";

    const recordedInIndustryTime = shift.end_recorded_at
      ? new Date(shift.end_recorded_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      })
      : "";

    return {
      id: shift.id,
      owner: shift.assigned_profile_id,
      manager: shift.manager_profile?.full_name || "",
      day,
      time: endText ? `${startTime} – ${endText}` : startTime,
      role: shift.role || "",
      workplace: shift.workplace?.name || "",
      status: shift.status,
      startsAt: shift.starts_at,
      endsAt: shift.ends_at || null,
      endLabel: shift.end_label || "",
      actualStartedAt: shift.actual_started_at || null,
      actualEndedAt: shift.actual_ended_at || null,
      reportedEndedAt: shift.reported_ended_at || null,
      endRecordedAt: shift.end_recorded_at || null,
      endTimeSource: shift.end_time_source || null,
      clockedOutTime,
      recordedInIndustryTime,
    };
  });

  renderAuthenticatedNextShiftSummary(authenticatedScheduleShifts);
  renderImportedShifts(authenticatedScheduleShifts);


  const nextScheduledShift = authenticatedScheduleShifts.find(
    (shift) => shift.status === "scheduled",
  );

  renderDashboardShift(nextScheduledShift || null);
}

async function loadAuthenticatedWorkplaceCrew() {
  if (!authenticatedWorkplaceId) {
    return [];
  }

  const { data: memberships, error: membershipError } =
    await supabaseClient
      .from("workplace_members")
      .select("profile_id, role")
      .eq("workplace_id", authenticatedWorkplaceId)
      .eq("membership_status", "active");

  if (membershipError) {
    throw membershipError;
  }

  const profileIds = (memberships || [])
    .map((membership) => membership.profile_id)
    .filter(Boolean);

  if (!profileIds.length) {
    return [];
  }

  const { data: profiles, error: profileError } =
    await supabaseClient
      .from("profiles")
      .select("id, full_name")
      .in("id", profileIds);

  if (profileError) {
    throw profileError;
  }

  const profilesById = new Map(
    (profiles || []).map((profile) => [profile.id, profile])
  );

  return (memberships || [])
    .map((membership) => {
      const profile = profilesById.get(membership.profile_id);

      return {
        id: membership.profile_id,
        name: profile?.full_name || "Crew member",
        role: membership.role || "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function loadAuthenticatedManagerCrew() {
  if (!managerShiftWorkerSelect) {
    return;
  }

  managerShiftWorkerSelect.innerHTML = `
    <option value="">Choose a crew member</option>
    <option value="open">Open Shift</option>
  `;

  if (
    authenticatedWorkplaceRole?.toLowerCase() !== "manager" ||
    !authenticatedWorkplaceId
  ) {
    return;
  }

  if (managerCreateShiftStatus) {
    managerCreateShiftStatus.textContent = "Loading workplace crew...";
  }

  try {
    const crew = await loadAuthenticatedWorkplaceCrew();

    authenticatedManagerCrew = crew;

    crew.forEach((member) => {
      const option = document.createElement("option");

      option.value = member.id;

      option.textContent = member.role
        ? `${member.name} · ${member.role}`
        : member.name;

      managerShiftWorkerSelect.appendChild(option);
    });

    if (managerCreateShiftStatus) {
      managerCreateShiftStatus.textContent = crew.length
        ? ""
        : "No workplace members found.";
    }

    return crew;
  } catch (error) {
    authenticatedManagerCrew = [];

    if (managerCreateShiftStatus) {
      managerCreateShiftStatus.textContent =
        "Unable to load workplace crew.";
    }

    return [];
  }
}
function renderAuthenticatedManagerCrew(crew = authenticatedManagerCrew) {
  if (!managerCrewList) {
    return;
  }

  managerCrewList.innerHTML = "";

  if (!crew?.length) {
    managerCrewList.innerHTML = `
      <article class="stack-card shift-card">
        <div class="stack-copy">
          <p class="stack-kicker">Workplace crew</p>
          <h3>No crew members found</h3>
          <p>Connected workplace members will appear here.</p>
        </div>
      </article>
    `;

    return;
  }

  crew.forEach((member) => {
    const isManager = member.role?.toLowerCase() === "manager";

    const memberCard = document.createElement("article");
    memberCard.className = "stack-card shift-card";

    memberCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">
          ${isManager ? "Manager" : "Crew member"}
        </p>

        <h3>${escapeHtml(member.name)}</h3>

        <ul class="shift-meta">
          <li>${escapeHtml(member.role || "Role not set")}</li>
        </ul>
      </div>
    `;

    if (member.id && member.id !== authenticatedUserId) {
      const actions = document.createElement("div");
      actions.className = "manager-invite-card-actions";

      const removeButton = document.createElement("button");
      removeButton.className = "action-button secondary-action destructive-action";
      removeButton.type = "button";
      removeButton.textContent = "Remove from pilot";

      const status = document.createElement("p");
      status.className = "status-text";
      status.setAttribute("aria-live", "polite");

      removeButton.addEventListener("click", async () => {
        const confirmed = window.confirm(
          `Remove ${member.name || "this participant"} from this workplace pilot? Their Industry account will not be deleted.`,
        );

        if (!confirmed) {
          return;
        }

        removeButton.disabled = true;
        status.textContent = "Checking schedule responsibilities…";

        const { data, error } = await supabaseClient.rpc(
          "remove_workplace_member",
          { target_profile_id: member.id },
        );
        const result = data?.[0];

        if (error || !result) {
          removeButton.disabled = false;
          status.textContent =
            "We couldn't remove this participant. Please try again.";
          return;
        }

        if (result.outcome !== "deactivated") {
          removeButton.disabled = false;
          status.textContent = getMembershipBlockMessage(result.reason, "remove");
          return;
        }

        status.textContent = "Participant removed from this workplace pilot.";
        const crew = await loadAuthenticatedManagerCrew();
        renderAuthenticatedManagerCrew(crew ?? authenticatedManagerCrew);
      });

      actions.append(removeButton, status);
      memberCard.appendChild(actions);
    }

    managerCrewList.appendChild(memberCard);
  });
}

function formatInvitationDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function showManagerInviteResult(invitation) {
  currentManagerInviteUrl = buildIndustryInviteUrl(invitation.invite_token);

  if (managerInviteResultCopy) {
    managerInviteResultCopy.textContent =
      `Send this link privately to ${invitation.invited_email}. It expires ${formatInvitationDate(invitation.expires_at)}.`;
  }

  if (managerInviteResult) {
    managerInviteResult.hidden = false;
  }
}

async function createManagerWorkplaceInvitation(
  email,
  role,
  volunteerConfirmed,
) {
  if (managerInviteStatus) {
    managerInviteStatus.textContent = "Creating a secure invitation…";
  }

  const { data, error } = await supabaseClient.rpc(
    "create_workplace_invitation",
    {
      target_email: email,
      target_role: role,
      volunteer_confirmed: volunteerConfirmed,
    },
  );

  if (error || !data?.length) {
    if (managerInviteStatus) {
      managerInviteStatus.textContent =
        getSafeAuthFailureMessage("createInvitation");
    }

    return null;
  }

  showManagerInviteResult(data[0]);

  if (managerInviteStatus) {
    managerInviteStatus.textContent =
      "Invitation created. Copy the link and send it privately.";
  }

  await loadWorkplaceInvitations();
  return data[0];
}

function renderWorkplaceInvitations(invitations = []) {
  if (!managerInviteList) {
    return;
  }

  managerInviteList.innerHTML = "";

  if (!invitations.length) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "stack-card shift-card";
    emptyCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">Invitations</p>
        <h3>No invitations yet</h3>
        <p>Create a private invite when you are ready to add a worker.</p>
      </div>
    `;
    managerInviteList.appendChild(emptyCard);
    return;
  }

  invitations.forEach((invitation) => {
    const card = document.createElement("article");
    card.className = "stack-card shift-card";

    const copy = document.createElement("div");
    copy.className = "stack-copy";

    const status = document.createElement("span");
    status.className = `manager-invite-status-badge is-${invitation.invitation_status}`;
    status.textContent = invitation.invitation_status;

    const name = document.createElement("h3");
    name.textContent = invitation.invited_email;

    const meta = document.createElement("ul");
    meta.className = "shift-meta";

    const roleItem = document.createElement("li");
    roleItem.textContent = invitation.invited_role;

    const dateItem = document.createElement("li");
    dateItem.textContent =
      invitation.invitation_status === "pending"
        ? `Expires ${formatInvitationDate(invitation.expires_at)}`
        : `Created ${formatInvitationDate(invitation.created_at)}`;

    meta.append(roleItem, dateItem);
    copy.append(status, name, meta);
    card.appendChild(copy);

    if (invitation.invitation_status === "pending") {
      const actions = document.createElement("div");
      actions.className = "manager-invite-card-actions";

      const replaceButton = document.createElement("button");
      replaceButton.className = "action-button secondary-action";
      replaceButton.type = "button";
      replaceButton.textContent = "Prepare new link";
      replaceButton.addEventListener("click", () => {
        managerInviteEmail.value = invitation.invited_email;
        managerInviteRole.value = invitation.invited_role;
        managerVolunteerConfirmed.checked = false;
        managerInviteStatus.textContent =
          "Confirm that participation is still voluntary, then create the new link.";
        managerInviteForm.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      const revokeButton = document.createElement("button");
      revokeButton.className = "action-button secondary-action";
      revokeButton.type = "button";
      revokeButton.textContent = "Revoke";
      revokeButton.addEventListener("click", async () => {
        revokeButton.disabled = true;

        const { data, error } = await supabaseClient.rpc(
          "revoke_workplace_invitation",
          { target_invitation_id: invitation.invitation_id },
        );

        if (error || !data) {
          revokeButton.disabled = false;

          if (managerInviteStatus) {
            managerInviteStatus.textContent =
              getSafeAuthFailureMessage("revokeInvitation");
          }

          return;
        }

        if (managerInviteStatus) {
          managerInviteStatus.textContent = "Invitation revoked.";
        }

        await loadWorkplaceInvitations();
      });

      actions.append(replaceButton, revokeButton);
      card.appendChild(actions);
    }

    managerInviteList.appendChild(card);
  });
}

async function loadWorkplaceInvitations() {
  if (
    authenticatedWorkplaceRole?.toLowerCase() !== "manager" ||
    !managerInviteList
  ) {
    return [];
  }

  const { data, error } = await supabaseClient.rpc(
    "list_workplace_invitations",
  );

  if (error) {
    managerInviteList.innerHTML = `
      <article class="stack-card shift-card">
        <div class="stack-copy">
          <p class="stack-kicker">Invitations</p>
          <h3>Unable to load invitations</h3>
          <p>Try again before inviting a worker.</p>
        </div>
      </article>
    `;
    return [];
  }

  renderWorkplaceInvitations(data || []);
  return data || [];
}

managerInviteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = managerInviteEmail.value.trim();
  const role = managerInviteRole.value;
  const volunteerConfirmed = managerVolunteerConfirmed.checked;
  const invitation = await createManagerWorkplaceInvitation(
    email,
    role,
    volunteerConfirmed,
  );

  if (invitation) {
    managerInviteForm.reset();
  }
});

managerCopyInviteButton?.addEventListener("click", async () => {
  if (!currentManagerInviteUrl) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentManagerInviteUrl);
    managerInviteStatus.textContent =
      "Invite link copied. Send it only to the person named in the invitation.";
  } catch (error) {
    managerInviteStatus.textContent =
      "Copy failed. Create a new link and try again in a secure browser window.";
  }
});

async function loadAuthenticatedTeamSchedule() {
  if (
    authenticatedWorkplaceRole?.toLowerCase() !== "manager" ||
    !authenticatedWorkplaceId
  ) {
    authenticatedTeamScheduleShifts = [];
    return;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTodayIso = startOfToday.toISOString();
  const teamScheduleLookbackIso = new Date(
    Date.now() - 18 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabaseClient
    .from("shifts")
    .select(
      `
    id,
    workplace_id,
    assigned_profile_id,
    role,
    starts_at,
    ends_at,
    end_label,
    status,
    actual_started_at,
    reported_started_at,
start_recorded_at,
start_time_source,
actual_ended_at,
reported_ended_at,
end_recorded_at,
end_time_source,
coverage_stage,
    assigned_profile:profiles!shifts_assigned_profile_id_fkey (
      full_name
    ),
     manager_profile:profiles!shifts_manager_profile_id_fkey (
      full_name
    ),
    workplace:workplaces (
      name,
      time_zone
    )
  `,
    )
    .eq("workplace_id", authenticatedWorkplaceId)
    .in("status", ["scheduled", "coverage_needed", "open"])
    .gte("starts_at", teamScheduleLookbackIso)
    .order("starts_at", { ascending: true });

  if (error) {
    return;
  }

  authenticatedTeamScheduleShifts = (data || [])
    .map((shift) => {
      const timeZone =
        shift.workplace?.time_zone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      const startDate = new Date(shift.starts_at);

      const day = startDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone,
      });

      const startTime = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      });

      let endText = shift.end_label || "";

      if (shift.ends_at) {
        endText = new Date(shift.ends_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone,
        });
      }

      const clockedOutTime = shift.reported_ended_at
        ? new Date(shift.reported_ended_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone,
        })
        : "";

      const recordedInIndustryTime = shift.end_recorded_at
        ? new Date(shift.end_recorded_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone,
        })
        : "";

      return {
        id: shift.id,
        owner: shift.assigned_profile_id,
        workerName: shift.assigned_profile?.full_name || "Unassigned",
        workplaceId: shift.workplace_id,
        workplace: shift.workplace?.name || "",
        workplaceTimeZone:
          shift.workplace?.time_zone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: shift.role || "",
        day,
        time: endText ? `${startTime} – ${endText}` : startTime,
        status: shift.status,
        coverageStage: shift.coverage_stage || null,
        startsAt: shift.starts_at,
        endsAt: shift.ends_at || null,
        endLabel: shift.end_label || "",
        actualStartedAt: shift.actual_started_at || null,
        reportedStartedAt: shift.reported_started_at || null,
        startRecordedAt: shift.start_recorded_at || null,
        startTimeSource: shift.start_time_source || null,
        actualEndedAt: shift.actual_ended_at || null,
        reportedEndedAt: shift.reported_ended_at || null,
        endRecordedAt: shift.end_recorded_at || null,
        endTimeSource: shift.end_time_source || null,
        clockedOutTime,
        recordedInIndustryTime,
      };
    })
    .filter((shift) => {
      const now = new Date();
      const start = new Date(shift.startsAt);

      if (shift.actualEndedAt) {
        return new Date(shift.actualEndedAt) >= startOfToday;
      }

      return start > now || isCurrentShift(shift);
    });

  renderAuthenticatedTeamSchedule();
}
function renderAuthenticatedTeamSchedule() {
  if (!managerTeamScheduleList) {
    return;
  }

  managerTeamScheduleList.innerHTML = "";

  const shifts = authenticatedTeamScheduleShifts || [];

  if (!shifts.length) {
    managerTeamScheduleList.innerHTML = `
      <article class="stack-card shift-card">
        <div class="stack-copy">
          <p class="stack-kicker">Team schedule</p>
          <h3>No workplace shifts</h3>
          <p>Upcoming team shifts will appear here.</p>
        </div>
      </article>
    `;
    return;
  }

  const renderTeamShiftCard = (shift) => {
    const isUnassigned = !shift.owner;
    const needsCoverage = shift.status === "coverage_needed";
    const hasEnded = Boolean(shift.actualEndedAt);
    const isCurrent =
      !hasEnded && shift.status === "scheduled" && isCurrentShift(shift);

    const canManageShift =
      !hasEnded &&
      !isCurrent &&
      (shift.status === "scheduled" || shift.status === "open");

    const endedShiftDetails =
      hasEnded && shift.clockedOutTime
        ? `
        <div class="shift-end-details">
          <p>
            <span>Clocked out</span>
            <strong>${escapeHtml(shift.clockedOutTime)}</strong>
          </p>

          ${shift.recordedInIndustryTime
          ? `
                <p>
                  <span>Recorded in Industry</span>
                  <strong>${escapeHtml(shift.recordedInIndustryTime)}</strong>
                </p>
              `
          : ""
        }
        </div>
      `
        : "";

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";

    shiftCard.innerHTML = `
    <div class="stack-copy">
      <p class="stack-kicker">
       ${hasEnded
        ? "Shift ended"
        : needsCoverage
          ? "Coverage requested"
          : isCurrent
            ? "Current shift"
            : isUnassigned
              ? "Unassigned shift"
              : "Scheduled shift"
      }
      </p>

      <h3>${escapeHtml(shift.workerName)}</h3>

      <p>${escapeHtml(shift.role)}</p>

      <ul class="shift-meta">
        <li>${escapeHtml(shift.day)}</li>
        <li>${escapeHtml(shift.time)}</li>
      </ul>

      <ul class="shift-meta">
        <li>${escapeHtml(shift.workplace)}</li>
      </ul>

      ${endedShiftDetails}

${canManageShift
        ? `
      <button
        class="secondary-action"
        type="button"
        data-manager-manage-shift="${escapeHtml(shift.id)}"
      >
        Manage Shift
      </button>
    `
        : ""
      }
</div>
`;

    const manageShiftButton = shiftCard.querySelector(
      "[data-manager-manage-shift]",
    );

    if (manageShiftButton) {
      manageShiftButton.addEventListener("click", async () => {
        editingManagerShiftId = shift.id;
        setManagerShiftFormMode("edit");

        const { date, startTime, endTime } = getManagerShiftInputValues(shift);

        if (managerCreateShiftStatus) {
          managerCreateShiftStatus.textContent = "";
        }

        setActiveSection("schedule");
        setActiveScheduleView("manager-create-shift");

        await loadAuthenticatedManagerCrew();

        managerShiftWorkerSelect.value =
          shift.status === "open" && !shift.owner ? "open" : shift.owner || "";
        managerShiftRoleInput.value = shift.role || "";
        managerShiftDateInput.value = date;
        managerShiftStartInput.value = startTime;
        managerShiftEndInput.value = endTime;

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    managerTeamScheduleList.appendChild(shiftCard);
  };

  const activeAndUpcomingShifts = shifts.filter(
    (shift) => !shift.actualEndedAt,
  );

  const endedShifts = shifts
    .filter((shift) => Boolean(shift.actualEndedAt))
    .sort(
      (shiftA, shiftB) =>
        new Date(shiftB.actualEndedAt) - new Date(shiftA.actualEndedAt),
    );

  activeAndUpcomingShifts.forEach(renderTeamShiftCard);

  if (endedShifts.length) {
    const endedHeading = document.createElement("div");
    endedHeading.className = "manager-ended-shifts-heading";

    endedHeading.innerHTML = `
    <p class="stack-kicker">Ended today</p>
  `;

    managerTeamScheduleList.appendChild(endedHeading);

    endedShifts.forEach(renderTeamShiftCard);
  }
}
async function loadAuthenticatedCatchShifts() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  const nowIso = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from("shifts")
    .select(
      `
        id,
        assigned_profile_id,
        role,
        starts_at,
        ends_at,
        end_label,
        status,
        coverage_stage,
        workplace:workplaces (
          name,
          time_zone
        )
      `,
    )
    .in("status", ["coverage_needed", "open"])
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });

  if (error) {
    return;
  }

  authenticatedCatchShifts = (data || []).map((shift) => {
    const timeZone =
      shift.workplace?.time_zone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startDate = new Date(shift.starts_at);

    const day = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone,
    });

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });

    const endText = shift.ends_at
      ? new Date(shift.ends_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      })
      : shift.end_label || "";

    return {
      id: shift.id,
      owner: shift.assigned_profile_id,
      workplace: shift.workplace?.name || "",
      role: shift.role || "",
      day,
      time: endText ? `${startTime} – ${endText}` : startTime,
      status: shift.status,
      coverageStage: shift.coverage_stage || "open",
      displayStatus: "Open",
      startsAt: shift.starts_at,
      source: "backend-catch",
    };
  });

  renderShiftBoard();
}

async function loadAuthenticatedShiftInterests() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  authenticatedUserId = user.id;

  const { data, error } = await supabaseClient.from("shift_interests").select(`
  id,
  shift_id,
  profile_id,
  status,
  profile:profiles (
    full_name
  )
`);

  if (error) {
    return;
  }

  authenticatedShiftInterests = data || [];

  renderShiftBoard();
}
async function loadAuthenticatedCoverageEvents() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  if (!authenticatedWorkplaceId) {
    authenticatedCoverageEvents = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from("coverage_events")
    .select(
      `
      id,
      shift_id,
      workplace_id,
      event_type,
      previous_profile_id,
      new_profile_id,
      created_at,
      shift_starts_at,
      shift_ends_at,
      shift_role,
      shift:shifts (
        starts_at,
        ends_at,
        role
      )
    `,
    )
    .eq("workplace_id", authenticatedWorkplaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return;
  }

  authenticatedCoverageEvents = data ?? [];

}

function renderDashboardShift(backendShift = undefined) {
  if (
    !dashboardCountdownTime ||
    !dashboardShiftKicker ||
    !dashboardCountdownCopy ||
    !dashboardShiftDay ||
    !dashboardShiftDate ||
    !dashboardShiftTime ||
    !dashboardShiftRole ||
    !dashboardShiftWorkplace
  ) {
    return;
  }

  const isAuthenticatedDashboard = backendShift !== undefined;

  if (dashboardShiftCommuteStrip) {
    dashboardShiftCommuteStrip.hidden = isAuthenticatedDashboard;
  }

  const upcomingShift =
    backendShift !== undefined
      ? backendShift
      : getShiftStore()
        .filter((shift) => shift.owner === CURRENT_USER.id)
        .sort((shiftA, shiftB) => {
          return getShiftDateValue(shiftA) - getShiftDateValue(shiftB);
        })[0];

  if (!upcomingShift) {
    dashboardShiftDetailsButton.hidden = true;

    dashboardShiftKicker.textContent = "Next Shift";
    dashboardCountdownCopy.textContent = "No upcoming shift scheduled";
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

  const scheduledNow = isCurrentShift(upcomingShift);

  const hasReportedStart = Boolean(
    upcomingShift.reportedStartedAt || upcomingShift.actualStartedAt,
  );

  const onShiftNow = scheduledNow && hasReportedStart;

  dashboardShiftKicker.textContent = onShiftNow
    ? "Current Shift"
    : scheduledNow
      ? "Scheduled Shift"
      : "Next Shift";

  dashboardCountdownTime.textContent = onShiftNow
    ? "On shift now"
    : scheduledNow
      ? "Scheduled now"
      : getCountdownText(upcomingShift);

  dashboardCountdownCopy.textContent = onShiftNow
    ? "shift currently in progress"
    : scheduledNow
      ? "report when you clock in"
      : "until your next shift";
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

if (managerTeamScheduleButton) {
  managerTeamScheduleButton.addEventListener("click", () => {
    renderAuthenticatedTeamSchedule();

    setActiveSection("schedule");
    setActiveScheduleView("manager-team-schedule");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerCancelShiftButton) {
  managerCancelShiftButton.addEventListener("click", async () => {
    if (!editingManagerShiftId) {
      return;
    }

    const confirmed = window.confirm(
      "Cancel this shift? It will be removed from the worker's active schedule.",
    );

    if (!confirmed) {
      return;
    }

    const originalButtonText = managerCancelShiftButton.textContent;

    managerCancelShiftButton.disabled = true;
    managerCancelShiftButton.textContent = "Cancelling...";

    const { data: cancelledShift, error } = await supabaseClient
      .from("shifts")
      .update({
        status: "cancelled",
      })
      .eq("id", editingManagerShiftId)
      .select("id")
      .maybeSingle();

    if (error || !cancelledShift) {
      if (managerCreateShiftStatus) {
        managerCreateShiftStatus.textContent = "Unable to cancel this shift.";
      }

      managerCancelShiftButton.disabled = false;
      managerCancelShiftButton.textContent = originalButtonText;
      return;
    }

    editingManagerShiftId = null;
    setManagerShiftFormMode("create");

    await loadAuthenticatedTeamSchedule();

    setActiveScheduleView("manager-team-schedule");

    managerCancelShiftButton.disabled = false;
    managerCancelShiftButton.textContent = originalButtonText;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerCreateShiftButton) {
  managerCreateShiftButton.addEventListener("click", async () => {
    editingManagerShiftId = null;
    setManagerShiftFormMode("create");

    managerShiftWorkerSelect.value = "";
    managerShiftRoleInput.value = "";
    managerShiftDateInput.value = "";
    managerShiftStartInput.value = "";
    managerShiftEndInput.value = "";

    if (managerCreateShiftStatus) {
      managerCreateShiftStatus.textContent = "";
    }

    setActiveSection("schedule");
    setActiveScheduleView("manager-create-shift");

    await loadAuthenticatedManagerCrew();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerCrewButton) {
  managerCrewButton.addEventListener("click", async () => {
    const [crew] = await Promise.all([
      loadAuthenticatedManagerCrew(),
      loadWorkplaceInvitations(),
    ]);

    renderAuthenticatedManagerCrew(crew ?? authenticatedManagerCrew);

    setActiveSection("schedule");
    setActiveScheduleView("manager-crew");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerActivityButton) {
  managerActivityButton.addEventListener("click", () => {
    setActiveSection("schedule");
    setActiveScheduleView("activity-feed");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerCoverageRequestsButton) {
  managerCoverageRequestsButton.addEventListener("click", async () => {
    await Promise.all([
      loadAuthenticatedCatchShifts(),
      loadAuthenticatedShiftInterests(),
    ]);

    updateCatchViewForRole();

    setActiveSection("schedule");
    setActiveScheduleView("catch");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (managerSaveShiftButton) {
  managerSaveShiftButton.addEventListener("click", async () => {
    if (
      authenticatedWorkplaceRole?.toLowerCase() !== "manager" ||
      !authenticatedWorkplaceId
    ) {
      managerCreateShiftStatus.textContent = "Manager access is required.";
      return;
    }

    const selectedWorkerValue = managerShiftWorkerSelect?.value || "";
    const isOpenShift = selectedWorkerValue === "open";
    const assignedProfileId = isOpenShift ? null : selectedWorkerValue;

    const role = managerShiftRoleInput?.value.trim() || "";
    const date = managerShiftDateInput?.value || "";
    const startTime = managerShiftStartInput?.value || "";
    const endTime = managerShiftEndInput?.value || "";

    if ((!assignedProfileId && !isOpenShift) || !role || !date || !startTime) {
      managerCreateShiftStatus.textContent =
        "Choose a crew member or Open Shift, and enter the role, date, and start time.";
      return;
    }
    const startsAtDate = new Date(`${date}T${startTime}:00`);

    if (Number.isNaN(startsAtDate.getTime())) {
      managerCreateShiftStatus.textContent =
        "Enter a valid shift date and start time.";
      return;
    }

    let endsAt = null;
    let endLabel = "Close";

    if (endTime) {
      const endsAtDate = new Date(`${date}T${endTime}:00`);

      if (Number.isNaN(endsAtDate.getTime())) {
        managerCreateShiftStatus.textContent = "Enter a valid end time.";
        return;
      }

      // Restaurant shifts commonly cross midnight.
      if (endsAtDate <= startsAtDate) {
        endsAtDate.setDate(endsAtDate.getDate() + 1);
      }

      endsAt = endsAtDate.toISOString();
      endLabel = null;
    }

    const originalButtonText = managerSaveShiftButton.textContent;

    managerSaveShiftButton.disabled = true;
    managerSaveShiftButton.textContent = "Creating…";
    managerCreateShiftStatus.textContent = "Creating shift…";

    const isEditing = Boolean(editingManagerShiftId);

    let saveError = null;

    if (isEditing) {
      const { data: updatedShiftId, error } = await supabaseClient.rpc(
        "manager_update_shift",
        {
          target_shift_id: editingManagerShiftId,
          target_assigned_profile_id: assignedProfileId,
          target_role: role,
          target_starts_at: startsAtDate.toISOString(),
          target_ends_at: endsAt,
          target_end_label: endLabel,
        }
      );

      saveError = error;

      if (!error && !updatedShiftId) {
        saveError = new Error("Shift update did not return a shift id.");
      }

    } else {
      const { error } = await supabaseClient.from("shifts").insert({
        workplace_id: authenticatedWorkplaceId,
        assigned_profile_id: assignedProfileId,
        manager_profile_id: authenticatedUserId,
        role,
        starts_at: startsAtDate.toISOString(),
        ends_at: endsAt,
        end_label: endLabel,
        status: isOpenShift ? "open" : "scheduled",
        coverage_stage: isOpenShift ? "open" : null,
      });

      saveError = error;
    }

    if (saveError) {
      managerCreateShiftStatus.textContent = isEditing
        ? "Unable to update this shift."
        : "Unable to create this shift.";
      managerSaveShiftButton.disabled = false;
      managerSaveShiftButton.textContent = originalButtonText;
      return;
    }

    managerCreateShiftStatus.textContent = isEditing
      ? "Shift updated."
      : "Shift created.";
    await loadAuthenticatedTeamSchedule();

    editingManagerShiftId = null;
    setManagerShiftFormMode("create");

    managerShiftWorkerSelect.value = "";
    managerShiftRoleInput.value = "";
    managerShiftDateInput.value = "";
    managerShiftStartInput.value = "";
    managerShiftEndInput.value = "";

    managerSaveShiftButton.disabled = false;
    managerSaveShiftButton.textContent = originalButtonText;

    setActiveScheduleView("manager-team-schedule");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function updateCatchViewForRole() {
  const isManager = authenticatedWorkplaceRole?.toLowerCase() === "manager";
  if (resetDemoDataButton) {
    resetDemoDataButton.hidden = true;
  }

  if (
    !catchBackButton ||
    !catchSectionLabel ||
    !catchViewTitle ||
    !catchViewCopy ||
    !catchViewHelper ||
    !shiftBoardStatus
  ) {
    return;
  }

  if (isManager) {
    catchBackButton.textContent = "← Back to Manager Schedule";
    catchSectionLabel.textContent = "Schedule / Manager";
    catchViewTitle.textContent = "Coverage Requests";
    catchViewCopy.textContent =
      "Review open shifts and coverage requests that need your attention.";
    catchViewHelper.textContent =
      "Track open and released shifts from interest through approval.";
    shiftBoardStatus.textContent = "Coverage activity appears here.";

    return;
  }

  catchBackButton.textContent = "← Back to Schedule";
  catchSectionLabel.textContent = "Catch";
  catchViewTitle.textContent = "Catch Board";
  catchViewCopy.textContent =
    "Find open shifts posted by managers or released by your workplace crew.";
  catchViewHelper.textContent =
    "Need coverage? Release a shift from My Shifts.";
  shiftBoardStatus.textContent = "Open shifts appear here.";
}

function showScheduleHub() {
  const defaultScheduleView =
    authenticatedWorkplaceRole?.toLowerCase() === "manager"
      ? "manager-schedule"
      : "my-shifts";

  if (scheduleHub) {
    scheduleHub.classList.add("hidden-panel");
  }

  scheduleSubviews.forEach((subview) => {
    subview.classList.toggle(
      "active",
      subview.dataset.scheduleSubview === defaultScheduleView,
    );
  });

  scheduleViewCards.forEach((card) => {
    card.classList.toggle(
      "active",
      card.dataset.scheduleView === defaultScheduleView,
    );
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

    const authenticatedShift = (authenticatedScheduleShifts || []).find(
      (item) => item.id === shiftId,
    );

    const demoShift = getShiftStore().find((item) => item.id === shiftId);

    const shift = authenticatedShift || demoShift;

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
  releaseToBoardButton.addEventListener("click", async () => {
    if (!selectedReleaseShift) {
      return;
    }

    const originalButtonText = releaseToBoardButton.textContent;

    releaseToBoardButton.disabled = true;
    releaseToBoardButton.textContent = "Releasing...";

    if (postShiftStatus) {
      postShiftStatus.textContent = "";
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError || !user) {
        if (postShiftStatus) {
          postShiftStatus.textContent =
            "Unable to verify your account. Please try again.";
        }

        return;
      }



      const { data: releasedShift, error: releaseError } =
        await supabaseClient.rpc("release_shift_for_coverage", {
          target_shift_id: selectedReleaseShift.id,
        });

      if (releaseError) {
        if (postShiftStatus) {
          postShiftStatus.textContent =
            "We couldn't release this shift. Please try again.";
        }

        return;
      }

      if (!releasedShift) {
        if (postShiftStatus) {
          postShiftStatus.textContent = "This shift could not be released.";
        }

        return;
      }

      selectedReleaseShift = {
        ...selectedReleaseShift,
        status: "Pending Coverage",
      };

      addActivity({
        type: "shift-released",
        title: "Shift released",
        message: `${selectedReleaseShift.role} at ${selectedReleaseShift.workplace}`,
        workerId: user.id,
        shiftId: selectedReleaseShift.id,
        workplace: selectedReleaseShift.workplace,
      });

      const { id, status, owner, source, ...shiftData } = selectedReleaseShift;

      createBoardPost({
        ...shiftData,
        sourceShiftId: id,
        source: "catch-board",
        requestType: "release",
      });

      if (postShiftStatus) {
        postShiftStatus.textContent = "Shift released to Catch.";
      }

      await loadAuthenticatedSchedule();

      setActiveSection("schedule");
      setActiveScheduleView("my-shifts");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      if (postShiftStatus) {
        postShiftStatus.textContent =
          "Something went wrong while releasing this shift.";
      }
    } finally {
      releaseToBoardButton.disabled = false;
      releaseToBoardButton.textContent = originalButtonText;
    }
  });
}

if (directReleaseButton) {
  directReleaseButton.addEventListener("click", async () => {
    if (!selectedReleaseShift) {
      return;
    }

    const originalButtonText = directReleaseButton.textContent;

    directReleaseButton.disabled = true;
    directReleaseButton.textContent = "Loading coworkers...";

    try {
      const {
        data: directReleaseCoworkers,
        error: directReleaseCoworkersError,
      } = await supabaseClient.rpc("get_direct_release_coworkers");

      if (directReleaseCoworkersError) {
        throw directReleaseCoworkersError;
      }

      const availableCoworkers = (directReleaseCoworkers || []).map(
        (coworker) => ({
          id: coworker.profile_id,
          name: coworker.full_name || "Crew member",
          role: coworker.role || "",
        })
      );

      const existingCoworkerList = document.getElementById(
        "direct-release-coworker-list"
      );

      if (existingCoworkerList) {
        existingCoworkerList.remove();
      }

      if (!availableCoworkers.length) {
        if (postShiftStatus) {
          postShiftStatus.textContent =
            "No other workplace coworkers are available.";
        }

        return;
      }

      if (postShiftStatus) {
        postShiftStatus.textContent =
          `Choose a coworker for this shift:`;
      }

      const coworkerList = document.createElement("div");
      coworkerList.id = "direct-release-coworker-list";
      coworkerList.className = "direct-release-coworker-list";

      availableCoworkers.forEach((member) => {
        const coworkerButton = document.createElement("button");

        coworkerButton.type = "button";
        coworkerButton.className =
          "secondary-action direct-release-coworker-option";

        coworkerButton.dataset.profileId = member.id;

        coworkerButton.textContent = member.role
          ? `${member.name} · ${member.role}`
          : member.name;

        coworkerButton.addEventListener("click", () => {
          coworkerList
            .querySelectorAll(".direct-release-coworker-option")
            .forEach((button) => {
              button.setAttribute("aria-pressed", "false");
            });

          coworkerButton.setAttribute("aria-pressed", "true");

          const existingSendButton = document.getElementById(
            "direct-release-send-button"
          );

          if (existingSendButton) {
            existingSendButton.remove();
          }

          if (postShiftStatus) {
            postShiftStatus.textContent =
              `${member.name} selected for direct offer.`;
          }

          const sendOfferButton = document.createElement("button");

          sendOfferButton.type = "button";
          sendOfferButton.id = "direct-release-send-button";
          sendOfferButton.className = "action-button";
          sendOfferButton.textContent = `Send Direct Offer to ${member.name}`;

          sendOfferButton.addEventListener("click", async () => {
            sendOfferButton.disabled = true;
            sendOfferButton.textContent = "Sending offer…";

            try {
              const {
                data: offerId,
                error: offerError,
              } = await supabaseClient.rpc(
                "send_direct_shift_offer",
                {
                  target_shift_id: selectedReleaseShift.id,
                  target_recipient_profile_id: member.id,
                }
              );

              if (offerError) {
                throw offerError;
              }

              await loadAuthenticatedCoverageEvents();

              if (releaseToBoardButton) {
                releaseToBoardButton.disabled = true;
              }

              directReleaseButton.style.display = "none";

              if (directReleaseDivider) {
                directReleaseDivider.style.display = "none";
              }


              coworkerList.style.display = "none";
              if (postShiftStatus) {
                postShiftStatus.textContent =
                  `Direct offer sent to ${member.name}.`;
              }

              const cancelOfferButton = document.createElement("button");

              cancelOfferButton.type = "button";
              cancelOfferButton.className = "secondary-action direct-offer-cancel";
              cancelOfferButton.textContent = "Cancel Direct Offer";

              cancelOfferButton.addEventListener("click", async () => {
                cancelOfferButton.disabled = true;
                cancelOfferButton.textContent = "Canceling…";

                try {
                  const { error: cancelError } = await supabaseClient.rpc(
                    "cancel_direct_shift_offer",
                    {
                      target_offer_id: offerId,
                    }
                  );

                  if (cancelError) {
                    throw cancelError;
                  }

                  if (postShiftStatus) {
                    postShiftStatus.textContent =
                      `Direct offer to ${member.name} canceled.`;
                  }

                  cancelOfferButton.remove();

                  if (releaseToBoardButton) {
                    releaseToBoardButton.disabled = false;
                  }

                  directReleaseButton.style.display = "";


                  if (directReleaseDivider) {
                    directReleaseDivider.style.display = "";
                  }

                  coworkerList.style.display = "";

                } catch (error) {
                  showActionFailure(
                    postShiftStatus,
                    "We couldn't cancel this direct offer. Please try again.",
                  );
                  cancelOfferButton.disabled = false;
                  cancelOfferButton.textContent =
                    "Cancel Direct Offer";
                }
              });

              sendOfferButton.replaceWith(cancelOfferButton);
            } catch (error) {
              if (postShiftStatus) {
                postShiftStatus.textContent =
                  "Unable to send direct offer.";
              }

              sendOfferButton.disabled = false;
              sendOfferButton.textContent =
                `Send Direct Offer to ${member.name}`;
            }
          });

          coworkerList.insertAdjacentElement(
            "afterend",
            sendOfferButton
          );
        });

        coworkerList.appendChild(coworkerButton);
      });

      if (postShiftStatus) {
        postShiftStatus.insertAdjacentElement(
          "afterend",
          coworkerList
        );
      }
    } catch (error) {
      if (postShiftStatus) {
        postShiftStatus.textContent =
          "Unable to load workplace coworkers.";
      }
    } finally {
      directReleaseButton.disabled = false;
      directReleaseButton.textContent = originalButtonText;
    }
  });
}

async function endAuthenticatedShift(
  shiftId,
  reportedEndAt = new Date().toISOString(),
) {
  if (!shiftId || !reportedEndAt) {
    return false;
  }

  const reportedEndDate = new Date(reportedEndAt);

  if (Number.isNaN(reportedEndDate.getTime())) {
    return false;
  }

  try {
    const { error } = await supabaseClient.rpc("report_assigned_shift_end", {
      target_shift_id: shiftId,
      reported_end_at: reportedEndDate.toISOString(),
    });

    if (error) {
      return false;
    }

    await Promise.all([
      loadAuthenticatedSchedule(),
      loadAuthenticatedDashboardShift(),
    ]);

    updateDashboardForRole();

    return true;
  } catch (error) {
    return false;
  }
}

const startShiftOverlay = document.getElementById("start-shift-overlay");
const startShiftChoicePanel = document.getElementById(
  "start-shift-choice-panel",
);
const startShiftTimePanel = document.getElementById("start-shift-time-panel");

const startShiftNowButton = document.getElementById("start-shift-now-button");
const startShiftChooseTimeButton = document.getElementById(
  "start-shift-choose-time-button",
);
const startShiftCancelButton = document.getElementById(
  "start-shift-cancel-button",
);

const startShiftTimeInput = document.getElementById("start-shift-time-input");
const startShiftSaveTimeButton = document.getElementById(
  "start-shift-save-time-button",
);
const startShiftBackButton = document.getElementById("start-shift-back-button");
const startShiftError = document.getElementById("start-shift-error");

let pendingStartShiftId = null;

function openStartShiftDialog(shiftId) {
  if (!shiftId || !startShiftOverlay) {
    return;
  }

  pendingStartShiftId = shiftId;

  startShiftChoicePanel.hidden = false;
  startShiftTimePanel.hidden = true;

  startShiftTimeInput.value = "";

  startShiftError.textContent = "";
  startShiftError.hidden = true;

  startShiftOverlay.hidden = false;

  startShiftNowButton?.focus();
}

function closeStartShiftDialog() {
  pendingStartShiftId = null;

  startShiftOverlay.hidden = true;

  startShiftChoicePanel.hidden = false;
  startShiftTimePanel.hidden = true;

  startShiftTimeInput.value = "";

  startShiftError.textContent = "";
  startShiftError.hidden = true;
}

async function startAuthenticatedShift(
  shiftId,
  reportedStartAt = new Date().toISOString(),
) {
  if (!shiftId || !reportedStartAt) {
    return false;
  }

  const reportedStartDate = new Date(reportedStartAt);

  if (Number.isNaN(reportedStartDate.getTime())) {
    return false;
  }

  try {
    const { error } = await supabaseClient.rpc("report_assigned_shift_start", {
      target_shift_id: shiftId,
      reported_start_at: reportedStartDate.toISOString(),
    });

    if (error) {
      return false;
    }

    await Promise.all([
      loadAuthenticatedSchedule(),
      loadAuthenticatedDashboardShift(),
    ]);

    updateDashboardForRole();

    return true;
  } catch (error) {
    return false;
  }
}

startShiftCancelButton?.addEventListener("click", () => {
  closeStartShiftDialog();
});

startShiftNowButton?.addEventListener("click", async () => {
  if (!pendingStartShiftId) {
    return;
  }

  const shiftId = pendingStartShiftId;
  const originalLabel = startShiftNowButton.textContent;

  startShiftNowButton.disabled = true;
  startShiftNowButton.textContent = "Starting shift...";

  const success = await startAuthenticatedShift(
    shiftId,
    new Date().toISOString(),
  );

  startShiftNowButton.disabled = false;
  startShiftNowButton.textContent = originalLabel;

  if (success) {
    closeStartShiftDialog();
  } else {
    showActionFailure(
      startShiftError,
      "We couldn't start this shift. Please try again.",
    );
  }
});

startShiftChooseTimeButton?.addEventListener("click", () => {
  startShiftChoicePanel.hidden = true;
  startShiftTimePanel.hidden = false;

  startShiftError.textContent = "";
  startShiftError.hidden = true;

  const nowValue = getLocalDateTimeInputValue();

  startShiftTimeInput.value = nowValue;
  startShiftTimeInput.max = nowValue;
});

startShiftBackButton?.addEventListener("click", () => {
  startShiftTimePanel.hidden = true;
  startShiftChoicePanel.hidden = false;

  startShiftError.textContent = "";
  startShiftError.hidden = true;

  startShiftTimeInput.value = "";
});

startShiftSaveTimeButton?.addEventListener("click", async () => {
  if (!pendingStartShiftId) {
    return;
  }

  if (!startShiftTimeInput.value) {
    startShiftError.textContent = "Choose the time you clocked in.";
    startShiftError.hidden = false;
    return;
  }

  const reportedStartDate = new Date(startShiftTimeInput.value);

  if (Number.isNaN(reportedStartDate.getTime())) {
    startShiftError.textContent = "Enter a valid clock-in time.";
    startShiftError.hidden = false;
    return;
  }

  const now = new Date();

  if (reportedStartDate > now) {
    startShiftError.textContent = "Clock-in time cannot be in the future.";
    startShiftError.hidden = false;
    return;
  }

  const shiftId = pendingStartShiftId;
  const originalLabel = startShiftSaveTimeButton.textContent;

  startShiftError.textContent = "";
  startShiftError.hidden = true;

  startShiftSaveTimeButton.disabled = true;
  startShiftSaveTimeButton.textContent = "Saving...";

  const success = await startAuthenticatedShift(
    shiftId,
    reportedStartDate.toISOString(),
  );

  startShiftSaveTimeButton.disabled = false;
  startShiftSaveTimeButton.textContent = originalLabel;

  if (success) {
    closeStartShiftDialog();
  } else {
    showActionFailure(
      startShiftError,
      "We couldn't save the shift start. Please try again.",
    );
  }
});

const endShiftOverlay = document.getElementById("end-shift-overlay");
const endShiftChoicePanel = document.getElementById("end-shift-choice-panel");
const endShiftTimePanel = document.getElementById("end-shift-time-panel");

const endShiftNowButton = document.getElementById("end-shift-now-button");
const endShiftChooseTimeButton = document.getElementById(
  "end-shift-choose-time-button",
);
const endShiftCancelButton = document.getElementById("end-shift-cancel-button");

const endShiftTimeInput = document.getElementById("end-shift-time-input");
const endShiftSaveTimeButton = document.getElementById(
  "end-shift-save-time-button",
);
const endShiftBackButton = document.getElementById("end-shift-back-button");
const endShiftError = document.getElementById("end-shift-error");

let pendingEndShiftId = null;

function openEndShiftDialog(shiftId) {
  if (!shiftId || !endShiftOverlay) {
    return;
  }

  pendingEndShiftId = shiftId;

  endShiftChoicePanel.hidden = false;
  endShiftTimePanel.hidden = true;

  endShiftTimeInput.value = "";
  endShiftError.textContent = "";
  endShiftError.hidden = true;

  endShiftOverlay.hidden = false;

  endShiftNowButton?.focus();
}

endShiftCancelButton?.addEventListener("click", () => {
  closeEndShiftDialog();
});

endShiftNowButton?.addEventListener("click", async () => {
  if (!pendingEndShiftId) {
    return;
  }

  const shiftId = pendingEndShiftId;
  const originalLabel = endShiftNowButton.textContent;

  endShiftNowButton.disabled = true;
  endShiftNowButton.textContent = "Ending shift…";

  const success = await endAuthenticatedShift(
    shiftId,
    new Date().toISOString(),
  );

  endShiftNowButton.disabled = false;
  endShiftNowButton.textContent = originalLabel;

  if (success) {
    closeEndShiftDialog();
  } else {
    showActionFailure(
      endShiftError,
      "We couldn't end this shift. Please try again.",
    );
  }
});

function getLocalDateTimeInputValue(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

endShiftChooseTimeButton?.addEventListener("click", () => {
  endShiftChoicePanel.hidden = true;
  endShiftTimePanel.hidden = false;

  endShiftError.textContent = "";
  endShiftError.hidden = true;

  const nowValue = getLocalDateTimeInputValue();

  endShiftTimeInput.value = nowValue;
  endShiftTimeInput.max = nowValue;
});

endShiftBackButton?.addEventListener("click", () => {
  endShiftTimePanel.hidden = true;
  endShiftChoicePanel.hidden = false;

  endShiftError.textContent = "";
  endShiftError.hidden = true;

  endShiftNowButton?.focus();
});

endShiftSaveTimeButton?.addEventListener("click", async () => {
  if (!pendingEndShiftId) {
    return;
  }

  if (!endShiftTimeInput.value) {
    endShiftError.textContent = "Choose the time you clocked out.";
    endShiftError.hidden = false;
    return;
  }

  const reportedEndDate = new Date(endShiftTimeInput.value);

  if (Number.isNaN(reportedEndDate.getTime())) {
    endShiftError.textContent = "Enter a valid clock-out time.";
    endShiftError.hidden = false;
    return;
  }

  const now = new Date();

  if (reportedEndDate > now) {
    endShiftError.textContent = "Clock-out time cannot be in the future.";
    endShiftError.hidden = false;
    return;
  }

  const shiftId = pendingEndShiftId;
  const originalLabel = endShiftSaveTimeButton.textContent;

  endShiftError.textContent = "";
  endShiftError.hidden = true;

  endShiftSaveTimeButton.disabled = true;
  endShiftSaveTimeButton.textContent = "Saving…";

  const success = await endAuthenticatedShift(
    shiftId,
    reportedEndDate.toISOString(),
  );

  endShiftSaveTimeButton.disabled = false;
  endShiftSaveTimeButton.textContent = originalLabel;

  if (success) {
    closeEndShiftDialog();
  } else {
    showActionFailure(
      endShiftError,
      "We couldn't save the shift end. Please try again.",
    );
  }
});

function closeEndShiftDialog() {
  pendingEndShiftId = null;

  endShiftOverlay.hidden = true;

  endShiftChoicePanel.hidden = false;
  endShiftTimePanel.hidden = true;

  endShiftTimeInput.value = "";
  endShiftError.textContent = "";
  endShiftError.hidden = true;
}

/* Dashboard direct links */

dashboardLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const dashboardAction = link.dataset.dashboardAction;

    if (dashboardAction === "start-shift") {
      const shiftId = link.dataset.shiftId;

      if (!shiftId) {
        return;
      }

      openStartShiftDialog(shiftId);
      return;
    }

    if (dashboardAction === "end-shift") {
      const shiftId = link.dataset.shiftId;

      if (!shiftId) {
        return;
      }

      openEndShiftDialog(shiftId);
      return;
    }

    const sectionName = link.dataset.dashboardSection;
    const scheduleView = link.dataset.dashboardView;
    const scrollTarget = link.dataset.scrollTarget;

    if (!sectionName) {
      return;
    }

    if (sectionName === "schedule" && scheduleView === "need-coverage") {
      const shift = (authenticatedScheduleShifts || []).find(
        (item) => item.status === "scheduled",
      );

      if (!shift) {
        return;
      }

      prefillReleaseForm(shift);
    }

    setActiveSection(sectionName);

    if (sectionName === "schedule" && scheduleView) {
      if (scheduleView === "catch") {
        updateCatchViewForRole();
      }

      if (
        scheduleView === "manager-crew" &&
        authenticatedWorkplaceRole?.toLowerCase() === "manager"
      ) {
        renderAuthenticatedManagerCrew(authenticatedManagerCrew);
        loadWorkplaceInvitations();
      }

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

const dashboardQuickPrimary = document.getElementById(
  "dashboard-quick-primary",
);
const dashboardQuickPrimaryLabel = document.getElementById(
  "dashboard-quick-primary-label",
);

const dashboardQuickSecondary = document.getElementById(
  "dashboard-quick-secondary",
);
const dashboardQuickSecondaryLabel = document.getElementById(
  "dashboard-quick-secondary-label",
);

const dashboardQuickTertiary = document.getElementById(
  "dashboard-quick-tertiary",
);
const dashboardQuickTertiaryLabel = document.getElementById(
  "dashboard-quick-tertiary-label",
);

const dashboardQuickQuaternary = document.getElementById(
  "dashboard-quick-quaternary",
);
const dashboardQuickQuaternaryLabel = document.getElementById(
  "dashboard-quick-quaternary-label",
);

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
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("industry-")) {
        localStorage.removeItem(key);
      }
    });
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
  return "Catch shift";
}

function getBoardRequestLabel(shift) {
  const isManagerPostedOpen = shift?.status === "open" && !shift?.owner;

  return isManagerPostedOpen ? "Manager posted" : "Release request";
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
  const responses = getShiftResponses();
  const currentResponse = responses[activeCrewShiftId] || {};

  const interestedWorkers = Array.isArray(currentResponse.interestedWorkers)
    ? currentResponse.interestedWorkers
    : [];

  listElement.innerHTML = members
    .map((member) => {
      const memberId = `crew-${member.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`;

      const isInterested = interestedWorkers.some(
        (worker) => worker.id === memberId,
      );

      const isAvailabilityAction = actionLabel === "Ask availability";

      const buttonLabel =
        isAvailabilityAction && isInterested ? "Interested" : actionLabel;

      const isDisabled = isAvailabilityAction && isInterested;

      const actionButtonMarkup = actionLabel
        ? `
      <button
        class="action-button secondary-action crew-member-action-button"
        type="button"
        data-action-label="${escapeHtml(actionLabel)}"
        data-member-name="${escapeHtml(member.name)}"
        data-member-position="${escapeHtml(member.position)}"
        ${isDisabled ? "disabled" : ""}
      >
        ${escapeHtml(buttonLabel)}
      </button>
    `
        : "";

      return `
        <article class="stack-card crew-member-card">
          <div class="stack-copy">
            <h3>${escapeHtml(member.name)}</h3>
            <p>${escapeHtml(member.position)}</p>
            <p>Status: ${escapeHtml(member.status)}</p>
          </div>

          ${actionButtonMarkup}
        </article>
      `;
    })
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

      const memberName = button.dataset.memberName;
      const memberPosition = button.dataset.memberPosition;

      if (!activeCrewShiftId || !memberName) {
        return;
      }

      const responses = getShiftResponses();
      const currentResponse = responses[activeCrewShiftId] || {};

      const existingWorkers = Array.isArray(currentResponse.interestedWorkers)
        ? currentResponse.interestedWorkers
        : [];

      const memberId = `crew-${memberName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`;

      const alreadyInterested = existingWorkers.some(
        (worker) => worker.id === memberId,
      );

      if (!alreadyInterested) {
        const interestedWorker = {
          id: memberId,
          name: memberName,
          role: memberPosition || "Worker",
          availability: {
            label: "Available",
            status: "available",
          },
          selected: false,
        };

        responses[activeCrewShiftId] = {
          ...currentResponse,
          interested: true,
          interestedAt: getCatchEventTime(),
          interestedWorkers: [...existingWorkers, interestedWorker],
          interestedCount: existingWorkers.length + 1,
          status: currentResponse.status || "Open",
        };

        saveShiftResponses(responses);
        renderShiftBoard();
      }

      button.textContent = "Interested";
      button.disabled = true;

      crewActionStatus.textContent = `${memberName} is available and interested in this shift.`;
    });
  });
}

function openCrewShift(shift, shouldNavigate = true) {
  const crew =
    workplaceCrews[shift.workplace] || workplaceCrews["Departure Lounge"];

  const sourceShift = shift.sourceShiftId
    ? findShiftById(shift.sourceShiftId)
    : null;

  const isOwnCoverageRequest =
    shift.requestType === "release" && sourceShift?.owner === CURRENT_USER.id;

  activeCrewShiftId = shift.id;
  crewShiftDate.textContent = shift.day;
  crewShiftWorkplace.textContent = shift.workplace;
  crewShiftTime.textContent = shift.time;
  crewShiftRole.textContent = getCrewShiftSummary(shift);
  crewShiftStatus.textContent = `Status: ${getDisplayedShiftStatus(shift, getShiftResponses())}`;
  crewActionStatus.textContent = `Viewing Shift Crew for ${shift.workplace}.`;

  renderCrewMembers(
    frontOfHouseList,
    crew.frontOfHouse,
    isOwnCoverageRequest ? "Ask availability" : "",
  );

  renderCrewMembers(
    backOfHouseList,
    crew.backOfHouse,
    isOwnCoverageRequest ? "Ask availability" : "",
  );

  renderCrewMembers(
    managerList,
    crew.managers,
    isOwnCoverageRequest ? "Approval needed" : "",
  );
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

  window.setTimeout(() => {
    if (shiftBoardStatus.textContent === "Added to Catch Board.") {
      updateCatchViewForRole();
    }
  }, 2500);

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
            ${selected ? "✓" : escapeHtml(initial)}
        </span>
    `;
}

// IDL-001 — Status Pill
// Props: label, status
// States: available, working, off
// Used by: Presence Card

function renderStatusPill(label, status) {
  return `
        <span class="interested-worker-availability status-${escapeHtml(status)}">
            <span
                class="interested-worker-availability-dot"
                aria-hidden="true"
            ></span>

            ${escapeHtml(label)}
        </span>
    `;
}

// IDL-003 — Presence Card
// Props: worker, workerIndex, shiftId
// States: default, hover, selected
// Composes: Avatar, Status Pill

function renderPresenceCard(
  worker,
  workerIndex,
  shiftId,
  { selectable = false } = {},
) {
  const interactionAttributes = selectable
    ? `
            role="button"
            tabindex="0"
            aria-pressed="${worker.selected}"
      `
    : "";

  return `
        <div
            class="interested-worker ${selectable ? "is-selectable" : ""} ${worker.selected ? "is-selected" : ""}"
            data-shift-id="${escapeHtml(shiftId)}"
            data-worker-index="${escapeHtml(workerIndex)}"
            ${interactionAttributes}
        >
            ${renderAvatar({
    label: worker.name,
    selected: worker.selected,
  })}

            <div>
                <p class="interested-worker-name">
                    ${escapeHtml(worker.name)}
                </p>

                <div class="interested-worker-meta">
                    <p class="interested-worker-role">
                        ${escapeHtml(worker.role)}
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

async function restoreActiveDirectOfferForRelease(shift) {
  if (!shift?.id || !directReleaseButton || !postShiftStatus) {
    return;
  }

  const targetShiftId = shift.id;

  const existingRestoredButton = document.getElementById(
    "restored-direct-offer-cancel-button",
  );

  if (existingRestoredButton) {
    existingRestoredButton.remove();
  }

  directReleaseButton.style.display = "";

  try {
    const {
      data: activeOffers,
      error: activeOfferError,
    } = await supabaseClient.rpc("get_my_active_direct_shift_offer", {
      target_shift_id: targetShiftId,
    });

    if (activeOfferError) {
      throw activeOfferError;
    }

    // The user may have opened another shift while the request was running.
    if (selectedReleaseShift?.id !== targetShiftId) {
      return;
    }

    const activeOffer = (activeOffers || [])[0];

    if (!activeOffer) {
      return;
    }

    if (releaseToBoardButton) {
      releaseToBoardButton.disabled = true;
    }

    directReleaseButton.style.display = "none";

    if (directReleaseDivider) {
      directReleaseDivider.style.display = "none";
    }

    if (activeOffer.offer_status === "accepted") {
      postShiftStatus.textContent =
        `${activeOffer.recipient_name} accepted this direct offer. ` +
        "Waiting for manager approval.";
    } else {
      postShiftStatus.textContent =
        `Direct offer sent to ${activeOffer.recipient_name}.`;
    }

    const cancelOfferButton = document.createElement("button");

    cancelOfferButton.type = "button";
    cancelOfferButton.id = "restored-direct-offer-cancel-button";
    cancelOfferButton.className = "secondary-action direct-offer-cancel";
    cancelOfferButton.textContent = "Cancel Direct Offer";

    cancelOfferButton.addEventListener("click", async () => {
      cancelOfferButton.disabled = true;
      cancelOfferButton.textContent = "Canceling...";

      try {
        const {
          error: cancelError,
        } = await supabaseClient.rpc("cancel_direct_shift_offer", {
          target_offer_id: activeOffer.offer_id,
        });

        if (cancelError) {
          throw cancelError;
        }

        postShiftStatus.textContent =
          `Direct offer to ${activeOffer.recipient_name} canceled.`;

        cancelOfferButton.remove();

        if (releaseToBoardButton) {
          releaseToBoardButton.disabled = false;
        }

        directReleaseButton.style.display = "";

        if (directReleaseDivider) {
          directReleaseDivider.style.display = "";
        }




      } catch (error) {
        postShiftStatus.textContent =
          "Unable to cancel direct offer.";

        cancelOfferButton.disabled = false;
        cancelOfferButton.textContent = "Cancel Direct Offer";
      }
    });

    postShiftStatus.insertAdjacentElement(
      "afterend",
      cancelOfferButton,
    );
  } catch (error) {
    postShiftStatus.textContent = "Unable to restore the active direct offer.";
  }
}

function prefillReleaseForm(shift) {
  if (!shift) {
    return;
  }

  selectedReleaseShift = shift;

  // Always begin Release Shift from a clean UI state.
  if (releaseToBoardButton) {
    releaseToBoardButton.disabled = false;
  }

  if (directReleaseButton) {
    directReleaseButton.style.display = "";
  }

  if (directReleaseDivider) {
    directReleaseDivider.style.display = "";
  }

  if (postShiftStatus) {
    postShiftStatus.textContent = "";
  }

  document
    .querySelectorAll(".direct-offer-cancel")
    .forEach((button) => button.remove());

  releaseSummaryWorkplace.textContent =
    shift.workplace || "Workplace not provided";

  releaseSummaryRole.textContent =
    shift.role || "Role not provided";

  releaseSummaryDay.textContent =
    shift.day || "Date not provided";

  releaseSummaryTime.textContent =
    shift.time || "Time not provided";

  // After resetting the UI, restore an active offer only if Supabase has one.
  void restoreActiveDirectOfferForRelease(shift);
}

function renderShiftDetailsActivity(shift) {
  if (!shiftDetailsActivity || !shift) {
    return;
  }

  const crew = Array.isArray(authenticatedWorkplaceCrew)
    ? authenticatedWorkplaceCrew
    : [];

  const shiftActivities = Array.isArray(authenticatedCoverageEvents)
    ? authenticatedCoverageEvents
      .filter((event) => event.shift_id === shift.id)
      .map((event) => formatCoverageEvent(event, crew))
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
    : [];

  if (shift.source === "imported") {
    shiftActivities.unshift({
      title: "Schedule imported",
      message: "Imported from ScheduleFly.",
      createdAt: null,
    });
  }

  shiftDetailsActivity.innerHTML =
    shiftActivities.length > 0
      ? shiftActivities
        .map((activity) => {
          const activityTime = activity.createdAt
            ? new Date(activity.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
            : "";

          return `
            <p class="shift-activity-item">
              <strong>${escapeHtml(activity.title)}</strong>
              ${activityTime
              ? `<br><span>${activityTime}</span>`
              : ""
            }
              <br>${escapeHtml(activity.message)}
            </p>
          `;
        })
        .join("")
      : "<p>No activity recorded.</p>";
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

  renderShiftDetailsActivity(shift);

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
      authenticatedScheduleShifts?.find((item) => item.id === shiftId) ||
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

function formatCoverageEvent(event, crew = []) {
  if (!event) {
    return null;
  }

  const getCrewName = (profileId) => {
    if (!profileId) return null;

    const crewMember = crew.find(
      (member) => member.id === profileId
    );

    return crewMember?.name || "Coworker";
  };

  const previousWorker = getCrewName(
    event.previous_profile_id
  );

  const newWorker = getCrewName(
    event.new_profile_id
  );

  const shiftStartsAtValue =
    event.shift_starts_at || event.shift?.starts_at;

  const shiftStartsAt = shiftStartsAtValue
    ? new Date(shiftStartsAtValue)
    : null;

  const shiftLabel =
    shiftStartsAt &&
      !Number.isNaN(shiftStartsAt.getTime())
      ? shiftStartsAt.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
      : "Shift";

  const baseActivity = {
    id: event.id,
    type: event.event_type,
    createdAt: event.created_at,
    workplace: shiftLabel,
  };

  switch (event.event_type) {
    case "direct_offer_sent":
      return {
        ...baseActivity,
        title: "Direct offer sent",
        message: `${previousWorker || "Coworker"} → ${newWorker || "Coworker"
          }`,
      };

    case "direct_offer_accepted":
      return {
        ...baseActivity,
        title: "Direct offer accepted",
        message: `${newWorker || "Coworker"
          } accepted the shift.`,
      };

    case "direct_offer_approved":
      return {
        ...baseActivity,
        title: "Direct offer approved",
        message: `${newWorker || "Coworker"
          } was assigned to the shift.`,
      };

    case "direct_offer_declined":
      return {
        ...baseActivity,
        title: "Direct offer declined",
        message: `${newWorker || "Coworker"
          } declined the shift.`,
      };

    case "direct_offer_canceled":
      return {
        ...baseActivity,
        title: "Direct offer canceled",
        message: `${previousWorker || "Coworker"
          } canceled the direct offer.`,
      };

    case "manager_reassigned":
      return {
        ...baseActivity,
        title: "Shift reassigned",
        message: `${previousWorker || "Unassigned"
          } → ${newWorker || "Unassigned"}`,
      };

    case "coverage_confirmed":
      return {
        ...baseActivity,
        title: "Coverage confirmed",
        message: previousWorker
          ? `${previousWorker} → ${newWorker || "Coworker"}`
          : `${newWorker || "Coworker"} picked up an open shift`,
      };

    case "coverage_canceled":
      return {
        ...baseActivity,
        title: "Coverage canceled",
        message: `${previousWorker || "Coworker"
          } canceled the coverage request.`,
      };

    default:
      return {
        ...baseActivity,
        title: "Schedule activity",
        message: "Schedule activity recorded.",
      };
  }
}

function renderActivityFeed() {
  if (!activityFeedList) {
    return;
  }

  const isAuthenticatedActivityMode = Array.isArray(
    authenticatedCoverageEvents,
  );

  let activities;

  if (isAuthenticatedActivityMode) {
    const crew = Array.isArray(authenticatedWorkplaceCrew)
      ? authenticatedWorkplaceCrew
      : [];
    const isManager =
      authenticatedWorkplaceRole?.toLowerCase() === "manager";
    const visibleEvents = isManager
      ? authenticatedCoverageEvents
      : authenticatedCoverageEvents.filter(
        (event) =>
          event.previous_profile_id === authenticatedUserId ||
          event.new_profile_id === authenticatedUserId,
      );

    activities = visibleEvents
      .map((event) => formatCoverageEvent(event, crew))
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  } else {
    activities = getActivityFeed().filter((activity) => {
      return activity.workerId === CURRENT_USER.id;
    });
  }

  if (activities.length === 0) {
    activityFeedList.innerHTML =
      `<p class="status-text">No activity yet.</p>`;
    return;
  }

  activityFeedList.innerHTML = activities
    .filter(Boolean)
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
        !isAuthenticatedActivityMode && activity.type === "shift-approved"
          ? `
              <p class="activity-feed-detail">
                Approved by ${escapeHtml(activity.approvedBy || "Manager")}
              </p>
            `
          : "";

      return `
        <article class="activity-feed-item">
          <div
            class="activity-feed-marker"
            aria-hidden="true"
          ></div>

          <div class="activity-feed-content">
            <div class="activity-feed-header">
              <p class="activity-feed-type">
                ${escapeHtml(activity.title)}
              </p>

              <p class="activity-feed-time">
                ${activityTime}
              </p>
            </div>

            <h3>${escapeHtml(activity.message)}</h3>

            ${approvalMarkup}

            <p class="activity-feed-meta">
              ${escapeHtml(activity.workplace || "Workplace not provided")}
            </p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCaughtShifts() {
  if (!caughtShiftsPanel || !caughtShiftsList) return;

  const responses = getShiftResponses();
  const allShifts = getAllShifts();

  const pendingCaughtShifts = Object.keys(responses)
    .filter((shiftId) => {
      const response = responses[shiftId];

      return (
        response?.accepted === true &&
        response?.caughtByWorkerId === CURRENT_USER.id &&
        response?.status === "Pending Approval"
      );
    })
    .map((shiftId) => {
      const shift = findShiftById(shiftId);

      if (!shift) return null;

      return {
        ...shift,
        displayStatus: "Pending Approval",
      };
    })
    .filter(Boolean);

  const confirmedCaughtShifts = allShifts
    .filter((shift) => {
      return (
        shift.owner === CURRENT_USER.id &&
        shift.status === "Scheduled" &&
        Boolean(shift.transferredAt)
      );
    })
    .map((shift) => ({
      ...shift,
      displayStatus: "Confirmed",
    }));

  const caughtShifts = [...pendingCaughtShifts, ...confirmedCaughtShifts];

  caughtShiftsPanel.hidden = caughtShifts.length === 0;

  if (caughtShifts.length === 0) {
    caughtShiftsList.innerHTML = "";
    return;
  }

  caughtShiftsList.innerHTML = caughtShifts
    .map(
      (shift) => `
        <article class="stack-card shift-card caught-shift-card">
          <div class="stack-copy">
            <p class="stack-kicker">
              ${escapeHtml(shift.displayStatus)}
            </p>

            <h3>${escapeHtml(shift.workplace)}</h3>

            <p>${escapeHtml(shift.role)}</p>

            <ul class="shift-meta">
              <li>${escapeHtml(shift.day)}</li>
              <li>${escapeHtml(shift.time)}</li>
            </ul>

            <p>Status: ${escapeHtml(shift.displayStatus)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

async function loadAndRenderManagerDirectApprovals() {
  if (
    authenticatedWorkplaceRole?.toLowerCase() !== "manager" ||
    !shiftBoardList
  ) {
    return;
  }

  const {
    data: directApprovals,
    error: directApprovalsError,
  } = await supabaseClient.rpc(
    "list_direct_offer_approvals"
  );



  if (directApprovalsError) {
    return;
  }

  authenticatedManagerDirectApprovals = directApprovals || [];

  shiftBoardList
    .querySelectorAll(".direct-offer-approval-card")
    .forEach((card) => card.remove());

  (directApprovals || []).forEach((offer) => {
    const shift = offer.shift_data || {};

    const startDate = shift.starts_at
      ? new Date(shift.starts_at)
      : null;

    const day = startDate
      ? startDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      : "Shift";

    const startTime = startDate
      ? startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
      : "";

    const endTime = shift.ends_at
      ? new Date(shift.ends_at).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
      : shift.end_label || "";

    const approvalCard =
      document.createElement("article");

    approvalCard.className =
      "stack-card shift-card direct-offer-approval-card";

    approvalCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">
          Direct offer awaiting approval
        </p>

        <h3>
          ${escapeHtml(offer.sender_name)}
          → ${escapeHtml(offer.recipient_name)}
        </h3>

        <p>${escapeHtml(shift.role || "Shift")}</p>

        <ul class="shift-meta">
          <li>${escapeHtml(day)}</li>
          ${startTime
        ? `<li>${escapeHtml(startTime)}${endTime ? ` – ${escapeHtml(endTime)}` : ""
        }</li>`
        : ""
      }
        </ul>

        <p class="status-text">
  ${escapeHtml(offer.recipient_name)} accepted this direct offer.
</p>

<button
  type="button"
  class="action-button direct-offer-approve-button"
>
  Approve Direct Offer
</button>
</div>
`;

    const approveButton = approvalCard.querySelector(
      ".direct-offer-approve-button"
    );

    if (approveButton) {
      approveButton.addEventListener("click", async () => {
        approveButton.disabled = true;
        approveButton.textContent = "Approving…";

        try {
          const { error: approvalError } = await supabaseClient.rpc(
            "approve_direct_shift_offer",
            {
              target_offer_id: offer.offer_id,
            }
          );

          if (approvalError) {
            throw approvalError;
          }

          approvalCard.remove();
          authenticatedManagerDirectApprovals =
            authenticatedManagerDirectApprovals.filter(
              (pendingOffer) => pendingOffer.offer_id !== offer.offer_id,
            );
          syncShiftBoardEmptyState();

          if (shiftBoardStatus) {
            shiftBoardStatus.textContent =
              `${offer.recipient_name} is now assigned to the shift.`;
          }
        } catch (error) {
          showActionFailure(
            shiftBoardStatus,
            "We couldn't approve this direct offer. Please try again.",
          );
          approveButton.disabled = false;
          approveButton.textContent =
            "Approve Direct Offer";
        }
      });
    }

    shiftBoardList.appendChild(approvalCard);
  });

  syncShiftBoardEmptyState();
}

function getShiftBoardEmptyStateMarkup() {
  const isManager =
    authenticatedWorkplaceRole?.toLowerCase() === "manager";
  const title = isManager
    ? "No coverage activity right now."
    : "New coverage activity will appear here.";
  const message = isManager
    ? "New coverage activity will appear here."
    : "Available shifts will appear here.";

  return `
    <div class="catch-empty-state">
      <p class="catch-empty-title">
        ${title}
      </p>

      <p class="catch-empty-text">
        ${message}
      </p>
    </div>
  `;
}

function syncShiftBoardEmptyState() {
  if (!shiftBoardList) {
    return;
  }

  const existingEmptyState =
    shiftBoardList.querySelector(".catch-empty-state");
  const hasShiftCards = Boolean(
    shiftBoardList.querySelector(".shift-card"),
  );

  if (hasShiftCards) {
    existingEmptyState?.remove();
    return;
  }

  if (!existingEmptyState) {
    shiftBoardList.insertAdjacentHTML(
      "beforeend",
      getShiftBoardEmptyStateMarkup(),
    );
  }
}

function renderShiftBoard() {
  const isAuthenticatedCatchMode = Boolean(authenticatedUserId);

  const responses = isAuthenticatedCatchMode ? {} : getShiftResponses();
  const scheduledShifts = getShiftStore();

  const shifts = isAuthenticatedCatchMode
    ? (authenticatedCatchShifts ?? [])
    : getAllShifts().filter((shift) => {
      const displayedStatus = getDisplayedShiftStatus(shift, responses);

      const isCatchOpportunity =
        shift.source === "catch-board" ||
        sampleShifts.some((sampleShift) => sampleShift.id === shift.id);

      const hasBeenScheduled = scheduledShifts.some(
        (scheduledShift) => scheduledShift.sourceBoardShiftId === shift.id,
      );

      const isCompletedOpportunity =
        displayedStatus === "Confirmed" || displayedStatus === "Scheduled";

      return (
        isCatchOpportunity && !hasBeenScheduled && !isCompletedOpportunity
      );
    });

  shiftBoardList.innerHTML = "";

  if (
    authenticatedWorkplaceRole?.toLowerCase() === "manager"
  ) {
    loadAndRenderManagerDirectApprovals();
  }

  if (shifts.length === 0) {
    shiftBoardList.innerHTML = getShiftBoardEmptyStateMarkup();

    return;
  }

  shifts.forEach((shift) => {
    const displayedStatus =
      shift.displayStatus || getDisplayedShiftStatus(shift, responses);

    const backendInterests = isAuthenticatedCatchMode
      ? (authenticatedShiftInterests ?? []).filter(
        (interest) => interest.shift_id === shift.id,
      )
      : [];

    const legacyResponse = isAuthenticatedCatchMode
      ? null
      : (responses[shift.id] ?? {});

    const isOwnCoverageRequest =
      Boolean(authenticatedUserId) && shift.owner === authenticatedUserId;

    const currentUserInterest = backendInterests.find(
      (interest) => interest.profile_id === authenticatedUserId,
    );

    const hasAnyInterest = isAuthenticatedCatchMode
      ? backendInterests.length > 0
      : Boolean(legacyResponse?.interested);

    const hasInterest = isAuthenticatedCatchMode
      ? isOwnCoverageRequest
        ? hasAnyInterest
        : Boolean(currentUserInterest)
      : Boolean(legacyResponse?.interested);
    const interestedCount = isAuthenticatedCatchMode
      ? backendInterests.length
      : legacyResponse?.interestedCount || 0;

    const interestedWorkers = isAuthenticatedCatchMode
      ? backendInterests.map((interest) => ({
        id: interest.profile_id,
        name: interest.profile?.full_name || "Coworker",
        role: "Coworker",
        availability: {
          label:
            interest.status === "confirmed"
              ? "Confirmed"
              : interest.status === "selected"
                ? "Selected"
                : "Interested",
          status: "available",
        },
        selected:
          interest.status === "selected" || interest.status === "confirmed",
        interestId: interest.id,
        interestStatus: interest.status,
      }))
      : legacyResponse?.interestedWorkers || [];
    const confirmedBackendInterest = isAuthenticatedCatchMode
      ? (backendInterests.find((interest) => interest.status === "confirmed") ??
        null)
      : null;

    const confirmedWorkerId = isAuthenticatedCatchMode
      ? (confirmedBackendInterest?.profile_id ?? null)
      : legacyResponse?.confirmedWorkerId;

    const confirmedWorker = interestedWorkers.find(
      (worker) => worker.id === confirmedWorkerId,
    );

    const isAccepted = isAuthenticatedCatchMode
      ? backendInterests.some(
        (interest) =>
          interest.status === "selected" || interest.status === "confirmed",
      )
      : Boolean(legacyResponse?.accepted);

    const catchTimeline = getCatchTimeline(
      shift,
      isAuthenticatedCatchMode ? {} : responses,
    );

    const isConfirmed = isAuthenticatedCatchMode
      ? backendInterests.some((interest) => interest.status === "confirmed")
      : Boolean(legacyResponse?.confirmed);

    const publicCoverageStage = isAuthenticatedCatchMode
      ? shift.coverageStage || "open"
      : null;

    const shiftHasInterest = isAuthenticatedCatchMode
      ? ["interest", "selected", "confirmed"].includes(publicCoverageStage) ||
      backendInterests.some((interest) =>
        ["interested", "selected", "confirmed"].includes(interest.status),
      )
      : hasAnyInterest;

    const shiftIsSelected = isAuthenticatedCatchMode
      ? ["selected", "confirmed"].includes(publicCoverageStage) ||
      backendInterests.some((interest) =>
        ["selected", "confirmed"].includes(interest.status),
      )
      : isAccepted;

    const shiftIsConfirmed = isAuthenticatedCatchMode
      ? publicCoverageStage === "confirmed" ||
      backendInterests.some((interest) => interest.status === "confirmed")
      : isConfirmed;

    const anotherWorkerSelected =
      isAuthenticatedCatchMode &&
      shiftIsSelected &&
      !isOwnCoverageRequest &&
      currentUserInterest?.status !== "selected" &&
      currentUserInterest?.status !== "confirmed";

    const selectedBackendInterest = isAuthenticatedCatchMode
      ? (backendInterests.find((interest) => interest.status === "selected") ??
        null)
      : null;

    const canManagerApprove =
      isAuthenticatedCatchMode &&
      authenticatedWorkplaceRole?.toLowerCase() === "manager" &&
      Boolean(selectedBackendInterest) &&
      !isConfirmed;
    const canManagerSelectInterestedWorkers =
      isAuthenticatedCatchMode &&
      authenticatedWorkplaceRole?.toLowerCase() === "manager" &&
      !shiftIsSelected &&
      !shiftIsConfirmed;

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
            renderPresenceCard(worker, workerIndex, shift.id, {
              selectable: canManagerSelectInterestedWorkers,
            }),
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
        class="catch-timeline-event ${index === catchTimeline.length - 1 ? "is-current" : ""
          }"
      >
        <span class="catch-timeline-marker" aria-hidden="true"></span>

        <div>
  <p class="catch-timeline-time">${escapeHtml(event.time)}</p>
  <p class="catch-timeline-label">${escapeHtml(event.label)}</p>
  <p class="catch-timeline-detail">${escapeHtml(event.detail)}</p>
</div>
      </div>
    `,
      )
      .join("");
    const boardButtonLabel = isConfirmed
      ? "Coverage confirmed"
      : isAccepted
        ? "Waiting for approval"
        : anotherWorkerSelected
          ? "Another coworker selected"
          : hasInterest
            ? "Withdraw interest"
            : isAuthenticatedCatchMode
              ? "Catch shift"
              : getBoardButtonLabel(shift);
    const hasInterestedCoworkers = interestedWorkers.length > 0;
    const responsePanel =
      hasInterest || hasInterestedCoworkers
        ? `
        <div class="response-panel">
         ${interestedWorkersMarkup}
         ${hasInterest
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
         ${isConfirmed
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
            data-shift-id="${escapeHtml(shift.id)}"
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
            : isAuthenticatedCatchMode
              ? `
      <div class="schedule-action-panel">
        <p class="status-text">
          ${authenticatedWorkplaceRole?.toLowerCase() === "manager"
                ? hasInterestedCoworkers
                  ? "Select an interested coworker above."
                  : "Waiting for coworker interest."
                : hasInterestedCoworkers
                  ? "Waiting for manager selection."
                  : "Waiting for coworker interest."
              }
        </p>
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
          data-shift-id="${escapeHtml(shift.id)}"
        >
          Accept
        </button>

        <button
          class="action-button secondary-action decline-button"
          type="button"
          data-shift-id="${escapeHtml(shift.id)}"
        >
          Decline
        </button>
      </div>
    `
        }
        </div>
      `
        : "";

    const sourceShift = shift.sourceShiftId
      ? findShiftById(shift.sourceShiftId)
      : null;

    const releasedTimeLabel = getRelativeReleaseTime(shift.releasedTimestamp);

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";
    shiftCard.dataset.catchShiftId = shift.id;
    shiftCard.tabIndex = -1;

    const statusClass = shiftIsConfirmed
      ? "status-confirmed"
      : shiftIsSelected
        ? "status-pending"
        : shiftHasInterest
          ? "status-interest"
          : "status-open";
    const coverageStatusLabel = shiftIsConfirmed
      ? "Confirmed"
      : shiftIsSelected
        ? "Selected"
        : shiftHasInterest
          ? "Interest"
          : displayedStatus;

    shiftCard.innerHTML = `
      <div class="stack-copy">
  <p class="stack-kicker">${escapeHtml(getBoardRequestLabel(shift))}</p>
  <h3>${escapeHtml(shift.workplace)}</h3>
<p class="detail-label">Position</p>
<p>${escapeHtml(shift.role)}</p>

  <ul class="shift-meta">
    <li>${escapeHtml(shift.day)}</li>
    <li>${escapeHtml(shift.time)}</li>
  </ul>

  ${shift.neighborhood
        ? `
      <ul class="shift-meta">
        <li>${escapeHtml(shift.neighborhood)}</li>
      </ul>
    `
        : ""
      }

  <p class="shift-release-time">
  ${escapeHtml(releasedTimeLabel)}
</p>




 <div class="catch-status-chip ${statusClass}">
  <span class="catch-status-dot" aria-hidden="true"></span>
 <span>${escapeHtml(coverageStatusLabel)}</span>
</div>
<div class="catch-progress ${statusClass}" aria-label="Shift coverage progress">
  <div class="catch-progress-step ${shiftHasInterest ? "is-complete" : ""} ${shiftHasInterest && !shiftIsSelected ? "is-current" : ""
      }">
    <span class="catch-progress-dot"></span>
    <span>Interest</span>
  </div>

  <div class="catch-progress-step ${shiftIsSelected ? "is-complete" : ""} ${shiftIsSelected && !shiftIsConfirmed ? "is-current" : ""
      }">
    <span class="catch-progress-dot"></span>
    <span>Selected</span>
  </div>

  <div class="catch-progress-step ${shiftIsConfirmed ? "is-complete is-current" : ""
      }">
    <span class="catch-progress-dot"></span>
    <span>Confirmed</span>
  </div>
</div>

<p>Shared with ${escapeHtml(shift.postedTo || "Workplace crew")}</p>
<p>${escapeHtml(shift.notes || shift.note || "No additional notes.")}</p>
</div>
      <div class="shift-action-row">
        ${isOwnCoverageRequest
        ? `
<button
  class="action-button cancel-coverage-button"
  type="button"
  data-shift-id="${escapeHtml(shift.id)}"
  ${shiftIsSelected || shiftIsConfirmed ? "disabled" : ""}
>
  ${shiftIsSelected
          ? "Coverage awaiting approval"
          : "Cancel coverage request"
        }
</button>
`
        : canManagerApprove
          ? `
        <button
          class="action-button manager-approve-button"
          type="button"
          data-shift-id="${escapeHtml(shift.id)}"
          data-profile-id="${escapeHtml(selectedBackendInterest.profile_id)}"
        >
          Approve Coverage
        </button>
      `
          : authenticatedWorkplaceRole?.toLowerCase() === "manager"
            ? ""
            : `
<button
  class="action-button board-action-button"
  type="button"
  data-shift-id="${escapeHtml(shift.id)}"
 ${isConfirmed || isAccepted || anotherWorkerSelected ? "disabled" : ""}
  >
  ${boardButtonLabel}
</button>
`
      }
        ${isConfirmed
        ? ""
        : `
      <button
        class="action-button secondary-action view-crew-button"
        type="button"
        data-shift-id="${escapeHtml(shift.id)}"
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
    button.addEventListener("click", async () => {
      const shiftId = button.dataset.shiftId;

      if (!shiftId) {
        return;
      }

      const originalButtonText = button.textContent;

      button.disabled = true;
      button.textContent = "Catching...";

      try {
        if (shiftBoardStatus) {
          shiftBoardStatus.textContent = "";
        }

        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
          showActionFailure(
            shiftBoardStatus,
            "We couldn't verify your account. Please sign in and try again.",
          );
          button.disabled = false;
          button.textContent = originalButtonText;
          return;
        }

        const existingOwnInterest = authenticatedShiftInterests.find(
          (interest) =>
            interest.shift_id === shiftId &&
            interest.profile_id === user.id &&
            interest.status === "interested",
        );

        if (existingOwnInterest) {
          button.textContent = "Withdrawing...";

          const { error: withdrawError } = await supabaseClient.rpc(
            "withdraw_shift_interest",
            {
              p_shift_id: shiftId,
            },
          );

          if (withdrawError) {
            showActionFailure(
              shiftBoardStatus,
              "We couldn't withdraw your interest. Please try again.",
            );
            button.disabled = false;
            button.textContent = originalButtonText;
            return;
          }

          await loadAuthenticatedShiftInterests();
          await loadAuthenticatedCatchShifts();
          return;
        }

        const { error: interestError } = await supabaseClient
          .from("shift_interests")
          .insert({
            shift_id: shiftId,
            profile_id: user.id,
            status: "interested",
          })
          .select()
          .single();

        if (interestError) {
          // User already expressed interest in this shift.
          if (interestError.code === "23505") {
            await loadAuthenticatedShiftInterests();
            return;
          }

          button.disabled = false;
          button.textContent = originalButtonText;
          showActionFailure(
            shiftBoardStatus,
            "We couldn't record your interest. Please try again.",
          );
          return;
        }

        await loadAuthenticatedShiftInterests();
      } catch (error) {
        showActionFailure(
          shiftBoardStatus,
          "We couldn't update your interest. Please try again.",
        );
        button.disabled = false;
        button.textContent = originalButtonText;
      }
    });
  });

  document.querySelectorAll(".cancel-coverage-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const shiftId = button.dataset.shiftId;

      if (!shiftId) {
        return;
      }

      const originalButtonText = button.textContent;

      button.disabled = true;
      button.textContent = "Canceling...";

      try {
        if (shiftBoardStatus) {
          shiftBoardStatus.textContent = "";
        }

        const { error: cancelError } =
          await supabaseClient.rpc("cancel_coverage_request", {
            p_shift_id: shiftId,
          });

        if (cancelError) {
          showActionFailure(
            shiftBoardStatus,
            "We couldn't cancel this coverage request. Please try again.",
          );
          button.disabled = false;
          button.textContent = originalButtonText;
          return;
        }

        await loadAuthenticatedShiftInterests();
        await loadAuthenticatedCatchShifts();
        await loadAuthenticatedSchedule();

        setActiveSection("schedule");
        setActiveScheduleView("my-shifts");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        showActionFailure(
          shiftBoardStatus,
          "We couldn't cancel this coverage request. Please try again.",
        );
        button.disabled = false;
        button.textContent = originalButtonText;
      }
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

  document
    .querySelectorAll(".interested-worker.is-selectable")
    .forEach((workerRow) => {
      const selectWorker = async () => {
        const shiftId = workerRow.dataset.shiftId;
        const workerIndex = Number(workerRow.dataset.workerIndex);

        if (
          authenticatedShiftInterests === undefined ||
          !authenticatedUserId
        ) {
          return;
        }

        const shift = authenticatedCatchShifts?.find(
          (catchShift) => catchShift.id === shiftId,
        );

        const isManagerSelectingShift =
          authenticatedWorkplaceRole?.toLowerCase() === "manager" &&
          (shift?.status === "coverage_needed" ||
            (shift?.status === "open" && !shift.owner));

        if (!shift || !isManagerSelectingShift) {
          return;
        }

        const shiftInterests = authenticatedShiftInterests.filter(
          (interest) => interest.shift_id === shiftId,
        );

        const selectedInterest = shiftInterests[workerIndex];

        if (!selectedInterest) {
          return;
        }

        try {
          const { error: updateError } =
            await supabaseClient
              .rpc("select_shift_interest", {
                p_interest_id: selectedInterest.id,
              })
              .single();

          if (updateError) {
            showActionFailure(
              shiftBoardStatus,
              "We couldn't select this coworker. Please try again.",
            );
            return;
          }

          await loadAuthenticatedShiftInterests();
        } catch (error) {
          showActionFailure(
            shiftBoardStatus,
            "We couldn't select this coworker. Please try again.",
          );
        }
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
    button.addEventListener("click", async () => {
      const shiftId = button.dataset.shiftId;
      const selectedProfileId = button.dataset.profileId;

      if (!shiftId || !selectedProfileId) {
        return;
      }

      const originalButtonText = button.textContent;

      button.disabled = true;
      button.textContent = "Approving...";

      try {
        const { error } = await supabaseClient.rpc("confirm_shift_coverage", {
          target_shift_id: shiftId,
          selected_profile_id: selectedProfileId,
        });

        if (error) {
          showActionFailure(
            shiftBoardStatus,
            "We couldn't approve this coverage request. Please try again.",
          );
          button.disabled = false;
          button.textContent = originalButtonText;
          return;
        }

        shiftBoardStatus.textContent = "Coverage confirmed.";

        await loadAuthenticatedShiftInterests();
        await loadAuthenticatedCatchShifts();
        await loadAuthenticatedSchedule();
      } catch (error) {
        showActionFailure(
          shiftBoardStatus,
          "We couldn't approve this coverage request. Please try again.",
        );
        button.disabled = false;
        button.textContent = originalButtonText;
      }
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

function getYesterdayTipTotal() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");

  const yesterdayDate = `${year}-${month}-${day}`;

  return getTipEntries()
    .filter((entry) => entry.date === yesterdayDate)
    .reduce(
      (total, entry) =>
        total + (Number(entry.cashTips) || 0) + (Number(entry.creditTips) || 0),
      0,
    );
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

  const now = new Date(DEMO_NOW);
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
  tipBestShiftDetail.textContent = `${bestShift.workplace || "Workplace not added"
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
  tipSummaryDetail.textContent = `${entries.length} saved ${entries.length === 1 ? "shift" : "shifts"
    }.`;

  entries.forEach((entry) => {
    const entryTotal = entry.cashTips + entry.creditTips;
    const card = document.createElement("article");

    card.className = "stack-card tip-entry-card";

    card.innerHTML = `
  <div class="stack-copy">
    <p class="stack-kicker">${escapeHtml(formatSavedDate(entry.date))}</p>
    <h3 class="tip-entry-workplace">
  <span aria-hidden="true">📍</span>
  ${escapeHtml(entry.workplace || "Workplace not added")}
</h3>

<p class="tip-entry-role">
  <span aria-hidden="true">👤</span>
  ${escapeHtml(entry.role || "Role not added")}
</p>
    <div class="tip-entry-breakdown">
      <div>
        <span><span aria-hidden="true">💵</span> Cash</span>
        <strong>${escapeHtml(formatMoney(entry.cashTips))}</strong>
      </div>

      <div>
        <span><span aria-hidden="true">💳</span> Credit</span>
        <strong>${escapeHtml(formatMoney(entry.creditTips))}</strong>
      </div>
    </div>

   <div class="tip-entry-total">
  <span>Shift Total</span>
  <strong>${escapeHtml(formatMoney(entryTotal))}</strong>
</div>

    ${entry.notes ? `<p>${escapeHtml(entry.notes)}</p>` : ""}

    <div class="tip-entry-actions">
  <button
    class="action-button secondary-action edit-tip-entry-button"
    type="button"
    data-entry-id="${escapeHtml(entry.id)}"
  >
    Edit entry
  </button>

  <button
    class="action-button secondary-action delete-tip-entry-button"
    type="button"
    data-entry-id="${escapeHtml(entry.id)}"
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
        `Delete the ${formatSavedDate(entryToDelete.date)} shift from ${entryToDelete.workplace || "this workplace"
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
      updateDashboardForRole();
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

    updateDashboardForRole();
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
                  <strong>${escapeHtml(shift.role)}</strong>
                  <span>${escapeHtml(shift.time)}</span>
                  <span>${escapeHtml(shift.workplace)}</span>
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

function renderAuthenticatedNextShiftSummary(shifts) {
  if (
    !myShiftsNextLabel ||
    !myShiftsNextTime ||
    !myShiftsNextStatus ||
    !myShiftsNextRole ||
    !myShiftsNextWorkplace
  ) {
    return;
  }

  const nextShift = shifts[0];

  if (!nextShift) {
    myShiftsNextLabel.textContent = "Upcoming shift";
    myShiftsNextTime.textContent = "No upcoming shift";
    myShiftsNextStatus.textContent = "No shift";
    myShiftsNextRole.textContent = "—";
    myShiftsNextWorkplace.textContent = "—";

    if (myShiftsNextCard) {
      delete myShiftsNextCard.dataset.shiftId;
    }

    return;
  }

  const dayLabel = getShiftDayLabel(nextShift);
  const isCoverageNeeded = nextShift.status === "coverage_needed";
  const isCurrent =
    nextShift.status === "scheduled" && isCurrentShift(nextShift);

  const nextShiftInterests = (authenticatedShiftInterests ?? []).filter(
    (interest) => interest.shift_id === nextShift.id,
  );

  const selectedInterest = nextShiftInterests.find(
    (interest) => interest.status === "selected",
  );

  const interestedCount = nextShiftInterests.filter(
    (interest) => interest.status === "interested",
  ).length;

  let coverageStatusLabel = "Waiting for coworker";

  if (selectedInterest) {
    coverageStatusLabel = "Awaiting manager approval";
  } else if (interestedCount === 1) {
    coverageStatusLabel = "1 coworker interested";
  } else if (interestedCount > 1) {
    coverageStatusLabel = `${interestedCount} coworkers interested`;
  }

  myShiftsNextLabel.textContent = isCoverageNeeded
    ? "Coverage requested"
    : isCurrent
      ? "Current shift"
      : "Upcoming shift";

  myShiftsNextTime.textContent = `${dayLabel} · ${nextShift.time}`;

  myShiftsNextStatus.textContent = isCoverageNeeded
    ? coverageStatusLabel
    : isCurrent
      ? "On shift now"
      : "Upcoming";

  myShiftsNextRole.textContent = nextShift.role || "—";
  myShiftsNextWorkplace.textContent = nextShift.workplace || "—";

  if (myShiftsNextCard) {
    myShiftsNextCard.dataset.shiftId = nextShift.id;
  }
} // end renderAuthenticatedNextShiftSummary

if (myShiftsNextCard) {
  const openAuthenticatedNextShift = () => {
    const shiftId = myShiftsNextCard.dataset.shiftId;

    if (!shiftId || !authenticatedScheduleShifts) {
      return;
    }

    const shift = authenticatedScheduleShifts.find(
      (item) => item.id === shiftId,
    );

    if (!shift) {
      return;
    }

    if (shift.status === "coverage_needed") {
      renderShiftBoard();
      setActiveSection("schedule");
      setActiveScheduleView("catch");

      requestAnimationFrame(() => {
        const coverageCard = document.querySelector(
          `[data-catch-shift-id="${shift.id}"]`,
        );

        if (!coverageCard) {
          return;
        }

        coverageCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        coverageCard.focus({
          preventScroll: true,
        });
      });

      return;
    }

    openShiftDetails(shift);
  };

  myShiftsNextCard.addEventListener("click", openAuthenticatedNextShift);

  myShiftsNextCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openAuthenticatedNextShift();
  });
}

function renderAuthenticatedScheduleShifts(shifts) {
  importedShiftList.innerHTML = "";

  const activeShifts = shifts || [];
  const endedShifts = authenticatedEndedScheduleShifts || [];

  // -----------------------------------------
  // ACTIVE / UPCOMING SHIFTS
  // -----------------------------------------

  if (!activeShifts.length) {
    importedShiftList.innerHTML = `
      <article class="stack-card shift-card">
        <div class="stack-copy">
          <p class="stack-kicker">My schedule</p>
          <h3>No upcoming shifts</h3>
          <p>Your scheduled shifts will appear here.</p>
        </div>
      </article>
    `;
  }

  activeShifts.forEach((shift) => {
    const isCoverageNeeded = shift.status === "coverage_needed";
    const isCurrent = shift.status === "scheduled" && isCurrentShift(shift);

    const shiftCard = document.createElement("article");
    shiftCard.className = "stack-card shift-card";

    shiftCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">
          ${isCoverageNeeded
        ? "Coverage requested"
        : isCurrent
          ? "Current shift"
          : "Scheduled shift"
      }
        </p>

        <h3>${escapeHtml(shift.day)}</h3>
        <p>${escapeHtml(shift.role)}</p>

        <ul class="shift-meta">
          <li>${escapeHtml(shift.time)}</li>
        </ul>

        <ul class="shift-meta">
          <li>${escapeHtml(shift.workplace)}</li>
        </ul>
      </div>
    `;

    shiftCard.setAttribute("role", "button");
    shiftCard.tabIndex = 0;

    shiftCard.setAttribute(
      "aria-label",
      isCoverageNeeded
        ? "Open coverage request"
        : `Open shift details for ${shift.day}`,
    );

    const openAuthenticatedScheduleShift = () => {
      if (isCoverageNeeded) {
        renderShiftBoard();
        setActiveSection("schedule");
        setActiveScheduleView("catch");
        return;
      }

      openShiftDetails(shift);
    };

    shiftCard.addEventListener("click", openAuthenticatedScheduleShift);

    shiftCard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openAuthenticatedScheduleShift();
    });

    importedShiftList.appendChild(shiftCard);
  });

  // -----------------------------------------
  // ENDED TODAY
  // -----------------------------------------

  if (endedShifts.length) {
    const endedHeading = document.createElement("div");
    endedHeading.className = "worker-ended-shifts-heading";

    endedHeading.innerHTML = `
      <p class="stack-kicker">Ended today</p>
    `;

    importedShiftList.appendChild(endedHeading);

    endedShifts.forEach((shift) => {
      const endedShiftDetails = shift.clockedOutTime
        ? `
            <div class="shift-end-details">
              <p>
                <span>Clocked out</span>
                <strong>${escapeHtml(shift.clockedOutTime)}</strong>
              </p>

              ${shift.recordedInIndustryTime
          ? `
                    <p>
                      <span>Recorded in Industry</span>
                      <strong>${escapeHtml(shift.recordedInIndustryTime)}</strong>
                    </p>
                  `
          : ""
        }
            </div>
          `
        : "";

      const shiftCard = document.createElement("article");
      shiftCard.className = "stack-card shift-card";

      shiftCard.innerHTML = `
        <div class="stack-copy">
          <p class="stack-kicker">Shift ended</p>

          <h3>${escapeHtml(shift.day)}</h3>
          <p>${escapeHtml(shift.role)}</p>

          <ul class="shift-meta">
            <li>${escapeHtml(shift.time)}</li>
          </ul>

          <ul class="shift-meta">
            <li>${escapeHtml(shift.workplace)}</li>
          </ul>

          ${endedShiftDetails}
        </div>
      `;

      importedShiftList.appendChild(shiftCard);
    });
  }
}

async function loadAndRenderDirectShiftOffers() {
  const {
    data: directOffers,
    error: directOffersError,
  } = await supabaseClient.rpc("list_my_direct_shift_offers");

  if (directOffersError) {
    return;
  }

  importedShiftList
    .querySelectorAll(".direct-offer-card")
    .forEach((card) => card.remove());

  (directOffers || []).forEach((offer) => {
    const shift = offer.shift_data || {};

    const offerCard = document.createElement("article");
    offerCard.className = "stack-card shift-card direct-offer-card";

    offerCard.innerHTML = `
      <div class="stack-copy">
        <p class="stack-kicker">Shift offered to you</p>

        <h3>${escapeHtml(offer.sender_name || "Coworker")}</h3>

        <p>${escapeHtml(shift.role || "Shift")}</p>

        <p class="status-text">
          ${offer.offer_status === "accepted"
        ? "You accepted this offer. Waiting for manager approval."
        : "This coworker sent this shift directly to you."
      }
        </p>

        ${offer.offer_status === "pending"
        ? `
              <div class="direct-offer-actions">
                <button
                  type="button"
                  class="action-button direct-offer-accept"
                  data-offer-id="${escapeHtml(offer.offer_id)}"
                >
                  Accept
                </button>

                <button
                  type="button"
                  class="secondary-action direct-offer-decline"
                  data-offer-id="${escapeHtml(offer.offer_id)}"
                >
                  Decline
                </button>
              </div>
            `
        : ""
      }
      </div>
    `;

    const acceptButton = offerCard.querySelector(
      ".direct-offer-accept"
    );

    const declineButton = offerCard.querySelector(
      ".direct-offer-decline"
    );

    const offerStatus = offerCard.querySelector(".status-text");

    const respondToDirectOffer = async (responseAction) => {
      if (acceptButton) {
        acceptButton.disabled = true;
      }

      if (declineButton) {
        declineButton.disabled = true;
      }

      try {
        const { error: responseError } = await supabaseClient.rpc(
          "respond_to_direct_shift_offer",
          {
            target_offer_id: offer.offer_id,
            response_action: responseAction,
          }
        );

        if (responseError) {
          throw responseError;
        }

        renderImportedShifts(
          authenticatedScheduleShifts
        );
      } catch (error) {
        showActionFailure(
          offerStatus,
          "We couldn't update this direct offer. Please try again.",
        );

        if (acceptButton) {
          acceptButton.disabled = false;
        }

        if (declineButton) {
          declineButton.disabled = false;
        }
      }
    };

    if (acceptButton) {
      acceptButton.addEventListener("click", () => {
        respondToDirectOffer("accept");
      });
    }

    if (declineButton) {
      declineButton.addEventListener("click", () => {
        respondToDirectOffer("decline");
      });
    }

    importedShiftList.appendChild(offerCard);
  });
}

function renderImportedShifts(backendShifts = authenticatedScheduleShifts) {
  importedShiftList.innerHTML = "";

  if (backendShifts !== undefined) {
    renderAuthenticatedScheduleShifts(backendShifts);
    loadAndRenderDirectShiftOffers();
    return;
  }

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
          <button class="action-button post-to-crew-button" type="button" data-shift-id="${escapeHtml(shift.id)}">
            Post to crew
          </button>
        </div>
      `
      : "";

    const isConfirmedCatch = Boolean(
      shift.sourceBoardShiftId ||
      (shift.owner === CURRENT_USER.id &&
        shift.previousOwner &&
        shift.previousOwner !== CURRENT_USER.id &&
        shift.transferredAt),
    );
    const shiftSourceLabel = isConfirmedCatch
      ? "Caught shift"
      : shift.status === "Pending Approval"
        ? "Pending Approval"
        : shift.status === "Pending Coverage"
          ? "Pending Coverage"
          : "Imported shift";
    const stationMarkup = shift.station
      ? `<li>${escapeHtml(shift.station)}</li>`
      : "";

    const managerMarkup = shift.manager
      ? `<p>Manager: ${escapeHtml(shift.manager)}</p>`
      : "";
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
       <p class="stack-kicker">${escapeHtml(shiftSourceLabel)}</p>
        <h3>${escapeHtml(shift.day)}</h3>

<p>${escapeHtml(shift.role)}</p>

${transferContextMarkup}
        <ul class="shift-meta">
  <li>${escapeHtml(shift.time)}</li>
  <li>${escapeHtml(shift.neighborhood)}</li>
</ul>
<ul class="shift-meta">
  <li>${escapeHtml(shift.workplace)}</li>
  ${stationMarkup}
</ul>

${managerMarkup}
<p>${escapeHtml(notes)}</p>
      </div>
      <div class="shift-action-row">
    <button
  class="action-button imported-details-button"
  type="button"
  data-shift-id="${escapeHtml(shift.id)}"
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

  const applicationRoleName = applicationPrepView.querySelector(
    "[data-application-role-name]",
  );

  const applicationWorkplaceName = applicationPrepView.querySelector(
    "[data-application-workplace-name]",
  );

  const applicationResumeCopy = applicationPrepView.querySelector(
    "[data-application-resume-copy]",
  );

  const applicationContexts = {
    "juniper-house-server": {
      role: "Server",
      workplace: "Juniper House",
      backView: "juniper-server-role",
      storageKey: "industry-juniper-application",
    },

    "northline-server": {
      role: "Server",
      workplace: "Northline",
      backView: "northline-server-role",
      storageKey: "industry-northline-application",
    },
  };

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

  const trackStatusControls = document.querySelectorAll(
    "[data-track-status-control]",
  );

  const trackDevControls = document.querySelectorAll(
    "[data-track-dev-control]",
  );

  /* ----------------------------------------------
     STEP 2: CREATE THE APPLICATION STATE
  ---------------------------------------------- */
  let activeApplicationContext = applicationContexts["juniper-house-server"];
  const READINESS_STORAGE_KEY = "industry-user-readiness";

  /* Starting state used when no saved application exists */
  const defaultApplicationState = {
    role: "",
    workplace: "",
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
  function loadApplicationState(applicationContext = activeApplicationContext) {
    const contextualDefaultState = {
      ...defaultApplicationState,
      guidance: `Your application has been submitted to ${applicationContext.workplace}.`,
    };

    const savedState = localStorage.getItem(applicationContext.storageKey);

    if (!savedState) {
      return { ...contextualDefaultState };
    }

    try {
      const parsedState = JSON.parse(savedState);

      return {
        ...contextualDefaultState,
        ...parsedState,
      };
    } catch (error) {
      return { ...contextualDefaultState };
    }
  }

  /* This object becomes the current application data */
  let applicationState = loadApplicationState();

  function saveApplicationState() {
    localStorage.setItem(
      activeApplicationContext.storageKey,
      JSON.stringify(applicationState),
    );
  }

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

  function loadGlobalResumeReadiness() {
    try {
      const savedReadiness = localStorage.getItem(READINESS_STORAGE_KEY);

      if (!savedReadiness) {
        return null;
      }

      const parsedReadiness = JSON.parse(savedReadiness);

      return Boolean(parsedReadiness.resumeReady);
    } catch (error) {
      return null;
    }
  }

  function saveGlobalResumeReadiness(resumeReady) {
    let existingReadiness = {};

    try {
      existingReadiness =
        JSON.parse(localStorage.getItem(READINESS_STORAGE_KEY)) || {};
    } catch (error) {}

    localStorage.setItem(
      READINESS_STORAGE_KEY,
      JSON.stringify({
        ...existingReadiness,
        resumeReady,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  function syncApplicationResumeFromReadiness() {
    /* Do not rewrite the history of a submitted application. */
    if (applicationState.submitted) {
      return;
    }

    const globalResumeReady = loadGlobalResumeReadiness();

    /* Preserve older application data when no reusable setting exists. */
    if (globalResumeReady === null) {
      return;
    }

    if (applicationState.resumeComplete === globalResumeReady) {
      return;
    }

    applicationState.resumeComplete = globalResumeReady;

    saveApplicationState();
  }

  function updateApplicationInterface() {
    syncApplicationResumeFromReadiness();

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

      const workplaceViewPrefix =
        applicationState.workplace === "Northline" ? "northline" : "juniper";

      /*
  Juniper and Northline currently share the same reusable
  application-preparation screen.
*/
      let actionDestination = "juniper-application-prep";

      if (applicationState.statusKey === "interview-requested") {
        actionDestination = `${workplaceViewPrefix}-interview`;
      } else if (applicationState.statusKey === "offer-received") {
        actionDestination = `${workplaceViewPrefix}-offer`;
      } else if (applicationState.statusKey === "not-selected") {
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
    trackDevControls.forEach((trackDevControl) => {
      trackDevControl.hidden = !INDUSTRY_TRACK_DEV_MODE;
    });

    /* Keep every workplace DEV control synchronized */
    trackStatusControls.forEach((trackStatusControl) => {
      trackStatusControl.disabled = !INDUSTRY_TRACK_DEV_MODE;

      const applicationCard = trackStatusControl.closest(
        "[data-track-application]",
      );

      if (!applicationCard) return;

      const contextKey =
        applicationCard.dataset.trackApplication === "northline"
          ? "northline-server"
          : "juniper-house-server";

      const applicationContext = applicationContexts[contextKey];

      if (!applicationContext) return;

      const savedApplication = loadApplicationState(applicationContext);

      trackStatusControl.value = savedApplication.statusKey || "submitted";
    });

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
      const workplaceName = activeApplicationContext.workplace;

      applicationLead.textContent = applicationIsSubmitted
        ? `Review the materials sent to ${workplaceName} and follow its current status in My Applications.`
        : `Review what ${workplaceName} will receive and complete anything that still needs attention.`;
    }

    if (applicationBackButton) {
      applicationBackButton.dataset.openJobsView = applicationIsSubmitted
        ? "track"
        : activeApplicationContext.backView;

      applicationBackButton.textContent = applicationIsSubmitted
        ? "← My Applications"
        : "← Server role";
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
        applicationGuidance.textContent = `${applicationState.workplace} has received your application.`;
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

      /* Reuse this readiness across future applications */
      saveGlobalResumeReadiness(true);

      /* Save the updated state in the browser */
      saveApplicationState();

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
      saveApplicationState();

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
      saveApplicationState();

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
      guidance: (workplace) =>
        `Your application has been submitted to ${workplace}.`,
    },

    viewed: {
      status: "Viewed",
      nextStep: "Employer is reviewing your application",
      guidance: (workplace) => `${workplace} has viewed your application.`,
    },

    "interview-requested": {
      status: "Interview requested",
      nextStep: "Review the interview details and respond",
      guidance: (workplace) =>
        `${workplace} would like to schedule an interview.`,
    },

    "offer-received": {
      status: "Offer received",
      nextStep: "Review the offer and decide your next step",
      guidance: (workplace) => `${workplace} has sent you an employment offer.`,
    },

    "not-selected": {
      status: "Not selected",
      nextStep: "Continue exploring other opportunities",
      guidance: (workplace) =>
        `${workplace} has completed its review and selected another candidate.`,
    },
  };
  trackStatusControls.forEach((trackStatusControl) => {
    trackStatusControl.addEventListener("change", () => {
      const applicationCard = trackStatusControl.closest(
        "[data-track-application]",
      );

      if (!applicationCard) return;

      const contextKey =
        applicationCard.dataset.trackApplication === "northline"
          ? "northline-server"
          : "juniper-house-server";

      const applicationContext = applicationContexts[contextKey];

      if (!applicationContext) return;

      const selectedStatusKey = trackStatusControl.value;
      const selectedStatus = trackStatusOptions[selectedStatusKey];

      if (!selectedStatus) return;

      const savedApplication = loadApplicationState(applicationContext);

      savedApplication.role = applicationContext.role;
      savedApplication.workplace = applicationContext.workplace;
      savedApplication.statusKey = selectedStatusKey;
      savedApplication.status = selectedStatus.status;
      savedApplication.nextStep = selectedStatus.nextStep;
      savedApplication.guidance = selectedStatus.guidance(
        applicationContext.workplace,
      );
      savedApplication.updatedAt = new Date().toISOString();

      localStorage.setItem(
        applicationContext.storageKey,
        JSON.stringify(savedApplication),
      );

      const statusText = applicationCard.querySelector(
        "[data-track-application-status]",
      );

      const nextStepText = applicationCard.querySelector(
        "[data-track-application-next-step]",
      );

      const guidanceText = applicationCard.querySelector(
        "[data-track-guidance]",
      );

      const statusBadge = applicationCard.querySelector(
        "[data-track-application-badge]",
      );

      const updatedRow = applicationCard.querySelector(
        "[data-track-updated-row]",
      );

      const updatedText = applicationCard.querySelector(
        "[data-track-application-updated]",
      );

      const actionButton = applicationCard.querySelector(
        "[data-track-application-action]",
      );

      if (statusText) {
        statusText.textContent = savedApplication.status;
      }

      if (nextStepText) {
        nextStepText.textContent = savedApplication.nextStep;
      }

      if (guidanceText) {
        guidanceText.textContent = savedApplication.guidance;
      }

      if (statusBadge) {
        statusBadge.textContent = savedApplication.status;
        statusBadge.dataset.trackStatus = savedApplication.statusKey;
      }

      const formattedUpdatedAt = formatApplicationUpdatedAt(
        savedApplication.updatedAt,
      );

      if (updatedRow) {
        updatedRow.hidden = !formattedUpdatedAt;
      }

      if (updatedText) {
        updatedText.textContent =
          formattedUpdatedAt || "Status date unavailable";
      }

      if (actionButton) {
        const workplaceViewPrefix =
          applicationContext.workplace === "Northline"
            ? "northline"
            : "juniper";

        let actionDestination = "juniper-application-prep";

        if (selectedStatusKey === "interview-requested") {
          actionDestination = `${workplaceViewPrefix}-interview`;
        } else if (selectedStatusKey === "offer-received") {
          actionDestination = `${workplaceViewPrefix}-offer`;
        } else if (selectedStatusKey === "not-selected") {
          actionDestination = "explore-intro";
        }

        actionButton.textContent =
          trackApplicationActionLabels[selectedStatusKey] || "View application";

        actionButton.dataset.openJobsView = actionDestination;
        actionButton.dataset.applicationContext = contextKey;
      }
    });
  });

  document.addEventListener("click", (event) => {
    const applicationTrigger = event.target.closest(
      '[data-open-jobs-view="juniper-application-prep"]',
    );

    if (!applicationTrigger) {
      return;
    }

    const contextKey =
      applicationTrigger.dataset.applicationContext || "juniper-house-server";

    const applicationContext = applicationContexts[contextKey];

    if (applicationContext) {
      activeApplicationContext = applicationContext;
      applicationState = loadApplicationState(activeApplicationContext);

      applicationState.role = applicationContext.role;
      applicationState.workplace = applicationContext.workplace;

      saveApplicationState();
      if (applicationRoleName) {
        applicationRoleName.textContent = applicationContext.role;
      }

      if (applicationWorkplaceName) {
        applicationWorkplaceName.textContent = applicationContext.workplace;
      }

      if (applicationResumeCopy) {
        applicationResumeCopy.textContent = `Add or confirm the resume you want ${applicationContext.workplace} to receive.`;
      }

      if (applicationMessage) {
        applicationMessage.placeholder = `Share why ${applicationContext.workplace} feels like a good fit.`;
      }

      if (applicationBackButton) {
        applicationBackButton.dataset.openJobsView =
          applicationContext.backView;
      }
    }

    setTimeout(updateApplicationInterface, 0);
  });
})();

/* ==================================================
   | | JOBS TRACK APPLICATIONS — STATE SYNC

   Reads submitted application data from localStorage
   and controls the Track Applications screen.
================================================== */

(() => {
  const jobsSection = document.querySelector(
    '.app-section[data-section="jobs"]',
  );

  if (!jobsSection) return;

  const trackView = jobsSection.querySelector('[data-jobs-view="track"]');

  if (!trackView) return;

  const trackEmptyState = trackView.querySelector("[data-track-empty]");

  const trackApplicationList = trackView.querySelector("[data-track-list]");

  const juniperApplicationCard = trackView.querySelector(
    '[data-track-application="juniper-house"]',
  );

  const northlineApplicationCard = trackView.querySelector(
    '[data-track-application="northline"]',
  );

  const TRACK_APPLICATION_STORAGE_KEYS = {
    juniper: "industry-juniper-application",
    northline: "industry-northline-application",
  };

  function loadTrackedApplication(storageKey) {
    const savedApplication = localStorage.getItem(storageKey);

    if (!savedApplication) {
      return null;
    }

    try {
      return JSON.parse(savedApplication);
    } catch (error) {
      return null;
    }
  }

  const trackApplicationActionLabels = {
    submitted: "View application",
    viewed: "View application",
    "interview-requested": "Review interview",
    "offer-received": "Review offer",
    "not-selected": "Explore opportunities",
  };

  function formatTrackedApplicationUpdatedAt(timestamp) {
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

  function renderTrackedApplicationCard(
    applicationCard,
    savedApplication,
    contextKey,
  ) {
    if (!applicationCard || !savedApplication) return;

    const workplace =
      savedApplication.workplace ||
      (contextKey === "northline-server" ? "Northline" : "Juniper House");

    const statusKey = savedApplication.statusKey || "submitted";

    const fallbackGuidance = {
      submitted: `Your application has been submitted to ${workplace}.`,
      viewed: `${workplace} has viewed your application.`,
      "interview-requested": `${workplace} would like to schedule an interview.`,
      "offer-received": `${workplace} has sent you an employment offer.`,
      "not-selected": `${workplace} has completed its review and selected another candidate.`,
    };

    const fallbackNextSteps = {
      submitted: "Waiting for employer response",
      viewed: "Employer is reviewing your application",
      "interview-requested": "Review the interview details and respond",
      "offer-received": "Review the offer and decide your next step",
      "not-selected": "Continue exploring other opportunities",
    };

    const statusText = applicationCard.querySelector(
      "[data-track-application-status]",
    );

    const nextStepText = applicationCard.querySelector(
      "[data-track-application-next-step]",
    );

    const guidanceText = applicationCard.querySelector("[data-track-guidance]");

    const statusBadge = applicationCard.querySelector(
      "[data-track-application-badge]",
    );

    const updatedRow = applicationCard.querySelector(
      "[data-track-updated-row]",
    );

    const updatedText = applicationCard.querySelector(
      "[data-track-application-updated]",
    );

    const statusControl = applicationCard.querySelector(
      "[data-track-status-control]",
    );

    const actionButton = applicationCard.querySelector(
      "[data-track-application-action]",
    );

    if (statusText) {
      statusText.textContent = savedApplication.status || "Submitted";
    }

    if (nextStepText) {
      nextStepText.textContent =
        savedApplication.nextStep ||
        fallbackNextSteps[statusKey] ||
        fallbackNextSteps.submitted;
    }

    if (guidanceText) {
      guidanceText.textContent = savedApplication.guidance
        ? savedApplication.guidance.replace("Juniper House", workplace)
        : fallbackGuidance[statusKey] || fallbackGuidance.submitted;
    }

    if (statusBadge) {
      statusBadge.textContent = savedApplication.status || "Submitted";
      statusBadge.dataset.trackStatus = statusKey;
    }

    if (statusControl) {
      statusControl.value = statusKey;
    }

    const formattedUpdatedAt = formatTrackedApplicationUpdatedAt(
      savedApplication.updatedAt,
    );

    if (updatedRow) {
      updatedRow.hidden = !formattedUpdatedAt;
    }

    if (updatedText) {
      updatedText.textContent = formattedUpdatedAt || "Status date unavailable";
    }

    if (actionButton) {
      const workplaceViewPrefix =
        contextKey === "northline-server" ? "northline" : "juniper";

      let actionDestination = "juniper-application-prep";

      if (statusKey === "interview-requested") {
        actionDestination = `${workplaceViewPrefix}-interview`;
      } else if (statusKey === "offer-received") {
        actionDestination = `${workplaceViewPrefix}-offer`;
      } else if (statusKey === "not-selected") {
        actionDestination = "explore-intro";
      }

      actionButton.textContent =
        trackApplicationActionLabels[statusKey] || "View application";

      actionButton.dataset.openJobsView = actionDestination;
      actionButton.dataset.applicationContext = contextKey;
    }
  }

  function updateTrackApplications() {
    const juniperApplication = loadTrackedApplication(
      TRACK_APPLICATION_STORAGE_KEYS.juniper,
    );

    const northlineApplication = loadTrackedApplication(
      TRACK_APPLICATION_STORAGE_KEYS.northline,
    );

    const juniperWasSubmitted = Boolean(juniperApplication?.submitted);

    const northlineWasSubmitted = Boolean(northlineApplication?.submitted);

    const hasSubmittedApplications =
      juniperWasSubmitted || northlineWasSubmitted;

    if (trackEmptyState) {
      trackEmptyState.hidden = hasSubmittedApplications;
    }

    if (trackApplicationList) {
      trackApplicationList.hidden = !hasSubmittedApplications;
    }

    if (juniperApplicationCard) {
      juniperApplicationCard.hidden = !juniperWasSubmitted;

      if (juniperWasSubmitted) {
        renderTrackedApplicationCard(
          juniperApplicationCard,
          juniperApplication,
          "juniper-house-server",
        );
      }
    }

    if (northlineApplicationCard) {
      northlineApplicationCard.hidden = !northlineWasSubmitted;

      if (northlineWasSubmitted) {
        renderTrackedApplicationCard(
          northlineApplicationCard,
          northlineApplication,
          "northline-server",
        );
      }
    }
  }
  updateTrackApplications();

  jobsSection.addEventListener("click", (event) => {
    const trackTrigger = event.target.closest('[data-open-jobs-view="track"]');

    if (!trackTrigger) return;

    updateTrackApplications();
  });

  window.addEventListener("storage", updateTrackApplications);
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

/* =================================================
   JOBS: USER PREFERENCES
================================================== */

(() => {
  const PREFERENCES_STORAGE_KEY = "industry-user-preferences";

  const preferencesForm = document.querySelector(
    "[data-jobs-preferences-form]",
  );

  const roleInputs = Array.from(
    document.querySelectorAll("[data-preferences-role]"),
  );

  const workplaceInputs = Array.from(
    document.querySelectorAll("[data-preferences-workplace]"),
  );

  const employmentInput = document.querySelector(
    "[data-preferences-employment]",
  );

  const locationInput = document.querySelector("[data-preferences-location]");

  const distanceInput = document.querySelector("[data-preferences-distance]");

  const preferencesMessage = document.querySelector(
    "[data-preferences-message]",
  );

  const dashboardStatus = document.querySelector(
    "[data-preferences-dashboard-status]",
  );

  const dashboardAction = document.querySelector(
    "[data-preferences-dashboard-action]",
  );

  if (
    !preferencesForm ||
    !employmentInput ||
    !locationInput ||
    !distanceInput
  ) {
    return;
  }

  const defaultPreferencesState = {
    desiredRoles: [],
    workplaceTypes: [],
    employmentType: "",
    searchLocation: "",
    searchDistance: "",
    completed: false,
    updatedAt: null,
  };

  function loadPreferencesState() {
    try {
      const savedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);

      if (!savedPreferences) {
        return { ...defaultPreferencesState };
      }

      return {
        ...defaultPreferencesState,
        ...JSON.parse(savedPreferences),
      };
    } catch (error) {
      return { ...defaultPreferencesState };
    }
  }

  let preferencesState = loadPreferencesState();

  function preferencesAreComplete(preferences) {
    return Boolean(
      preferences.desiredRoles.length &&
      preferences.workplaceTypes.length &&
      preferences.employmentType &&
      preferences.searchLocation.trim() &&
      preferences.searchDistance,
    );
  }

  function savePreferencesState() {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferencesState),
    );
  }

  function updatePreferencesInterface() {
    roleInputs.forEach((input) => {
      input.checked = preferencesState.desiredRoles.includes(input.value);
    });

    workplaceInputs.forEach((input) => {
      input.checked = preferencesState.workplaceTypes.includes(input.value);
    });

    employmentInput.value = preferencesState.employmentType;

    locationInput.value = preferencesState.searchLocation;

    distanceInput.value = preferencesState.searchDistance;

    if (dashboardStatus) {
      dashboardStatus.textContent = preferencesState.completed
        ? "Complete"
        : "Not started";

      dashboardStatus.dataset.preferencesStatus = preferencesState.completed
        ? "complete"
        : "not-started";
    }

    if (dashboardAction) {
      dashboardAction.textContent = preferencesState.completed
        ? "Edit preferences"
        : "Add preferences";
    }
  }

  preferencesForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!preferencesForm.checkValidity()) {
      preferencesForm.reportValidity();
      return;
    }

    const desiredRoles = roleInputs
      .filter((input) => input.checked)
      .map((input) => input.value);

    const workplaceTypes = workplaceInputs
      .filter((input) => input.checked)
      .map((input) => input.value);

    if (desiredRoles.length === 0 || workplaceTypes.length === 0) {
      if (preferencesMessage) {
        preferencesMessage.textContent =
          "Choose at least one desired role and one workplace type.";

        preferencesMessage.hidden = false;
      }

      return;
    }

    preferencesState = {
      desiredRoles,
      workplaceTypes,
      employmentType: employmentInput.value,
      searchLocation: locationInput.value.trim(),
      searchDistance: distanceInput.value,
      completed: false,
      updatedAt: new Date().toISOString(),
    };

    preferencesState.completed = preferencesAreComplete(preferencesState);

    savePreferencesState();
    updatePreferencesInterface();

    if (preferencesMessage) {
      preferencesMessage.textContent =
        "Preferences saved. Industry can now use them to personalize your job search.";

      preferencesMessage.hidden = false;
    }
  });

  updatePreferencesInterface();
})();

/* =================================================
   JOBS: USER AVAILABILITY
================================================== */

(() => {
  const AVAILABILITY_STORAGE_KEY = "industry-user-availability";

  const availabilityForm = document.querySelector(
    "[data-jobs-availability-form]",
  );

  const dayInputs = Array.from(
    document.querySelectorAll("[data-availability-day]"),
  );

  const shiftInputs = Array.from(
    document.querySelectorAll("[data-availability-shift]"),
  );

  const hoursInput = document.querySelector("[data-availability-hours]");

  const startInput = document.querySelector("[data-availability-start]");

  const availabilityMessage = document.querySelector(
    "[data-availability-message]",
  );

  const dashboardStatus = document.querySelector(
    "[data-availability-dashboard-status]",
  );

  const dashboardAction = document.querySelector(
    "[data-availability-dashboard-action]",
  );

  if (!availabilityForm || !hoursInput || !startInput) {
    return;
  }

  const defaultAvailabilityState = {
    availableDays: [],
    preferredShifts: [],
    weeklyHours: "",
    startAvailability: "",
    completed: false,
    updatedAt: null,
  };

  function loadAvailabilityState() {
    try {
      const savedAvailability = localStorage.getItem(AVAILABILITY_STORAGE_KEY);

      if (!savedAvailability) {
        return { ...defaultAvailabilityState };
      }

      return {
        ...defaultAvailabilityState,
        ...JSON.parse(savedAvailability),
      };
    } catch (error) {
      return { ...defaultAvailabilityState };
    }
  }

  let availabilityState = loadAvailabilityState();

  function availabilityIsComplete(availability) {
    return Boolean(
      availability.availableDays.length &&
      availability.preferredShifts.length &&
      availability.weeklyHours &&
      availability.startAvailability,
    );
  }

  function saveAvailabilityState() {
    localStorage.setItem(
      AVAILABILITY_STORAGE_KEY,
      JSON.stringify(availabilityState),
    );
  }

  function updateAvailabilityInterface() {
    dayInputs.forEach((input) => {
      input.checked = availabilityState.availableDays.includes(input.value);
    });

    shiftInputs.forEach((input) => {
      input.checked = availabilityState.preferredShifts.includes(input.value);
    });

    hoursInput.value = availabilityState.weeklyHours;

    startInput.value = availabilityState.startAvailability;

    if (dashboardStatus) {
      dashboardStatus.textContent = availabilityState.completed
        ? "Complete"
        : "Not started";

      dashboardStatus.dataset.availabilityStatus = availabilityState.completed
        ? "complete"
        : "not-started";
    }

    if (dashboardAction) {
      dashboardAction.textContent = availabilityState.completed
        ? "Edit availability"
        : "Set availability";
    }
  }

  availabilityForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!availabilityForm.checkValidity()) {
      availabilityForm.reportValidity();
      return;
    }

    const availableDays = dayInputs
      .filter((input) => input.checked)
      .map((input) => input.value);

    const preferredShifts = shiftInputs
      .filter((input) => input.checked)
      .map((input) => input.value);

    if (availableDays.length === 0 || preferredShifts.length === 0) {
      if (availabilityMessage) {
        availabilityMessage.textContent =
          "Choose at least one available day and one preferred shift.";

        availabilityMessage.hidden = false;
      }

      return;
    }

    availabilityState = {
      availableDays,
      preferredShifts,
      weeklyHours: hoursInput.value,
      startAvailability: startInput.value,
      completed: false,
      updatedAt: new Date().toISOString(),
    };

    availabilityState.completed = availabilityIsComplete(availabilityState);

    saveAvailabilityState();
    updateAvailabilityInterface();

    if (availabilityMessage) {
      availabilityMessage.textContent =
        "Availability saved. Industry can now use your schedule preferences when matching opportunities.";

      availabilityMessage.hidden = false;
    }
  });

  updateAvailabilityInterface();
})();

/* =================================================
   JOBS: APPLICATION READINESS
================================================== */

(() => {
  const PROFILE_STORAGE_KEY = "industry-user-profile";
  const PREFERENCES_STORAGE_KEY = "industry-user-preferences";
  const AVAILABILITY_STORAGE_KEY = "industry-user-availability";
  const READINESS_STORAGE_KEY = "industry-user-readiness";

  const APPLICATION_STORAGE_KEYS = {
    "Juniper House": "industry-juniper-application",
    Northline: "industry-northline-application",
  };

  const APPLICATION_STORAGE_KEY = APPLICATION_STORAGE_KEYS["Juniper House"];
  const dashboardStatus = document.querySelector(
    "[data-readiness-dashboard-status]",
  );

  const dashboardAction = document.querySelector(
    "[data-readiness-dashboard-action]",
  );

  const overallStatus = document.querySelector(
    "[data-readiness-overall-status]",
  );

  const overallHeading = document.querySelector(
    "[data-readiness-overall-heading]",
  );

  const overallMessage = document.querySelector(
    "[data-readiness-overall-message]",
  );

  const profileStatus = document.querySelector(
    "[data-readiness-profile-status]",
  );

  const profileAction = document.querySelector(
    "[data-readiness-profile-action]",
  );

  const preferencesStatus = document.querySelector(
    "[data-readiness-preferences-status]",
  );

  const preferencesAction = document.querySelector(
    "[data-readiness-preferences-action]",
  );

  const availabilityStatus = document.querySelector(
    "[data-readiness-availability-status]",
  );

  const availabilityAction = document.querySelector(
    "[data-readiness-availability-action]",
  );

  const applicationAction = document.querySelector(
    "[data-readiness-application-action]",
  );

  const resumeStatus = document.querySelector("[data-readiness-resume-status]");

  const resumeToggle = document.querySelector("[data-readiness-resume-toggle]");

  if (!overallStatus || !resumeToggle) {
    return;
  }

  const defaultReadinessState = {
    resumeReady: false,
    updatedAt: null,
  };

  function loadStorageObject(storageKey) {
    try {
      const savedValue = localStorage.getItem(storageKey);

      return savedValue ? JSON.parse(savedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function sectionIsComplete(storageKey) {
    const savedSection = loadStorageObject(storageKey);

    return Boolean(savedSection?.completed);
  }

  function loadReadinessState() {
    const savedReadiness = loadStorageObject(READINESS_STORAGE_KEY);

    return {
      ...defaultReadinessState,
      ...(savedReadiness || {}),
    };
  }

  let readinessState = loadReadinessState();

  function saveReadinessState() {
    localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(readinessState));
  }

  function updateStatus(statusElement, isComplete, completeText = "Complete") {
    if (!statusElement) return;

    statusElement.textContent = isComplete ? completeText : "Needs attention";

    statusElement.dataset.readinessStatus = isComplete
      ? "complete"
      : "needs-attention";
  }

  function updateReadinessInterface() {
    const profileComplete = sectionIsComplete(PROFILE_STORAGE_KEY);

    const preferencesComplete = sectionIsComplete(PREFERENCES_STORAGE_KEY);

    const availabilityComplete = sectionIsComplete(AVAILABILITY_STORAGE_KEY);

    const resumeReady = readinessState.resumeReady;

    const allSectionsReady =
      profileComplete &&
      preferencesComplete &&
      availabilityComplete &&
      resumeReady;

    const incompleteCount = [
      profileComplete,
      preferencesComplete,
      availabilityComplete,
      resumeReady,
    ].filter((sectionComplete) => !sectionComplete).length;

    /* Read the current Juniper application */
    const juniperApplication = loadStorageObject(APPLICATION_STORAGE_KEY);

    const hasJuniperApplication = Boolean(juniperApplication);

    const applicationWasSubmitted = Boolean(juniperApplication?.submitted);

    if (applicationAction) {
      applicationAction.hidden = !hasJuniperApplication;

      applicationAction.textContent = applicationWasSubmitted
        ? "View submitted application"
        : "Continue Juniper application";

      applicationAction.dataset.openJobsView = "juniper-application-prep";
    }

    updateStatus(profileStatus, profileComplete);
    updateStatus(preferencesStatus, preferencesComplete);
    updateStatus(availabilityStatus, availabilityComplete);
    updateStatus(resumeStatus, resumeReady, "Ready");
    updateStatus(overallStatus, allSectionsReady, "Ready to apply");
    updateStatus(dashboardStatus, allSectionsReady);

    if (profileAction) {
      profileAction.textContent = profileComplete
        ? "Edit my profile"
        : "Complete my profile";
    }

    if (preferencesAction) {
      preferencesAction.textContent = preferencesComplete
        ? "Edit preferences"
        : "Add preferences";
    }

    if (availabilityAction) {
      availabilityAction.textContent = availabilityComplete
        ? "Edit availability"
        : "Set availability";
    }

    resumeToggle.textContent = resumeReady
      ? "Mark resume not ready"
      : "Mark my resume ready";

    if (dashboardAction) {
      dashboardAction.textContent = allSectionsReady
        ? "View readiness"
        : "Review readiness";
    }

    if (overallHeading) {
      overallHeading.textContent = allSectionsReady
        ? "You’re ready to apply."
        : "Your application tools are taking shape.";
    }

    if (overallMessage) {
      overallMessage.textContent = allSectionsReady
        ? "Your profile, preferences, availability, and resume are ready to support future applications."
        : `${incompleteCount} ${incompleteCount === 1 ? "item needs" : "items need"
        } attention before your application tools are complete.`;
    }
  }

  resumeToggle.addEventListener("click", () => {
    readinessState = {
      resumeReady: !readinessState.resumeReady,
      updatedAt: new Date().toISOString(),
    };

    saveReadinessState();
    updateReadinessInterface();
  });

  document.addEventListener("click", (event) => {
    const navigationTrigger = event.target.closest("[data-open-jobs-view]");

    if (!navigationTrigger) return;

    const destination = navigationTrigger.dataset.openJobsView;

    if (destination === "prepare" || destination === "prepare-readiness") {
      setTimeout(updateReadinessInterface, 0);
    }
  });

  window.addEventListener("storage", updateReadinessInterface);

  updateReadinessInterface();
})();

/* =================================================
   JOBS: READY TO JUMP
================================================== */

(() => {
  const PROFILE_STORAGE_KEY = "industry-user-profile";
  const PREFERENCES_STORAGE_KEY = "industry-user-preferences";
  const AVAILABILITY_STORAGE_KEY = "industry-user-availability";
  const READINESS_STORAGE_KEY = "industry-user-readiness";

  const jumpHeading = document.querySelector("[data-jump-heading]");

  const jumpIntro = document.querySelector("[data-jump-intro]");

  const jumpReadinessStatus = document.querySelector(
    "[data-jump-readiness-status]",
  );

  const jumpReadinessHeading = document.querySelector(
    "[data-jump-readiness-heading]",
  );

  const jumpReadinessMessage = document.querySelector(
    "[data-jump-readiness-message]",
  );

  const jumpReadinessAction = document.querySelector(
    "[data-jump-readiness-action]",
  );

  const jumpSearchCard = document.querySelector("[data-jump-search-card]");

  const jumpSearchHeading = document.querySelector(
    "[data-jump-search-heading]",
  );

  const jumpSearchMessage = document.querySelector(
    "[data-jump-search-message]",
  );

  const jumpRoles = document.querySelector("[data-jump-roles]");

  const jumpLocation = document.querySelector("[data-jump-location]");

  const jumpAvailability = document.querySelector("[data-jump-availability]");

  if (!jumpReadinessStatus || !jumpReadinessHeading || !jumpSearchCard) {
    return;
  }

  function loadJumpStorageObject(storageKey) {
    try {
      const savedValue = localStorage.getItem(storageKey);

      return savedValue ? JSON.parse(savedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function updateJumpInterface() {
    const profile = loadJumpStorageObject(PROFILE_STORAGE_KEY);

    const preferences = loadJumpStorageObject(PREFERENCES_STORAGE_KEY);

    const availability = loadJumpStorageObject(AVAILABILITY_STORAGE_KEY);

    const readiness = loadJumpStorageObject(READINESS_STORAGE_KEY);

    const profileComplete = Boolean(profile?.completed);

    const preferencesComplete = Boolean(preferences?.completed);

    const availabilityComplete = Boolean(availability?.completed);

    const resumeReady = Boolean(readiness?.resumeReady);

    const allSectionsReady =
      profileComplete &&
      preferencesComplete &&
      availabilityComplete &&
      resumeReady;

    const incompleteCount = [
      profileComplete,
      preferencesComplete,
      availabilityComplete,
      resumeReady,
    ].filter((itemIsComplete) => !itemIsComplete).length;

    const preferredName = profile?.preferredName?.trim() || "";

    if (jumpHeading) {
      jumpHeading.textContent = preferredName
        ? `Ready for your next move, ${preferredName}?`
        : "Ready for your next move?";
    }

    if (jumpIntro) {
      jumpIntro.textContent = allSectionsReady
        ? "Your saved profile, preferences, availability, and resume are ready to shape your search."
        : "Finish your application tools so Industry can use them to shape more relevant opportunities.";
    }

    jumpReadinessStatus.textContent = allSectionsReady
      ? "Ready to jump"
      : "Needs attention";

    jumpReadinessStatus.dataset.readinessStatus = allSectionsReady
      ? "complete"
      : "needs-attention";

    jumpReadinessHeading.textContent = allSectionsReady
      ? "Your preparation is ready."
      : "Your preparation needs attention.";

    if (jumpReadinessMessage) {
      jumpReadinessMessage.textContent = allSectionsReady
        ? "Industry can now use your saved information to support your search and future applications."
        : `${incompleteCount} ${incompleteCount === 1 ? "item needs" : "items need"
        } attention before you are ready to jump.`;
    }

    if (jumpReadinessAction) {
      jumpReadinessAction.textContent = allSectionsReady
        ? "View readiness"
        : "Complete my readiness";
    }

    jumpSearchCard.hidden = !allSectionsReady;

    if (!allSectionsReady) {
      return;
    }

    const desiredRoles = preferences?.desiredRoles || [];

    const preferredShifts = availability?.preferredShifts || [];

    if (jumpSearchHeading) {
      jumpSearchHeading.textContent =
        desiredRoles.length === 1
          ? `${desiredRoles[0]} opportunities`
          : "Your matching opportunities";
    }

    if (jumpSearchMessage) {
      jumpSearchMessage.textContent =
        "Industry will use your saved direction to prioritize opportunities that better fit your goals.";
    }

    if (jumpRoles) {
      jumpRoles.textContent =
        desiredRoles.length > 0 ? desiredRoles.join(", ") : "Not selected";
    }

    if (jumpLocation) {
      jumpLocation.textContent =
        preferences?.searchLocation || profile?.location || "Not selected";
    }

    if (jumpAvailability) {
      const availabilityParts = [];

      if (preferredShifts.length > 0) {
        availabilityParts.push(preferredShifts.join(", "));
      }

      if (availability?.weeklyHours) {
        availabilityParts.push(availability.weeklyHours);
      }

      jumpAvailability.textContent =
        availabilityParts.length > 0
          ? availabilityParts.join(" · ")
          : "Not selected";
    }
  }

  document.addEventListener("click", (event) => {
    const jumpTrigger = event.target.closest('[data-open-jobs-view="jump"]');

    if (!jumpTrigger) {
      return;
    }

    setTimeout(updateJumpInterface, 0);
  });

  window.addEventListener("storage", updateJumpInterface);

  updateJumpInterface();
})();

/* =================================================
   JOBS: PERSONALIZED OPPORTUNITY MATCHES
================================================== */

(() => {
  const PREFERENCES_STORAGE_KEY = "industry-user-preferences";

  const AVAILABILITY_STORAGE_KEY = "industry-user-availability";

  const opportunityCards = Array.from(
    document.querySelectorAll("[data-opportunity-card]"),
  );

  const opportunityList = document.querySelector(".jobs-place-list");

  if (opportunityCards.length === 0 || !opportunityList) {
    return;
  }

  function loadOpportunityStorage(storageKey) {
    try {
      const savedValue = localStorage.getItem(storageKey);

      return savedValue ? JSON.parse(savedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function normalizeMatchValue(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  function splitOpportunityValues(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function valuesMatch(userValues, opportunityValues) {
    return userValues.some((userValue) =>
      opportunityValues.some(
        (opportunityValue) =>
          normalizeMatchValue(userValue) ===
          normalizeMatchValue(opportunityValue),
      ),
    );
  }

  function updateOpportunityMatches() {
    const preferences = loadOpportunityStorage(PREFERENCES_STORAGE_KEY);

    const availability = loadOpportunityStorage(AVAILABILITY_STORAGE_KEY);

    opportunityCards.forEach((card) => {
      const matchBadge = card.querySelector("[data-opportunity-match-badge]");
      const matchReason = card.querySelector("[data-opportunity-match-reason]");

      if (!matchBadge) {
        return;
      }

      matchBadge.hidden = true;
      matchBadge.removeAttribute("data-match-level");
      card.dataset.matchScore = "0";
      if (matchReason) {
        matchReason.hidden = true;
        matchReason.textContent = "";
      }

      if (!preferences?.completed) {
        return;
      }

      const desiredRoles = preferences.desiredRoles || [];

      const workplaceTypes = preferences.workplaceTypes || [];

      const preferredShifts = availability?.preferredShifts || [];

      const opportunityRoles = splitOpportunityValues(
        card.dataset.opportunityRoles,
      );

      const opportunityWorkplaces = splitOpportunityValues(
        card.dataset.opportunityWorkplace,
      );

      const opportunityShifts = splitOpportunityValues(
        card.dataset.opportunityShifts,
      );

      const roleMatches = valuesMatch(desiredRoles, opportunityRoles);

      const workplaceMatches = valuesMatch(
        workplaceTypes,
        opportunityWorkplaces,
      );

      const employmentMatches =
        Boolean(preferences.employmentType) &&
        normalizeMatchValue(preferences.employmentType) ===
        normalizeMatchValue(card.dataset.opportunityEmployment);

      const shiftMatches = valuesMatch(preferredShifts, opportunityShifts);

      const locationMatches =
        Boolean(preferences.searchLocation) &&
        normalizeMatchValue(preferences.searchLocation) ===
        normalizeMatchValue(card.dataset.opportunityLocation);

      const matchScore = [
        roleMatches,
        workplaceMatches,
        employmentMatches,
        shiftMatches,
        locationMatches,
      ].filter(Boolean).length;

      let matchLabel = "";
      let matchLevel = "";

      if (roleMatches && workplaceMatches && matchScore >= 4) {
        matchLabel = "Strong match";
        matchLevel = "strong";
      } else if (roleMatches && workplaceMatches && matchScore >= 3) {
        matchLabel = "Good match";
        matchLevel = "good";
      } else if (roleMatches) {
        matchLabel = "Role match";
        matchLevel = "role";
      } else if (workplaceMatches && locationMatches) {
        matchLabel = "Potential match";
        matchLevel = "workplace";
      }

      if (!matchLabel) {
        return;
      }

      matchBadge.textContent = matchLabel;
      matchBadge.dataset.matchLevel = matchLevel;
      matchBadge.hidden = false;
      card.dataset.matchScore = String(matchScore);

      if (matchReason) {
        const matchedDetails = [];

        if (roleMatches) {
          matchedDetails.push(`${opportunityRoles[0]} role`);
        }

        if (workplaceMatches) {
          matchedDetails.push(`${opportunityWorkplaces[0]} preference`);
        }

        if (employmentMatches) {
          matchedDetails.push(
            `${card.dataset.opportunityEmployment} preference`,
          );
        }

        if (shiftMatches) {
          matchedDetails.push(`${opportunityShifts[0]} availability`);
        }

        if (locationMatches) {
          const opportunityCity = card.dataset.opportunityLocation
            .split(",")[0]
            .trim();

          matchedDetails.push(`${opportunityCity} search`);
        }

        const finalDetail = matchedDetails.pop();

        const formattedDetails =
          matchedDetails.length > 0
            ? `${matchedDetails.join(", ")}, and ${finalDetail}`
            : finalDetail;

        matchReason.textContent = `Matches your ${formattedDetails}.`;

        matchReason.hidden = false;
      }
    });
    const sortedOpportunityCards = [...opportunityCards].sort(
      (firstCard, secondCard) =>
        Number(secondCard.dataset.matchScore) -
        Number(firstCard.dataset.matchScore),
    );

    sortedOpportunityCards.forEach((card) => {
      opportunityList.appendChild(card);
    });
  }

  document.addEventListener("click", (event) => {
    const jobsViewTrigger = event.target.closest("[data-open-jobs-view]");

    if (!jobsViewTrigger) {
      return;
    }

    setTimeout(updateOpportunityMatches, 0);
  });

  window.addEventListener("storage", updateOpportunityMatches);

  updateOpportunityMatches();
})();

// =========================================
// TESTING ONBOARDING
// Build 1: Welcome Screen
// =========================================

const INDUSTRY_ONBOARDING_KEY = "industry-onboarding-complete";
const onboardingWelcome = document.querySelector("#onboarding-welcome");
const startOnboardingButton = document.querySelector(
  "#start-onboarding-button",
);
const skipOnboardingButton = document.querySelector("#skip-onboarding-button");

const onboardingHomeStep = document.querySelector("#onboarding-home-step");
const continueOnboardingButton = document.querySelector(
  "#continue-onboarding-button",
);
const exitTourButton = document.querySelector("#exit-tour-button");

const onboardingLanesStep = document.querySelector("#onboarding-lanes-step");

const finishOnboardingButton = document.querySelector(
  "#finish-onboarding-button",
);

const exitLanesTourButton = document.querySelector("#exit-lanes-tour-button");

const onboardingHelpButton = document.querySelector("#onboarding-help-button");

const onboardingHelpPanel = document.querySelector("#onboarding-help-panel");

const replayOnboardingButton = document.querySelector(
  "#replay-onboarding-button",
);

const closeOnboardingHelpButton = document.querySelector(
  "#close-onboarding-help-button",
);

const onboardingTestStep = document.querySelector("#onboarding-test-step");

const startUsabilityTestButton = document.querySelector(
  "#start-usability-test-button",
);

const exitTestTourButton = document.querySelector("#exit-test-tour-button");

const shareFeedbackButton = document.querySelector("#share-feedback-button");

function completeOnboarding() {
  localStorage.setItem(INDUSTRY_ONBOARDING_KEY, "true");

  onboardingWelcome?.classList.add("is-hidden");
  onboardingHomeStep?.classList.add("is-hidden");
  onboardingLanesStep?.classList.add("is-hidden");
  onboardingTestStep?.classList.add("is-hidden");

  document.body.classList.remove("onboarding-home-active");
}

startOnboardingButton?.addEventListener("click", () => {
  openIndustryAuth(activePilotInvitation ? "signup" : "login");
});
skipOnboardingButton?.addEventListener("click", () => {
  completeOnboarding();
});
continueOnboardingButton?.addEventListener("click", () => {
  onboardingHomeStep?.classList.add("is-hidden");
  document.body.classList.remove("onboarding-home-active");

  onboardingLanesStep?.classList.remove("is-hidden");
});

onboardingHelpButton?.addEventListener("click", () => {
  onboardingHelpPanel?.classList.remove("is-hidden");
});

closeOnboardingHelpButton?.addEventListener("click", () => {
  onboardingHelpPanel?.classList.add("is-hidden");
});

replayOnboardingButton?.addEventListener("click", () => {
  onboardingHelpPanel?.classList.add("is-hidden");

  onboardingWelcome?.classList.add("is-hidden");
  onboardingLanesStep?.classList.add("is-hidden");

  onboardingHomeStep?.classList.remove("is-hidden");
  document.body.classList.add("onboarding-home-active");
});

shareFeedbackButton?.addEventListener("click", () => {
  const savedSource = localStorage.getItem("industry-test-source");

  const defaultFeedbackUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdUwvbZ663lA_P7is0VA0X8ViLVhsxMNWnSPf-JfDcrkNdouw/viewform";

  const portlandFeedbackUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdUwvbZ663lA_P7is0VA0X8ViLVhsxMNWnSPf-JfDcrkNdouw/viewform?usp=pp_url&entry.128855954=Portland";

  const tacomaFeedbackUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdUwvbZ663lA_P7is0VA0X8ViLVhsxMNWnSPf-JfDcrkNdouw/viewform?usp=pp_url&entry.128855954=Tacoma";

  let feedbackUrl = defaultFeedbackUrl;

  if (savedSource === "portland-qr") {
    feedbackUrl = portlandFeedbackUrl;
  }

  if (savedSource === "tacoma-qr") {
    feedbackUrl = tacomaFeedbackUrl;
  }

  window.open(feedbackUrl, "_blank", "noopener,noreferrer");
});

exitTourButton?.addEventListener("click", () => {
  completeOnboarding();
});
finishOnboardingButton?.addEventListener("click", () => {
  onboardingLanesStep?.classList.add("is-hidden");
  onboardingTestStep?.classList.remove("is-hidden");
});
startUsabilityTestButton?.addEventListener("click", () => {
  completeOnboarding();
});

exitTestTourButton?.addEventListener("click", () => {
  completeOnboarding();
});
exitLanesTourButton?.addEventListener("click", () => {
  completeOnboarding();
});

// Authentication now decides whether the user enters Industry.
// Keep the entry screen available until Supabase resolves the session.
onboardingWelcome?.classList.remove("is-hidden");

// =========================================================
// INDUSTRY AUTH — SCREEN 2
// =========================================================

const industryAuthScreen = document.querySelector("#industry-auth-screen");
const industryAuthBack = document.querySelector("#industry-auth-back");

const industryAuthTitle = document.querySelector("#industry-auth-title");
const industryAuthCopy = document.querySelector(".industry-auth-copy");

const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");

const signupStatus = document.querySelector("#signup-status");
const loginStatus = document.querySelector("#login-status");

const authSwitchCopy = document.querySelector("#industry-auth-switch-copy");
const authSwitchButton = document.querySelector("#industry-auth-switch-button");

const onboardingSignInButton = document.querySelector(
  "#onboarding-signin-button",
);

const industrySignOutButton = document.querySelector(
  "#industry-signout-button",
);

const forgotPasswordButton = document.querySelector(
  "#industry-forgot-password",
);

const recoveryForm = document.querySelector("#recovery-form");
const recoveryStatus = document.querySelector("#recovery-status");

const updatePasswordForm = document.querySelector("#update-password-form");
const updatePasswordStatus = document.querySelector("#update-password-status");

const authSwitch = document.querySelector(".industry-auth-switch");

const industryInviteSummary = document.querySelector(
  "#industry-invite-summary",
);
const industryInviteWorkplace = document.querySelector(
  "#industry-invite-workplace",
);
const industryInviteDetails = document.querySelector(
  "#industry-invite-details",
);
const pilotConsentPanel = document.querySelector("#pilot-consent-panel");
const pilotConsentCheckbox = document.querySelector(
  "#pilot-consent-checkbox",
);
const leavePilotConfirmation = document.querySelector(
  "#leave-pilot-confirmation",
);
const leavePilotButton = document.querySelector("#leave-pilot-button");
const leavePilotStatus = document.querySelector("#leave-pilot-status");
const pilotMonitorScreen = document.querySelector("#pilot-monitor-screen");
const pilotMonitorWorkplace = document.querySelector("#pilot-monitor-workplace");
const pilotMonitorEnvironment = document.querySelector("#pilot-monitor-environment");
const pilotMonitorRetention = document.querySelector("#pilot-monitor-retention");
const pilotMonitorStatusTitle = document.querySelector(
  "#pilot-monitor-status-title",
);
const pilotMonitorSummary = document.querySelector("#pilot-monitor-summary");
const pilotMonitorState = document.querySelector("#pilot-monitor-state");
const pilotMonitorEvents = document.querySelector("#pilot-monitor-events");
const pilotMonitorConnectionDot = document.querySelector(
  "#pilot-monitor-connection-dot",
);
const pilotMonitorConnectionText = document.querySelector(
  "#pilot-monitor-connection-text",
);
const pilotMonitorEventFilter = document.querySelector(
  "#pilot-monitor-event-filter",
);
const pilotMonitorOutcomeFilter = document.querySelector(
  "#pilot-monitor-outcome-filter",
);
const pilotMonitorTimeFilter = document.querySelector(
  "#pilot-monitor-time-filter",
);
const pilotMonitorFilters = document.querySelector("#pilot-monitor-filters");
const pilotMonitorRefresh = document.querySelector("#pilot-monitor-refresh");
const pilotMonitorSignout = document.querySelector("#pilot-monitor-signout");

const INDUSTRY_INVITE_STORAGE_KEY = "industry-pilot-invite";
const inviteQueryToken = new URLSearchParams(window.location.search).get(
  "invite",
);

if (inviteQueryToken) {
  localStorage.setItem(INDUSTRY_INVITE_STORAGE_KEY, inviteQueryToken);
}

let activePilotInviteToken =
  inviteQueryToken || localStorage.getItem(INDUSTRY_INVITE_STORAGE_KEY) || "";
let activePilotInvitation = null;
let currentManagerInviteUrl = "";
let pendingPilotConsentAcknowledged = false;

const dashboardGreeting = document.querySelector("#dashboard-greeting");
const dashboardDate = document.querySelector("#dashboard-date");
const dashboardClock = document.querySelector("#dashboard-clock");

const dashboardSnapshotPrimary = document.getElementById(
  "dashboard-snapshot-primary",
);
const dashboardSnapshotPrimaryIcon = document.getElementById(
  "dashboard-snapshot-primary-icon",
);
const dashboardSnapshotPrimaryValue = document.getElementById(
  "dashboard-snapshot-primary-value",
);
const dashboardSnapshotPrimaryLabel = document.getElementById(
  "dashboard-snapshot-primary-label",
);

const dashboardSnapshotSecondary = document.getElementById(
  "dashboard-snapshot-secondary",
);
const dashboardSnapshotSecondaryIcon = document.getElementById(
  "dashboard-snapshot-secondary-icon",
);
const dashboardSnapshotSecondaryValue = document.getElementById(
  "dashboard-snapshot-secondary-value",
);
const dashboardSnapshotSecondaryLabel = document.getElementById(
  "dashboard-snapshot-secondary-label",
);

const dashboardSnapshotTertiary = document.getElementById(
  "dashboard-snapshot-tertiary",
);
const dashboardSnapshotTertiaryIcon = document.getElementById(
  "dashboard-snapshot-tertiary-icon",
);
const dashboardSnapshotTertiaryValue = document.getElementById(
  "dashboard-snapshot-tertiary-value",
);
const dashboardSnapshotTertiaryLabel = document.getElementById(
  "dashboard-snapshot-tertiary-label",
);

const dashboardQuickActionsGrid = document.getElementById(
  "dashboard-quick-actions-grid",
);

// =========================================================
// SUPABASE CLIENT
// Local development uses local Supabase.
// GitHub Pages uses production Supabase.
// =========================================================

const INDUSTRY_SUPABASE_OVERRIDE = new URLSearchParams(
  window.location.search,
).get("supabase");

const IS_LOCAL_INDUSTRY =
  INDUSTRY_SUPABASE_OVERRIDE !== "hosted" &&
  (window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost");

const SUPABASE_URL = IS_LOCAL_INDUSTRY
  ? "http://127.0.0.1:54321"
  : "https://pzgfottwuczqgisrlfss.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = IS_LOCAL_INDUSTRY
  ? "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
  : "sb_publishable_I4zjPUH_5zqN0x2cV_n1iQ_-gUwPS2H";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

function buildIndustryInviteUrl(inviteToken) {
  const inviteUrl = new URL(window.location.pathname, window.location.origin);

  if (INDUSTRY_SUPABASE_OVERRIDE === "hosted") {
    inviteUrl.searchParams.set("supabase", "hosted");
  }

  inviteUrl.searchParams.set("invite", inviteToken);
  return inviteUrl.toString();
}

function clearPilotInvitation() {
  activePilotInviteToken = "";
  activePilotInvitation = null;
  localStorage.removeItem(INDUSTRY_INVITE_STORAGE_KEY);

  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("invite");
  window.history.replaceState(
    {},
    document.title,
    `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
  );

  if (industryInviteSummary) {
    industryInviteSummary.hidden = true;
  }

  if (pilotConsentPanel) {
    pilotConsentPanel.hidden = true;
  }

  if (pilotConsentCheckbox) {
    pilotConsentCheckbox.checked = false;
  }

  pendingPilotConsentAcknowledged = false;
}

function renderPilotInvitation() {
  if (!industryInviteSummary) {
    return;
  }

  if (!activePilotInvitation) {
    industryInviteSummary.hidden = true;
    pilotConsentPanel.hidden = true;
    return;
  }

  industryInviteSummary.hidden = false;
  pilotConsentPanel.hidden = false;
  industryInviteWorkplace.textContent = activePilotInvitation.workplace_name;
  industryInviteDetails.textContent = `${activePilotInvitation.invited_role} invitation for ${activePilotInvitation.invited_email}`;

  const signupEmail = document.querySelector("#signup-email");
  const loginEmail = document.querySelector("#login-email");

  if (signupEmail) {
    signupEmail.value = activePilotInvitation.invited_email;
    signupEmail.readOnly = true;
  }

  if (loginEmail && !loginEmail.value) {
    loginEmail.value = activePilotInvitation.invited_email;
  }
}

async function loadPilotInvitation() {
  if (!activePilotInviteToken) {
    activePilotInvitation = null;
    renderPilotInvitation();
    return null;
  }

  const { data, error } = await supabaseClient.rpc("get_pilot_invitation", {
    invite_token: activePilotInviteToken,
  });

  if (error || !data?.length) {
    clearPilotInvitation();
    return null;
  }

  activePilotInvitation = data[0];
  renderPilotInvitation();
  return activePilotInvitation;
}

async function acceptPendingPilotInvitation() {
  if (!activePilotInviteToken) {
    return true;
  }

  if (!activePilotInvitation) {
    await loadPilotInvitation();
  }

  if (!activePilotInvitation) {
    return false;
  }

  if (!pendingPilotConsentAcknowledged) {
    const message =
      "Please acknowledge the optional pilot and privacy notice before joining.";
    if (loginStatus) {
      loginStatus.textContent = message;
    }
    if (signupStatus) {
      signupStatus.textContent = message;
    }
    return false;
  }

  const { error } = await supabaseClient.rpc("accept_pilot_invitation", {
    invite_token: activePilotInviteToken,
    consent_acknowledged: true,
    consent_version: PILOT_CONSENT_VERSION,
  });

  if (error) {
    if (loginStatus) {
      loginStatus.textContent = getSafeAuthFailureMessage("invitation");
    }

    if (signupStatus) {
      signupStatus.textContent = getSafeAuthFailureMessage("invitation");
    }

    return false;
  }

  clearPilotInvitation();
  return true;
}

const recoveryHashParams = new URLSearchParams(
  window.location.hash.replace(/^#/, ""),
);

const recoveryQueryParams = new URLSearchParams(window.location.search);

let passwordRecoveryActive =
  recoveryHashParams.get("type") === "recovery" ||
  recoveryQueryParams.get("type") === "recovery";

supabaseClient.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    passwordRecoveryActive = true;

    openIndustryAuth("update-password");
  }
});

function setIndustryAuthMode(mode = "signup") {
  if (mode === "signup" && !activePilotInvitation) {
    mode = "login";
  }

  signupForm.hidden = true;
  loginForm.hidden = true;
  recoveryForm.hidden = true;
  updatePasswordForm.hidden = true;

  authSwitch.hidden = false;
  authSwitchButton.hidden = false;

  if (mode === "login") {
    loginForm.hidden = false;

    industryAuthTitle.textContent = "Welcome back";
    industryAuthCopy.textContent = "Sign in to your space.";

    if (activePilotInvitation) {
      authSwitchCopy.textContent = "Using a new invitation?";
      authSwitchButton.textContent = "Create account";
    } else {
      authSwitchCopy.textContent = "New accounts require a private invitation.";
      authSwitchButton.hidden = true;
    }
  } else if (mode === "recovery") {
    recoveryForm.hidden = false;

    industryAuthTitle.textContent = "Reset your password";
    industryAuthCopy.textContent = "We’ll send you a link to get back in.";

    authSwitchCopy.textContent = "Remembered it?";
    authSwitchButton.textContent = "Sign in";
  } else if (mode === "update-password") {
    updatePasswordForm.hidden = false;
    authSwitch.hidden = true;

    industryAuthTitle.textContent = "Choose a new password";
    industryAuthCopy.textContent = "Make it something only you know.";
  } else {
    signupForm.hidden = false;

    industryAuthTitle.textContent = "Create your account";
    industryAuthCopy.textContent = `Join ${activePilotInvitation.workplace_name} with your private invitation.`;

    authSwitchCopy.textContent = "Already have an account?";
    authSwitchButton.textContent = "Sign in";

    mode = "signup";
  }

  industryAuthScreen.dataset.mode = mode;
  renderPilotInvitation();
}
function openIndustryAuth(mode = "signup") {
  setIndustryAuthMode(mode);

  onboardingWelcome?.classList.add("is-hidden");

  industryAuthScreen?.classList.add("is-active");
  industryAuthScreen?.setAttribute("aria-hidden", "false");

  document.body.classList.remove("onboarding-home-active");
}

function closeIndustryAuth() {
  industryAuthScreen?.classList.remove("is-active");
  industryAuthScreen?.setAttribute("aria-hidden", "true");

  onboardingWelcome?.classList.remove("is-hidden");

  document.body.classList.remove("industry-auth-active");
}

industryAuthBack?.addEventListener("click", () => {
  closeIndustryAuth();
});

function showSignedOutIndustry() {
  industryAuthScreen?.classList.remove("is-active");
  industryAuthScreen?.setAttribute("aria-hidden", "true");

  onboardingWelcome?.classList.remove("is-hidden");

  document.body.classList.remove("industry-auth-active");
}

async function restoreIndustrySession() {
  if (passwordRecoveryActive) {
    return;
  }
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    showSignedOutIndustry();
    return;
  }

  if (!session) {
    if (activePilotInvitation) {
      openIndustryAuth("signup");
    } else {
      showSignedOutIndustry();
    }

    return;
  }

  await enterAuthenticatedIndustry();
}

async function initializeIndustryAuth() {
  await loadPilotInvitation();
  await restoreIndustrySession();
}

initializeIndustryAuth();

const PILOT_MONITOR_EVENT_LABELS = Object.freeze({
  invitation_created: "Invitation created",
  invitation_replaced: "Invitation replaced",
  invitation_revoked: "Invitation revoked",
  invitation_accepted: "Invitation accepted",
  participant_joined: "Participant joined",
  participant_left: "Participant left",
  participant_removed: "Participant removed",
  shift_created: "Shift created",
  shift_updated: "Shift updated",
  shift_released: "Shift released",
  shift_reassigned: "Shift reassigned",
  shift_cancelled: "Shift cancelled",
  shift_deleted: "Shift deleted",
  interest_expressed: "Interest expressed",
  interest_withdrawn: "Interest withdrawn",
  candidate_selected: "Candidate selected",
  coverage_approved: "Coverage approved",
  coverage_cancelled: "Coverage cancelled",
  direct_offer_sent: "Direct offer sent",
  direct_offer_accepted: "Direct offer accepted",
  direct_offer_declined: "Direct offer declined",
  direct_offer_approved: "Direct offer approved",
  direct_offer_cancelled: "Direct offer cancelled",
  observer_granted: "Observer access granted",
  observer_revoked: "Observer access revoked",
  retention_configured: "Retention configured",
});

function setPilotMonitorConnection(state, message) {
  if (pilotMonitorConnectionDot) {
    pilotMonitorConnectionDot.dataset.state = state;
  }
  if (pilotMonitorConnectionText) {
    pilotMonitorConnectionText.textContent = message;
  }
}

function setPilotMonitorState(message, state = "loading") {
  if (!pilotMonitorState || !pilotMonitorEvents) {
    return;
  }
  pilotMonitorState.hidden = false;
  pilotMonitorState.dataset.state = state;
  pilotMonitorState.textContent = message;
  pilotMonitorEvents.hidden = true;
}

function makePilotMonitorMetric(label, value) {
  const card = document.createElement("article");
  card.className = "pilot-monitor-metric";

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = String(value ?? 0);

  card.append(labelElement, valueElement);
  return card;
}

function renderPilotMonitorSummary(summary) {
  if (!pilotMonitorSummary) {
    return;
  }

  const metrics = [
    ["Pending invitations", summary?.invitations?.pending],
    ["Accepted invitations", summary?.invitations?.accepted],
    ["Revoked invitations", summary?.invitations?.revoked],
    ["Expired invitations", summary?.invitations?.expired],
    ["Active participants", summary?.participants?.active],
    ["Inactive participants", summary?.participants?.inactive],
    ["Scheduled shifts", summary?.shifts?.scheduled],
    ["Open shifts", summary?.shifts?.open],
    ["Coverage needed", summary?.shifts?.coverage_needed],
    ["Completed shifts", summary?.shifts?.completed],
    ["Cancelled shifts", summary?.shifts?.cancelled],
    ["Interested", summary?.coverage?.interested],
    ["Selected", summary?.coverage?.selected],
    ["Confirmed", summary?.coverage?.confirmed],
    ["Open direct offers", summary?.coverage?.direct_offers_open],
    ["Events in 7 days", summary?.audit?.recent_events],
  ];

  pilotMonitorSummary.replaceChildren(
    ...metrics.map(([label, value]) => makePilotMonitorMetric(label, value)),
  );
}

function getPilotMonitorEventDetail(event) {
  const details = [];
  if (event.subject_code) details.push(`Participant ${event.subject_code}`);
  if (event.object_code) details.push(`Shift ${event.object_code}`);
  if (!details.length && event.actor_code) details.push(`Actor ${event.actor_code}`);
  return details.join(" · ") || "Workplace event";
}

function renderPilotMonitorEvents(events) {
  if (!pilotMonitorEvents || !pilotMonitorState) {
    return;
  }

  pilotMonitorEvents.replaceChildren();

  if (!events?.length) {
    setPilotMonitorState(
      "No retained events match these filters.",
      "empty",
    );
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("li");
    item.className = "pilot-monitor-event";

    const eventName = document.createElement("strong");
    eventName.textContent =
      PILOT_MONITOR_EVENT_LABELS[event.event_type] || "Pilot event";

    const outcome = document.createElement("span");
    outcome.className = "pilot-monitor-outcome";
    outcome.textContent = event.outcome || "info";

    const detail = document.createElement("span");
    detail.className = "pilot-monitor-event-code";
    detail.textContent = getPilotMonitorEventDetail(event);

    const timestamp = document.createElement("time");
    const occurredAt = new Date(event.occurred_at);
    timestamp.dateTime = Number.isNaN(occurredAt.getTime())
      ? ""
      : occurredAt.toISOString();
    timestamp.textContent = Number.isNaN(occurredAt.getTime())
      ? "Time unavailable"
      : occurredAt.toLocaleString();

    item.append(eventName, outcome, detail, timestamp);
    pilotMonitorEvents.appendChild(item);
  });

  pilotMonitorState.hidden = true;
  pilotMonitorEvents.hidden = false;
}

function getPilotMonitorSinceFilter() {
  const hours = Number(pilotMonitorTimeFilter?.value);
  if (!hours) {
    return null;
  }
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function schedulePilotMonitorStaleState() {
  window.clearTimeout(pilotObserverStaleTimer);
  pilotObserverStaleTimer = window.setTimeout(() => {
    if (activePilotObserverWorkplace) {
      setPilotMonitorConnection("stale", "Connected · data may be stale");
    }
  }, 90000);
}

async function loadPilotMonitorData() {
  if (!activePilotObserverWorkplace) {
    return false;
  }

  setPilotMonitorState("Loading privacy-safe pilot data…");

  const [summaryResult, eventResult] = await Promise.all([
    supabaseClient.rpc("get_pilot_monitor_summary", {
      target_workplace_id: activePilotObserverWorkplace.workplace_id,
    }),
    supabaseClient.rpc("list_pilot_monitor_events", {
      target_workplace_id: activePilotObserverWorkplace.workplace_id,
      event_type_filter: pilotMonitorEventFilter?.value || null,
      outcome_filter: pilotMonitorOutcomeFilter?.value || null,
      since_filter: getPilotMonitorSinceFilter(),
      result_limit: 100,
    }),
  ]);

  if (summaryResult.error || eventResult.error) {
    setPilotMonitorState(
      "Pilot data is unavailable. Access may have changed; refresh or sign in again.",
      "error",
    );
    setPilotMonitorConnection("error", "Unable to refresh");
    return false;
  }

  renderPilotMonitorSummary(summaryResult.data || {});
  renderPilotMonitorEvents(eventResult.data || []);
  setPilotMonitorConnection("connected", "Live and read only");
  schedulePilotMonitorStaleState();
  return true;
}

async function loadPilotObserverAuthorization() {
  const { data, error } = await supabaseClient.rpc(
    "list_my_observer_workplaces",
  );

  if (error || !data?.length) {
    activePilotObserverWorkplace = null;
    return false;
  }

  activePilotObserverWorkplace = data[0];
  return true;
}

async function verifyPilotObserverAuthorization() {
  if (!activePilotObserverWorkplace) {
    return;
  }

  const activeWorkplaceId = activePilotObserverWorkplace.workplace_id;
  const authorized = await loadPilotObserverAuthorization();

  if (!authorized || activePilotObserverWorkplace.workplace_id !== activeWorkplaceId) {
    await signOutOfIndustry();
    openIndustryAuth("login");
    loginStatus.textContent =
      "Observer access is no longer active. Contact the pilot organizer if this is unexpected.";
  }
}

async function setupPilotObserverRealtime() {
  if (!activePilotObserverWorkplace) {
    return;
  }

  if (pilotObserverRealtimeChannel) {
    await supabaseClient.removeChannel(pilotObserverRealtimeChannel);
  }

  setPilotMonitorConnection("connecting", "Connecting…");
  pilotObserverRealtimeChannel = supabaseClient
    .channel(`pilot-monitor-${activePilotObserverWorkplace.workplace_id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "pilot_audit_events",
        filter: `workplace_id=eq.${activePilotObserverWorkplace.workplace_id}`,
      },
      async () => {
        await loadPilotMonitorData();
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setPilotMonitorConnection("connected", "Live and read only");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setPilotMonitorConnection("error", "Live updates unavailable");
      } else if (status === "CLOSED") {
        setPilotMonitorConnection("disconnected", "Disconnected");
      }
    });
}

async function enterPilotObserverMode() {
  if (!activePilotObserverWorkplace || !pilotMonitorScreen) {
    return false;
  }

  document.body.classList.add("pilot-observer-active");
  industryAuthScreen?.classList.remove("is-active");
  industryAuthScreen?.setAttribute("aria-hidden", "true");
  pilotMonitorScreen.hidden = false;

  pilotMonitorWorkplace.textContent = activePilotObserverWorkplace.workplace_name;
  pilotMonitorEnvironment.textContent = IS_LOCAL_INDUSTRY
    ? "LOCAL TEST ENVIRONMENT · no production data"
    : "HOSTED PILOT ENVIRONMENT · read-only observer";
  const pilotEndsAt = activePilotObserverWorkplace.pilot_ends_at
    ? new Date(activePilotObserverWorkplace.pilot_ends_at)
    : null;
  const retentionDays = activePilotObserverWorkplace.retention_days || 90;
  const retentionEligibleAt = pilotEndsAt
    ? new Date(pilotEndsAt.getTime() + retentionDays * 24 * 60 * 60 * 1000)
    : null;

  if (!pilotEndsAt || Number.isNaN(pilotEndsAt.getTime())) {
    pilotMonitorStatusTitle.textContent = "Pilot active · end not configured";
    pilotMonitorRetention.textContent =
      "Cleanup is locked until a pilot end is explicitly configured, followed by at least 90 days.";
  } else if (pilotEndsAt > new Date()) {
    pilotMonitorStatusTitle.textContent = "Pilot active";
    pilotMonitorRetention.textContent =
      `Pilot end: ${pilotEndsAt.toLocaleString()} · ${retentionDays}-day retention.`;
  } else if (retentionEligibleAt > new Date()) {
    pilotMonitorStatusTitle.textContent = "Pilot ended · records retained";
    pilotMonitorRetention.textContent =
      `Event-level cleanup remains locked until ${retentionEligibleAt.toLocaleString()}.`;
  } else {
    pilotMonitorStatusTitle.textContent = "Pilot ended · retention eligible";
    pilotMonitorRetention.textContent =
      "Authorized service cleanup may now preserve aggregates and remove event-level linkage.";
  }

  await loadPilotMonitorData();
  await setupPilotObserverRealtime();

  window.clearInterval(pilotObserverAuthorizationTimer);
  pilotObserverAuthorizationTimer = window.setInterval(
    verifyPilotObserverAuthorization,
    15000,
  );
  return true;
}

pilotMonitorFilters?.addEventListener("change", () => {
  loadPilotMonitorData();
});

pilotMonitorRefresh?.addEventListener("click", () => {
  loadPilotMonitorData();
});

pilotMonitorSignout?.addEventListener("click", () => {
  signOutOfIndustry();
});

async function signOutOfIndustry() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    return;
  }

  authenticatedUserId = null;
  authenticatedWorkplaceId = null;
  authenticatedWorkplaceRole = null;
  authenticatedDisplayName = "";
  authenticatedManagerCrew = [];
  authenticatedWorkplaceCrew = [];
  activePilotObserverWorkplace = null;

  window.clearInterval(pilotObserverAuthorizationTimer);
  window.clearTimeout(pilotObserverStaleTimer);
  pilotObserverAuthorizationTimer = null;
  pilotObserverStaleTimer = null;

  if (pilotObserverRealtimeChannel) {
    await supabaseClient.removeChannel(pilotObserverRealtimeChannel);
    pilotObserverRealtimeChannel = null;
  }

  if (pilotMonitorScreen) {
    pilotMonitorScreen.hidden = true;
  }
  document.body.classList.remove("pilot-observer-active");

  if (industryRealtimeChannel) {
    await supabaseClient.removeChannel(industryRealtimeChannel);
    industryRealtimeChannel = null;
  }

  onboardingHelpPanel?.classList.add("is-hidden");

  signupForm?.reset();
  loginForm?.reset();

  signupStatus.textContent = "";
  loginStatus.textContent = "";

  if (leavePilotConfirmation) {
    leavePilotConfirmation.checked = false;
  }

  if (leavePilotButton) {
    leavePilotButton.disabled = false;
  }

  if (leavePilotStatus) {
    leavePilotStatus.textContent = "";
  }

  setIndustryAuthMode(activePilotInvitation ? "signup" : "login");

  showSignedOutIndustry();
}

industrySignOutButton?.addEventListener("click", () => {
  signOutOfIndustry();
});

leavePilotButton?.addEventListener("click", async () => {
  if (!leavePilotConfirmation?.checked) {
    leavePilotStatus.textContent =
      "Confirm that you understand the consequences before leaving.";
    return;
  }

  leavePilotButton.disabled = true;
  leavePilotStatus.textContent = "Checking schedule responsibilities…";

  const { data, error } = await supabaseClient.rpc("leave_pilot");
  const result = data?.[0];

  if (error || !result) {
    leavePilotButton.disabled = false;
    leavePilotStatus.textContent =
      "We couldn't leave the workplace pilot. Please try again.";
    return;
  }

  if (result.outcome !== "deactivated") {
    leavePilotButton.disabled = false;
    leavePilotStatus.textContent = getMembershipBlockMessage(result.reason);
    return;
  }

  leavePilotStatus.textContent =
    "You left the workplace pilot. Your Industry account still exists.";
  leavePilotConfirmation.checked = false;

  await signOutOfIndustry();
  openIndustryAuth("login");
  loginStatus.textContent =
    "You left the workplace pilot. Your Industry account still exists.";
});

// =========================================================
// INDUSTRY AUTH — USER PROFILE
// =========================================================

function getIndustryGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

function updateIndustryDashboardGreeting() {
  if (!dashboardGreeting) {
    return;
  }

  dashboardGreeting.textContent = authenticatedDisplayName
    ? `${getIndustryGreeting()}, ${authenticatedDisplayName}`
    : getIndustryGreeting();
}

function updateIndustryDashboardDate() {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  dashboardDate.textContent = formattedDate.replace(",", " •");
}

window.addEventListener("focus", () => {
  updateIndustryDashboardDate();
  updateIndustryDashboardGreeting();
  updateIndustryDashboardClock();
});

function updateDashboardForRole() {
  const isManager = authenticatedWorkplaceRole?.toLowerCase() === "manager";

  dashboardNextShiftPanel?.toggleAttribute("hidden", isManager);

  if (resetDemoDataButton) {
    resetDemoDataButton.hidden = true;
  }

  if (
    !dashboardSnapshotPrimary ||
    !dashboardSnapshotPrimaryIcon ||
    !dashboardSnapshotPrimaryValue ||
    !dashboardSnapshotPrimaryLabel ||
    !dashboardSnapshotSecondary ||
    !dashboardSnapshotSecondaryIcon ||
    !dashboardSnapshotSecondaryValue ||
    !dashboardSnapshotSecondaryLabel ||
    !dashboardSnapshotTertiary ||
    !dashboardSnapshotTertiaryIcon ||
    !dashboardSnapshotTertiaryValue ||
    !dashboardSnapshotTertiaryLabel ||
    !dashboardQuickPrimary ||
    !dashboardQuickPrimaryLabel ||
    !dashboardQuickSecondary ||
    !dashboardQuickSecondaryLabel ||
    !dashboardQuickTertiary ||
    !dashboardQuickTertiaryLabel ||
    !dashboardQuickQuaternary ||
    !dashboardQuickQuaternaryLabel
  ) {
    return;
  }

  if (isManager) {
    dashboardQuickActionsGrid?.classList.add("is-manager");

    const today = new Date().toLocaleDateString("en-US");

    const teamTodayCount = (authenticatedTeamScheduleShifts || []).filter(
      (shift) => {
        return new Date(shift.startsAt).toLocaleDateString("en-US") === today;
      },
    ).length;

    const coverageShiftCount = (authenticatedTeamScheduleShifts || []).filter(
      (shift) => shift.status === "coverage_needed"
    ).length;

    const directApprovalCount =
      authenticatedManagerDirectApprovals?.length || 0;

    const coverageCount =
      coverageShiftCount + directApprovalCount;

    const crewCount = authenticatedManagerCrew?.length || 0;

    // At a Glance
    dashboardSnapshotPrimaryIcon.textContent = "👥";
    dashboardSnapshotPrimaryValue.textContent = teamTodayCount;
    dashboardSnapshotPrimaryLabel.textContent = "Team today";
    dashboardSnapshotPrimary.dataset.dashboardSection = "schedule";
    dashboardSnapshotPrimary.dataset.dashboardView = "manager-team-schedule";
    delete dashboardSnapshotPrimary.dataset.scrollTarget;

    dashboardSnapshotSecondaryIcon.textContent = "↗";
    dashboardSnapshotSecondaryValue.textContent = coverageCount;
    dashboardSnapshotSecondaryLabel.textContent = "Coverage";
    dashboardSnapshotSecondary.dataset.dashboardSection = "schedule";
    dashboardSnapshotSecondary.dataset.dashboardView = "catch";
    delete dashboardSnapshotSecondary.dataset.scrollTarget;

    dashboardSnapshotTertiaryIcon.textContent = "👥";
    dashboardSnapshotTertiaryValue.textContent = crewCount;
    dashboardSnapshotTertiaryLabel.textContent = "Crew";
    dashboardSnapshotTertiary.dataset.dashboardSection = "schedule";
    dashboardSnapshotTertiary.dataset.dashboardView = "manager-crew";
    delete dashboardSnapshotTertiary.dataset.scrollTarget;

    // Quick Actions
    dashboardQuickPrimary.querySelector(".quick-action-icon").textContent =
      "🗓";
    dashboardQuickPrimaryLabel.textContent = "Team Schedule";
    dashboardQuickPrimary.dataset.dashboardSection = "schedule";
    dashboardQuickPrimary.dataset.dashboardView = "manager-team-schedule";
    delete dashboardQuickPrimary.dataset.scrollTarget;

    dashboardQuickSecondary.querySelector(".quick-action-icon").textContent =
      "＋";
    dashboardQuickSecondaryLabel.textContent = "Create Shift";
    dashboardQuickSecondary.dataset.dashboardSection = "schedule";
    dashboardQuickSecondary.dataset.dashboardView = "manager-create-shift";

    dashboardQuickTertiary.querySelector(".quick-action-icon").textContent =
      "↗";
    dashboardQuickTertiaryLabel.textContent = "Coverage Requests";
    dashboardQuickTertiary.dataset.dashboardSection = "schedule";
    dashboardQuickTertiary.dataset.dashboardView = "catch";

    dashboardQuickQuaternary.hidden = false;
    dashboardQuickQuaternary.querySelector(".quick-action-icon").textContent =
      "👥";
    dashboardQuickQuaternaryLabel.textContent = "Crew";
    dashboardQuickQuaternary.dataset.dashboardSection = "schedule";
    dashboardQuickQuaternary.dataset.dashboardView = "manager-crew";

    return;
  }

  // Worker defaults
  dashboardQuickActionsGrid?.classList.remove("is-manager");

  const yesterdayTipTotal = getYesterdayTipTotal();

  dashboardSnapshotPrimaryIcon.textContent = "💵";
  dashboardSnapshotPrimaryValue.textContent = formatMoney(yesterdayTipTotal);
  dashboardSnapshotPrimaryLabel.textContent = "Yesterday’s tips";
  dashboardSnapshotPrimary.dataset.dashboardSection = "schedule";
  dashboardSnapshotPrimary.dataset.dashboardView = "earnings-tools";
  dashboardSnapshotPrimary.dataset.scrollTarget = "tip-tracker-panel";

  dashboardSnapshotSecondaryIcon.textContent = "📅";
  const openCatchCount = (authenticatedCatchShifts || []).filter(
    (shift) => shift.owner !== authenticatedUserId,
  ).length;

  dashboardSnapshotSecondaryValue.textContent = String(openCatchCount);
  dashboardSnapshotSecondaryLabel.textContent =
    openCatchCount === 1 ? "Open catch" : "Open catches";
  dashboardSnapshotSecondary.dataset.dashboardSection = "schedule";
  dashboardSnapshotSecondary.dataset.dashboardView = "catch";
  delete dashboardSnapshotSecondary.dataset.scrollTarget;

  const upcomingShiftCount = (authenticatedScheduleShifts || []).filter(
    (shift) =>
      shift.status === "scheduled" &&
      !isCurrentShift(shift) &&
      new Date(shift.startsAt) > new Date(),
  ).length;

  dashboardSnapshotTertiaryIcon.textContent = "📅";
  dashboardSnapshotTertiaryValue.textContent = String(upcomingShiftCount);
  dashboardSnapshotTertiaryLabel.textContent =
    upcomingShiftCount === 1 ? "Upcoming shift" : "Upcoming shifts";

  dashboardSnapshotTertiary.dataset.dashboardSection = "schedule";
  dashboardSnapshotTertiary.dataset.dashboardView = "my-shifts";
  delete dashboardSnapshotTertiary.dataset.scrollTarget;

  dashboardQuickPrimary.querySelector(".quick-action-icon").textContent = "💵";
  dashboardQuickPrimaryLabel.textContent = "Tip Tracker";
  dashboardQuickPrimary.dataset.dashboardSection = "schedule";
  dashboardQuickPrimary.dataset.dashboardView = "earnings-tools";
  dashboardQuickPrimary.dataset.scrollTarget = "tip-tracker-panel";

  dashboardQuickSecondary.querySelector(".quick-action-icon").textContent =
    "👥";
  dashboardQuickSecondaryLabel.textContent = "View Crew";
  dashboardQuickSecondary.dataset.dashboardSection = "schedule";
  dashboardQuickSecondary.dataset.dashboardView = "shift-crew";

  const scheduledShifts = (authenticatedScheduleShifts || []).filter(
    (shift) => shift.status === "scheduled",
  );

  const currentShift = scheduledShifts.find((shift) => isCurrentShift(shift));
  const hasScheduledShift = scheduledShifts.length > 0;
  const currentShiftHasStarted = Boolean(
    currentShift?.reportedStartedAt || currentShift?.actualStartedAt,
  );

  if (currentShift) {
    if (currentShiftHasStarted) {
      dashboardQuickTertiary.querySelector(".quick-action-icon").textContent =
        "✓";

      dashboardQuickTertiaryLabel.textContent = "End Shift";
      dashboardQuickTertiary.dataset.dashboardAction = "end-shift";
    } else {
      dashboardQuickTertiary.querySelector(".quick-action-icon").textContent =
        "→";

      dashboardQuickTertiaryLabel.textContent = "Start Shift";
      dashboardQuickTertiary.dataset.dashboardAction = "start-shift";
    }

    dashboardQuickTertiary.dataset.shiftId = currentShift.id;

    delete dashboardQuickTertiary.dataset.dashboardSection;
    delete dashboardQuickTertiary.dataset.dashboardView;
  } else {
    dashboardQuickTertiary.querySelector(".quick-action-icon").textContent =
      "↗";

    dashboardQuickTertiaryLabel.textContent = "Release Shift";

    dashboardQuickTertiary.dataset.dashboardSection = "schedule";
    dashboardQuickTertiary.dataset.dashboardView = "need-coverage";

    delete dashboardQuickTertiary.dataset.dashboardAction;
    delete dashboardQuickTertiary.dataset.shiftId;
  }

  dashboardQuickTertiary.hidden = !hasScheduledShift;
  dashboardQuickQuaternary.hidden = true;
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateIndustryDashboardDate();
    updateIndustryDashboardGreeting();
    updateIndustryDashboardClock();
  }
});

window.setInterval(() => {
  updateIndustryDashboardClock();
}, 30000);

function updateIndustryDashboardClock() {
  if (!dashboardClock) {
    return;
  }

  const now = new Date();

  dashboardClock.textContent = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

async function loadAuthenticatedIndustryProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError) {
    return false;
  }

  if (!user) {
    return false;
  }

  authenticatedUserId = user.id;

  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return false;
  }

  const { data: membership, error: membershipError } = await supabaseClient
    .from("workplace_members")
    .select("workplace_id, role")
    .eq("profile_id", user.id)
    .eq("membership_status", "active")
    .maybeSingle();

  if (membershipError) {
    authenticatedWorkplaceId = null;
    authenticatedWorkplaceRole = null;
  } else {
    authenticatedWorkplaceId = membership?.workplace_id || null;
    authenticatedWorkplaceRole = membership?.role || null;

    backToScheduleButtons.forEach((button) => {
      button.textContent =
        authenticatedWorkplaceRole?.toLowerCase() === "manager"
          ? "← Back to Team Schedule"
          : "← Back to My Shifts";
    });

  }

  if (!authenticatedWorkplaceId || !authenticatedWorkplaceRole) {
    return false;
  }

  const fullName = profile?.full_name?.trim();

  if (!fullName) {
    authenticatedDisplayName = "";
    updateIndustryDashboardGreeting();
    return true;
  }

  const firstName = fullName.split(/\s+/)[0];

  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  authenticatedDisplayName = displayName;

  const {
    data: workplaceCoworkers,
    error: workplaceCoworkersError,
  } = await supabaseClient.rpc("get_direct_release_coworkers");

  if (workplaceCoworkersError) {
    authenticatedWorkplaceCrew = [
      {
        id: authenticatedUserId,
        name: fullName,
        role: authenticatedWorkplaceRole || "",
      },
    ];
  } else {
    authenticatedWorkplaceCrew = [
      {
        id: authenticatedUserId,
        name: fullName,
        role: authenticatedWorkplaceRole || "",
      },
      ...(workplaceCoworkers || []).map((coworker) => ({
        id: coworker.profile_id,
        name: coworker.full_name || "Crew member",
        role: coworker.role || "",
      })),
    ];
  }

  updateIndustryDashboardGreeting();

  // Re-render role-aware Schedule and Catch after the authenticated role is known.
  if (authenticatedWorkplaceRole?.toLowerCase() === "manager") {
    setActiveScheduleView("manager-schedule");
  }

  renderShiftBoard();

  await setupIndustryRealtime();
  return true;
}

async function setupIndustryRealtime() {
  if (!authenticatedUserId) {
    return;
  }

  if (industryRealtimeChannel) {
    await supabaseClient.removeChannel(industryRealtimeChannel);
    industryRealtimeChannel = null;
  }

  industryRealtimeChannel = supabaseClient
    .channel("industry-authenticated-realtime")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "shifts",
      },
      async () => {
        await Promise.all([
          loadAuthenticatedSchedule(),
          loadAuthenticatedCatchShifts(),
        ]);

        if (
          authenticatedWorkplaceRole?.toLowerCase() !== "manager" &&
          selectedReleaseShift?.id &&
          !authenticatedScheduleShifts.some(
            (shift) => shift.id === selectedReleaseShift.id
          )
        ) {
          selectedReleaseShift = null;

          setActiveSection("schedule");
          setActiveScheduleView("my-shifts");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        if (authenticatedWorkplaceRole?.toLowerCase() === "manager") {
          await loadAuthenticatedTeamSchedule();
        }

        updateDashboardForRole();
      },
    )

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "shift_interests",
      },
      async () => {
        await loadAuthenticatedShiftInterests();

        renderShiftBoard();

        renderAuthenticatedNextShiftSummary(authenticatedScheduleShifts ?? []);
      },
    )

    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "coverage_events",
      },
      async () => {
        await Promise.all([
          loadAuthenticatedSchedule(),
          loadAuthenticatedCatchShifts(),
          loadAuthenticatedShiftInterests(),
          loadAuthenticatedCoverageEvents(),
          loadAndRenderDirectShiftOffers(),
          loadAndRenderManagerDirectApprovals(),
        ]);

        if (
          authenticatedWorkplaceRole?.toLowerCase() !== "manager" &&
          selectedReleaseShift?.id &&
          !authenticatedScheduleShifts.some(
            (shift) => shift.id === selectedReleaseShift.id
          )
        ) {
          selectedReleaseShift = null;

          setActiveSection("schedule");
          setActiveScheduleView("my-shifts");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        if (
          selectedReleaseShift?.id &&
          authenticatedScheduleShifts.some(
            (shift) => shift.id === selectedReleaseShift.id
          )
        ) {
          const refreshedShift = authenticatedScheduleShifts.find(
            (shift) => shift.id === selectedReleaseShift.id
          );

          prefillReleaseForm(refreshedShift);
        }

        const openShiftId =
          shiftDetailsReleaseButton?.dataset.shiftId ||
          shiftDetailsCrewButton?.dataset.shiftId;

        const refreshedOpenShift = authenticatedScheduleShifts.find(
          (shift) => shift.id === openShiftId
        );

        if (refreshedOpenShift) {
          renderShiftDetailsActivity(refreshedOpenShift);
        }

        updateDashboardForRole();
        renderActivityFeed();
      },
    )

    .subscribe();
}

async function enterAuthenticatedIndustry() {
  const invitationAccepted = await acceptPendingPilotInvitation();

  if (!invitationAccepted) {
    openIndustryAuth(activePilotInvitation ? "login" : "signup");
    return;
  }

  // Establish authenticated identity and workplace role first.
  const hasWorkplaceAccess = await loadAuthenticatedIndustryProfile();

  if (!hasWorkplaceAccess) {
    const hasObserverAccess = await loadPilotObserverAuthorization();

    if (hasObserverAccess) {
      await enterPilotObserverMode();
      return;
    }

    await supabaseClient.auth.signOut();
    showSignedOutIndustry();
    openIndustryAuth("login");
    loginStatus.textContent =
      "This account is not connected to a workplace. Ask your pilot organizer for a private invitation.";
    return;
  }

  industryAuthScreen?.classList.remove("is-active");
  industryAuthScreen?.setAttribute("aria-hidden", "true");

  document.body.classList.remove("industry-auth-active");

  completeOnboarding();
  updateIndustryDashboardDate();
  updateIndustryDashboardClock();

  // Then load the user's Schedule/Catch data.
  await Promise.all([
    loadAuthenticatedSchedule(),
    loadAuthenticatedCatchShifts(),
    loadAuthenticatedShiftInterests(),
    loadAuthenticatedCoverageEvents(),
    loadAuthenticatedTeamSchedule(),
    loadAuthenticatedManagerCrew(),
    authenticatedWorkplaceRole?.toLowerCase() === "manager"
      ? loadWorkplaceInvitations()
      : Promise.resolve(),
  ]);

  if (authenticatedWorkplaceRole?.toLowerCase() === "manager") {
    await loadAndRenderManagerDirectApprovals();
  }

  renderActivityFeed();
  updateDashboardForRole();

  // Make the final Schedule destination role-aware.
  if (authenticatedWorkplaceRole?.toLowerCase() === "manager") {
    setActiveScheduleView("manager-schedule");
  } else {
    setActiveScheduleView("my-shifts");
  }
}

authSwitchButton?.addEventListener("click", () => {
  const currentMode = industryAuthScreen?.dataset.mode;

  if (currentMode === "login") {
    setIndustryAuthMode("signup");
  } else {
    setIndustryAuthMode("login");
  }
});
forgotPasswordButton?.addEventListener("click", () => {
  setIndustryAuthMode("recovery");
});
onboardingSignInButton?.addEventListener("click", () => {
  openIndustryAuth("login");
});

// =========================================================
// INDUSTRY AUTH — PASSWORD RECOVERY REQUEST
// =========================================================

recoveryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#recovery-email").value.trim();

  recoveryStatus.textContent = "Sending reset link…";

  const recoveryRedirectUrl = new URL(
    window.location.pathname,
    window.location.origin,
  );

  // Keep the controlled hosted-backend switch when password recovery starts
  // from a localhost preview. Without it, the email link silently falls back
  // to the local Supabase project after the page reloads.
  if (INDUSTRY_SUPABASE_OVERRIDE === "hosted") {
    recoveryRedirectUrl.searchParams.set("supabase", "hosted");
  }

  const redirectTo = recoveryRedirectUrl.toString();

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    recoveryStatus.textContent = getSafeAuthFailureMessage("recovery");
    return;
  }

  recoveryStatus.textContent =
    "If an account exists for that email, a reset link has been sent.";
});

// =========================================================
// INDUSTRY AUTH — UPDATE PASSWORD
// =========================================================

updatePasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPassword = document.querySelector("#new-password").value;

  const confirmPassword = document.querySelector("#confirm-new-password").value;

  if (newPassword !== confirmPassword) {
    updatePasswordStatus.textContent = "Passwords do not match.";
    return;
  }

  updatePasswordStatus.textContent = "Updating your password…";

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    updatePasswordStatus.textContent = getSafeAuthFailureMessage("password");
    return;
  }

  updatePasswordStatus.textContent = "Password updated.";

  passwordRecoveryActive = false;

  // Remove recovery tokens from the address bar without dropping the
  // controlled hosted-backend switch (or any other safe query parameters).
  // Dropping `?supabase=hosted` here would reconnect the localhost preview to
  // the local Supabase project immediately after a hosted password reset.
  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}${window.location.search}`,
  );

  enterAuthenticatedIndustry();
});

// =========================================================
// INDUSTRY AUTH — CREATE ACCOUNT
// =========================================================

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!activePilotInvitation || !activePilotInviteToken) {
    signupStatus.textContent =
      "A valid private invitation is required to create an account.";
    return;
  }

  if (!pilotConsentCheckbox?.checked) {
    signupStatus.textContent =
      "Please acknowledge the optional pilot and privacy notice before creating your account.";
    return;
  }

  pendingPilotConsentAcknowledged = true;

  const fullName = document.querySelector("#signup-name").value.trim();

  const email = document.querySelector("#signup-email").value.trim();

  const password = document.querySelector("#signup-password").value;

  if (email.toLowerCase() !== activePilotInvitation.invited_email) {
    signupStatus.textContent =
      "Use the email address that received this invitation.";
    return;
  }

  signupStatus.textContent = "Creating your account…";

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildIndustryInviteUrl(activePilotInviteToken),
      data: {
        full_name: fullName,
        pilot_consent_acknowledged: true,
        pilot_consent_version: PILOT_CONSENT_VERSION,
      },
    },
  });

  if (error) {
    signupStatus.textContent = getSafeAuthFailureMessage("signup");
    return;
  }

  if (!data.session) {
    signupStatus.textContent = getSafeAuthFailureMessage("signup");
    return;
  }

  signupStatus.textContent = "Account created.";

  enterAuthenticatedIndustry();
});

// =========================================================
// INDUSTRY AUTH — SIGN IN
// =========================================================

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#login-email").value.trim();

  const password = document.querySelector("#login-password").value;

  if (activePilotInvitation && !pilotConsentCheckbox?.checked) {
    loginStatus.textContent =
      "Please acknowledge the optional pilot and privacy notice before joining.";
    return;
  }

  pendingPilotConsentAcknowledged = Boolean(
    activePilotInvitation && pilotConsentCheckbox?.checked,
  );

  loginStatus.textContent = "Signing in…";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginStatus.textContent = getSafeAuthFailureMessage("login");
    return;
  }

  loginStatus.textContent = "Welcome back.";

  enterAuthenticatedIndustry();
});

// =========================================
// TESTING DISTRIBUTION
// Build 7: QR Source Tracking
// =========================================

const industryUrlParams = new URLSearchParams(window.location.search);
const industryTestSource = industryUrlParams.get("source");

if (industryTestSource) {
  localStorage.setItem("industry-test-source", industryTestSource);
}
