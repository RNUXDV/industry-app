const themeStorageKey = "industry-v2-theme";
const nearbyStorageKey = "industry-v2-nearby";
const nearbyVisibilityStorageKey = "industry-v2-nearby-visibility";

const themeToggleButton = document.querySelector("#theme-toggle-button");
const pageFilterButtons = document.querySelectorAll(".page-filter-button");
const networkCards = document.querySelectorAll(".network-worker-card");
const eventCards = document.querySelectorAll(".people-event-card");
const resourceCards = document.querySelectorAll(".people-resource-card");
const workerPreviewButtons = document.querySelectorAll(".worker-preview-button");
const workerSaveButtons = document.querySelectorAll(".worker-save-button");
const networkStatusMessage = document.querySelector("#network-status-message");
const eventInterestButtons = document.querySelectorAll(".event-interest-button");
const eventsStatusMessage = document.querySelector("#events-status-message");
const nearbyVisibilityButtons = document.querySelectorAll(".nearby-visibility-button");
const mockNearbyButton = document.querySelector("#mock-nearby-button");
const nearbyStatusMessage = document.querySelector("#nearby-status-message");
const nearbyResultsPanel = document.querySelector("#nearby-results-panel");
const nearbyVisibilityStatus = document.querySelector("#nearby-visibility-status");
const resourcePreviewButtons = document.querySelectorAll(".resource-preview-button");
const resourceStatusMessage = document.querySelector("#resource-status-message");

function applyTheme(themeName) {
  document.body.dataset.theme = themeName;

  if (themeToggleButton) {
    themeToggleButton.textContent =
      themeName === "dark" ? "Light / Dark: Dark" : "Light / Dark: Light";
  }
}

function toggleCardVisibility(cards, activeValue, dataKey) {
  cards.forEach((card) => {
    const matches = activeValue === "all" || card.dataset[dataKey].includes(activeValue);
    card.classList.toggle("hidden-panel", !matches);
  });
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

pageFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { filterGroup, filterValue } = button.dataset;

    document
      .querySelectorAll(`.page-filter-button[data-filter-group="${filterGroup}"]`)
      .forEach((filterButton) => {
        filterButton.classList.toggle("active", filterButton === button);
      });

    if (filterGroup === "network") {
      toggleCardVisibility(networkCards, filterValue, "networkTags");
    }

    if (filterGroup === "events") {
      toggleCardVisibility(eventCards, filterValue, "eventTags");
    }

    if (filterGroup === "resources") {
      toggleCardVisibility(resourceCards, filterValue, "resourceTags");
    }
  });
});

workerPreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (networkStatusMessage) {
      networkStatusMessage.textContent = "Profile preview coming soon.";
    }
  });
});

workerSaveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (networkStatusMessage) {
      networkStatusMessage.textContent = "Connection saved.";
    }
  });
});

eventInterestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (eventsStatusMessage) {
      eventsStatusMessage.textContent = "Interest saved.";
    }
  });
});

nearbyVisibilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const visibility = button.dataset.visibility;
    localStorage.setItem(nearbyVisibilityStorageKey, visibility);

    nearbyVisibilityButtons.forEach((visibilityButton) => {
      visibilityButton.classList.toggle("active", visibilityButton === button);
    });

    if (nearbyVisibilityStatus) {
      nearbyVisibilityStatus.textContent = `Visibility: ${visibility}`;
    }
  });
});

if (mockNearbyButton) {
  mockNearbyButton.addEventListener("click", () => {
    localStorage.setItem(nearbyStorageKey, "on");

    if (nearbyStatusMessage) {
      nearbyStatusMessage.textContent = "Mock nearby enabled";
    }

    if (nearbyResultsPanel) {
      nearbyResultsPanel.classList.remove("hidden-panel");
    }

    if (nearbyVisibilityStatus) {
      nearbyVisibilityStatus.textContent = `Visibility: ${localStorage.getItem(nearbyVisibilityStorageKey) || "Hidden"}`;
    }
  });
}

resourcePreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (resourceStatusMessage) {
      resourceStatusMessage.textContent = "Resource preview coming soon.";
    }
  });
});

const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
const savedNearbyState = localStorage.getItem(nearbyStorageKey) || "off";
const savedNearbyVisibility = localStorage.getItem(nearbyVisibilityStorageKey) || "Hidden";

applyTheme(savedTheme);

nearbyVisibilityButtons.forEach((button) => {
  button.classList.toggle("active", button.dataset.visibility === savedNearbyVisibility);
});

if (nearbyVisibilityStatus) {
  nearbyVisibilityStatus.textContent = `Visibility: ${savedNearbyVisibility}`;
}

if (savedNearbyState === "on") {
  if (nearbyStatusMessage) {
    nearbyStatusMessage.textContent = "Mock nearby enabled";
  }

  if (nearbyResultsPanel) {
    nearbyResultsPanel.classList.remove("hidden-panel");
  }
}
