import React, { useEffect, useState } from 'react';
import { Container, Text, View, Button, StyleProvider } from 'native-base';
import BatteryInfo from '../components/BatteryInfo';
import GlobalStyles from '../styles/GlobalStyles';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import * as SecureStore from 'expo-secure-store';
import firebase from 'firebase';
import 'firebase/firestore';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const ChargingView = ({ navigation }) => {
    const [estimated, setEstimated] = useState(0)

    const handleBackButton = () => {
        navigation.goBack(null)
    }

    const stopCharging = async () => {
        try {
            const chargingDocId = await SecureStore.getItemAsync('chargingDocId');              //Get the document id from the secure store
            await firebase.firestore().collection('parkingspots').doc(chargingDocId).set({      //Change the spot availability to true
                availability: true,
            }, { merge: true });
            await SecureStore.deleteItemAsync('chargingDocId');                                 //Delete the doc id from the secure store
            notifyNextUser();                                                                   //Send the notification to the next user
            navigation.replace('App');                                                          //Navigate back to home
        } catch (error) {
            console.log(`Error while stopping the charging: ${ error.message }`);
        }
    }

    const notifyNextUser = async () => {
        try {

            let token;

            const queue = await firebase.firestore().collection('queue').orderBy('time', 'asc').limit(1).get();

            if (queue.size === 1) {
                queue.forEach(document => {
                    token = document.data().pushNotificationToken
                });
    
                const message = {
                    to: token,
                    sound: 'default',
                    title: 'Free charging station available!',
                    body: 'There is a free charging station available.'
                }
                
                const options = {
                    method: 'POST',
                    headers: {
                        'host': 'exp.host',
                        'accpet': 'application/json',
                        'accept-encoding': 'gzip, deflate',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(message),
                }
    
                await fetch('https://exp.host/--/api/v2/push/send', options);
            } else {
                return
            }
        } catch (error) {
            console.log(`Error notifying the next user: ${ error.message }`);
        }
    }

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Charging info' handleBackButton={handleBackButton} />
                <View padder>
                    <BatteryInfo batteryStatus={54} />
                    <Text>Estimated time: {estimated}</Text>
                    <Button full style={GlobalStyles.button} onPress={ stopCharging }>
                        <Text>Stop Charging</Text>
                    </Button>
                </View>
            </Container>
        </StyleProvider>
    );
}

export default ChargingView;