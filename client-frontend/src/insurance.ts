import App from "./App";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.createElement("div");
  container.classList.add("container");

  const title = document.createElement("h2");
  title.textContent = "⬡ PROVIDER PORTAL ⬡";
  title.style.cssText = "text-align: center; margin-bottom: 10px;";
  container.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Configure Insurance Policy Criteria";
  subtitle.style.cssText = "text-align: center; color: var(--secondary-purple); font-size: 16px; margin-bottom: 30px; opacity: 0.9;";
  container.appendChild(subtitle);

  // Create form container
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  // Create the insurance form
  const insuranceForm = document.createElement("div");
  insuranceForm.id = "insuranceForm";

  const insuranceFormElement = document.createElement("form");

  // Age: Min and Max inputs
  const ageMinInput = document.createElement("input");
  ageMinInput.type = "number";
  ageMinInput.placeholder = "Min Age";
  ageMinInput.required = true;
  insuranceFormElement.appendChild(ageMinInput);

  const ageMaxInput = document.createElement("input");
  ageMaxInput.type = "number";
  ageMaxInput.placeholder = "Max Age";
  ageMaxInput.required = true;
  insuranceFormElement.appendChild(ageMaxInput);

  // Height: Min and Max inputs
  const heightMinInput = document.createElement("input");
  heightMinInput.type = "number";
  heightMinInput.placeholder = "Min Height (cm)";
  heightMinInput.required = true;
  insuranceFormElement.appendChild(heightMinInput);

  const heightMaxInput = document.createElement("input");
  heightMaxInput.type = "number";
  heightMaxInput.placeholder = "Max Height (cm)";
  heightMaxInput.required = true;
  insuranceFormElement.appendChild(heightMaxInput);

  // Weight: Min and Max inputs
  const weightMinInput = document.createElement("input");
  weightMinInput.type = "number";
  weightMinInput.placeholder = "Min Weight (kg)";
  weightMinInput.required = true;
  insuranceFormElement.appendChild(weightMinInput);

  const weightMaxInput = document.createElement("input");
  weightMaxInput.type = "number";
  weightMaxInput.placeholder = "Max Weight (kg)";
  weightMaxInput.required = true;
  insuranceFormElement.appendChild(weightMaxInput);

  // Submit Button
  const insuranceSubmitButton = document.createElement("button");
  insuranceSubmitButton.type = "submit";
  insuranceSubmitButton.textContent = "Submit Insurance Criteria";
  insuranceFormElement.appendChild(insuranceSubmitButton);

  insuranceForm.appendChild(insuranceFormElement);

  // Add preset insurance options
  const insuranceOptions = [
    {
      name: "Basic Health Plan",
      min_age: 18,
      max_age: 60,
      min_height: 150,
      max_height: 190,
      min_weight: 40,
      max_weight: 100,
    },
    {
      name: "Premium Health Plan",
      min_age: 21,
      max_age: 65,
      min_height: 160,
      max_height: 200,
      min_weight: 50,
      max_weight: 120,
    },
    {
      name: "Family Health Plan",
      min_age: 30,
      max_age: 70,
      min_height: 155,
      max_height: 185,
      min_weight: 45,
      max_weight: 110,
    },
  ];

  insuranceOptions.forEach((option) => {
    const insuranceOptionBtn = document.createElement("button");
    insuranceOptionBtn.textContent = option.name;
    insuranceOptionBtn.classList.add("insurance-option-button");
    insuranceOptionBtn.type = "button";

    insuranceOptionBtn.addEventListener("click", () => {
      ageMinInput.value = option.min_age.toString();
      ageMaxInput.value = option.max_age.toString();
      heightMinInput.value = option.min_height.toString();
      heightMaxInput.value = option.max_height.toString();
      weightMinInput.value = option.min_weight.toString();
      weightMaxInput.value = option.max_weight.toString();
    });

    insuranceForm.appendChild(insuranceOptionBtn);
  });

  formContainer.appendChild(insuranceForm);
  container.appendChild(formContainer);
  document.body.appendChild(container);

  // Initialize app
  const app = new App();
  
  console.log("[Insurance] Initializing MPC protocol...");
  await app.initializeProtocol();
  console.log("[Insurance] MPC protocol ready.");
  
  // Connect as Bob
  const sessionCode = "privinsure-session";
  console.log("[Insurance] Connecting as Bob...");
  await app.connect(sessionCode, "bob");
  console.log("[Insurance] Connected successfully!");
  app.listen_for_user();

  // Insurance form submit event
  insuranceFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const insurance_profiles = {
      min_age: Number(ageMinInput.value),
      max_age: Number(ageMaxInput.value),
      min_height: Number(heightMinInput.value),
      max_height: Number(heightMaxInput.value),
      min_weight: Number(weightMinInput.value),
      max_weight: Number(weightMaxInput.value),
    };

    console.log("[Insurance] Submitting criteria:", insurance_profiles);

    // Show loading message
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-message-ins";
    loadingDiv.style.cssText = "margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2)); border-radius: 12px; color: var(--neon-purple); border: 2px solid rgba(139, 92, 246, 0.4); text-align: center; font-weight: 600; animation: pulse 1.5s infinite;";
    loadingDiv.innerHTML = "⏳ <strong>AWAITING USER CONNECTION...</strong><br><span style='font-size: 14px; opacity: 0.8;'>Processing encrypted eligibility match</span>";
    insuranceForm.appendChild(loadingDiv);
    
    try {
      const result = await app.feed_to_client_caller(insurance_profiles);
      
      // Remove loading message
      loadingDiv.remove();
      
      // Show result
      const resultDiv = document.createElement("div");
      resultDiv.id = "match-result";
      resultDiv.style.cssText = "margin-top: 25px; padding: 25px; border-radius: 15px; font-size: 18px; font-weight: 600; text-align: center; border: 2px solid; box-shadow: 0 8px 24px;";
      
      if (result === 1) {
        resultDiv.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        resultDiv.style.color = "#10B981";
        resultDiv.style.borderColor = "#10B981";
        resultDiv.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.3)";
        resultDiv.innerHTML = "✅ <strong style='font-size: 22px; display: block; margin-bottom: 10px;'>MATCH CONFIRMED</strong><span style='font-size: 15px; opacity: 0.9;'>User meets all policy criteria</span>";
      } else {
        resultDiv.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        resultDiv.style.color = "#EF4444";
        resultDiv.style.borderColor = "#EF4444";
        resultDiv.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.3)";
        resultDiv.innerHTML = "❌ <strong style='font-size: 22px; display: block; margin-bottom: 10px;'>NO MATCH</strong><span style='font-size: 15px; opacity: 0.9;'>User does not meet policy criteria</span>";
      }
      
      // Remove any existing result
      const existingResult = document.getElementById("match-result");
      if (existingResult) existingResult.remove();
      
      insuranceForm.appendChild(resultDiv);
    } catch (error) {
      loadingDiv.remove();
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "margin-top: 20px; padding: 20px; background: rgba(239, 68, 68, 0.15); border-radius: 12px; color: #EF4444; border: 2px solid #EF4444; text-align: center; font-weight: 600;";
      errorDiv.innerHTML = "❌ <strong>COMPUTATION ERROR</strong><br><span style='font-size: 14px; opacity: 0.8;'>" + error + "</span>";
      insuranceForm.appendChild(errorDiv);
    }
  });
});
