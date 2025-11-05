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
