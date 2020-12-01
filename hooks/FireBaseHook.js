import React from 'react'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useState } from 'react'
import useApiHooks from "./ApiHooks";


const useFirebase = () => {
    const [locations, setLocations] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState([]);

    const {fetchSoc} = useApiHooks();

    const getUser = async () => {
        setLoading(true);
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        if (user) {
            const userRef = db.collection('users').doc(user.uid);
            const doc = await userRef.get();
            if (!doc.exists) {
                console.log('no user found')
            } else {

                setCurrentUser(doc.data());

            }
            setLoading(false)
        }
    };

    const deleteCar = async (car) => {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore()
        await db.collection('users').doc(user.uid).collection('cars').doc(car.id).delete();
        console.log(car.name, ': deleted');
        getUserCars()
    }

    const getUserCars = async () => {
        setLoading(true)
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        const carsRef = db.collection('users').doc(user.uid).collection('cars').orderBy('priority', 'desc') // GET cars, prioritized first
        // const carsRef = db.collection('users').doc(user.uid).collection('cars') // GET cars normally

        const snapshot = await carsRef.get();

        setCars([]);
        snapshot.forEach(doc => {
            const carData = doc.data();
        //TODO remove comments after we get registeration numbers to the fleet

        //   const soc = fetchSoc(carData.vin)
            setCars(previousState => ([
                ...previousState, {
                    ...carData,
                    id: doc.id,
                 //   soc: soc
                }
            ]));
        });
        setLoading(false)
    };


    const prioritizeCar = async (car) => {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        if (car.priority === true) {
            await db.collection('users').doc(user.uid).collection('cars').doc(car.id).update({
                priority: false
            });
        } else {
            await db.collection('users').doc(user.uid).collection('cars').doc(car.id).update({
                priority: true
            });
        }

       getUserCars();
    };


    const getLocations = async () => {
        const db = firebase.firestore();
        const locationsRef = db.collection('locations');
        const snapShot = await locationsRef.get();

        snapShot.forEach(doc => {
            const locationData = doc.data();
            if (locations.find(doc => doc.id === location.id) !== undefined) {
                return
            }
            setLocations(previousState => ([
                ...previousState, {
                    ...locationData,
                    id: doc.id
                }
            ]));
            console.log('locations', locations)
        });
    };

    return {
        deleteCar,
        getUser,
        getUserCars,
        getLocations,
        prioritizeCar,
        carArray: cars,
        locations,
        setLocations,
        currentUser,
        setCurrentUser,
        loading,

    }
};

export default useFirebase

