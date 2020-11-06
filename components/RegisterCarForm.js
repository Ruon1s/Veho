import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';

const RegisterCarForm = ({ navigation, toLogin }) => {
    return (
        <Form>
            <Item floatingLabel>
                <Label>Your car ID</Label>
                <Input />
            </Item>

            <Item floatingLabel>
                <Label>Retype your car ID</Label>
                <Input />
            </Item>

            <Item floatingLabel>
                <Label>Your car Register-number</Label>
            </Item>

            <Button
                full
                style={GlobalStyles.button}
                onPress={() => navigation.replace('App')}>
                <Text>Save</Text>
            </Button>
        </Form>
    );
};

export default RegisterCarForm;