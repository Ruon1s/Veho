import React from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const LoginForm = ({ navigation, toResetPassword, toRegister }) => {

    const btnMargin = 8

    return (
        <Content padder>
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
                        <Button style={{ margin: btnMargin }} full onPress={() => navigation.replace('App')}>
                            <Text>Login</Text>
                        </Button>
                    </Col>
                    <Col>
                        <Button style={{ margin: btnMargin }} full onPress={toRegister}>
                            <Text>Register</Text>
                        </Button>
                    </Col>
                </Grid>

                <Button transparent full onPress={toResetPassword}>
                    <Text>Forgot password?</Text>
                </Button>
            </Form>
        </Content>
    );
};

export default LoginForm;