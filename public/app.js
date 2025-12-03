let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");
let signoutbtn = document.querySelector("#signoutbtn");
let userEmailDisplay = document.querySelector("#userEmail");

// --------- ADMIN CONFIG (PUT YOUR EMAIL HERE) --------- //
const adminEmails = ["admin@gmail.com", "kasper.dancecrew@gmail.com"];

let isCurrentUserAdmin = false;

//---------------------------------- SIGN UP ----------------------------------//
if (signupbtn) {
  signupbtn.addEventListener("click", () => {
    document.querySelector("#smodal").classList.add("is-active");
  });
}

//---------------------------------- SIGN IN ----------------------------------//
if (signinbtn) {
  signinbtn.addEventListener("click", () => {
    document.querySelector("#smodal2").classList.add("is-active");
  });
}

//---------------------------- HIDE MODALS ------------------------------------//
const modalbg = document.querySelector("#modalbg");
if (modalbg) {
  modalbg.addEventListener("click", () => {
    document.querySelector("#smodal").classList.remove("is-active");
  });
}

const modalbg2 = document.querySelector("#modalbg2");
if (modalbg2) {
  modalbg2.addEventListener("click", () => {
    document.querySelector("#smodal2").classList.remove("is-active");
  });
}

//--------------------------- SIGN UP FORM SUBMIT -----------------------------//
const signUpForm = document.querySelector("#sign_up_form");
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_email = document.querySelector("#sign_email").value;
    let user_pass = document.querySelector("#sign_pass").value;

    auth
      .createUserWithEmailAndPassword(user_email, user_pass)
      .then(() => {
        document.querySelector("#smodal").classList.remove("is-active");
        signUpForm.reset();
        alert("Welcome! We are glad you joined us!");
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

//--------------------------- SIGN IN FORM SUBMIT -----------------------------//
const signInForm = document.querySelector("#sign_in_form");
if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_email = document.querySelector("#sign_in_email").value;
    let user_pass = document.querySelector("#sign_in_pass").value;

    auth
      .signInWithEmailAndPassword(user_email, user_pass)
      .then(() => {
        document.querySelector("#smodal2").classList.remove("is-active");
        signInForm.reset();
        alert("Welcome Back!");
      })
      .catch(() => {
        alert("Incorrect login!");
      });
  });
}

//----------------------------- SIGN OUT BUTTON -------------------------------//
if (signoutbtn) {
  signoutbtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      alert("You've securely logged out, see you next time!");
    });
  });
}

//------------------------ AUTH STATE LISTENER -------------------------------//
const adminPanelAbout = document.querySelector("#adminPanelAbout");
const adminPanelGallery = document.querySelector("#adminPanelGallery");

auth.onAuthStateChanged((user) => {
  if (user) {
    if (signinbtn) signinbtn.classList.add("is-hidden");
    if (signupbtn) signupbtn.classList.add("is-hidden");
    if (signoutbtn) signoutbtn.classList.remove("is-hidden");

    if (userEmailDisplay) {
      userEmailDisplay.textContent = user.email;
      userEmailDisplay.classList.remove("is-hidden");
    }

    isCurrentUserAdmin = adminEmails.includes(user.email);

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

    // Load data (with admin/non-admin view)
    loadPerformances();
    loadAuditions();
    loadGalleryItems();
  } else {
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

    // Still show public lists even if logged out
    loadPerformances();
    loadAuditions();
    loadGalleryItems();
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

/* ===================== ADMIN: PERFORMANCES & AUDITIONS ===================== */

// Add performance
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
      .catch((err) => alert("Error adding performance: " + err));
  });
}

// Add audition
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
      .catch((err) => alert("Error adding audition: " + err));
  });
}

function loadPerformances() {
  const publicContainer = document.querySelector("#public_performances");
  const adminContainer = document.querySelector("#perf_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("performances")
    .orderBy("date")
    .onSnapshot((snapshot) => {
      if (publicContainer) {
        publicContainer.innerHTML = "";
      }
      if (adminContainer) {
        adminContainer.innerHTML = "";
      }

      if (snapshot.empty) {
        if (publicContainer) {
          publicContainer.innerHTML =
            "<p>No upcoming performances right now.</p>";
        }
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Public view
        if (publicContainer) {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${data.title}</strong> — ${data.date} ${data.time} @ ${data.location}`;
          publicContainer.appendChild(p);
        }

        // Admin view
        if (adminContainer) {
          const div = document.createElement("div");
          div.classList.add("mb-3");

          let html = `
            <p><strong>${data.title}</strong> — ${data.date} ${data.time} @ ${
            data.location
          }</p>
            <p>${data.description || ""}</p>
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
            db.collection("performances")
              .doc(id)
              .delete()
              .then(() => alert("Performance deleted."))
              .catch((err) => alert("Error deleting performance: " + err));
          });
        });
      }
    });
}

function loadAuditions() {
  const publicContainer = document.querySelector("#public_auditions");
  const adminContainer = document.querySelector("#aud_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("auditions")
    .orderBy("date")
    .onSnapshot((snapshot) => {
      if (publicContainer) {
        publicContainer.innerHTML = "";
      }
      if (adminContainer) {
        adminContainer.innerHTML = "";
      }

      if (snapshot.empty) {
        if (publicContainer) {
          publicContainer.innerHTML = "<p>No upcoming auditions right now.</p>";
        }
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Public
        if (publicContainer) {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${data.season}</strong> — ${data.date} ${data.time} @ ${data.location}`;
          publicContainer.appendChild(p);
        }

        // Admin
        if (adminContainer) {
          const div = document.createElement("div");
          div.classList.add("mb-3");

          let html = `
            <p><strong>${data.season}</strong> — ${data.date} ${data.time} @ ${
            data.location
          }</p>
            <p>${data.requirements || ""}</p>
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
              .catch((err) => alert("Error deleting audition: " + err));
          });
        });
      }
    });
}

/* ===================== ADMIN: GALLERY ITEMS ===================== */

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
      .catch((err) => alert("Error adding gallery item: " + err));
  });
}

function loadGalleryItems() {
  const publicContainer = document.querySelector("#gallery_public_list");
  const adminContainer = document.querySelector("#gallery_items");

  if (!publicContainer && !adminContainer) return;

  db.collection("galleryItems")
    .orderBy("title")
    .onSnapshot((snapshot) => {
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

        // Public view: simple card
        if (publicContainer) {
          const col = document.createElement("div");
          col.classList.add("column", "is-one-third");

          let mediaHtml = "";

          if (data.type === "video") {
            mediaHtml = `<div class="video">
              <iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%;height:200px;"></iframe>
            </div>`;
          } else {
            // image
            mediaHtml = `<figure class="image">
              <img src="${data.thumbnailUrl || data.url}" alt="${data.title}">
            </figure>`;
          }

          col.innerHTML = `
            <div class="card has-background-grey-darker has-text-white">
              <div class="card-image">
                ${mediaHtml}
              </div>
              <div class="card-content">
                <p class="title is-5 has-text-white">${data.title}</p>
                <p class="has-text-grey-light">${data.description || ""}</p>
              </div>
            </div>
          `;

          publicContainer.appendChild(col);
        }

        // Admin view: list with delete
        if (adminContainer) {
          const div = document.createElement("div");
          div.classList.add("mb-3");

          let html = `
            <p><strong>${data.title}</strong> (${data.type})</p>
            <p>${data.url}</p>
            <p>${data.description || ""}</p>
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
              .catch((err) => alert("Error deleting gallery item: " + err));
          });
        });
      }
    });
}
