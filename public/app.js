// ---------------- BASIC BUTTON / NAV ELEMENTS ---------------- //
let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");
let signoutbtn = document.querySelector("#signoutbtn");
let userEmailDisplay = document.querySelector("#userEmail");

// --------- ADMIN CONFIG (PUT YOUR EMAIL HERE) --------- //
// Use your REAL email(s) that you log in with
const adminEmails = ["admin@gmail.com", "admin2@gmail.com"].map((e) =>
  e.toLowerCase()
);

let isCurrentUserAdmin = false;

// -------------------------- MODALS -------------------------- //
const smodal = document.querySelector("#smodal");
const smodal2 = document.querySelector("#smodal2");
const modalbg = document.querySelector("#modalbg");
const modalbg2 = document.querySelector("#modalbg2");

//---------------------------------- SIGN UP (OPEN MODAL) ----------------------------------//
if (signupbtn && smodal) {
  signupbtn.addEventListener("click", () => {
    smodal.classList.add("is-active");
  });
}

//---------------------------------- SIGN IN (OPEN MODAL) ----------------------------------//
if (signinbtn && smodal2) {
  signinbtn.addEventListener("click", () => {
    smodal2.classList.add("is-active");
  });
}

//---------------------------- HIDE MODALS ------------------------------------//
if (modalbg && smodal) {
  modalbg.addEventListener("click", () => {
    smodal.classList.remove("is-active");
  });
}
if (modalbg2 && smodal2) {
  modalbg2.addEventListener("click", () => {
    smodal2.classList.remove("is-active");
  });
}

//--------------------------- SIGN UP FORM SUBMIT -----------------------------//
const signUpForm = document.querySelector("#sign_up_form");
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_email = document.querySelector("#sign_email").value.trim();
    let user_pass = document.querySelector("#sign_pass").value;

    auth
      .createUserWithEmailAndPassword(user_email, user_pass)
      .then(() => {
        console.log("Sign-up successful for:", user_email);
        if (smodal) smodal.classList.remove("is-active");
        signUpForm.reset();
        alert("Welcome! We are glad you joined us!");
      })
      .catch((error) => {
        console.error("Sign-up error:", error);
        alert("Sign-up error: " + error.message);
      });
  });
}

//--------------------------- SIGN IN FORM SUBMIT -----------------------------//
const signInForm = document.querySelector("#sign_in_form");
if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_email = document.querySelector("#sign_in_email").value.trim();
    let user_pass = document.querySelector("#sign_in_pass").value;

    auth
      .signInWithEmailAndPassword(user_email, user_pass)
      .then(() => {
        console.log("Sign-in successful for:", user_email);
        if (smodal2) smodal2.classList.remove("is-active");
        signInForm.reset();
        alert("Welcome Back!");
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        alert("Sign-in error: " + error.message);
      });
  });
}

//----------------------------- SIGN OUT BUTTON -------------------------------//
if (signoutbtn) {
  signoutbtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        alert("You've securely logged out, see you next time!");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
        alert("Sign-out error: " + error.message);
      });
  });
}

// ------------------------ AUTH STATE LISTENER ------------------------------- //
const adminPanelAbout = document.querySelector("#adminPanelAbout");
const adminPanelGallery = document.querySelector("#adminPanelGallery");

auth.onAuthStateChanged((user) => {
  console.log("Auth state changed. User:", user);

  if (user) {
    const userEmail = (user.email || "").toLowerCase();
    console.log("Signed in as:", userEmail);

    // Show correct auth buttons
    if (signinbtn) signinbtn.classList.add("is-hidden");
    if (signupbtn) signupbtn.classList.add("is-hidden");
    if (signoutbtn) signoutbtn.classList.remove("is-hidden");

    // Show user email in navbar
    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email;
      userEmailDisplay.classList.remove("is-hidden");
    }

    // Check admin
    isCurrentUserAdmin = adminEmails.includes(userEmail);
    console.log("Is current user admin?", isCurrentUserAdmin);

    // Toggle admin panels
    if (adminPanelAbout) {
      if (isCurrentUserAdmin) {
        adminPanelAbout.classList.remove("is-hidden");
      } else {
        adminPanelAbout.classList.add("is-hidden");
      }
    }

    if (adminPanelGallery) {
      if (isCurrentUserAdmin) {
        adminPanelGallery.classList.remove("is-hidden");
      } else {
        adminPanelGallery.classList.add("is-hidden");
      }
    }
  } else {
    console.log("No user signed in");

    // User is signed out
    if (signinbtn) signinbtn.classList.remove("is-hidden");
    if (signupbtn) signupbtn.classList.remove("is-hidden");
    if (signoutbtn) signoutbtn.classList.add("is-hidden");

    if (userEmailDisplay) {
      userEmailDisplay.textContent = "";
      userEmailDisplay.classList.add("is-hidden");
    }

    isCurrentUserAdmin = false;

    if (adminPanelAbout) adminPanelAbout.classList.add("is-hidden");
    if (adminPanelGallery) adminPanelGallery.classList.add("is-hidden");
  }

  // Load data (public + admin if present) on any auth state change
  loadPerformances();
  loadAuditions();
  loadGalleryItems();
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
        console.error("Contact form error:", error);
        alert("Error sending message: " + error.message);
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
        console.error("Newsletter error:", error);
        alert("Error signing up: " + error.message);
      });
  });
}

/* ===================== ADMIN: PERFORMANCES & AUDITIONS ===================== */

// Add performance (About page admin form)
const addPerfForm = document.querySelector("#add_performance_form");
if (addPerfForm) {
  addPerfForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#perf_title").value;
    const date = document.querySelector("#perf_date").value;
    const time = document.querySelector("#perf_time").value;
    const location = document.querySelector("#perf_location").value;
    const description = document.querySelector("#perf_desc").value;

    db.collection("performances")
      .add({
        title,
        date,
        time,
        location,
        description,
      })
      .then(() => {
        alert("Performance added!");
        addPerfForm.reset();
      })
      .catch((err) => {
        console.error("Add performance error:", err);
        alert("Error adding performance: " + err.message);
      });
  });
}

// Add audition (About page admin form)
const addAudForm = document.querySelector("#add_audition_form");
if (addAudForm) {
  addAudForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const season = document.querySelector("#aud_season").value;
    const date = document.querySelector("#aud_date").value;
    const time = document.querySelector("#aud_time").value;
    const location = document.querySelector("#aud_location").value;
    const requirements = document.querySelector("#aud_requirements").value;

    db.collection("auditions")
      .add({
        season,
        date,
        time,
        location,
        requirements,
      })
      .then(() => {
        alert("Audition added!");
        addAudForm.reset();
      })
      .catch((err) => {
        console.error("Add audition error:", err);
        alert("Error adding audition: " + err.message);
      });
  });
}

// Load performances (public + admin) - CARD VIEW
function loadPerformances() {
  const publicContainer = document.querySelector("#public_performances");
  const adminContainer = document.querySelector("#perf_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("performances")
    .orderBy("date")
    .onSnapshot(
      (snapshot) => {
        if (publicContainer) publicContainer.innerHTML = "";
        if (adminContainer) adminContainer.innerHTML = "";

        if (snapshot.empty) {
          if (publicContainer) {
            publicContainer.innerHTML =
              "<p>No upcoming performances right now.</p>";
          }
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          const title = data.title || "Untitled Performance";
          const date = data.date || "";
          const time = data.time || "";
          const location = data.location || "";
          const description = data.description || "";

          // ----- PUBLIC CARD VIEW -----
          if (publicContainer) {
            const col = document.createElement("div");
            col.classList.add("column", "is-half");

            col.innerHTML = `
              <div class="card has-background-grey-darker has-text-white mb-4">
                <div class="card-content">
                  <p class="title is-4 has-text-white">${title}</p>
                  <p class="subtitle is-6 has-text-grey-light">
                    ${date} @ ${time} — ${location}
                  </p>
                  <p>${description}</p>
                </div>
              </div>
            `;

            publicContainer.appendChild(col);
          }

          // ----- ADMIN VIEW -----
          if (adminContainer) {
            const div = document.createElement("div");
            div.classList.add("mb-3");

            let html = `
              <p><strong>${title}</strong></p>
              <p>${date} ${time} @ ${location}</p>
              <p>${description}</p>
            `;

            if (isCurrentUserAdmin) {
              html += `<button class="button is-small is-danger" data-id="${doc.id}">Delete</button>`;
            }

            html += "<hr />";
            div.innerHTML = html;
            adminContainer.appendChild(div);
          }
        });

        // delete buttons for admin
        if (adminContainer && isCurrentUserAdmin) {
          const deleteButtons =
            adminContainer.querySelectorAll("button[data-id]");
          deleteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-id");
              db.collection("performances")
                .doc(id)
                .delete()
                .then(() => alert("Performance deleted."))
                .catch((err) => {
                  console.error("Delete performance error:", err);
                  alert("Error deleting performance: " + err.message);
                });
            });
          });
        }
      },
      (error) => {
        console.error("loadPerformances snapshot error:", error);
      }
    );
}

// Load auditions (public + admin) - CARD VIEW
function loadAuditions() {
  const publicContainer = document.querySelector("#public_auditions");
  const adminContainer = document.querySelector("#aud_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("auditions")
    .orderBy("date")
    .onSnapshot(
      (snapshot) => {
        if (publicContainer) publicContainer.innerHTML = "";
        if (adminContainer) adminContainer.innerHTML = "";

        if (snapshot.empty) {
          if (publicContainer) {
            publicContainer.innerHTML =
              "<p>No upcoming auditions right now.</p>";
          }
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          const season = data.season || "Upcoming Audition";
          const date = data.date || "";
          const time = data.time || "";
          const location = data.location || "";
          const requirements = data.requirements || "";

          // ----- PUBLIC CARD VIEW -----
          if (publicContainer) {
            const col = document.createElement("div");
            col.classList.add("column", "is-half");

            col.innerHTML = `
              <div class="card has-background-grey-darker has-text-white mb-4">
                <div class="card-content">
                  <p class="title is-4 has-text-white">${season}</p>
                  <p class="subtitle is-6 has-text-grey-light">
                    ${date} @ ${time} — ${location}
                  </p>
                  <p>${requirements}</p>
                </div>
              </div>
            `;

            publicContainer.appendChild(col);
          }

          // ----- ADMIN VIEW -----
          if (adminContainer) {
            const div = document.createElement("div");
            div.classList.add("mb-3");

            let html = `
              <p><strong>${season}</strong></p>
              <p>${date} ${time} @ ${location}</p>
              <p>${requirements}</p>
            `;

            if (isCurrentUserAdmin) {
              html += `<button class="button is-small is-danger" data-id="${doc.id}">Delete</button>`;
            }

            html += "<hr />";
            div.innerHTML = html;
            adminContainer.appendChild(div);
          }
        });

        if (adminContainer && isCurrentUserAdmin) {
          const deleteButtons =
            adminContainer.querySelectorAll("button[data-id]");
          deleteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-id");
              db.collection("auditions")
                .doc(id)
                .delete()
                .then(() => alert("Audition deleted."))
                .catch((err) => {
                  console.error("Delete audition error:", err);
                  alert("Error deleting audition: " + err.message);
                });
            });
          });
        }
      },
      (error) => {
        console.error("loadAuditions snapshot error:", error);
      }
    );
}

/* ===================== ADMIN: GALLERY ITEMS ===================== */

// Add gallery item (Gallery page admin form)
const addGalleryForm = document.querySelector("#add_gallery_item_form");
if (addGalleryForm) {
  addGalleryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.querySelector("#gallery_type").value; // image or video
    const title = document.querySelector("#gallery_title").value;
    const url = document.querySelector("#gallery_url").value;
    const thumb = document.querySelector("#gallery_thumb").value;
    const desc = document.querySelector("#gallery_desc").value;

    db.collection("galleryItems")
      .add({
        type,
        title,
        url,
        thumbnailUrl: thumb,
        description: desc,
      })
      .then(() => {
        alert("Gallery item added!");
        addGalleryForm.reset();
      })
      .catch((err) => {
        console.error("Add gallery error:", err);
        alert("Error adding gallery item: " + err.message);
      });
  });
}

// Load gallery items (public + admin)
function loadGalleryItems() {
  const publicContainer = document.querySelector("#gallery_public_list");
  const adminContainer = document.querySelector("#gallery_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("galleryItems")
    .orderBy("title")
    .onSnapshot(
      (snapshot) => {
        if (publicContainer) publicContainer.innerHTML = "";
        if (adminContainer) adminContainer.innerHTML = "";

        if (snapshot.empty) {
          if (publicContainer) {
            publicContainer.innerHTML = "<p>No gallery items yet.</p>";
          }
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();

          const type = data.type || "image";
          const title = data.title || "Gallery Item";
          const url = data.url || "";
          const thumb = data.thumbnailUrl || data.url || "";
          const desc = data.description || "";

          // Public view
          if (publicContainer) {
            const col = document.createElement("div");
            col.classList.add("column", "is-one-third");

            let mediaHtml = "";

            if (type === "video") {
              mediaHtml = `
                <div class="video">
                  <iframe src="${url}" frameborder="0" allowfullscreen style="width:100%;height:200px;"></iframe>
                </div>`;
            } else {
              mediaHtml = `
                <figure class="image">
                  <img src="${thumb}" alt="${title}">
                </figure>`;
            }

            col.innerHTML = `
              <div class="card has-background-grey-darker has-text-white">
                <div class="card-image">
                  ${mediaHtml}
                </div>
                <div class="card-content">
                  <p class="title is-5 has-text-white">${title}</p>
                  <p class="has-text-grey-light">${desc}</p>
                </div>
              </div>
            `;

            publicContainer.appendChild(col);
          }

          // Admin view
          if (adminContainer) {
            const div = document.createElement("div");
            div.classList.add("mb-3");

            let html = `
              <p><strong>${title}</strong> (${type})</p>
              <p>${url}</p>
              <p>${desc}</p>
            `;

            if (isCurrentUserAdmin) {
              html += `<button class="button is-small is-danger" data-id="${doc.id}">Delete</button>`;
            }

            html += "<hr />";
            div.innerHTML = html;
            adminContainer.appendChild(div);
          }
        });

        if (adminContainer && isCurrentUserAdmin) {
          const deleteButtons =
            adminContainer.querySelectorAll("button[data-id]");
          deleteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-id");
              db.collection("galleryItems")
                .doc(id)
                .delete()
                .then(() => alert("Gallery item deleted."))
                .catch((err) => {
                  console.error("Delete gallery error:", err);
                  alert("Error deleting gallery item: " + err.message);
                });
            });
          });
        }
      },
      (error) => {
        console.error("loadGalleryItems snapshot error:", error);
      }
    );
}
