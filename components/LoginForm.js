import React, { useState } from 'react';
import { Button, Input, Form, Text, Item, Label, Spinner } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import useLoginForm from '../hooks/LoginHook';
import firebase from 'firebase'
import i18n from 'i18n-js';
import ErrorText from './ErrorText';


const LoginForm = ({ navigation, toResetPassword, toRegister }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const {
        handlePasswordChange,
        handleEmailChange,
        inputs
    } = useLoginForm();

    const login = async () => {
        try {
            setLoading(true);

            await firebase.auth().signInWithEmailAndPassword(inputs.email, inputs.password);

            navigation.replace('App');

            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message);

            setTimeout(() => {
                setError();
            }, 2000);
        }
    };


    return (
        loading ?
            <Spinner />
            :
            error ?
                <ErrorText text={error} />
                :
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
                            <Button bordered style={GlobalStyles.button} full onPress={toRegister}>
                                <Text>{i18n.t('createUser')}</Text>
                            </Button>
                        </Col>
                    </Grid>
                    <Button danger transparent style={GlobalStyles.button} full onPress={toResetPassword}>
                        <Text>{i18n.t('forgotPassword')}</Text>
                    </Button>


                </Form>
    );
};

export default LoginForm;
