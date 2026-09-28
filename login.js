const fields = document.querySelectorAll(".login-fields input");
const loginButton = document.querySelector(".submit-button");
const updateButton = () => {
  loginButton.disabled = [...fields].some((field) => !field.value.trim());
};

fields.forEach((field) => field.addEventListener("input", updateButton));
updateButton();
