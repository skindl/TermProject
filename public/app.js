let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");

signupbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal = document.querySelector("#smodal");

  // add the is-active to the model (function: add, class being added: is-active)
  smodal.classList.add("is-active");
});

// SIGN IN BTN
signinbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal2 = document.querySelector("#smodal2");

  // add the is-active to the model (function: add, class being added: is-active)
  smodal2.classList.add("is-active");
});

// hide the modal (sign up)
document.querySelector("#modalbg").addEventListener("click", () => {
  // remove the is-active class from the modal
  document.querySelector("#smodal").classList.remove("is-active");
});

// hide the modal (sign in)
document.querySelector("#modalbg2").addEventListener("click", () => {
  // remove the is-active class from the modal
  document.querySelector("#smodal2").classList.remove("is-active");
});

//-----------------------------SIGN UP FORM--------------------------------------
document.querySelector("#sign_up_form").addEventListener("submit", (e) => {
  //prevent auto refresh
  e.preventDefault();

  //capture the user email and password
  let user_email = document.querySelector("#sign_email").value;
  let user_pass = document.querySelector("#sign_pass").value;

  //finish user authentication
  auth.createUserWithEmailAndPassword(user_email, user_pass).then(() => {
    //hide the modal
    document.querySelector("#smodal").classList.remove("is-active");

    //clear the form
    document.querySelector("#sign_up_form").reset();

    let new_user = {
      email: user_email,
      password: user_pass,
    };
    alert("Welcome! We are glad you joined us!");
  });
});

//---------------------------------SIGN IN------------------------------------------

document.querySelector("#sign_in_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let user_email = document.querySelector("#sign_in_email").value;
  let user_pass = document.querySelector("#sign_in_pass").value;

  auth
    .signInWithEmailAndPassword(user_email, user_pass)
    .then((user) => {
      document.querySelector("#smodal2").classList.remove("is-active");
      document.querySelector("#sign_in_form").reset();
      alert("Welcome Back!");
    })
    .catch((e) => {
      alert("incorrect login!");
    });
});
