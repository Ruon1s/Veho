import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const ResetPasswordForm = ({ toLogin }) => {
    return (
        <View>
            <Text> Reset password </Text>
            <TextInput placeholder="Email" keyboardType="email-address" />
            <Button title="Reset" />
            <Text onPress={ toLogin }>Back</Text>
        </View>
    );
}

export default ResetPasswordForm