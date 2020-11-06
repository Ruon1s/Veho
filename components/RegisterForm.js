import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';

const RegisterForm = ({ navigation, toLogin }) => {
    return (
        <Form>
            <Item floatingLabel>
                <Label>First Name</Label>
                <Input />
            </Item>
            <Item floatingLabel>
                <Label>Last Name</Label>
                <Input />
            </Item>
            <Item floatingLabel>
                <Label keyboardType='email-address'>Email</Label>
                <Input />
            </Item>
            <Item floatingLabel>
                <Label>Password</Label>
                <Input secureTextEntry />
            </Item>
            <Item floatingLabel>
                <Label>Retype password</Label>
                <Input secureTextEntry />
            </Item>
            <Button
                full
                style={GlobalStyles.button}
                onPress={() => navigation.replace('AddCarDetails')}
            >
                <Text>
                    Register
                </Text>
            </Button>
            <Button full transparent style={GlobalStyles.button} onPress={toLogin}>
                <Text>Back to login</Text>
            </Button>
        </Form>
    );
};

export default RegisterForm;