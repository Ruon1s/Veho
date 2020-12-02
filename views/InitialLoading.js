import { Spinner, View } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';

const InitialLoading = ({ navigation }) => {
    
    //Check if the user is logged in at the start and navigate the user correctly
    useEffect(() => {
        const unsubscribeListener = firebase.auth().onAuthStateChanged(user => {
            navigation.replace(user !== null ? 'App' : 'Auth');
        });

        return () => unsubscribeListener();
    }, []);

    return(
        <View style={styles.center}>
            <Spinner />
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default InitialLoading;
