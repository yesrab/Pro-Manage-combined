import { useEffect, useState } from "react";

const useValidator = (initialState, validationRules, submit, method) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length === 0) {
      return true;
    } else {
      setErrors(validationErrors);
      return false;
    }
  };

  const validateForm = (data, rules) => {
    let errors = {};
    for (const field in rules) {
      if (rules.hasOwnProperty(field)) {
        const fieldRules = rules[field];

        for (const rule of fieldRules) {
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
