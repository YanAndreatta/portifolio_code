import Toastify from "toastify-js";

export default class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.form = document.querySelector(settings.form);
    this.formButton = document.querySelector(settings.button);
    if (this.form) {
      this.url = this.form.getAttribute("action");
    }
    this.sendForm = this.sendForm.bind(this);
  }

  displaySuccess() {
    this.showToast(this.settings.success, "bottom", "center");
  }

  displayError() {
    this.showToast(this.settings.error, "bottom", "center");
  }

  showToast(message, gravity, position) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: gravity,
      position: position,
      style: {
        background: "#fff",
        color: "#000",
      },
    }).showToast();
  }

  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      if (field.value.trim() !== "") {
        formObject[field.getAttribute("name")] = field.value;
      }
    });
    return formObject;
  }

  onSubmission(event) {
    event.preventDefault();
    this.formButton.innerText = "Enviando...";
  }

  async sendForm(event) {
    try {

      if (Object.keys(this.getFormObject()).length === 0) {
        return;
      }

      this.onSubmission(event);
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.getFormObject()),
      });
      this.displaySuccess();
      this.formButton.innerText = "Envie sua mensagem";
    } catch (error) {

      this.displayError();
      throw new Error(error);

    }
  }

  init() {
    if (this.form)
      this.formButton.addEventListener("click", (event) =>
        this.sendForm(event)
      );
    return this;
  }
}
