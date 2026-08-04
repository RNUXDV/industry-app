const themeStorageKey = "industry-v2-theme";
const nearbyStorageKey = "industry-v2-nearby";
const nearbyVisibilityStorageKey = "industry-v2-nearby-visibility";

const themeToggleButton = document.querySelector("#theme-toggle-button");
const pageFilterButtons = document.querySelectorAll(".page-filter-button");
const networkCards = document.querySelectorAll(".network-worker-card");
const eventCards = document.querySelectorAll(".people-event-card");
const resourceCards = document.querySelectorAll(".people-resource-card");
const workerPreviewButtons = document.querySelectorAll(
  ".worker-preview-button",
);
const workerSaveButtons = document.querySelectorAll(".worker-save-button");
const networkStatusMessage = document.querySelector("#network-status-message");
const eventInterestButtons = document.querySelectorAll(
  ".event-interest-button",
);
const eventsStatusMessage = document.querySelector("#events-status-message");
const nearbyVisibilityButtons = document.querySelectorAll(
  ".nearby-visibility-button",
);
const mockNearbyButton = document.querySelector("#mock-nearby-button");
const nearbyStatusMessage = document.querySelector("#nearby-status-message");
const nearbyResultsPanel = document.querySelector("#nearby-results-panel");
const nearbyVisibilityStatus = document.querySelector(
  "#nearby-visibility-status",
);
const resourcePreviewButtons = document.querySelectorAll(
  ".resource-preview-button",
);
const resourceStatusMessage = document.querySelector(
  "#resource-status-message",
);

/* =========================================================
   PEOPLE VIEW: MY LOOP — SELECTORS + STORAGE
========================================================= */

const loopStateStorageKey = "industry-v2-my-loop-state";

const loopRequestCount = document.querySelector("[data-loop-request-count]");

const loopPersonCount = document.querySelector("[data-loop-person-count]");

const loopRequestCard = document.querySelector("[data-loop-request-card]");

const acceptLoopRequestButton = document.querySelector(
  "[data-accept-loop-request]",
);

const declineLoopRequestButton = document.querySelector(
  "[data-decline-loop-request]",
);

const loopPeopleGrid = document.querySelector("[data-loop-people-grid]");

const loopSuggestionCard = document.querySelector(
  "[data-loop-suggestion-card]",
);

const sendLoopRequestButton = document.querySelector(
  "[data-send-loop-request]",
);

function applyTheme(themeName) {
  document.body.dataset.theme = themeName;

  if (themeToggleButton) {
    themeToggleButton.textContent =
      themeName === "dark" ? "Light / Dark: Dark" : "Light / Dark: Light";
  }
}

function toggleCardVisibility(cards, activeValue, dataKey) {
  cards.forEach((card) => {
    const matches =
      activeValue === "all" || card.dataset[dataKey].includes(activeValue);
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
      .querySelectorAll(
        `.page-filter-button[data-filter-group="${filterGroup}"]`,
      )
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
const savedNearbyVisibility =
  localStorage.getItem(nearbyVisibilityStorageKey) || "Hidden";

applyTheme(savedTheme);

nearbyVisibilityButtons.forEach((button) => {
  button.classList.toggle(
    "active",
    button.dataset.visibility === savedNearbyVisibility,
  );
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
/* =========================================================
   PEOPLE VIEW: MY LOOP — START
========================================================= */

/* =========================================================
   MY LOOP: DEFAULT STATE
========================================================= */

const defaultLoopState = {
  mayaStatus: "pending",
  samStatus: "suggested",
};

/* =========================================================
   MY LOOP: LOAD SAVED STATE
========================================================= */

function loadLoopState() {
  const savedLoopState = localStorage.getItem(loopStateStorageKey);

  if (!savedLoopState) {
    return { ...defaultLoopState };
  }

  try {
    const parsedLoopState = JSON.parse(savedLoopState);

    return {
      mayaStatus:
        parsedLoopState.mayaStatus === "accepted" ||
        parsedLoopState.mayaStatus === "declined"
          ? parsedLoopState.mayaStatus
          : "pending",

      samStatus: parsedLoopState.samStatus === "sent" ? "sent" : "suggested",
    };
  } catch (error) {
    console.warn("Unable to load the saved My Loop state.", error);

    return { ...defaultLoopState };
  }
}

/* =========================================================
   MY LOOP: SAVE STATE
========================================================= */

function saveLoopState() {
  localStorage.setItem(loopStateStorageKey, JSON.stringify(loopState));
}

/* =========================================================
   MY LOOP: UPDATE OVERVIEW COUNTS
========================================================= */

function renderLoopCounts() {
  if (!loopRequestCount || !loopPersonCount) return;

  loopRequestCount.textContent = loopState.mayaStatus === "pending" ? "2" : "1";

  loopPersonCount.textContent =
    loopState.mayaStatus === "accepted" ? "13" : "12";
}

/* =========================================================
   MY LOOP: ADD MAYA TO THE LOOP GRID
========================================================= */

function addMayaToLoop() {
  if (!loopPeopleGrid) return;

  const mayaAlreadyExists = loopPeopleGrid.querySelector(
    '[data-loop-person="maya-chen"]',
  );

  if (mayaAlreadyExists) return;

  const mayaCard = document.createElement("article");

  mayaCard.className = "people-loop-connection-card";
  mayaCard.dataset.loopPerson = "maya-chen";

  mayaCard.innerHTML = `
    <div
      class="people-loop-avatar people-loop-avatar-red"
      aria-hidden="true"
    >
      MC
    </div>

    <h3>Maya Chen</h3>

    <p>Bartender</p>

    <span>Northline</span>

    <button
      class="people-loop-message-button"
      type="button"
    >
      Message
    </button>
  `;

  loopPeopleGrid.prepend(mayaCard);
}

/* =========================================================
   MY LOOP: RENDER MAYA REQUEST
========================================================= */

function renderMayaRequestState() {
  if (!loopRequestCard) return;

  if (loopState.mayaStatus === "accepted") {
    addMayaToLoop();

    loopRequestCard.innerHTML = `
      <div
        class="people-loop-avatar people-loop-avatar-red"
        aria-hidden="true"
      >
        MC
      </div>

      <div class="people-loop-person-copy">
        <span class="people-loop-relationship-label">
          Now in your Loop
        </span>

        <h3>Maya Chen</h3>

        <p class="people-loop-person-role">
          Bartender · Northline
        </p>

        <p class="people-loop-connection-context">
          Maya is now in your Loop.
        </p>
      </div>

      <button
        class="people-loop-primary-button"
        type="button"
      >
        Message
      </button>
    `;

    return;
  }

  if (loopState.mayaStatus === "declined") {
    loopRequestCard.innerHTML = `
      <div
        class="people-loop-avatar people-loop-avatar-red"
        aria-hidden="true"
      >
        MC
      </div>

      <div class="people-loop-person-copy">
        <span class="people-loop-relationship-label">
          Request declined
        </span>

        <h3>Maya Chen</h3>

        <p class="people-loop-connection-context">
          Maya was not added to your Loop.
          They will not be notified.
        </p>
      </div>
    `;
  }
}

/* =========================================================
   MY LOOP: RENDER SAM SUGGESTION
========================================================= */

function renderSamSuggestionState() {
  if (!loopSuggestionCard || loopState.samStatus !== "sent") {
    return;
  }

  const relationshipLabel = loopSuggestionCard.querySelector(
    ".people-loop-relationship-label",
  );

  const connectionContext = loopSuggestionCard.querySelector(
    ".people-loop-connection-context",
  );

  const requestButton = loopSuggestionCard.querySelector(
    "[data-send-loop-request]",
  );

  if (relationshipLabel) {
    relationshipLabel.textContent = "Request pending";
  }

  if (connectionContext) {
    connectionContext.textContent =
      "Sam will appear in your Loop after accepting.";
  }

  if (requestButton) {
    requestButton.textContent = "Request sent";
    requestButton.disabled = true;
  }
}

/* =========================================================
   MY LOOP: RENDER COMPLETE STATE
========================================================= */

function renderLoopState() {
  renderLoopCounts();
  renderMayaRequestState();
  renderSamSuggestionState();
}

/* =========================================================
   MY LOOP: INITIALIZE
========================================================= */

const loopState = loadLoopState();

acceptLoopRequestButton?.addEventListener("click", () => {
  loopState.mayaStatus = "accepted";

  saveLoopState();
  renderLoopState();
});

declineLoopRequestButton?.addEventListener("click", () => {
  loopState.mayaStatus = "declined";

  saveLoopState();
  renderLoopState();
});

sendLoopRequestButton?.addEventListener("click", () => {
  loopState.samStatus = "sent";

  saveLoopState();
  renderLoopState();
});

renderLoopState();

/* =========================================================
   PEOPLE VIEW: MY LOOP — END
========================================================= */

/* =========================================================
   PEOPLE VIEW: EVENTS — START
========================================================= */

{
  /* =======================================================
     EVENTS: PAGE + STORAGE
  ======================================================= */

  const peopleEventsView = document.querySelector(".people-events-view");

  const peopleEventsStorageKey = "industry-v2-people-events-state";

  const validPeopleEventStates = ["none", "interested", "going"];

  const defaultPeopleEventsState = {
    selectedFilter: "all",
    inviteReady: false,

    invitedPeople: {
      "maya-chen": false,
      "jordan-reed": false,
      "alex-kim": false,
    },

    eventStates: {
      "industry-night": "none",
      "sober-industry-coffee": "none",
      "after-shift-patio-mixer": "none",
      "conflict-at-work-workshop": "none",
    },
  };

  if (peopleEventsView) {
    /* =====================================================
       EVENTS: SELECTORS
    ===================================================== */

    const peopleEventsFeatured = document.querySelector(
      "[data-events-featured]",
    );

    const peopleEventsFeaturedGoingButton = document.querySelector(
      "[data-events-featured-going]",
    );

    const peopleEventsFeaturedInterestedButton = document.querySelector(
      "[data-events-featured-interested]",
    );

    const peopleEventsInviteButton = document.querySelector(
      "[data-events-invite-loop]",
    );

    const peopleEventsInvitePanel = document.querySelector(
      "[data-events-invite-panel]",
    );

    const peopleEventsInviteCloseButton = document.querySelector(
      "[data-events-invite-close]",
    );

    const peopleEventsInvitePersonButtons = document.querySelectorAll(
      "[data-events-invite-person]",
    );

    const peopleEventsFilterButtons = document.querySelectorAll(
      "[data-events-filter]",
    );

    const peopleEventsCards = document.querySelectorAll("[data-events-card]");

    const peopleEventsStatus = document.querySelector("[data-events-status]");

    /* =====================================================
       EVENTS: LOAD STATE
    ===================================================== */

    function loadPeopleEventsState() {
      const savedState = localStorage.getItem(peopleEventsStorageKey);

      if (!savedState) {
        return {
          ...defaultPeopleEventsState,

          eventStates: {
            ...defaultPeopleEventsState.eventStates,
          },
        };
      }

      try {
        const parsedState = JSON.parse(savedState);

        const loadedEventStates = {
          ...defaultPeopleEventsState.eventStates,
        };

        Object.keys(loadedEventStates).forEach((eventId) => {
          const savedEventState = parsedState.eventStates?.[eventId];

          loadedEventStates[eventId] = validPeopleEventStates.includes(
            savedEventState,
          )
            ? savedEventState
            : "none";
        });

        const validFilters = ["all", "social", "sober", "learning", "support"];

        const loadedInvitedPeople = {
          "maya-chen": parsedState.invitedPeople?.["maya-chen"] === true,

          "jordan-reed": parsedState.invitedPeople?.["jordan-reed"] === true,

          "alex-kim": parsedState.invitedPeople?.["alex-kim"] === true,
        };

        return {
          selectedFilter: validFilters.includes(parsedState.selectedFilter)
            ? parsedState.selectedFilter
            : "all",

          inviteReady: parsedState.inviteReady === true,

          invitedPeople: loadedInvitedPeople,

          eventStates: loadedEventStates,
        };
      } catch (error) {
        console.warn("Unable to load the saved Events state.", error);

        return {
          ...defaultPeopleEventsState,

          invitedPeople: {
            ...defaultPeopleEventsState.invitedPeople,
          },

          eventStates: {
            ...defaultPeopleEventsState.eventStates,
          },
        };
      }
    }

    /* =====================================================
       EVENTS: SAVE STATE
    ===================================================== */

    function savePeopleEventsState() {
      localStorage.setItem(
        peopleEventsStorageKey,
        JSON.stringify(peopleEventsState),
      );
    }

    /* =====================================================
       EVENTS: STATUS MESSAGE
    ===================================================== */

    function updatePeopleEventsStatus(message) {
      if (!peopleEventsStatus) return;

      peopleEventsStatus.textContent = message;
    }

    /* =====================================================
       EVENTS: BUTTON PAIR
    ===================================================== */

    function renderPeopleEventButtons(
      goingButton,
      interestedButton,
      eventState,
    ) {
      const isGoing = eventState === "going";
      const isInterested = eventState === "interested";

      if (goingButton) {
        goingButton.classList.toggle("is-selected", isGoing);

        goingButton.setAttribute("aria-pressed", String(isGoing));

        goingButton.textContent = isGoing ? "Going" : "I’m going";
      }

      if (interestedButton) {
        interestedButton.classList.toggle("is-selected", isInterested);

        interestedButton.setAttribute("aria-pressed", String(isInterested));

        interestedButton.textContent = isInterested
          ? "Interested ✓"
          : "Interested";
      }
    }

    /* =====================================================
       EVENTS: FEATURED EVENT
    ===================================================== */

    function renderPeopleEventsFeatured() {
      if (!peopleEventsFeatured) return;

      const eventState = peopleEventsState.eventStates["industry-night"];

      peopleEventsFeatured.dataset.eventState = eventState;

      renderPeopleEventButtons(
        peopleEventsFeaturedGoingButton,
        peopleEventsFeaturedInterestedButton,
        eventState,
      );
    }

    /* =====================================================
       EVENTS: EVENT CARDS
    ===================================================== */

    function renderPeopleEventsCards() {
      peopleEventsCards.forEach((eventCard) => {
        const eventId = eventCard.dataset.eventId;

        const eventState = peopleEventsState.eventStates[eventId] || "none";

        const goingButton = eventCard.querySelector("[data-events-going]");

        const interestedButton = eventCard.querySelector(
          "[data-events-interested]",
        );

        eventCard.dataset.eventState = eventState;

        renderPeopleEventButtons(goingButton, interestedButton, eventState);
      });
    }

    /* =====================================================
       EVENTS: FILTERS
    ===================================================== */

    function renderPeopleEventsFilter() {
      const selectedFilter = peopleEventsState.selectedFilter;

      peopleEventsFilterButtons.forEach((filterButton) => {
        const isActive = filterButton.dataset.eventsFilter === selectedFilter;

        filterButton.classList.toggle("active", isActive);

        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      peopleEventsCards.forEach((eventCard) => {
        const categories = eventCard.dataset.eventCategory
          .split(" ")
          .filter(Boolean);

        const shouldShow =
          selectedFilter === "all" || categories.includes(selectedFilter);

        eventCard.hidden = !shouldShow;
      });
    }

    /* =====================================================
       EVENTS: LOOP INVITATION
    ===================================================== */

    function renderPeopleEventsInvitation() {
      if (peopleEventsInviteButton) {
        peopleEventsInviteButton.classList.toggle(
          "is-selected",
          peopleEventsState.inviteReady,
        );

        peopleEventsInviteButton.setAttribute(
          "aria-pressed",
          String(peopleEventsState.inviteReady),
        );

        peopleEventsInviteButton.setAttribute(
          "aria-expanded",
          String(peopleEventsState.inviteReady),
        );

        peopleEventsInviteButton.textContent = peopleEventsState.inviteReady
          ? "Close invitations"
          : "Invite someone";
      }

      if (peopleEventsInvitePanel) {
        peopleEventsInvitePanel.hidden = !peopleEventsState.inviteReady;
      }

      peopleEventsInvitePersonButtons.forEach((personButton) => {
        const personId = personButton.dataset.eventsInvitePerson;

        const isInvited = peopleEventsState.invitedPeople[personId] === true;

        const invitationState = personButton.querySelector(
          ".people-events-invite-state",
        );

        personButton.classList.toggle("is-invited", isInvited);

        personButton.setAttribute("aria-pressed", String(isInvited));

        if (invitationState) {
          invitationState.textContent = isInvited ? "Invited" : "Invite";
        }
      });
    }

    /* =====================================================
       EVENTS: COMPLETE RENDER
    ===================================================== */

    function renderPeopleEventsState() {
      renderPeopleEventsFeatured();
      renderPeopleEventsCards();
      renderPeopleEventsFilter();
      renderPeopleEventsInvitation();
    }

    /* =====================================================
       EVENTS: CHANGE ATTENDANCE STATE
    ===================================================== */

    function setPeopleEventState(eventId, nextState, eventName) {
      const currentState = peopleEventsState.eventStates[eventId] || "none";

      const finalState = currentState === nextState ? "none" : nextState;

      peopleEventsState.eventStates[eventId] = finalState;

      savePeopleEventsState();
      renderPeopleEventsState();

      if (finalState === "going") {
        updatePeopleEventsStatus(`You’re going to ${eventName}.`);

        return;
      }

      if (finalState === "interested") {
        updatePeopleEventsStatus(
          `${eventName} was saved to your interested events.`,
        );

        return;
      }

      updatePeopleEventsStatus(`${eventName} was removed from your events.`);
    }

    /* =====================================================
       EVENTS: FEATURED ACTIONS
    ===================================================== */

    peopleEventsFeaturedGoingButton?.addEventListener("click", () => {
      setPeopleEventState(
        "industry-night",
        "going",
        "Industry Night at The Get Down",
      );
    });

    peopleEventsFeaturedInterestedButton?.addEventListener("click", () => {
      setPeopleEventState(
        "industry-night",
        "interested",
        "Industry Night at The Get Down",
      );
    });

    /* =====================================================
       EVENTS: CARD ACTIONS
    ===================================================== */

    peopleEventsCards.forEach((eventCard) => {
      const eventId = eventCard.dataset.eventId;

      const eventName =
        eventCard.querySelector("h3")?.textContent.trim() || "This event";

      const goingButton = eventCard.querySelector("[data-events-going]");

      const interestedButton = eventCard.querySelector(
        "[data-events-interested]",
      );

      goingButton?.addEventListener("click", () => {
        setPeopleEventState(eventId, "going", eventName);
      });

      interestedButton?.addEventListener("click", () => {
        setPeopleEventState(eventId, "interested", eventName);
      });
    });

    /* =====================================================
       EVENTS: FILTER ACTIONS
    ===================================================== */

    peopleEventsFilterButtons.forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        const selectedFilter = filterButton.dataset.eventsFilter;

        peopleEventsState.selectedFilter = selectedFilter;

        savePeopleEventsState();
        renderPeopleEventsFilter();

        const visibleEventCount = [...peopleEventsCards].filter(
          (eventCard) => !eventCard.hidden,
        ).length;

        updatePeopleEventsStatus(
          selectedFilter === "all"
            ? "Showing all events."
            : `Showing ${visibleEventCount} ${selectedFilter} event${
                visibleEventCount === 1 ? "" : "s"
              }.`,
        );
      });
    });

    /* =====================================================
       EVENTS: INVITE ACTION
    ===================================================== */

    peopleEventsInviteButton?.addEventListener("click", () => {
      peopleEventsState.inviteReady = !peopleEventsState.inviteReady;

      savePeopleEventsState();
      renderPeopleEventsInvitation();

      updatePeopleEventsStatus(
        peopleEventsState.inviteReady
          ? "Choose someone from your Loop to invite to Industry Night."
          : "The Loop invitation was closed.",
      );
    });

    /* =====================================================
   EVENTS: CLOSE INVITATION PANEL
===================================================== */

    peopleEventsInviteCloseButton?.addEventListener("click", () => {
      peopleEventsState.inviteReady = false;

      savePeopleEventsState();
      renderPeopleEventsInvitation();

      updatePeopleEventsStatus("The invitation panel was closed.");
    });

    /* =====================================================
   EVENTS: INVITE PEOPLE FROM MY LOOP
===================================================== */

    peopleEventsInvitePersonButtons.forEach((personButton) => {
      personButton.addEventListener("click", () => {
        const personId = personButton.dataset.eventsInvitePerson;

        const personName =
          personButton.querySelector("strong")?.textContent.trim() ||
          "This person";

        const isCurrentlyInvited =
          peopleEventsState.invitedPeople[personId] === true;

        peopleEventsState.invitedPeople[personId] = !isCurrentlyInvited;

        savePeopleEventsState();
        renderPeopleEventsInvitation();

        updatePeopleEventsStatus(
          isCurrentlyInvited
            ? `${personName} was removed from the invitation.`
            : `${personName} was invited to Industry Night.`,
        );
      });
    });

    /* =====================================================
       EVENTS: INITIALIZE
    ===================================================== */

    const peopleEventsState = loadPeopleEventsState();

    renderPeopleEventsState();
  }
}

/* =========================================================
   PEOPLE VIEW: EVENTS — END
========================================================= */

/* =========================================================
   INDUSTRY — NEARBY EXPLORATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     NEARBY: SELECTORS
  ======================================================= */

  const nearbyOffState = document.querySelector(
    "[data-nearby-off-state]",
  );

  const nearbyActiveState = document.querySelector(
    "[data-nearby-active-state]",
  );

  const audienceButtons = document.querySelectorAll(
    "[data-nearby-audience]",
  );

  const socialStatusButtons = document.querySelectorAll(
    "[data-nearby-social-status]",
  );

  const durationButtons = document.querySelectorAll(
    "[data-nearby-duration]",
  );

  const startNearbyButton = document.querySelector(
    "[data-start-nearby]",
  );

  const stopNearbyButton = document.querySelector(
    "[data-stop-nearby]",
  );

  const setupSummary = document.querySelector(
    "[data-nearby-setup-summary]",
  );

  const activeAudience = document.querySelector(
    "[data-active-audience]",
  );

  const activeStatus = document.querySelector(
    "[data-active-status]",
  );

  const activeExpiration = document.querySelector(
    "[data-active-expiration]",
  );

  const nearbyStatusMessage = document.querySelector(
    "[data-nearby-status-message]",
  );

  const messageButtons = document.querySelectorAll(
    "[data-nearby-message]",
  );

  const viewNearbyEventButton = document.querySelector(
    "[data-view-nearby-event]",
  );

  /* =======================================================
     NEARBY: LABELS
  ======================================================= */

  const audienceLabels = {
    hidden: "Hidden",
    "my-loop": "My Loop",
    "same-event": "People attending the same event",
  };

  const statusLabels = {
    coffee: "Open to coffee",
    "heading-out": "Heading out after work",
    "industry-event": "At an Industry event",
    "meeting-people": "Open to meeting people",
    browsing: "Just browsing",
  };

  const durationLabels = {
    "30-minutes": "30 minutes",
    "1-hour": "1 hour",
    "this-evening": "This evening",
    "until-stopped": "Until you turn it off",
  };

  const expirationLabels = {
    "30-minutes": "In 30 minutes",
    "1-hour": "In 1 hour",
    "this-evening": "At the end of this evening",
    "until-stopped": "When you turn it off",
  };

  const nearbyPeopleNames = {
    "jordan-reed": "Jordan Reed",
    "maya-chen": "Maya Chen",
  };

  /* =======================================================
     NEARBY: LOCAL STATE
  ======================================================= */

  const nearbyState = {
    audience: "hidden",
    socialStatus: null,
    duration: null,
    isSharing: false,
  };

  /* =======================================================
     NEARBY: STATUS MESSAGE
  ======================================================= */

  function updateNearbyStatus(message) {
    if (!nearbyStatusMessage) return;

    nearbyStatusMessage.textContent = message;
  }

  /* =======================================================
     NEARBY: BUTTON GROUP RENDERER
  ======================================================= */

  function renderSelectedButtons(
    buttons,
    selectedValue,
    datasetKey,
  ) {
    buttons.forEach((button) => {
      const isSelected =
        button.dataset[datasetKey] === selectedValue;

      button.classList.toggle("active", isSelected);

      button.setAttribute(
        "aria-pressed",
        String(isSelected),
      );
    });
  }

  /* =======================================================
     NEARBY: SETUP COMPLETION
  ======================================================= */

  function isNearbySetupComplete() {
    return (
      nearbyState.audience !== "hidden" &&
      nearbyState.socialStatus !== null &&
      nearbyState.duration !== null
    );
  }

  /* =======================================================
     NEARBY: SETUP SUMMARY
  ======================================================= */

  function renderNearbySetupSummary() {
    const hasAudience =
      nearbyState.audience !== "hidden";

    const hasStatus =
      nearbyState.socialStatus !== null;

    const hasDuration =
      nearbyState.duration !== null;

    if (startNearbyButton) {
      startNearbyButton.disabled =
        !isNearbySetupComplete();
    }

    if (!setupSummary) return;

    if (!hasAudience) {
      setupSummary.textContent =
        "Choose who can see you.";

      return;
    }

    if (!hasStatus) {
      setupSummary.textContent =
        `${audienceLabels[nearbyState.audience]} selected. Choose what you are open to.`;

      return;
    }

    if (!hasDuration) {
      setupSummary.textContent =
        `${statusLabels[nearbyState.socialStatus]} selected. Choose how long sharing should last.`;

      return;
    }

    setupSummary.textContent =
      `${audienceLabels[nearbyState.audience]} · ` +
      `${statusLabels[nearbyState.socialStatus]} · ` +
      `${durationLabels[nearbyState.duration]}`;
  }

  /* =======================================================
     NEARBY: ACTIVE SUMMARY
  ======================================================= */

  function renderNearbyActiveSummary() {
    if (activeAudience) {
      activeAudience.textContent =
        audienceLabels[nearbyState.audience];
    }

    if (activeStatus) {
      activeStatus.textContent =
        statusLabels[nearbyState.socialStatus];
    }

    if (activeExpiration) {
      activeExpiration.textContent =
        expirationLabels[nearbyState.duration];
    }
  }

  /* =======================================================
     NEARBY: COMPLETE OFF-STATE RENDER
  ======================================================= */

  function renderNearbySetup() {
    renderSelectedButtons(
      audienceButtons,
      nearbyState.audience,
      "nearbyAudience",
    );

    renderSelectedButtons(
      socialStatusButtons,
      nearbyState.socialStatus,
      "nearbySocialStatus",
    );

    renderSelectedButtons(
      durationButtons,
      nearbyState.duration,
      "nearbyDuration",
    );

    renderNearbySetupSummary();
  }

  /* =======================================================
     NEARBY: AUDIENCE ACTIONS
  ======================================================= */

  audienceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      nearbyState.audience =
        button.dataset.nearbyAudience;

      renderNearbySetup();

      if (nearbyState.audience === "hidden") {
        updateNearbyStatus(
          "You remain hidden. Nothing is being shared.",
        );

        return;
      }

      updateNearbyStatus(
        `${audienceLabels[nearbyState.audience]} can see your approximate area once sharing begins.`,
      );
    });
  });

  /* =======================================================
     NEARBY: SOCIAL STATUS ACTIONS
  ======================================================= */

  socialStatusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedStatus =
        button.dataset.nearbySocialStatus;

      nearbyState.socialStatus =
        nearbyState.socialStatus === selectedStatus
          ? null
          : selectedStatus;

      renderNearbySetup();

      if (!nearbyState.socialStatus) {
        updateNearbyStatus(
          "Your Nearby activity was cleared.",
        );

        return;
      }

      updateNearbyStatus(
        `${statusLabels[nearbyState.socialStatus]} selected.`,
      );
    });
  });

  /* =======================================================
     NEARBY: DURATION ACTIONS
  ======================================================= */

  durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedDuration =
        button.dataset.nearbyDuration;

      nearbyState.duration =
        nearbyState.duration === selectedDuration
          ? null
          : selectedDuration;

      renderNearbySetup();

      if (!nearbyState.duration) {
        updateNearbyStatus(
          "The sharing duration was cleared.",
        );

        return;
      }

      updateNearbyStatus(
        `${durationLabels[nearbyState.duration]} selected.`,
      );
    });
  });

  /* =======================================================
     NEARBY: START SHARING
  ======================================================= */

  startNearbyButton?.addEventListener(
    "click",
    () => {
      if (!isNearbySetupComplete()) return;

      nearbyState.isSharing = true;

      renderNearbyActiveSummary();

      if (nearbyOffState) {
        nearbyOffState.hidden = true;
      }

      if (nearbyActiveState) {
        nearbyActiveState.hidden = false;

        nearbyActiveState.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      updateNearbyStatus(
        `Nearby is active. You are visible to ${
          audienceLabels[nearbyState.audience]
        } until ${
          expirationLabels[
            nearbyState.duration
          ].toLowerCase()
        }.`,
      );
    },
  );

  /* =======================================================
     NEARBY: STOP SHARING
  ======================================================= */

  stopNearbyButton?.addEventListener(
    "click",
    () => {
      nearbyState.audience = "hidden";
      nearbyState.socialStatus = null;
      nearbyState.duration = null;
      nearbyState.isSharing = false;

      if (nearbyActiveState) {
        nearbyActiveState.hidden = true;
      }

      if (nearbyOffState) {
        nearbyOffState.hidden = false;

        nearbyOffState.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      renderNearbySetup();

      updateNearbyStatus(
        "Nearby is off. Nothing is being shared.",
      );
    },
  );

  /* =======================================================
     NEARBY: MESSAGE ACTIONS
  ======================================================= */

  messageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const personId =
        button.dataset.nearbyMessage;

      const personName =
        nearbyPeopleNames[personId] ||
        "This person";

      button.textContent = "Message ready";
      button.classList.add("active");

      updateNearbyStatus(
        `A message to ${personName} is ready to begin.`,
      );
    });
  });

  /* =======================================================
     NEARBY: VIEW EVENT ACTION
  ======================================================= */

  viewNearbyEventButton?.addEventListener(
    "click",
    () => {
      viewNearbyEventButton.textContent =
        "Opening event…";

      updateNearbyStatus(
        "Opening Sober Industry Coffee in Events.",
      );

      window.setTimeout(() => {
        viewNearbyEventButton.textContent =
          "View event";
      }, 900);
    },
  );

  /* =======================================================
     NEARBY: INITIALIZE
  ======================================================= */

  renderNearbySetup();
});
