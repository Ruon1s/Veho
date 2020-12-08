import React from 'react'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useState } from 'react'
import useApiHooks from "./ApiHooks";

/**
 * File to hold all the firebase firestore related functionality
 * @returns {{getUserCars: *, setCurrentUser: *, currentUser: *, deleteCar: *, getUser: *, carArray: *, getLocations: *, setLocations: *, locations: *, prioritizeCar: *, loading: *}}
 */

const useFirebase = () => {
    //all available locations for registering
    const [locations, setLocations] = useState([]);
    // data of currently logged in user
    const [currentUser, setCurrentUser] = useState({});
    //for conditional rendering so that some components render only after the function has finished
    const [loading, setLoading] = useState(true);
    //data of single users cars
    const [cars, setCars] = useState([]);

    //get fetchSoc function from ApiHooks
    const {fetchSoc} = useApiHooks();

    const user = firebase.auth().currentUser;
    const db = firebase.firestore();


    /**
     * function for getting currently logged in users data to a state
     * @returns {Promise<void>}
     */
    const getUser = async () => {
        setLoading(true);
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

    /**
     * Deletion of a single car of an user from a list of cars
     * @see carDropdown.js
     * @param car
     */
    const deleteCar = async (car) => {
        await db.collection('users').doc(user.uid).collection('cars').doc(car.id).delete();
        console.log(car.name, ': deleted');
        getUserCars()
    };

    /**
     * function to get all of a single users cars data into a state from the database
     * order those cars by their priority status
     * and fetch their current state of charge
     */
    const getUserCars = async () => {
        setLoading(true)
        const carsRef = db.collection('users').doc(user.uid).collection('cars').orderBy('priority', 'desc') // GET cars, prioritized first
        // const carsRef = db.collection('users').doc(user.uid).collection('cars') // GET cars normally

        const snapshot = await carsRef.get();

        setCars([]);
        snapshot.forEach(async doc => {
            const carData = doc.data();
        //TODO remove comments after we get registeration numbers to the fleet
            console.log('carData.vin in getUsercars', carData.vin)
           const soc = await fetchSoc(carData.vin);
            setCars(previousState => ([
                ...previousState, {
                    ...carData,
                    id: doc.id,
                    soc: soc
                }
            ]));
        });
        setLoading(false)
    };

    /**
     * function that takes a car from a list and
     * changes its priority status from true to false or vice versa
     * @see HomeListLayout.js
     * @param car
     */
    const prioritizeCar = async (car) => {
        if (car.priority === true) {
            await db.collection('users').doc(user.uid).collection('cars').doc(car.id).update({
                priority: false
            });
        } else {
            await db.collection('users').doc(user.uid).collection('cars').doc(car.id).update({
                priority: true
            });
        }
//for refreshing the view
       getUserCars();
    };

    /**
     * gets all locations for registration
     * @returns {Promise<void>}
     */
    const getLocations = async () => {
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

