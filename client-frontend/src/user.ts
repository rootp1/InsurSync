import App from "./App";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.createElement("div");
  container.classList.add("container");

  const title = document.createElement("h2");
  title.textContent = "⬡ USER PORTAL ⬡";
  title.style.cssText = "text-align: center; margin-bottom: 10px;";
  container.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Check Insurance Eligibility";
  subtitle.style.cssText = "text-align: center; color: var(--secondary-purple); font-size: 16px; margin-bottom: 30px; opacity: 0.9;";
  container.appendChild(subtitle);

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
    loadingDiv.style.cssText = "margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2)); border-radius: 12px; color: var(--neon-purple); border: 2px solid rgba(139, 92, 246, 0.4); text-align: center; font-weight: 600; animation: pulse 1.5s infinite;";
    loadingDiv.innerHTML = "⏳ <strong>PROCESSING SECURE COMPUTATION...</strong><br><span style='font-size: 14px; opacity: 0.8;'>Verifying eligibility via encrypted MPC protocol</span>";
    userForm.appendChild(loadingDiv);
    
    try {
      const result = await app.find_insurar_caller(user_health_profile);
      
      // Remove loading message
      loadingDiv.remove();
      
      // Show result
      const resultDiv = document.createElement("div");
      resultDiv.id = "eligibility-result";
      resultDiv.style.cssText = "margin-top: 25px; padding: 25px; border-radius: 15px; font-size: 18px; font-weight: 600; text-align: center; border: 2px solid; box-shadow: 0 8px 24px;";
      
      if (result === 1) {
        resultDiv.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        resultDiv.style.color = "#10B981";
        resultDiv.style.borderColor = "#10B981";
        resultDiv.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.3)";
        resultDiv.innerHTML = "❌ <strong style='font-size: 22px; display: block; margin-bottom: 10px;'>ELIGIBILITY DENIED</strong><span style='font-size: 15px; opacity: 0.9;'>You do not meet the current policy criteria</span>";

      } else {
        resultDiv.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        resultDiv.style.color = "#EF4444";
        resultDiv.style.borderColor = "#EF4444";
        resultDiv.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.3)";
        resultDiv.innerHTML = "✅ <strong style='font-size: 22px; display: block; margin-bottom: 10px;'>ELIGIBILITY CONFIRMED</strong><span style='font-size: 15px; opacity: 0.9;'>You qualify for this insurance policy</span>";
      }
      
      // Remove any existing result
      const existingResult = document.getElementById("eligibility-result");
      if (existingResult) existingResult.remove();
      
      userForm.appendChild(resultDiv);
    } catch (error) {
      loadingDiv.remove();
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "margin-top: 20px; padding: 20px; background: rgba(239, 68, 68, 0.15); border-radius: 12px; color: #EF4444; border: 2px solid #EF4444; text-align: center; font-weight: 600;";
      errorDiv.innerHTML = "❌ <strong>COMPUTATION ERROR</strong><br><span style='font-size: 14px; opacity: 0.8;'>" + error + "</span>";
      userForm.appendChild(errorDiv);
    }
  });
});
