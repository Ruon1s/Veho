import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';
import useRegisterForm from '../hooks/RegisterHook.js';
import firebase from 'firebase'






const RegisterForm = ({ navigation, toLogin}) => {
    const {
        handleEmailChange,
        handleFirstNameChange,
        handleLastNameChange,
        handleConfirmPasswordChange,
        handlePasswordChange,
        inputs
    } = useRegisterForm();

    const register = async () => {
            console.log("register pushed")
            let check = true;
            await firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password).catch(function(error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                check = false
            });
            if(check === true) {
                navigation.replace('AddCarDetails')
            } else {
                console.log("account not created")
            }
    };

    return (
        <Form>
            <Item floatingLabel>
                <Label>First Name</Label>
                <Input
                value={inputs.firstName}
                onChangeText={handleFirstNameChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>Last Name</Label>
                <Input
                value={inputs.lastName}
                onChangeText={handleLastNameChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>Email</Label>
                <Input
                keyboardType='email-address'
                value={inputs.email}
                onChangeText={handleEmailChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>Password</Label>
                <Input
                secureTextEntry
                value={inputs.password}
                onChangeText={handlePasswordChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>Retype password</Label>
                <Input
                secureTextEntry
                value={inputs.confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                />
            </Item>
            <Button
                full
                style={GlobalStyles.button}
                onPress={register}
            >
                <Text>
                    Register
                </Text>
            </Button>
            <Button full transparent style={GlobalStyles.button} onPress={toLogin}>
                <Text>Back to login</Text>
            </Button>
        </Form>
    );
};

export default RegisterForm;
