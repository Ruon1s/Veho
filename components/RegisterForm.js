import React, { useState, useEffect } from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content, View } from 'native-base';
import useRegisterForm from '../hooks/RegisterHook.js';
import * as firebase from 'firebase';
import 'firebase/firestore';
import DropDownMenu from "./DropdownMenu";
import i18n from 'i18n-js';

const RegisterForm = ({ navigation, toLogin, props }) => {
    const {
        handleEmailChange,
        handleFirstNameChange,
        handleLastNameChange,
        handleConfirmPasswordChange,
        handlePasswordChange,
        inputs,
        errors
    } = useRegisterForm();


    const [selected, setSelected] = useState('');

    const onSelect = (value) => {
        console.log('Selected: ' + value)
        setSelected(value)
    }

    useEffect(() => {
        console.log('selectedState ' + selected)
    }, [selected])

    const register = async () => {
        let check = true;
        console.log('inputs', inputs);
        if (inputs.firstName !== '' && inputs.lastName !== '' && inputs.email !== '' && inputs.password !== '' && inputs.confirmPassword !== '' && inputs.password === inputs.confirmPassword) {
            await firebase.auth().createUserWithEmailAndPassword(inputs.email, inputs.password).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                check = false
            });

            await firebase.auth().signInWithEmailAndPassword(inputs.email, inputs.password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                check = false;
            });

            const db = firebase.firestore();
            const user = firebase.auth().currentUser;
            await db.collection('users').doc(user.uid).set({
                email: inputs.email,
                firstname: inputs.firstName,
                lastname: inputs.lastName,
                location: selected,
                role: 'standard'
            });

            if (check === true) {
                navigation.replace('AddCarDetails')
            } else {
                console.log("account not created")
            }
        } else {
            if (inputs.firstName === '') {
                handleFirstNameChange(inputs.firstName)
            }
            if (inputs.lastName === '') {
                await handleLastNameChange(inputs.lastName)
            }
            if (inputs.email === '') {
                await handleEmailChange(inputs.email)
            }
            if (inputs.password === '') {
                await handlePasswordChange(inputs.password)
            }
            if (inputs.confirmPassword === '') {
                await handleConfirmPasswordChange(inputs.confirmPassword)
            }
        }
        console.log("register pushed", errors)
    };

    return (
        <Form>
            <DropDownMenu selected={selected} onSelect={onSelect} />
            <Item floatingLabel>
                <Label>{i18n.t('firstName')} {errors.firstName && inputs.firstName.length >= 0 &&
                    <Text style={{ color: "#FB3664" }}>{i18n.t('nameError')}</Text>}
                </Label>
                <Input
                    value={inputs.firstName}
                    onChangeText={handleFirstNameChange}
                />

            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('lastName')} {errors.lastName && inputs.lastName.length >= 0 &&
                    <Text style={{ color: "#FB3664" }}>{i18n.t('nameError')}</Text>}
                </Label>
                <Input
                    value={inputs.lastName}
                    onChangeText={handleLastNameChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('email')} {errors.email && inputs.email.length >= 0 &&
                    <Text style={{ color: "#FB3664" }}>{i18n.t('emailError')}</Text>}
                </Label>
                <Input
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={inputs.email}
                    onChangeText={handleEmailChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('password')}  {errors.password && inputs.password.length >= 0 &&
                    <Text style={{ color: "#FB3664" }}>{i18n.t('passwordError')}</Text>}
                </Label>
                <Input
                    autoCapitalize='none'
                    secureTextEntry
                    value={inputs.password}
                    onChangeText={handlePasswordChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('repeatPassword')}</Label>
                <Input
                    autoCapitalize='none'
                    secureTextEntry
                    value={inputs.confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                />
            </Item>

            {   errors.firstName ||
                errors.lastName ||
                errors.email ||
                errors.password ||
                !inputs.firstName ||
                !inputs.lastName ||
                !inputs.email ||
                !inputs.password ||
                !inputs.confirmPassword ?
                <Button
                    full
                    disabled
                    style={GlobalStyles.button}
                    onPress={register}
                ><Text>{i18n.t('register')}</Text>
                </Button> : <Button
                    full
                    style={GlobalStyles.button}
                    onPress={register}>
                    <Text>{i18n.t('register')}</Text>
                </Button>}
            <Button full transparent style={GlobalStyles.button} onPress={toLogin}>
                <Text>{i18n.t('backToLogin')}</Text>
            </Button>
        </Form>
    );
};

export default RegisterForm;
