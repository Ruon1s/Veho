import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, Text, View, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useFirebase from "../hooks/FireBaseHook";
import i18n from 'i18n-js';

const HomeListLayout = (props) => {
    let carArray = props.carArray

    const createTwoButtonAlert = (car) => {                 // Manager clicks cardObject, they are asked to put car in queue or not
        let message = i18n.t(addCarMessage(car))

        if (car.priority === true) {                        // If car is already priority
            message = i18n.t(removeCarMessage(car))
        }

        Alert.alert(
            i18n.t('title'),
            message,
            [
                {
                    text: i18n.t('cancel'),                         // Nothing happens
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: i18n.t('ok'), onPress: () => {            // Set car on top of the list and mark the priority somehow -- firebase modifications needed
                        props.prioritizeCar(car)
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (<Content padder>
        {carArray.map((car, key) => (
            <Card key={key}>
                <CardItem button onPress={() => createTwoButtonAlert(car)}>
                    <View style={styles.left}>
                        <Text numberOfLines={1} style={styles.carName}>
                            {car.priority && <Text style={styles.priorityIndicator}>* </Text> /* render if car is set as priority in carArray, boolean value */}
                            {car.name.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.bodyStyle}>
                        <Text numberOfLines={1} style={styles.licenceNumber}>{car.licencePlate.toUpperCase()}</Text>
                    </View>
                    <View style={styles.batteryStatus}>
                        <Icon name='bolt' size={32} color="#EAEAEA" />
                        <Text numberOfLines={1} style={styles.batteryPercentage}>42%</Text>
                    </View>
                </CardItem>
            </Card>
        ))}
    </Content>)
}

const styles = StyleSheet.create({
    left: {
        flex: 1
    },
    carName: {
        fontSize: 26
    },
    priorityIndicator: {
        fontSize: 26,
        color: '#FB3664',
        fontWeight: 'bold'
    },
    bodyStyle: {
        flex: 1,
        borderColor: '#EAEAEA',
        borderStartWidth: 1,
        borderEndWidth: 1
    },
    licenceNumber: {
        alignSelf: 'center',
        fontSize: 26
    },
    batteryStatus: {
        flex: 0.7,
        justifyContent: 'flex-end',
        display: 'flex',
        flexDirection: 'row'
    },
    batteryPercentage: {
        fontSize: 26,
        marginLeft: 8
    }
});

export default HomeListLayout
