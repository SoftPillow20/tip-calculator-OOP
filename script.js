"use strict";
// button elements
const btnTipEl = document.querySelectorAll(".btn--tips");
const btnResetEl = document.querySelector(".btn--reset");

// forms
const billFormEl = document.querySelector(".bill-form");
const numPeopleFormEl = document.querySelector(".num-people-form");

// input field elements
const inputBillEl = document.querySelector(".input--bill");
const inputNumPeopleEl = document.querySelector(".input--numPeople");
const inputCustomBtnEl = document.querySelector(".input--custom");

// container elements
const labelContEl = document.querySelectorAll(".label-container");
const tipsEl = document.querySelector(".tips");

// text elements
const warningBillEl = document.querySelector(".warning--bill");
const warningNumPeopleEl = document.querySelector(".warning--numPeople");
const tipEl = document.querySelector(".tip");
const totalEl = document.querySelector(".total");
const labelCustomEl = document.querySelector(".label-custom");

class App {
  #bill;
  #numPeople;
  #tip;
  #customTip;
  #clicked;
  #focusOutline = "2px solid hsl(172, 67%, 45%)";
  #warningOutline = "2px solid hsl(27, 98%, 54%)";
  constructor() {
    this._removeBtnActive(btnTipEl);

    tipsEl.addEventListener("click", this.tipBtnActivate.bind(this));

    billFormEl.addEventListener("input", this._inputBill.bind(this));

    numPeopleFormEl.addEventListener("input", this._inputNumPeople.bind(this));

    inputCustomBtnEl.addEventListener(
      "input",
      this._customInputActivate.bind(this)
    );
  }

  // Resets Web app
  resetPage() {
    btnResetEl.classList.add("btn--default");
    this._removeBtnActive();
    tipEl.textContent = "0.00";
    totalEl.textContent = "0.00";
    this.#bill = 0;
    this.#tip = 0;
    this.#customTip = 0;
    this.#numPeople = 0;
    inputBillEl.value = "";
    inputNumPeopleEl.value = "";
    inputCustomBtnEl.value = "";
    inputBillEl.style.outline = "none";
    inputNumPeopleEl.style.outline = "none";
    inputCustomBtnEl.style.outline = "";
    labelCustomEl.style.opacity = 1;
  }

  _removeBtnActive() {
    btnTipEl.forEach((el) => el.classList.remove("btn--active"));
  }

  // Function that handles tip btn logic
  tipBtnActivate(e) {
    e.preventDefault();
    // checks if the clicked element is the tip btn
    this.#clicked = e.target.closest(".btn--tips");

    // for User experience (if custom btn is not focus remove outline)
    if (e.target !== inputCustomBtnEl) inputCustomBtnEl.style.outline = "none";
    else inputCustomBtnEl.style.outline = this.#focusOutline;

    // Guard clause
    if (!this.#clicked) return;

    // Get tip
    this.#tip = Number.parseFloat(this.#clicked.textContent) / 100;

    this.calculate();
  }

  // Function that handles custom tip btn logic
  _customInputActivate(e) {
    e.preventDefault();

    if (!this._hasInput()) {
      e.target.value = "";
      return;
    }

    const customTip = e.target.value;

    if (customTip) labelCustomEl.style.opacity = 0;
    else labelCustomEl.style.opacity = 1;

    // Checks if the input number is valid
    const isValid = this._isValidInputs(+e.target.value);

    if (isValid) {
      this.#customTip = +e.target.value / 100;
      inputCustomBtnEl.style.outline = this.#focusOutline;
    } else {
      this.#customTip = 0;
      inputCustomBtnEl.style.outline = this.#warningOutline;
    }

    this.calculate();
  }

  calculate() {
    if (!this._hasInput()) return;

    btnResetEl.classList.remove("btn--default");

    // Remove active classes
    this._removeBtnActive();

    // Active button
    this.#clicked.classList.add("btn--active");

    // Checks if tip was used
    if (this.#tip) {
      this.calcTipAndTotal(this.#tip);
      // or if custom tip was used
    } else if (this.#customTip) {
      this.calcTipAndTotal(this.#customTip);
    }

    btnResetEl.addEventListener("click", this.resetPage.bind(this));
  }

  calcTipAndTotal(tip) {
    const tipAmount = this.calcTipPerPerson(this.#bill, tip, this.#numPeople);
    const total = this.calcTotalPerPerson(this.#bill, tip, this.#numPeople);

    this._showTipAndTotalPerPerson(tipAmount, total);
  }

  // Calculate tip per person
  calcTipPerPerson(bill, tip, numPeople) {
    const result = (bill * tip) / numPeople;
    return result;
  }

  // Calculate total per person
  calcTotalPerPerson(bill, tip, numPeople) {
    const result = (bill * (1 + tip)) / numPeople;
    return result;
  }

  // Show the tip and total per person on the display
  _showTipAndTotalPerPerson(tipAmount, total) {
    tipEl.textContent = `${Number(tipAmount).toFixed(2)}`;
    totalEl.textContent = `${Number(total).toFixed(2)}`;
  }

  // Method receives input bill from the user and store it in the private class field
  _inputBill(e) {
    e.preventDefault();

    // Checks if the input number is valid
    const isValid = this._isValidInputs(+inputBillEl.value);

    if (isValid) {
      this.#bill = +inputBillEl.value;
    } else {
      this.#bill = 0;
    }
  }

  // Method receives input number of people from the user and store it in the private class field
  _inputNumPeople(e) {
    e.preventDefault();

    // Checks if the input number is valid
    const isValid = this._isValidInputs(+inputNumPeopleEl.value);

    if (isValid) {
      this.#numPeople = +inputNumPeopleEl.value;
    } else {
      this.#numPeople = 0;
    }
  }

  // Checks if input field has inputs
  _hasInput() {
    const numPeopleInt = Number.isInteger(this.#numPeople);
    this._checkNumValidation(this.#bill, this.#numPeople, numPeopleInt);

    if (
      !this._isValidInputs(this.#bill) ||
      !this._isValidInputs(this.#numPeople) ||
      !numPeopleInt
    ) {
      return false;
    }

    return true;
  }

  // Validates the number for each inputs
  _checkNumValidation(bill, numpeople, isInt) {
    // For bill
    this._checkFormUI(this._isValidInputs(bill), warningBillEl, inputBillEl);
    // For numPeople
    this._checkFormUI(
      this._isValidInputs(numpeople),
      warningNumPeopleEl,
      inputNumPeopleEl,
      isInt
    );
  }

  _checkFormUI(isValid, warning, inputEl, isInt = true) {
    // Checks if input is valid
    if (isValid) {
      // if input is valid
      // don't show warning message
      // render normal input outline
      this._warningMessage(warning, false);
      inputEl.style.outline = this.#focusOutline;
    } else {
      // if input is invalid
      // show warning message
      // render warning input outline
      this._warningMessage(warning, true);
      inputEl.style.outline = this.#warningOutline;
    }

    // For input number of people
    if (!isInt) {
      this._warningMessage(warning, true);
      inputEl.style.outline = this.#warningOutline;
    }
  }

  // Reusable method
  // Checks if a value is valid
  // returns true or false
  _isValidInputs(value) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    if (!validInputs(value) || !allPositive(value)) {
      return false;
    } else {
      return true;
    }
  }

  // Creates warning message
  _warningMessage(element, bool) {
    bool ? element.classList.remove("hidden") : element.classList.add("hidden");
  }
}

const app = new App();
