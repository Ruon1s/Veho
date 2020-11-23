import React from 'react';
import { Container, Text, Content, StyleProvider, Label, Input, Item, Button, Form } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import NotificationTest from '../components/NotificationTest';
import useSettingsForm from '../hooks/SettingsHook.js'
import { useState, useEffect } from 'react'
import GlobalStyles from "../styles/GlobalStyles";



const Settings = ({navigation}) => {

    const toAddCar = () => {
        navigation.navigate('AddCarDetails')
    }

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>
                    <Button
                        full
                        style={GlobalStyles.button}
                        onPress={toAddCar}
                        >
                        <Text>Add new car</Text>
                    </Button>

                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;
