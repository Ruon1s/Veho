import React from 'react';
import { Button, TextInput, View, Text } from 'react-native';

const RegisterForm = ({ toLogin }) => {
    return (
        <View>
            <Text> Register </Text>
            <TextInput placeholder="First name" />
            <TextInput placeholder="Last name" />
            <TextInput placeholder="Email" keyboardType="email-address" />
            <TextInput placeholder="Password" secureTextEntry={ true } />
            <TextInput placeholder="Retype Password" secureTextEntry={ true } />
            <Button title="Register" />
            <Text onPress={ toLogin }>Login</Text>
        </View>
    );
};

export default RegisterForm;