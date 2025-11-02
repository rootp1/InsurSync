import App from "./App";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.createElement("div");
  container.classList.add("container");

  const title = document.createElement("h2");
  title.textContent = "User - Check Insurance Eligibility";
  title.style.color = "#f7b500";
  container.appendChild(title);

  // Create form container
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  // Create the user form
  const userForm = document.createElement("div");
  userForm.id = "userForm";

  const userFormElement = document.createElement("form");

  // Age Input
  const userAgeInput = document.createElement("input");
  userAgeInput.type = "number";
  userAgeInput.placeholder = "Age";
  userAgeInput.required = true;
  userFormElement.appendChild(userAgeInput);

  // Height Input
  const userHeightInput = document.createElement("input");
  userHeightInput.type = "number";
  userHeightInput.placeholder = "Height (cm)";
  userHeightInput.required = true;
  userFormElement.appendChild(userHeightInput);

  // Weight Input
  const userWeightInput = document.createElement("input");
  userWeightInput.type = "number";
  userWeightInput.placeholder = "Weight (kg)";
  userWeightInput.required = true;
  userFormElement.appendChild(userWeightInput);

  // Submit Button
  const userSubmitButton = document.createElement("button");
  userSubmitButton.type = "submit";
  userSubmitButton.textContent = "Check Eligibility";
  userFormElement.appendChild(userSubmitButton);

  userForm.appendChild(userFormElement);
  formContainer.appendChild(userForm);
  container.appendChild(formContainer);
  document.body.appendChild(container);

  // Initialize app
  const app = new App();
  
  console.log("[User] Initializing MPC protocol...");
  await app.initializeProtocol();
  console.log("[User] MPC protocol ready.");
  
  // Connect as Alice
  const sessionCode = "privinsure-session";
  console.log("[User] Connecting as Alice...");
  await app.connect(sessionCode, "alice");
  console.log("[User] Connected successfully!");

  // User form submit event
  userFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user_health_profile = {
      age: Number(userAgeInput.value),
      height: Number(userHeightInput.value),
      weight: Number(userWeightInput.value),
    };

    console.log("[User] Submitting health data:", user_health_profile);
    
    // Show loading message
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-message";
    loadingDiv.style.cssText = "margin-top: 20px; padding: 15px; background-color: #444; border-radius: 8px; color: #f7b500;";
    loadingDiv.textContent = "⏳ Checking eligibility... Please wait.";
    userForm.appendChild(loadingDiv);
    
    try {
      const result = await app.find_insurar_caller(user_health_profile);
      
      // Remove loading message
      loadingDiv.remove();
      
      // Show result
      const resultDiv = document.createElement("div");
      resultDiv.id = "eligibility-result";
      resultDiv.style.cssText = "margin-top: 20px; padding: 20px; border-radius: 8px; font-size: 18px; font-weight: bold;";
      
      if (result === 1) {
        resultDiv.style.backgroundColor = "#2d5016";
        resultDiv.style.color = "#90ee90";
        resultDiv.innerHTML = "✅ <strong>Congratulations!</strong><br>You are ELIGIBLE for this insurance policy.";
      } else {
        resultDiv.style.backgroundColor = "#4a1515";
        resultDiv.style.color = "#ffaaaa";
        resultDiv.innerHTML = "❌ <strong>Sorry!</strong><br>You are NOT ELIGIBLE for this insurance policy based on the criteria.";
      }
      
      // Remove any existing result
      const existingResult = document.getElementById("eligibility-result");
      if (existingResult) existingResult.remove();
      
      userForm.appendChild(resultDiv);
    } catch (error) {
      loadingDiv.remove();
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "margin-top: 20px; padding: 15px; background-color: #4a1515; border-radius: 8px; color: #ffaaaa;";
      errorDiv.textContent = "❌ Error: " + error;
      userForm.appendChild(errorDiv);
    }
  });
});
