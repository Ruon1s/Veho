import { useState } from "react";
import firebase from 'firebase';
import 'firebase/firestore';
import { Modal } from "react-native";

const useAdminHooks = () => {
    const [managers, setManagers] = useState([]);           //Keep track of the manager users that are found from the firebase
    const [locations, setLocations] = useState([]);         //Keep track of the locations that comes from the firebase
    const [managerQuery, setManagerQuery] = useState('');   //For searching the managers
    const [locationQuery, setLocationQuery] = useState(''); //For searching the locations
    const [emailQuery, setEmailQuery] = useState('');       //For searchin user from the database
    const [user, setUser] = useState();                     //User found from the database
    const [processing, setProcessing] = useState({          //For UI changes during networking
        fetching: false,                                    //When we fetch locations and/or managers
        adding: false,                                      //When we are adding location/setting users rights
        removing: '',                                       //When we are removing location/user rights
        searching: false,                                   //When we are searching a user from the database
        editing: false,
    });
    const [error, setError] = useState({                    //For notifying user if an error occurs (type = function name, message = catch methods error message)
        type: '',
        message: '',
    });
    const [newLocation, setNewLocation] = useState({        //For adding new location to the firebase
        name: '',                                           //Name of the location
        publicSpots: 0,                                     //Number of spots where users can queue
        dedicatedSpots: 0,                                  //Number of spots that manager manages in the location
    });
    const [modalVisible, setModalVisible] = useState({      //Hide/Show AddLocation/AddManager form
        visible: false,
        type: '',                                           //Type = addManager || addLocation
        editing: false,                                     //Change UI layouts depending if the admin is editing
        object: {},                                         //Pass the object if we are dealing with editing
    });

    /**
     * Fetch the manager users.
     * 
     * Fetches manager users from the firebase and set the managers state.
     */
    const fetchManagers = async () => {
        try {

            setProcessing(previousState => ({
                ...previousState,
                fetching: true,
            }));

            const managersFromDb = await firebase.firestore().collection('users').where('role', '==', 'manager').get();

            managersFromDb.forEach(manager => {

                if (managers.find(user => user.id === manager.id) !== undefined) {
                    return;
                }

                const managerData = manager.data();

                setManagers(previousState => ([
                    ...previousState, {
                        ...managerData,
                        id: manager.id
                    }
                ]));
            });

            setProcessing(previousState => ({
                ...previousState,
                fetching: false,
            }));
        } catch (error) {
            handleError('fetch', error.message);
        }
    }

    /**
     * Fetch the locations.
     * 
     * Fetches locations so the admins and set the locations state.
     */
    const fetchLocations = async () => {
        try {

            setProcessing(previousState => ({
                ...previousState,
                fetching: true,
            }));

            const locationsFromDb = await firebase.firestore().collection('locations').get();

            locationsFromDb.forEach(async (location) => {

                if (locations.find(loc => loc.id === location.id) !== undefined) {
                    return;
                }

                const locationData = location.data();

                const publicSpots = await firebase.firestore().collection('locations').doc(location.id).collection('parkingspots').get();
                const dedicatedSpots = await firebase.firestore().collection('locations').doc(location.id).collection('dedicatedParkingspots').get();

                setLocations(previousState => ([
                    ...previousState, {
                        ...locationData,
                        id: location.id,
                        publicSpots: publicSpots.size,
                        dedicatedSpots: dedicatedSpots.size,
                    }
                ]));
            });

            setProcessing(previousState => ({
                ...previousState,
                fetching: false,
            }));
        } catch (error) {
            handleError('fetch', error.message);
        }
    }

    /**
     * Search user.
     * 
     * Search a certain user from the database.
     */
    const searchUser = async () => {
        try {
            if (emailQuery === '') {
                handleError('searchUser', 'Please fill the email');
                return;
            }

            setProcessing(previousState => ({
                ...previousState,
                searching: true,
            }));

            const userFromDb = await firebase.firestore().collection('users').where('email', '==', emailQuery).get();

            if (!userFromDb.empty) {
                const userData = userFromDb.docs[0];

                setUser({
                    ...userData.data(),
                    id: userData.id,
                });
    
                setProcessing(previousState => ({
                    ...previousState,
                    searching: false,
                }));
            } else {
                setProcessing(previousState => ({
                    ...previousState,
                    searching: false,
                }));

                handleError('searchUser', 'User does not exist or invalid email');
            }
        } catch (error) {
            handleError('searchUser', error.message);
        }
    }

    /**
     * Adds a new manager.
     * 
     * Updates a certain users role to manager.
     * 
     * @param {String} userId
     */
    const addManager = async (userId) => {
        try {

            setProcessing(previousState => ({
                ...previousState,
                adding: true,
            }));

            await firebase.firestore().collection('users').doc(userId).set({
                role: 'manager',
            }, { merge: true }); 


            setManagers(previousState => ([
                ...previousState,
                user
            ]));

            setUser();

            setProcessing(previousState => ({
                ...previousState,
                adding: false,
            }));

            closeModal();
        } catch (error) {
            handleError('addManager', error.message);
        }
    }

    /**
     * Removes a manager.
     * 
     * Updates certain users role back to standard.
     * 
     * @param {String} userId 
     */
    const removeManager = async (userId) => {
        try {

            setProcessing(previousState => ({
                ...previousState,
                removing: userId,
            }));

            await firebase.firestore().collection('users').doc(userId).set({
                role: 'standard',
            }, { merge: true }); 

            const managersAfterDeletion = managers.filter(manager => manager.id !== userId);

            setManagers(managersAfterDeletion);

            setProcessing(previousState => ({
                ...previousState,
                removing: '',
            }));
        } catch (error) {
            handleError(userId, error.message);
        }
    }

    /**
     * Add new location.
     * 
     * Adds a new location to the firebase.
     */
    const addNewLocation = async () => {
        try {

            setProcessing(previousState => ({
                ...previousState,
                adding: true,
            }));

            if (newLocation.name === '') {
                handleError('addNewLocation', 'Please provide a name for the location');
                return;
            }

            if (locations.find(location => location.name.toLowerCase() === newLocation.name.toLowerCase())) {
                handleError('addNewLocation', 'Location with that name already exists!');
                return;
            }

            const responseFromDb = await firebase.firestore().collection('locations').add({
                name: newLocation.name,
            });

            for (let i = 0; i < newLocation.publicSpots; i++) {
                await firebase.firestore().collection('locations').doc(responseFromDb.id).collection('parkingspots').add({
                    availability: true,
                    userId: '',
                });
            }

            for (let i = 0; i < newLocation.dedicatedSpots; i++) {
                await firebase.firestore().collection('locations').doc(responseFromDb.id).collection('dedicatedParkingspots').add({
                    available: true,
                    userId: '',
                });
            }

            setLocations(previousState => ([
                ...previousState, {
                    ...newLocation,
                    id: responseFromDb.id,
                }
            ]));

            setNewLocation({
                name: '',
                publicSpots: 0,
                dedicatedSpots: 0,
            });

            setProcessing(previousState => ({
                ...previousState,
                adding: false,
            }));

            closeModal();
        } catch (error) {
            handleError('addNewLocation', error.message);
        }
    }

    /**
     * Function to edit location info.
     * 
     * This function handles the edit of the locations to database.
     */
    const editLocation = async () => {
        try {
            setProcessing(previousState => ({
                ...previousState,
                editing: true,
            }));

            const changedPublicSpots = newLocation.publicSpots - modalVisible.object.publicSpots;
            const changedDedicatedSpots = newLocation.dedicatedSpots - modalVisible.object.dedicatedSpots;
            
            const locationsCopy = [...locations];
            const editedLocationIndex = locationsCopy.findIndex(location => location.id === modalVisible.object.id);

            if (changedPublicSpots !== 0) {
                if (changedPublicSpots > 0) {
                    for (let i = 0; i < changedPublicSpots; i++) {
                        await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('parkingspots').add({
                            availability: true,
                            userId: '',
                        });
                    }
                } else if (changedPublicSpots < 0) {
                    const limitSpots = Math.abs(changedPublicSpots);
                    const spotsToBeDeleted = await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('parkingspots').limit(limitSpots).get();
                    spotsToBeDeleted.forEach( async (spot) => {
                        await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('parkingspots').doc(spot.id).delete();
                    });
                }
                locationsCopy[editedLocationIndex].publicSpots = newLocation.publicSpots;
            }

            if (changedDedicatedSpots !== 0) {
                if (changedDedicatedSpots > 0) {
                    for (let i = 0; i < changedDedicatedSpots; i++) {
                        await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('dedicatedParkingspots').add({
                            availability: true,
                            userId: '',
                        });
                    }
                } else if (changedDedicatedSpots < 0) {
                    const limitSpots = Math.abs(changedDedicatedSpots);
                    const spotsToBeDeleted = await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('dedicatedParkingspots').limit(limitSpots).get();
                    spotsToBeDeleted.forEach( async (spot) => {
                        await firebase.firestore().collection('locations').doc(modalVisible.object.id).collection('dedicatedParkingspots').doc(spot.id).delete();
                    });
                }
                locationsCopy[editedLocationIndex].dedicatedSpots = newLocation.dedicatedSpots;
            }

            if (modalVisible.object.name !== newLocation.name && newLocation.name !== '') {
                await firebase.firestore().collection('locations').doc(modalVisible.object.id).set({
                    name: newLocation.name,
                }, { merge: true });
                locationsCopy[editedLocationIndex].name = newLocation.name;
            }

            setLocations(locationsCopy);
            setProcessing(previousState => ({
                ...previousState,
                editing: false,
            }));

            closeModal();
        } catch (error) {
            handleError(modalVisible.object.id, error.message);
        }
    }

    /**
     * Removes location from backend
     * 
     * Handle the removal of the location from the backend, parameter is the document id of firebase.
     * 
     * @param {String} locationDocumentId 
     */
    const removeLocation = async (locationDocumentId) => {
        try {
            setProcessing(previousState => ({
                ...previousState,
                removing: locationDocumentId,
            }));

            await firebase.firestore().collection('locations').doc(locationDocumentId).delete();

            const locationsAfterDeletion = locations.filter(location => location.id !== locationDocumentId);
            setLocations(locationsAfterDeletion);

            setProcessing(previousState => ({
                ...previousState,
                removing: '',
            }));

            closeModal();
        } catch (error) {
            handleError(locationDocumentId, error.message);
        }
    }

    /**
     * Opens a modal.
     * 
     * This function opens modal where you can add managers/locations or edit a location
     * 
     * @param {String} type 
     * @param {Boolean} editing 
     * @param {Object} object 
     */
    const openModal = (type, editing, object) => {
        setModalVisible({
            type,
            visible: true,
            editing,
            object
        });
    }

    /**
     * Function to close a modal.
     * 
     * Rhis functions just resets the modal.
     */
    const closeModal = () => {
        setModalVisible({ type: '', visible: false });
    }

    /**
     * Handle the Manager query.
     * 
     * Handles the query string change when searching the managers
     * 
     * @param {String} text
     */
    const handleManagerQueryChange = text => {
        setManagerQuery(text);
    }

    /**
     * Handles the location query.
     * 
     * Handles the query string change when searching for locations
     * 
     * @param {String} text
     */
    const handleLocationQueryChange = text => {
        setLocationQuery(text);
    }

    /**
     * Handles the email query.
     * 
     * Handles the query string change when we are searching user from the database.
     * 
     * @param {String} text 
     */
    const handleEmailQuery = text => {
        setEmailQuery(text);
    }

    /**
     * Handle a new location name change.
     * 
     * This function handles the input for the new locations name.
     * 
     * @param {String} text 
     */
    const handleNewLocationNameChange = text => {
        setNewLocation(previousState => ({
            ...previousState,
            name: text,
        }));
    }

    /**
     * Handle a number of parking spots of the new location.
     * 
     * Handles the input how many public parking spots are in the new location.
     * 
     * @param {Number} number 
     */
    const handleNewLocationPublicSpotCountChange = number => {
        setNewLocation(previousState => ({
            ...previousState,
            publicSpots: number,
        }));
    }

    /**
     * Handle a number of private parking spots of the new location.
     * 
     * Handles the input how many dedicated/private parking spots are in the new location.
     * 
     * 
     * @param {Number} number 
     */
    const handleNewLocationDedicatedSpotCountChange = number => {
        setNewLocation(previousState => ({
            ...previousState,
            dedicatedSpots: number,
        }));
    }

    /**
     * Handles the errors.
     * 
     * Function that handles the error messages if an errors occur.
     * 
     * @param {String} type 
     * @param {String} message 
     */
    const handleError = (type, message) => {
        setProcessing({
            fetching: false,
            adding: false,
            removing: false,
            searching: false,
        });

        setError({
            type,
            message,
        });

        setTimeout(() => {
            setError({ type: '', message: '' });
        }, 2000);
    }

    return {
        managers,
        locations,
        managerQuery,
        locationQuery,
        user,
        processing,
        error,
        modalVisible,
        fetchManagers,
        fetchLocations,
        searchUser,
        addManager,
        removeManager,
        addNewLocation,
        editLocation,
        removeLocation,
        openModal,
        closeModal,
        handleManagerQueryChange,
        handleLocationQueryChange,
        handleEmailQuery,
        handleNewLocationNameChange,
        handleNewLocationPublicSpotCountChange,
        handleNewLocationDedicatedSpotCountChange,
    }
}

export default useAdminHooks;
