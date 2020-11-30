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
    const [available, setAvailable] = useState();           //To check if there is a spot available right away
    const [batteryStatus, setBatteryStatus] = useState(54);
    const [carArray, setCarArray] = useState([]);
    const { currentUser, getUser, loading, userType } = useFirebase();

    useEffect(() => {
        getUser()
        getUserCars()
        console.log('currentUser in useEffect: ', currentUser)
        console.log('userType in useEffect: ', userType)
    }, []);


    const getUserCars = async () => {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        const carsRef = db.collection('users').doc(user.uid).collection('cars')
        const snapshot = await carsRef.get();

        let array = []
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data())
            array.push(doc.data())
            console.log(carArray)
        })
        setCarArray(array)
    }
/*
    const onValueChange = () => {
        switch (userType) {
            case 'Normal': {
                setUserType('Manager')
                break;
            }
            case 'Manager': {
                setUserType('Normal')
                break;
            }
        }
    }
*/
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
                        {userType && userType === "standard" || userType === "admin" && <HomeQueueLayout user={currentUser} navigation={navigation} />}
                        {userType && userType === 'manager' && <HomeListLayout carArray={carArray} />}
                    </Container >
                </StyleProvider >
            }
        </Root>
    );
}

export default Home;
