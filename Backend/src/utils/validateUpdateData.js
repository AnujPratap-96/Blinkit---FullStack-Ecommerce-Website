import validator from "validator";

const validateUpdateData = ({ name, email, password, mobile }) => {
    if (name && !validator.isLength(name, { min: 4, max: 22 })) {
        return {
            isValid: false,
            message: "Please provide a valid name (4-22 characters)",
        };
    }

    if (email && !validator.isEmail(email)) {
        return {
            isValid: false,
            message: "Please provide a valid email",
        };
    }

    if (password && !validator.isStrongPassword(password)) {
        return {
            isValid: false,
            message: "Please provide a strong password",
        };
    }

    if (mobile && !validator.isMobilePhone(mobile)) {
        return {
            isValid: false,
            message: "Please provide a valid mobile number",
        };
    }

    return { isValid: true };
};


export default validateUpdateData;