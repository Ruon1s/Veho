import * as firebase from "firebase";
import {useState} from 'react';


const useSettingsForm = () => {

const [carVin, setCarVin] = useState({});
const [editable, setEditable] =useState(false);

const getCarVin = async () => {
    const user = firebase.auth().currentUser;
    console.log(user);
    const db = firebase.firestore();

    const carsRef = db.collection('cars');
    const snapshot = await carsRef.where('uid', '==', user.uid).get();
    if(snapshot.empty){
        console.log('No documents.');
        return;
    }
    const carVin = snapshot.docs[0].data().vin
    console.log('current users cars vin number: ', carVin);
    return carVin
};

const editCarVin = async () => {
    changeEditable()


};
const changeEditable = () => {
    if(editable === false){
        setEditable(true)
    }else{
        setEditable(false)
    }
};


return {
    carVin,
    setCarVin,
    getCarVin,
    changeEditable,
    editable,
    editCarVin
}
};

export default useSettingsForm;
