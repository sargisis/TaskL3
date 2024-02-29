document.addEventListener("DOMContentLoaded", function() {
    const formFieldsContainer = document.getElementById("form-fields");
    const addFieldButton = document.getElementById("add-field-btn");
    const exportButton = document.getElementById("export-btn");
    const importFileInput = document.getElementById("import-file");
  
    addFieldButton.addEventListener("click", function() {
      // Show modal or dropdown to select field type
      const fieldType = prompt("Enter field type (e.g., text, email, dropdown):");
      addField(fieldType);
    });
  
    exportButton.addEventListener("click", function() {
      const formData = getFormConfiguration();
      const json = JSON.stringify(formData);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "form-config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  
    importFileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const formData = JSON.parse(e.target.result);
        recreateForm(formData);
      };
      reader.readAsText(file);
    });
  
    function addField(type) {
      const field = document.createElement("div");
      field.classList.add("field");
      field.innerHTML = `<label>${type}:</label>`;
  
      if (type === "dropdown") {
        field.innerHTML += `<select><option value="option1">Option 1</option><option value="option2">Option 2</option></select>`;
      } else {
        field.innerHTML += `<input type="${type}">`;
      }
  
      formFieldsContainer.appendChild(field);
    }
  
    function getFormConfiguration() {
      const fields = [];
      const fieldElements = formFieldsContainer.querySelectorAll(".field");
      fieldElements.forEach(fieldElement => {
        const label = fieldElement.querySelector("label").textContent.replace(":", "");
        const fieldType = fieldElement.querySelector("input") ? fieldElement.querySelector("input").type : "dropdown";
        const options = [];
  
        if (fieldType === "select") {
          const optionElements = fieldElement.querySelectorAll("option");
          optionElements.forEach(optionElement => {
            options.push(optionElement.textContent);
          });
        }
  
        fields.push({ label, type: fieldType, options });
      });
  
      return { fields };
    }
  
    function recreateForm(formData) {
      formFieldsContainer.innerHTML = "";
      formData.fields.forEach(fieldData => {
        addField(fieldData.type);
      });
    }
  });
  