import {useState} from 'react';

const useRegisterForm = () => {
    const [inputs, setInputs] = useState({});

  const handleFirstNameChange = (text) => {
      setInputs((inputs) => ({
          ...inputs,
          firstName: text,
      }));

  };
  const handleLastNameChange = (text) => {
      setInputs((inputs) => ({
          ...inputs,
          lastName: text,
      }));

  };
  const handleEmailChange = (text) => {
      setInputs((inputs) => ({
          ...inputs,
          email: text,
      }));
  };
  const handlePasswordChange = (text) => {
      setInputs((inputs) => ({
          ...inputs,
          password: text,
      }));
  };
  const handleConfirmPasswordChange = (text) => {
      setInputs((inputs) => ({
          ...inputs,
          confirmPassword: text,
      }));
  };
return {
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    inputs,
    setInputs,
}
};
export default useRegisterForm;

