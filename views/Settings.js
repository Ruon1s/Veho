import React from 'react';
import { Container, Text, Content, StyleProvider, Label, Input, Item, Button, Form } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import NotificationTest from '../components/NotificationTest';
import useSettingsForm from '../hooks/SettingsHook.js'
import { useState, useEffect } from 'react'
import GlobalStyles from "../styles/GlobalStyles";
import firebase from 'firebase';
import 'firebase/firestore';
import useFirebase from '../hooks/FireBaseHook';

const Settings = ({ navigation }) => {
    const { currentUser, getUser } = useFirebase();

    const toAddCar = () => {
        navigation.navigate('AddCarDetails')
    }

    const logout = async () => {                                                            //Functions that logs the user out (Need to be changed to Settings page later?)
        await firebase.auth().signOut();
        navigation.replace('Auth');
    }

    const {
        getCarVin,
        carVin,
        setCarVin,
        changeEditable,
        editable,
        editCarVin
    } = useSettingsForm();

    useEffect(() => {
        getCarVin().then(r => setCarVin(r))
        getUser();
    }, []);

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>
                    <Button
                        block
                        style={GlobalStyles.button}
                        onPress={toAddCar}>
                        <Text>Add new car</Text>
                    </Button>
                    {currentUser.role === 'admin'  && 
                    <Button full style={ GlobalStyles.button } onPress={ () => navigation.navigate('AdminPanel', { user: currentUser }) }>
                        <Text>Admin Panel</Text>
                    </Button>}
                    <Button
                        block
                        danger transparent
                        style={GlobalStyles.button}
                        onPress={logout}>
                        <Text>Logout</Text>
                    </Button>
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;
