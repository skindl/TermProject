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
  const eventButtons = document.querySelectorAll(".add-delete-btn");
  if (user) {
    // User is signed in
    signinbtn.classList.add("is-hidden");
    signupbtn.classList.add("is-hidden");
    signoutbtn.classList.remove("is-hidden");

    // Show user email
    userEmailDisplay.textContent = user.email;
    userEmailDisplay.classList.remove("is-hidden");

    // Show event buttons
    document.querySelector("#userEventsSection").classList.remove("is-hidden");

    // render saved events
    renderUserEvents(user.uid);
  } else {
    // User is signed out
    signinbtn.classList.remove("is-hidden");
    signupbtn.classList.remove("is-hidden");
    signoutbtn.classList.add("is-hidden");

    // Hide user email
    userEmailDisplay.textContent = "";
    userEmailDisplay.classList.add("is-hidden");

    // Hide event buttons
    eventButtons.forEach((btn) => btn.classList.add("is-hidden"));

    // hide user events section
    document.querySelector("#userEventsSection").classList.add("is-hidden");

    document.querySelector("#userEventCards").innerHTML = "";
  }
});

// add event buttons
document.querySelectorAll(".add-delete-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest("[data-event-id]");
    const eventId = card.getAttribute("data-event-id");

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to save events.");
      return;
    }

    const eventInfo = eventData[eventId];

    if (!eventInfo) return;

    // Save event under this user in Firestore
    db.collection("users")
      .doc(user.uid)
      .collection("myEvents")
      .doc(eventId)
      .set(eventInfo)
      .then(() => {
        renderUserEvents(user.uid);
      });
  });
});

// put added event info in cards in separate section
function renderUserEvents(uid) {
  const container = document.querySelector("#userEventCards");

  db.collection("users")
    .doc(uid)
    .collection("myEvents")
    .get()
    .then((snapshot) => {
      container.innerHTML = ""; // clear old cards

      snapshot.forEach((doc) => {
        const ev = doc.data();

        const card = document.createElement("div");
        card.classList.add(
          "card",
          "has-background-black-ter",
          "has-text-white",
          "mb-4"
        );

        card.innerHTML = `
          <div class="card-content">
            <p class="title is-5 has-text-white">${ev.title}</p>
            <p class="subtitle is-6 has-text-grey-light">Date: ${ev.date}</p>
            ${
              ev.time
                ? `<p class="subtitle is-6 has-text-grey-light">Time: ${ev.time}</p>`
                : ""
            }
            ${
              ev.location
                ? `<p class="subtitle is-6 has-text-grey-light">Location: ${ev.location}</p>`
                : ""
            }

            <button class="button is-danger mt-3 delete-event-btn" data-id="${
              doc.id
            }">
              Delete Event
            </button>
          </div>
        `;

        container.appendChild(card);
      });

      // enable delete buttons
      enableDeleteButtons(uid);
    });
}

function enableDeleteButtons(uid) {
  document.querySelectorAll(".delete-event-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const eventId = btn.getAttribute("data-id");

      db.collection("users")
        .doc(uid)
        .collection("myEvents")
        .doc(eventId)
        .delete()
        .then(() => renderUserEvents(uid));
    });
  });
}

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
