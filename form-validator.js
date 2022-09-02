const CONSTANTS = {
    REQUIRED_ERROR: "This field is required.",
    MIN_ERROR: (minChar) =>
      `This field should have atleast ${minChar} characters.`,
    MAX_ERROR: (maxChar) =>
      `This field should have not have more than ${maxChar} characters.`,
    ERROR_CLASS: "form-field-error",
  };
  
  export const configureFormValidations = (formElement, fields, onValidate) => {
    // States and helper function
    const fieldNames = Object.keys(fields);
  
    const formState = { isFormValid: null, ...fields };
  
    const getInputNameFromDOM = (input) => input.getAttribute("name");
  
    const isMinError = (fieldConfig, value) =>
      fieldConfig.hasOwnProperty("min") && value.length < fieldConfig.min;
  
    const isMaxError = (fieldConfig, value) =>
      fieldConfig.hasOwnProperty("max") && value.length > fieldConfig.max;
    const hasValidateFn = (fieldConfig) => fieldConfig.hasOwnProperty("validate");
  
    const appendErrorElement = (input, errorText = CONSTANTS.REQUIRED_ERROR) => {
      const inputFieldName = getInputNameFromDOM(input);
      const errorElement = document.createElement("span");
      errorElement.innerText = errorText;
      errorElement.classList.add(CONSTANTS.ERROR_CLASS);
      errorElement.id = inputFieldName + "-error-msg"
      input.insertAdjacentElement("beforebegin", errorElement);
      if (formState.isFormValid) formState.isFormValid = false;
      if (!formState[inputFieldName].hasError)
        formState[inputFieldName].hasError = true;
      return false;
    };
    const resetInput = (input) => {
      const inputFieldName = getInputNameFromDOM(input);
      if (formState[inputFieldName].hasError) {
        formState[inputFieldName].hasError = false;
        document.getElementById(`${inputFieldName}-error-msg`).remove();
      }
      return true;
    };
    const validateField = (condition, input, errorMsg) =>
      condition ? appendErrorElement(input, errorMsg) : resetInput(input);
  
    const validateConditions = (fieldConfig, input) => {
      const conditions = [
        fieldConfig.required && input.value.length <= 0,
        isMinError(fieldConfig, input.value),
        isMaxError(fieldConfig, input.value),
        hasValidateFn(fieldConfig) && !fieldConfig.validate(input.value)
      ];
  
      for (let condition of conditions) {
        const isValid = validateField(condition, input);
        if (!isValid) {
          return;
        }
      }
    };
    //   main validation function
    const runValidations = (e) => {
      formState.isFormValid = true;
      e.preventDefault();
  
      for (let fieldName of fieldNames) {
        const fieldConfig = fields[fieldName];
        const input = document.querySelector(`input[name="${fieldName}"]`);
        validateConditions(fieldConfig, input);
      }
    };
  
    // add event listener
    formElement.addEventListener("submit", (e) => {
      runValidations(e);
      formState.isFormValid && onValidate(e);
    });
  };