import React from 'react';
import { Button, Form, Input, Container, Text, Item, Label, Content } from 'native-base';

const RegisterForm = ({ toLogin }) => {
    const btnMargin = 8
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
                    <Button full style={{ margin: btnMargin }} >
                        <Text>
                            Register
                        </Text>
                    </Button>
                    <Button full transparent style={{ margin: btnMargin }} onPress={toLogin}>
                        <Text>Back to login</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
    );
};

export default RegisterForm;