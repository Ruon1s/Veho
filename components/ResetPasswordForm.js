import React from 'react';
import { Container, Text, Form, Input, Button, Item, Label, Content } from 'native-base';

const ResetPasswordForm = ({ toLogin }) => {
    return (
        <Content padder>
            <Form>
                <Text> Reset password </Text>
                <Item fixedLabel>
                    <Label keyboardType="email-address">Email</Label>
                    <Input />
                </Item>
                <Button title="Reset" />
                <Button onPress={toLogin}>
                    <Text>
                        Back
                </Text>
                </Button>
            </Form>
        </Content>
    );
}

export default ResetPasswordForm