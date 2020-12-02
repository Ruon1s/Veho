import React, { useState } from 'react';
import { Container, Content, Spinner, StyleProvider, View } from 'native-base';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ResetPasswordForm from '../components/ResetPasswordForm';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import { StyleSheet } from 'react-native';

const Authentication = ({ navigation }) => {
    const [active, setActive] = useState('login');  //To switch between the forms

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Authentication' />
                <Content padder>
                    <View>
                        {active === 'login' ?
                        <LoginForm 
                            navigation={navigation}
                            toRegister={() => setActive('register')}
                            toResetPassword={() => setActive('resetPassword')}
                        />
                        :
                        active === 'register' ?
                        <RegisterForm 
                            navigation={navigation}
                            toLogin={() => setActive('login')}
                        />
                        :
                        active === 'resetPassword' ?
                        <ResetPasswordForm
                            toLogin={() => setActive('login')}
                        />
                        :
                        null}
                    </View>
                </Content>
            </Container>
        </StyleProvider>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Authentication;
