let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");
let signoutbtn = document.querySelector("#signoutbtn");
let userEmailDisplay = document.querySelector("#userEmail");

//---------------------------------- SIGN UP ----------------------------------//
signupbtn.addEventListener("click", () => {
  document.querySelector("#smodal").classList.add("is-active");
});

//---------------------------------- SIGN IN ----------------------------------//
signinbtn.addEventListener("click", () => {
  document.querySelector("#smodal2").classList.add("is-active");
});

//---------------------------- HIDE MODALS ------------------------------------//
document.querySelector("#modalbg").addEventListener("click", () => {
  document.querySelector("#smodal").classList.remove("is-active");
});
document.querySelector("#modalbg2").addEventListener("click", () => {
  document.querySelector("#smodal2").classList.remove("is-active");
});

//--------------------------- SIGN UP FORM SUBMIT -----------------------------//
document.querySelector("#sign_up_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let user_email = document.querySelector("#sign_email").value;
  let user_pass = document.querySelector("#sign_pass").value;

  auth
    .createUserWithEmailAndPassword(user_email, user_pass)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      // Create Firestore user document
      return db.collection("users").doc(uid).set({
        email: user_email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => {
      document.querySelector("#smodal").classList.remove("is-active");
      document.querySelector("#sign_up_form").reset();
      alert("Welcome! We are glad you joined us!");
    })
    .catch((error) => {
      alert(error.message);
    });
});

//--------------------------- SIGN IN FORM SUBMIT -----------------------------//
document.querySelector("#sign_in_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let user_email = document.querySelector("#sign_in_email").value;
  let user_pass = document.querySelector("#sign_in_pass").value;

  auth
    .signInWithEmailAndPassword(user_email, user_pass)
    .then(() => {
      document.querySelector("#smodal2").classList.remove("is-active");
      document.querySelector("#sign_in_form").reset();
      alert("Welcome Back!");
    })
    .catch(() => {
      alert("Incorrect login!");
    });
});

//----------------------------- SIGN OUT BUTTON -------------------------------//
signoutbtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("You've securely logged out, see you next time!");
  });
});

//------------------------ AUTH STATE LISTENER -------------------------------//
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    signinbtn.classList.add("is-hidden");
    signupbtn.classList.add("is-hidden");
    signoutbtn.classList.remove("is-hidden");

    // Show user email
    userEmailDisplay.textContent = user.email;
    userEmailDisplay.classList.remove("is-hidden");
  } else {
    // User is signed out
    signinbtn.classList.remove("is-hidden");
    signupbtn.classList.remove("is-hidden");
    signoutbtn.classList.add("is-hidden");

    // Hide user email
    userEmailDisplay.textContent = "";
    userEmailDisplay.classList.add("is-hidden");
  }
});

// ---------------- CONTACT FORM SUBMISSION ---------------- //
const contactForm = document.querySelector("#contact_form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.querySelector("#contact_name").value;
    let email = document.querySelector("#contact_email").value;
    let message = document.querySelector("#contact_message").value;

    db.collection("contactMessages")
      .add({
        name: name,
        email: email,
        message: message,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Thanks! Your message has been sent.");
        contactForm.reset();
      })
      .catch((error) => {
        alert("Error sending message: " + error);
      });
  });
}

// ---------------- NEWSLETTER SIGNUP ---------------- //
const newsletterForm = document.querySelector("#newsletter_form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.querySelector("#newsletter_email").value;

    db.collection("newsletterSubscribers")
      .add({
        email: email,
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Thanks for signing up for our newsletter!");
        newsletterForm.reset();
      })
      .catch((error) => {
        alert("Error signing up: " + error);
      });
  });
}

// add/delete users' events after signed in
const userEventsSection = document.getElementById("userEventsSection");
const showEventSelectBtn = document.getElementById("showEventSelectBtn");
const eventSelectBox = document.getElementById("eventSelectBox");
const eventSelect = document.getElementById("eventSelect");
const addEventBtn = document.getElementById("addEventBtn");
const userEventCards = document.getElementById("userEventCards");

const db = firebase.firestore();

showEventSelectBtn.addEventListener("click", () => {
  eventSelectBox.classList.toggle("is-hidden");
});

auth.onAuthStateChanged(async (user) => {
  if (user) {
    userEventsSection.classList.remove("is-hidden");
    loadEventOptions();
    loadUserEvents(user.uid);
  } else {
    userEventsSection.classList.add("is-hidden");
  }
});

// new code:
// Reference to Firestore
const db = firebase.firestore();

// Get all built-in event cards
const eventCards = document.querySelectorAll("[data-event-id]");

auth.onAuthStateChanged(async (user) => {
  if (user) {
    userEventsSection.classList.remove("is-hidden");

    // Load their currently selected events
    const userEventIDs = await loadUserEvents(user.uid);

    // Update all "Add/Delete" buttons
    eventCards.forEach((card) => {
      const eventId = card.dataset.eventId;
      const btn = card.querySelector(".add-delete-btn");

      if (userEventIDs.includes(eventId)) {
        btn.textContent = "Delete Event";
        btn.classList.remove("is-link");
        btn.classList.add("is-danger");
      } else {
        btn.textContent = "Add Event";
        btn.classList.add("is-link");
        btn.classList.remove("is-danger");
      }

      // Add click handler
      btn.onclick = () => toggleEvent(user.uid, card);
    });
  } else {
    userEventsSection.classList.add("is-hidden");
    userEventCards.innerHTML = ""; // clear section
  }
});

// Load user's saved events from Firestore
async function loadUserEvents(uid) {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("events")
    .get();

  const events = snapshot.docs.map((doc) => doc.id);

  renderUserEvents(snapshot.docs.map((doc) => doc.data()));

  return events;
}

// Adds or deletes event
async function toggleEvent(uid, card) {
  const eventId = card.dataset.eventId;
  const btn = card.querySelector(".add-delete-btn");

  const eventData = {
    id: eventId,
    title: card.querySelector(".title").textContent,
    date: card.querySelectorAll(".subtitle")[0]?.textContent || "",
    time: card.querySelectorAll(".subtitle")[1]?.textContent || "",
  };

  if (btn.textContent === "Add Event") {
    // Add to Firebase
    await db
      .collection("users")
      .doc(uid)
      .collection("events")
      .doc(eventId)
      .set(eventData);

    btn.textContent = "Delete Event";
    btn.classList.remove("is-link");
    btn.classList.add("is-danger");
  } else {
    // Remove from Firebase
    await db
      .collection("users")
      .doc(uid)
      .collection("events")
      .doc(eventId)
      .delete();

    btn.textContent = "Add Event";
    btn.classList.add("is-link");
    btn.classList.remove("is-danger");
  }

  // Refresh user event cards
  loadUserEvents(uid);
}

// Render cards in the "My Events" section
function renderUserEvents(events) {
  userEventCards.innerHTML = "";

  events.forEach((event) => {
    const html = `
      <div class="box has-background-grey-darker has-text-white mb-3">
        <p class="title is-5">${event.title}</p>
        <p>${event.date}</p>
        <p>${event.time}</p>
      </div>
    `;
    userEventCards.innerHTML += html;
  });
}
