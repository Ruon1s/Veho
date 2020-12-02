import React, { useState } from 'react';
import { Button, Input, Form, Text, Item, Label, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import useLoginForm from '../hooks/LoginHook';
import firebase from 'firebase'
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
                <Label>Email</Label>
                <Input
                keyboardType="email-address"
                value={inputs.email}
                onChangeText={handleEmailChange}
                />
            </Item>
            <Item floatingLabel>
                <Label>Password</Label>
                <Input
                    autoCapitalize='none'
                    secureTextEntry={true}
                    value={inputs.password}
                    onChangeText={handlePasswordChange}
                />
            </Item>

            <Grid>
                <Col>
                    <Button style={GlobalStyles.button} full onPress={login} disabled={!inputs.email || !inputs.password}>
                        <Text>Login</Text>
                    </Button>
                </Col>
                <Col>
                    <Button style={GlobalStyles.button} full onPress={toRegister}>
                        <Text>Register</Text>
                    </Button>
                </Col>
            </Grid>

            <Button transparent style={GlobalStyles.button} full onPress={toResetPassword}>
                <Text>Forgot password?</Text>
            </Button>
        </Form>
    );
};

export default LoginForm;
