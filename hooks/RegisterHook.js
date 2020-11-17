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
const useRegisterForm = () => {
    const [inputs, setInputs] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: ''});
    const [errors, setErrors] = useState ({});

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

