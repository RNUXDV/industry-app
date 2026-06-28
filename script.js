const navButtons = document.querySelectorAll(".nav-item");
const appSections = document.querySelectorAll(".app-section");
const saveButtons = document.querySelectorAll(".save-button");
const workCard = document.querySelector(".work-card");
const jobsCard = document.querySelector(".jobs-card");
const openProfileButton = document.querySelector("#open-profile-button");
const openTestingButton = document.querySelector("#open-testing-button");
const backHomeButton = document.querySelector("#back-home-button");
const backHomeFromJobsButton = document.querySelector("#back-home-from-jobs");
const backHomeFromProfileButton = document.querySelector("#back-home-from-profile");
const backHomeFromTestingButton = document.querySelector("#back-home-from-testing");
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
const startTaskButtons = document.querySelectorAll(".start-task-button");
const markTaskButtons = document.querySelectorAll(".mark-task-button");
const testingAnswerButtons = document.querySelectorAll(".testing-answer-button");
const testingNote = document.querySelector("#testing-note");
const saveTestingFeedbackButton = document.querySelector("#save-testing-feedback-button");
const testingFeedbackStatus = document.querySelector("#testing-feedback-status");
const testingSummaryPanel = document.querySelector("#testing-summary-panel");
const testingAnswerSummary = document.querySelector("#testing-answer-summary");
const testingNoteSummary = document.querySelector("#testing-note-summary");
const copySummaryPreview = document.querySelector("#copy-summary-preview");
const copyFeedbackSummaryButton = document.querySelector("#copy-feedback-summary-button");
const copyFeedbackStatus = document.querySelector("#copy-feedback-status");
const clearTestingDataButton = document.querySelector("#clear-testing-data-button");
let tipTotal = 0;
const profileStorageKey = "industry-profile";
const testingTasksStorageKey = "industry-testing-tasks";
const testingFeedbackStorageKey = "industry-testing-feedback";

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

function openTestingSection() {
  setActiveSection("testing");
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

if (openTestingButton) {
  openTestingButton.addEventListener("click", openTestingSection);
}

if (backHomeFromProfileButton) {
  backHomeFromProfileButton.addEventListener("click", () => {
    setActiveSection("home");
  });
}

if (backHomeFromTestingButton) {
  backHomeFromTestingButton.addEventListener("click", () => {
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
    openNetworkPanel(button.dataset.panel, button.textContent.trim());
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
    updateFeedbackSummaryPreview();
    profileStatus.textContent = "Profile saved for this prototype.";
  });
}

feedbackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    feedbackStatus.textContent = "Feedback noted for this prototype.";
  });
});

function openNetworkPanel(panelName, label) {
  networkPanels.forEach((panel) => {
    const isActive = panel.dataset.panelContent === panelName;
    panel.classList.toggle("active", isActive);
  });

  if (label) {
    networkStatus.textContent = `${label} opened.`;
  }
}

function setTaskCompleteState(taskCard, isComplete) {
  taskCard.classList.toggle("is-complete", isComplete);

  const markButton = taskCard.querySelector(".mark-task-button");
  markButton.classList.toggle("is-complete", isComplete);
  markButton.textContent = isComplete ? "Completed" : "Mark complete";
}

function readCompletedTasks() {
  const savedTasks = localStorage.getItem(testingTasksStorageKey);

  if (!savedTasks) {
    return {};
  }

  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    localStorage.removeItem(testingTasksStorageKey);
    return {};
  }
}

function saveCompletedTasks(tasks) {
  localStorage.setItem(testingTasksStorageKey, JSON.stringify(tasks));
}

function getCompletedTaskTitles() {
  const completedTasks = readCompletedTasks();

  return Array.from(document.querySelectorAll(".testing-task-card"))
    .filter((taskCard) => completedTasks[taskCard.dataset.taskId])
    .map((taskCard) => taskCard.querySelector("h3").textContent);
}

function buildFeedbackSummary() {
  const savedProfile = localStorage.getItem(profileStorageKey);
  const savedTestingFeedback = localStorage.getItem(testingFeedbackStorageKey);
  let profileData = {};
  let feedbackData = {};

  if (savedProfile) {
    try {
      profileData = JSON.parse(savedProfile);
    } catch (error) {
      profileData = {};
    }
  }

  if (savedTestingFeedback) {
    try {
      feedbackData = JSON.parse(savedTestingFeedback);
    } catch (error) {
      feedbackData = {};
    }
  }

  const completedTaskTitles = getCompletedTaskTitles();

  return [
    "Industry Feedback Summary",
    `Nickname: ${profileData.name || "Not provided"}`,
    `Role: ${profileData.role || "Not provided"}`,
    `Neighborhood: ${profileData.neighborhood || "Not provided"}`,
    `Main goal: ${profileData.goal || "Not provided"}`,
    `Completed testing tasks: ${
      completedTaskTitles.length > 0 ? completedTaskTitles.join(", ") : "None yet"
    }`,
    `Feedback answer: ${feedbackData.answer || "Not provided"}`,
    `Feedback note: ${feedbackData.note || "No note yet."}`,
  ].join("\n");
}

function updateFeedbackSummaryPreview() {
  copySummaryPreview.textContent = buildFeedbackSummary();
}

startTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionName = button.dataset.targetSection;
    const panelName = button.dataset.networkPanel;

    setActiveSection(sectionName);

    if (sectionName === "network" && panelName) {
      openNetworkPanel(panelName, "Testing task");
    }
  });
});

markTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const taskCard = button.closest(".testing-task-card");
    const taskId = taskCard.dataset.taskId;
    const completedTasks = readCompletedTasks();
    const nextState = !completedTasks[taskId];

    completedTasks[taskId] = nextState;
    saveCompletedTasks(completedTasks);
    setTaskCompleteState(taskCard, nextState);
    updateFeedbackSummaryPreview();
  });
});

function updateTestingSummary(feedbackData) {
  const hasFeedback = feedbackData.answer || feedbackData.note;
  testingSummaryPanel.classList.toggle("visible", Boolean(hasFeedback));

  if (hasFeedback) {
    testingAnswerSummary.textContent = feedbackData.answer || "No answer yet";
    testingNoteSummary.textContent = feedbackData.note || "No note yet.";
    updateFeedbackSummaryPreview();
  }
}

let selectedTestingAnswer = "";

testingAnswerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTestingAnswer = button.dataset.answer;

    testingAnswerButtons.forEach((answerButton) => {
      const isActive = answerButton === button;
      answerButton.classList.toggle("active", isActive);
    });
  });
});

if (saveTestingFeedbackButton) {
  saveTestingFeedbackButton.addEventListener("click", () => {
    const feedbackData = {
      answer: selectedTestingAnswer,
      note: testingNote.value.trim(),
    };

    localStorage.setItem(testingFeedbackStorageKey, JSON.stringify(feedbackData));
    updateTestingSummary(feedbackData);
    testingFeedbackStatus.textContent = "Feedback saved for this prototype.";
  });
}

if (copyFeedbackSummaryButton) {
  copyFeedbackSummaryButton.addEventListener("click", async () => {
    const summaryText = buildFeedbackSummary();
    updateFeedbackSummaryPreview();

    try {
      await navigator.clipboard.writeText(summaryText);
      copyFeedbackStatus.textContent = "Feedback summary copied. Send it to Robert.";
    } catch (error) {
      copyFeedbackStatus.textContent = "Copy failed. Select the summary text and copy it manually.";
    }
  });
}

if (clearTestingDataButton) {
  clearTestingDataButton.addEventListener("click", () => {
    localStorage.removeItem(testingTasksStorageKey);
    localStorage.removeItem(testingFeedbackStorageKey);

    document.querySelectorAll(".testing-task-card").forEach((taskCard) => {
      setTaskCompleteState(taskCard, false);
    });

    testingAnswerButtons.forEach((button) => {
      button.classList.remove("active");
    });

    selectedTestingAnswer = "";
    testingNote.value = "";
    testingFeedbackStatus.textContent = "";
    copyFeedbackStatus.textContent = "";
    copySummaryPreview.textContent = "Feedback summary preview will appear here.";
    updateTestingSummary({ answer: "", note: "" });
  });
}

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

const completedTasks = readCompletedTasks();

document.querySelectorAll(".testing-task-card").forEach((taskCard) => {
  const taskId = taskCard.dataset.taskId;
  setTaskCompleteState(taskCard, Boolean(completedTasks[taskId]));
});

updateFeedbackSummaryPreview();

const savedTestingFeedback = localStorage.getItem(testingFeedbackStorageKey);

if (savedTestingFeedback) {
  try {
    const feedbackData = JSON.parse(savedTestingFeedback);
    selectedTestingAnswer = feedbackData.answer || "";
    testingNote.value = feedbackData.note || "";
    updateTestingSummary(feedbackData);

    testingAnswerButtons.forEach((button) => {
      const isActive = button.dataset.answer === selectedTestingAnswer;
      button.classList.toggle("active", isActive);
    });
  } catch (error) {
    localStorage.removeItem(testingFeedbackStorageKey);
  }
}
