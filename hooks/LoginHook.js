import {useState} from 'react';

/**
 * file for handling forms in Login
 * @returns {{setInputs: *, handlePasswordChange: *, inputs: *, handleEmailChange: *}}
 */

const useLoginForm  = () => {
    const [inputs, setInputs] = useState({});
    /**
     * Sets inputs from email field to inputs state
     * called when text in the field changes
     */
    const handleEmailChange = (text) => {
        setInputs((inputs) => ({
            ...inputs,
            email: text,
        }));

    };
    /**
     * Sets inputs from password field to inputs state
     * called when text in the field changes
     */
    const handlePasswordChange = (text) => {
        setInputs((inputs) => ({
            ...inputs,
            password: text,
        }));


    };
    return {
        handleEmailChange,
        handlePasswordChange,
        inputs,
        setInputs,
    }
};

    export default useLoginForm
