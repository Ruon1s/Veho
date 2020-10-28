import React, { useState } from 'react';
import { View } from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ResetPasswordForm from '../components/ResetPasswordForm';

const Authentication = ({ navigation }) => {
    const [active, setActive] = useState('login');

    return (
        <View>
            {active === 'login' ?
            <LoginForm 
            toResetPassword={ () => setActive('resetPassword') } 
            toRegister={ () => setActive('register') }
            navigation={ navigation }
            /> : null}

            {active === 'resetPassword' ?
            <ResetPasswordForm toLogin={ () => setActive('login') } /> 
            : null}

            {active === 'register' ?
            <RegisterForm toLogin={ () => setActive('login') } />
            : null}
        </View>
    );
};

export default Authentication;