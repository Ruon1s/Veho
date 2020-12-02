import {useState} from 'react';
import validate from 'validate.js'

/**
 * file for handling RegisterCarForm and validation
 */

//constraints for the fields
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

    /**
     * Sets inputs from license plate field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see RegisterCarConstraints.licencePlate
     */
    const handleLicencePlateChange = (text) => {
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
    /**
     * Sets inputs from name field to inputs state
     * validates to see if it matches the constraints
     * if there are errors they're put in the errors state
     * called when text in the field changes
     * @see RegisterCarConstraints.carName
     */
    const handleCarNameChange = (text) => {
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
        handleLicencePlateChange,
        handleCarNameChange,
        inputs,
        setInputs,
        errors,
        setErrors
    }
};
export default useRegisterCarForm;
