import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {  Text, View } from 'native-base';

const LocationInfo = (props) => {
    console.log(props.user.location);
    return (
        <View style={styles.locationView}>
            <Icon color='#EAEAEA' name='map-marker' size={32}></Icon>
            <Text style={styles.text}>{props.user.location && props.user.location.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    locationView: {
        margin: 4,
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        marginStart: 8,
        fontSize: 32,
        color: '#000',
    }
});

export default LocationInfo
