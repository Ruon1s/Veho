const useFirebase = () => {

const getUser = async () => {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    if(!doc.exists){
        console.log('no user found')
    } else {
        console.log (doc.data());
    }
};

const getUserCars = async () => {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();



    const carsRef = db.collection('users').doc(user.uid).collection('cars');
    const snapshot = await carsRef.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data)
    })

};

return {
    getUser,
    getUserCars
}
};

export default useFirebase

