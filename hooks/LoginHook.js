import {useState} from 'react';

const useLoginForm  = () => {
    const [inputs, setInputs] = useState({});

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
    return {
        handleEmailChange,
        handlePasswordChange,
        inputs,
        setInputs,
    }
};

    export default useLoginForm
