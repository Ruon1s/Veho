import React from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../GlobalStyles';

const LoginForm = ({ navigation, toResetPassword, toRegister }) => {
    return (
        <Form>
            <Text>Login</Text>
            <Item fixedLabel>
                <Label>Email</Label>
                <Input keyboardType="email-address" />
            </Item>
            <Item fixedLabel>
                <Label>Password</Label>
                <Input secureTextEntry={true} />
            </Item>

            <Grid>
                <Col>
                    <Button style={GlobalStyles.button} full onPress={() => navigation.replace('App')}>
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
