import React, { useState } from 'react';
import { Text, Form, Input, Button, Item, Label, Spinner } from 'native-base';
import GlobalStyles from '../styles/GlobalStyles';
import { Col, Grid } from 'react-native-easy-grid';
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
            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}> {success} </Text>
            <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                <Text>
                    Back to login
                </Text>
            </Button>
        </>
        :
            <Form>
                <Item floatingLabel>
                    <Label>Email</Label>
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
                                Reset
                            </Text>
                        </Button>
                    </Col>
                    <Col>
                        <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                            <Text>
                                Back
                            </Text>
                        </Button>
                    </Col>
                </Grid>
            </Form>}
        </>
    );
}

export default ResetPasswordForm