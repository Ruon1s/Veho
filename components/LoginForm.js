import React, { useEffect } from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import Picker from "./DropdownMenu";
import useLoginForm from '../hooks/LoginHook';
import firebase from 'firebase'
import i18n from 'i18n-js';

const LoginForm = ({ navigation, toResetPassword, toRegister }) => {
    const {
        handlePasswordChange,
        handleEmailChange,
        inputs
    } = useLoginForm();

    const login = async () => {
        let check = true;
        await firebase.auth().signInWithEmailAndPassword(inputs.email, inputs.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            check = false;
        });
        if (check === true) {
            navigation.replace('App')
        } else {
            console.log("sumtingwong")
        }
    };


    return (
        <Form>
            <Item floatingLabel>
                <Label>{i18n.t('email')}</Label>
                <Input
                    keyboardType="email-address"
                    value={inputs.email}
                    onChangeText={handleEmailChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('password')}</Label>
                <Input
                    autoCapitalize='none'
                    secureTextEntry={true}
                    value={inputs.password}
                    onChangeText={handlePasswordChange}
                />
            </Item>

            <Grid>
                <Col>
                    <Button style={GlobalStyles.button} full onPress={login}>
                        <Text>{i18n.t('login')}</Text>
                    </Button>
                </Col>
                <Col>
                    <Button style={GlobalStyles.button} full onPress={toRegister}>
                        <Text>{i18n.t('register')}</Text>
                    </Button>
                </Col>
            </Grid>

            <Button transparent style={GlobalStyles.button} full onPress={toResetPassword}>
                <Text>{i18n.t('forgotPassword')}</Text>
            </Button>
        </Form>
    );
};

export default LoginForm;
