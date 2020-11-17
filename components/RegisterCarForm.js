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
        console.log('vin',inputs.vin)
        //if(inputs.vin === inputs.confirmVin) {
            const user = firebase.auth().currentUser;
            console.log(user)
            const db = firebase.firestore();
            db.collection('cars').add({
                uid: user.uid,
                vin: inputs.vin
            })


        navigation.replace('App')
    };



    return (
        <Form>
            <Item floatingLabel>
                <Label>Your car VIN</Label>
                <Input
                    autoCapitalize='none'
                    value={inputs.vin}
                    onChangeText={handleVinChange}
                />
            </Item>

            <Item floatingLabel>
                <Label>Retype your car VIN</Label>
                <Input
                    autoCapitalize='none'
                    value={inputs.confirmVin}
                    onChangeText={handleConfirmVinChange}
                />
            </Item>
            {errors.vin || errors.confirmVin || !inputs.vin || !inputs.confirmVin ?
                <Button
                    full
                    disabled
                    style={GlobalStyles.button}
                    onPress={registerVehicle}>
                    <Text>Save</Text>
                </Button>
                :
                <Button
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
