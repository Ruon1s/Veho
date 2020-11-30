import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View, StyleProvider, Toast, Root, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import CustomHeader from '../components/CustomHeader';
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as firebase from 'firebase';
import 'firebase/firestore';
import useQueueHooks from '../hooks/QueueHooks';
import HomeQueueLayout from '../components/HomeQueueLayout';
import HomeListLayout from '../components/HomeListLayout';
import useFirebase from "../hooks/FireBaseHook";
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

const Home = ({ navigation }) => {
    const { currentUser, getUser, loading, getUserCars, carArray, prioritizeCar } = useFirebase();

    useEffect(() => {
        getUser()
        getUserCars()
    }, []);

    const getCarVin = async () => {
        const user = firebase.auth().currentUser;
        console.log(user)
        const db = firebase.firestore();

        const carsRef = db.collection('cars');
        const snapshot = await carsRef.where('uid', '==', user.uid).get();
        if (snapshot.empty) {
            console.log('No documents.');
            return;
        }
        const carVin = snapshot.docs[0].data().vin
        console.log('current users cars vin number: ', carVin)
        return carVin
    }

    return (
        <Root>
            {loading ? <Spinner /> :
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <CustomHeader
                            title='Home'
                            subtitle={currentUser}
                        />
                        {currentUser.role === "standard" || currentUser.rol === "admin" ? <HomeQueueLayout user={currentUser} navigation={navigation} /> :
                            <HomeListLayout carArray={carArray} prioritizeCar={prioritizeCar} />}
                        {/* {userType && userType === 'manager' && <HomeListLayout carArray={carArray} />} */}
                    </Container >
                </StyleProvider >
            }
        </Root>
    );
}

export default Home;
