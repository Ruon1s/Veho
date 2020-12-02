import React, { useState, useEffect } from 'react';
import { Container, StyleProvider, Spinner } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import CustomHeader from '../components/CustomHeader';
import 'firebase/firestore';
import HomeQueueLayout from '../components/HomeQueueLayout';
import HomeListLayout from '../components/HomeListLayout';
import useFirebase from "../hooks/FireBaseHook";

const Home = ({ navigation }) => {
    const [userType, setUserType] = useState('Normal');      // Values: Normal & Manager
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
        loading ? 
        <Spinner /> 
        :
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader
                    title='Home'
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
