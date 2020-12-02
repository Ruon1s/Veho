import React from 'react';
import { Container, Text, Content, StyleProvider, Label, Input, Item, Button, Form, Spinner } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import { useState, useEffect } from 'react'
import GlobalStyles from "../styles/GlobalStyles";
import firebase from 'firebase';
import 'firebase/firestore';
import useFirebase from '../hooks/FireBaseHook';
import CarList from "../components/CarList";
import i18n from 'i18n-js';

const Settings = ({ navigation }) => {
    const { currentUser, getUser, getUserCars, carArray, loading, deleteCar } = useFirebase();

    const toAddCar = () => {
        navigation.navigate('AddCarDetails')
    }

    const logout = async () => {                                                            //Functions that logs the user out (Need to be changed to Settings page later?)
        await firebase.auth().signOut();
        navigation.replace('Auth');
    }

    useEffect(() => {
        getUser();
        getUserCars()
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
                        <Text>{i18n.t('addNewCar')}</Text>
                    </Button>
                    {currentUser.role === 'admin' &&
                        <Button full style={GlobalStyles.button}
                            onPress={() => navigation.navigate('AdminPanel', { user: currentUser })}>
                            <Text>{i18n.t('adminPanel')}</Text>
                        </Button>}
                    {loading ? <Spinner /> :
                        <CarList carArray={carArray} deleteCar={deleteCar} />
                    }
                    <Button
                        block
                        danger transparent
                        style={GlobalStyles.button}
                        onPress={logout}>
                        <Text>{i18n.t('logout')}</Text>
                    </Button>
                </Content>
            </Container>
        </StyleProvider>

    );
}

export default Settings;
