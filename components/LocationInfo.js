import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Container, Content, Text, Button, View, StyleProvider, Card, CardItem, Body, List, ListItem } from 'native-base';

const LocationInfo = (props) => {
    return (
        <View style={styles.locationView}>
            <Icon color='#EAEAEA' name='map-marker' size={32}></Icon><Text style={styles.text}>{props.location && props.location.name}</Text>
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
