import React from 'react';
import { View, Button, TextInput, Text } from 'react-native';

const LoginForm = ({ navigation, toResetPassword, toRegister }) => {
    return (
        <View>
            <Text> Login </Text>
            <TextInput placeholder="Email" keyboardType="email-address" />
            <TextInput placeholder="Password" secureTextEntry={ true } />
            <Button title="Login" onPress={ () => navigation.replace('App') } />

            <Text onPress={ toResetPassword }>Forgot password?</Text>
            <Text onPress={ toRegister }>Register</Text>
        </View>
    );
};

export default LoginForm;