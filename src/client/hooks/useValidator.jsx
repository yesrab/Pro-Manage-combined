import { useEffect, useState } from "react";

const useValidator = (initialState, validationRules, submit, method) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value || null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid. Data submitted : responce from hook");
      return true;
    } else {
      setErrors(validationErrors);
      return false;
    }
  };

  const validateForm = (data, rules) => {
    let errors = {};
    for (const field in rules) {
      // console.log("hook in key?", field);
      if (rules.hasOwnProperty(field)) {
        const fieldRules = rules[field];
        // console.log("frules", fieldRules);
        for (const rule of fieldRules) {
          // console.log("items", rule);
          if (rule.validator(data[field]) !== rule.condition) {
            errors[field] = rule.message;
            break;
          }
        }
      }
    }
    return errors;
  };

  return { formData, errors, handleChange, handleSubmit };
};

export default useValidator;
