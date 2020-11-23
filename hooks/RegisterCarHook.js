import {useState} from 'react';
import validate from 'validate.js'

const RegisterCarConstraints = {
    licencePlate: {
        length: {
            maximum: 7
        }
    },
    carName: {
        length:{
            minimum: 3
        }
    },
};

const useRegisterCarForm = () => {
    const [inputs, setInputs] = useState({licencePlate: '', carName: ''});
    const [errors, setErrors] = useState({});

    const handleVinChange = (text) => {
        const error = validate({licencePlate: text}, {licencePlate: RegisterCarConstraints.licencePlate})
        setInputs(inputs => ({
            ...inputs,
            licencePlate: text,
        }))
        setErrors((errors) => ({
            ...errors,
            licencePlate: error,
        }))
    }
    const handleConfirmVinChange = (text) => {
        const error = validate({carName: text, vin: text}, {carName: RegisterCarConstraints.carName})
        setInputs(inputs => ({
            ...inputs,
            carName: text,
        }))
        setErrors((errors) => ({
            ...errors,
            carName: error,
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
