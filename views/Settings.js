import React from 'react';
import { Container, Text, Content, StyleProvider } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import NotificationTest from '../components/NotificationTest';

const Settings = () => {
    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>
                    <Text>As everything else in the app, settings page is still heavily under development</Text>
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;