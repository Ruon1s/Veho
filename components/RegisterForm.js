import React from 'react';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';

const RegisterForm = ({ toLogin }) => {
    return (
        <Container>
            <Content padder>
                <Form>
                    <Text>Register</Text>

                    <Item fixedLabel>
                        <Label>First Name</Label>
                        <Input />
                    </Item>
                    <Item fixedLabel>
                        <Label>Last Name</Label>
                        <Input />
                    </Item>
                    <Item fixedLabel>
                        <Label keyboardType='email-address'>Email</Label>
                        <Input />
                    </Item>
                    <Item fixedLabel>
                        <Label secureTextEntry={true}>Password</Label>
                        <Input />
                    </Item>
                    <Item fixedLabel>
                        <Label secureTextEntry={true}>Retype password</Label>
                        <Input />
                    </Item>
                    <Button title="Register" />
                    <Button onPress={toLogin}>
                        <Text>Login</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
    );
};

export default RegisterForm;