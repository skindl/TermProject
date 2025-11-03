let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");

signupbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal = document.querySelector("#smodal");

  console.log(smodal);

  // add the is-active to the model (function: add, class being added: is-active)
  smodal.classList.add("is-active");
});

// SIGN IN BTN
signinbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal = document.querySelector("#smodal2");

  console.log(smodal);

  // add the is-active to the model (function: add, class being added: is-active)
  smodal.classList.add("is-active");
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
