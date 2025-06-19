import validator from "validator";

export const validateRegisterData = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return {
      isValid: false,
      message: "Please provide email, name, and password",
    };
  }
  if (!validator.isLength(name, { min: 4, max: 22 })) {
    return {
      isValid: false,
      message: "Please provide a valid name",
    };
  }
  if (!validator.isEmail(email)) {
    return {
      isValid: false,
      message: "Please provide a valid email",
    };
  }
  if (!validator.isStrongPassword(password)) {
    return {
      isValid: false,
      message: "Please provide a strong password",
    };
  }

  return { isValid: true };
};
