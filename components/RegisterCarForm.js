import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import useRegisterCarForm from "../hooks/RegisterCarHook";
import useApiHooks from "../hooks/ApiHooks";
import { useState } from 'react'
import { Alert } from "react-native-web";
import i18n from 'i18n-js';
import ErrorText from "./ErrorText";

const RegisterCarForm = ({ navigation, toLogin }) => {
    const [error, setError] = useState();
    const {
        handleCarNameChange,
        handleLicencePlateChange,
        inputs,
        errors
    } = useRegisterCarForm();

    const { fetchVin } = useApiHooks();



    const registerVehicle = async () => {
        console.log('Rekkari: ', inputs.licencePlate);
        const user = firebase.auth().currentUser;
        console.log(user)
        const db = firebase.firestore();

        const vin = await fetchVin(inputs.licencePlate)

        if (vin !== undefined) {

            db.collection('users').doc(user.uid).collection('cars').add({
                licencePlate: inputs.licencePlate,
                name: inputs.carName,
                vin: vin,
                priority: false
            })

            navigation.replace('App')
        } else {
            //TODO make an alert or something
            console.log('car doesnt exist');
            setError(i18n.t('addCarErrorMessage'))
            setTimeout(() => {
                setError()
            }, 3000);
        }
    }


    return (
        <Form>
            <Item floatingLabel>
                <Label>{i18n.t('licensePlate')}</Label>
                <Input
                    autoCapitalize='none'
                    value={inputs.licencePlate}
                    onChangeText={handleLicencePlateChange}
                />
            </Item>

            <Item floatingLabel>
                <Label>{i18n.t('carName')}</Label>
                <Input
                    value={inputs.carName}
                    onChangeText={handleCarNameChange}
                />
            </Item>
            {errors.licencePlate || errors.carName || !inputs.licencePlate || !inputs.carName ?
                <Button
                    full
                    disabled
                    style={GlobalStyles.button}
                    onPress={registerVehicle}>
                    <Text>{i18n.t('save')}</Text>
                </Button> : <Button
                    full
                    style={GlobalStyles.button}
                    onPress={registerVehicle}>
                    <Text>{i18n.t('save')}</Text>
                </Button>
            }
            { error ?
                <ErrorText text={error} /> : null
            }
        </Form>
    )
};

export default RegisterCarForm;
