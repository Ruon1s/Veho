import React from 'react';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';

const RegisterForm = ({ navigation, toLogin }) => {
    const btnMargin = 8
    return (
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
                <Label>Password</Label>
                <Input secureTextEntry />
            </Item>
            <Item fixedLabel>
                <Label>Retype password</Label>
                <Input secureTextEntry />
            </Item>
            <Button 
            full 
            style={{ margin: btnMargin }}
            onPress={ () => navigation.replace('AddCarDetails') }
             >
                <Text>
                    Register
                </Text>
            </Button>
            <Button full transparent style={{ margin: btnMargin }} onPress={toLogin}>
                <Text>Back to login</Text>
            </Button>
        </Form>
    );
};

export default RegisterForm;