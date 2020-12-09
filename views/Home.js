import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Container, StyleProvider, Spinner } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import CustomHeader from '../components/CustomHeader';
import 'firebase/firestore';
import HomeQueueLayout from '../components/HomeQueueLayout';
import HomeListLayout from '../components/HomeListLayout';
import useFirebase from "../hooks/FireBaseHook";
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import i18n from 'i18n-js';

const Home = ({ navigation }) => {
    const { currentUser, getUser, loading, getUserCars, carArray, prioritizeCar } = useFirebase();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    console.log('Dimensions: ' + windowWidth, windowHeight)

    useEffect(() => {
        getUser()
        getUserCars()
    }, []);

    return (
        loading ?
            <Spinner />
            :
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <CustomHeader
                        title={i18n.t('home')}
                        subtitle={currentUser}
                    />
                    {currentUser.role === "standard" || currentUser.role === "admin" ?
                        <HomeQueueLayout user={currentUser} carArray={carArray} navigation={navigation} />
                        :
                        <HomeListLayout carArray={carArray} prioritizeCar={prioritizeCar} />}
                </Container >
            </StyleProvider >
    );
}

export default Home;
