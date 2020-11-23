import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import useRegisterCarForm from "../hooks/RegisterCarHook";

const RegisterCarForm = ({ navigation, toLogin }) => {
    const {
        handleVinChange,
        handleConfirmVinChange,
        inputs,
        errors
    } = useRegisterCarForm();

    const registerVehicle = async () => {
        console.log('vin', inputs.licencePlate)
        //if(inputs.vin === inputs.confirmVin) {
        const user = firebase.auth().currentUser;
        console.log(user)
        const db = firebase.firestore();
        db.collection('users').doc(user.uid).collection('cars').add({
            licencePlate: inputs.licencePlate,
            name: inputs.carName,
            vin: null
        })

        navigation.replace('App')
    };

    return (
        <Form>
            <Item floatingLabel>
                <Label>Licence plate number</Label>
                <Input
                    autoCapitalize='none'
                    value={inputs.licencePlate}
                    onChangeText={handleVinChange}
                />
            </Item>

            <Item floatingLabel>
                <Label>Car name</Label>
                <Input
                    value={inputs.carName}
                    onChangeText={handleConfirmVinChange}
                />
            </Item>
            {errors.licencePlate || errors.carName || !inputs.licencePlate || !inputs.carName ?
                <Button
                    full
                    disabled
                    style={GlobalStyles.button}
                    onPress={registerVehicle}>
                    <Text>Save</Text>
                </Button> : <Button
                    full
                    style={GlobalStyles.button}
                    onPress={registerVehicle}>
                    <Text>Save</Text>
                </Button>
            }
        </Form>
    )
};

export default RegisterCarForm;
