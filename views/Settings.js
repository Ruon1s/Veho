import React from 'react';
import { Container, Text, Content, StyleProvider } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

const Settings = () => {
    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>

                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;