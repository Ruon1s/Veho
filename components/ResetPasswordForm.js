import React, { useState } from 'react';
import { Text, Form, Input, Button, Item, Label, Spinner } from 'native-base';
import GlobalStyles from '../styles/GlobalStyles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import i18n from 'i18n-js';
import firebase from 'firebase';
import ErrorText from './ErrorText';

const ResetPasswordForm = ({ toLogin }) => {
    const [errors, setErrors] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const resetPassword = async () => {
        try {
            setLoading(true);

            await firebase.auth().sendPasswordResetEmail(email);

            setLoading(false);
            setSuccess('An email has been sent to your email address.');
        } catch (error) {
            setLoading(false);
            setErrors(error.message);

            setTimeout(() => {
                setErrors('');
            }, 2000);
        }
    }

    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    errors ?
                        <ErrorText text={errors} />
                        :
                        success ?
                            <>
                                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}> {success} </Text>
                                <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                                    <Text>
                                        {i18n.t('backToLogin')}
                                    </Text>
                                </Button>
                            </>
                            :
                            <Form>
                                <Item floatingLabel>
                                    <Label>{i18n.t('email')}</Label>
                                    <Input
                                        placeholder="Enter email"
                                        keyboardType="email-address"
                                        onChangeText={text => setEmail(text)}
                                        value={email}
                                        autoCapitalize="none"
                                    />
                                </Item>
                                <Grid>
                                    <Col>
                                        <Button full style={GlobalStyles.button} onPress={resetPassword} >
                                            <Text>
                                                {i18n.t('reset')}
                                            </Text>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                                            <Text>
                                                {i18n.t('back')}
                                            </Text>
                                        </Button>
                                    </Col>
                                </Grid>
                            </Form>}
        </>
    );
}

export default ResetPasswordForm