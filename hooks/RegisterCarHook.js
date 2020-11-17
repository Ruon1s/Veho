import {useState} from 'react';
import validate from 'validate.js'

const RegisterCarConstraints = {
    vin: {
        length: {
            minimum: 17,
            maximum: 17,
            message: 'must be 17 digits',
        },
    },
    confirmVin: {
        equality: 'vin'
    },
};

const useRegisterCarForm = () => {
    const [inputs, setInputs] = useState({vin: '', confirmVin: ''});
    const [errors, setErrors] = useState({});

    const handleVinChange = (text) => {
        const error = validate({vin: text}, {vin: RegisterCarConstraints.vin})
        setInputs(inputs => ({
            ...inputs,
            vin: text,
        }))
        setErrors((errors) => ({
            ...errors,
            vin: error,
        }))
    }
    const handleConfirmVinChange = (text) => {
        const error = validate({confirmVin: text, vin: text}, {vin: RegisterCarConstraints.vin})
        setInputs(inputs => ({
            ...inputs,
            confirmVin: text,
        }))
        setErrors((errors) => ({
            ...errors,
            confirmVin: error,
        }))
    }
    return {
        handleVinChange,
        handleConfirmVinChange,
        inputs,
        setInputs,
        errors,
        setErrors
    }
};
export default useRegisterCarForm;
