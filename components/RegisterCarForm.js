import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import useRegisterCarForm from "../hooks/RegisterCarHook";
import useApiHooks from "../hooks/ApiHooks";
import { Alert } from "react-native-web";
import i18n from 'i18n-js';

const RegisterCarForm = ({ navigation, toLogin }) => {
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
        }
    }


    return (
        <Form>
            <Text>
                {i18n.t('registerCarInfo')}
            </Text>
            <Text>
                {i18n.t('registerCarDemoInfo')}
            </Text>
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
            {
                errors.licencePlate || errors.carName || !inputs.licencePlate || !inputs.carName ?
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
        </Form >
    )
};

export default RegisterCarForm;
