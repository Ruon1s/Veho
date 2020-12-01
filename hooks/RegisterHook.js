import {useState} from 'react';
import validate from 'validate.js'

const registerConstraints = {
    firstName: {
        length: {
            minimum: 3,
            message: 'must be at least 3 characters',
        },
    },
    lastName: {
        presence: 'cannot be blank.',
        length: {
            minimum: 3,
            message: 'must be at least 3 characters',
        }
    },
    email: {
        email: {
            message: 'Email not valid.',
        },
    },

    password: {
        length: {
            minimum: 5,
            message: 'Password must be at least 5 characters',
        },
    },
    confirmPassword: {
        equality: 'password',
    },
};
/**
 * for using register form and handling the validation
 * @returns {{setInputs: *, handlePasswordChange: *, inputs: *, handleLastNameChange: *, handleEmailChange: *, handleConfirmPasswordChange: *, setErrors: *, errors: *, handleFirstNameChange: *}}
 */
const useRegisterForm = () => {
    const [inputs, setInputs] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: ''});
    const [errors, setErrors] = useState ({});

    /**
     * Sets inputs from first name field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see registerConstraints.firstName
     */
  const handleFirstNameChange = (text) => {
      console.log(errors)
      const error = validate({firstName: text}, {firstName: registerConstraints.firstName});
      setInputs((inputs) => ({
          ...inputs,
          firstName: text,
      }));
      setErrors((errors) => ({
          ...errors,
          firstName: error,
      }))

  };
    /**
     * Sets inputs from last name field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see registerConstraints.lastName
     */
  const handleLastNameChange = (text) => {
      const error = validate({lastName: text}, {lastName: registerConstraints.lastName})
      setInputs((inputs) => ({
          ...inputs,
          lastName: text,
      }));
      setErrors((errors) => ({
          ...errors,
          lastName: error,
      }))
  };

    /**
     * Sets inputs from email field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see registerConstraints.email
     */
  const handleEmailChange = (text) => {
      const error = validate({email: text}, {email: registerConstraints.email})
      setInputs((inputs) => ({
          ...inputs,
          email: text,
      }));
      setErrors((errors) => ({
          ...errors,
          email: error,
      }))
  };

    /**
     * Sets inputs from password field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see registerConstraints.password
     */
  const handlePasswordChange = (text) => {
      const error = validate({password: text}, {password: registerConstraints.password})
      setInputs((inputs) => ({
          ...inputs,
          password: text,
      }));
      setErrors((errors) => ({
          ...errors,
          password: error,
      }))
      console.log(text)
  };

    /**
     * Sets inputs from confirm password field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see registerConstraints.confirmPassword
     */
  const handleConfirmPasswordChange = (text) => {
      const error = validate({password: inputs.password, confirmPassword: text}, {confirmPassword: registerConstraints.confirmPassword})
      setInputs((inputs) => ({
          ...inputs,
          confirmPassword: text,
      }));
      setErrors((errors) => ({
          ...errors,
          confirmPassword: error,
      }))
      console.log(text)
  };
return {
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    inputs,
    setInputs,
    errors,
    setErrors
}
};
export default useRegisterForm;

