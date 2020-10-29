import React from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';

const LoginForm = ({ navigation, toResetPassword, toRegister }) => {
    return (
        <Container>
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

                    <Button onPress={() => navigation.replace('App')}>
                        <Text>Login</Text>
                    </Button>
                    <Button onPress={toResetPassword}>
                        <Text>Forgot password?</Text>
                    </Button>
                    <Button onPress={toRegister}>
                        <Text>Register</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
    );
};

export default LoginForm;