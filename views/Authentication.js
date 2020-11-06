import React, { useState } from 'react';
import { Container, Content } from 'native-base';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ResetPasswordForm from '../components/ResetPasswordForm';
import CustomHeader from '../components/CustomHeader';

const Authentication = ({ navigation }) => {
    const [active, setActive] = useState('login');

    return (
        <Container>
            <CustomHeader title={active} />
            <Content padder>
                {active === 'login' &&
                    <LoginForm
                        toResetPassword={() => setActive('resetPassword')}
                        toRegister={() => setActive('register')}
                        navigation={navigation}
                    />}

                {active === 'resetPassword' &&
                    <ResetPasswordForm toLogin={() => setActive('login')} />}

                {active === 'register' &&
                    <RegisterForm
                        toLogin={() => setActive('login')}
                        navigation={navigation}
                    />}
            </Content>
        </Container>
    );
};

export default Authentication;