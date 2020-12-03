import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Text, View, Button } from 'native-base';
import i18n from 'i18n-js';

const QueueInfo = (props) => {
    const charging = props.charging

    let height = null
    let fontSize = 24
    let borderBottomWidth = 1
    let padding = 12

    if (charging == true) {
        height = 0
        fontSize = 0
        borderBottomWidth = 0
        padding = 0
    } else {
        height = null
        fontSize = 24
        borderBottomWidth = 1
        padding = 12
    }

    /*
    const fadeAnim = useRef(new Animated.value(0)).current

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 1 second
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000
        }).start()
    }
*/

    const styles = StyleSheet.create({
        textParent: {
            position: 'relative',
            borderBottomColor: '#EAEAEA',
            borderBottomWidth: borderBottomWidth,
            paddingBottom: padding,
            height: height,
        },
        infoText: {
            fontSize: fontSize,
        },
        charginText: {
            fontSize: fontSize,
            color: '#4fd966',
        }
    });

    return (<View style={styles.textParent}>
        {props.queue > 0 ?
            <Text style={styles.infoText}>{i18n.t('numberOfCars')} {props.queue}</Text> : <Text style={styles.infoText}>{i18n.t('noCarsInQueue')}</Text>
        }

        {props.free > 0 ?
            <Text style={styles.infoText}>{i18n.t('freeSpots')} {props.free}</Text> : <Text style={styles.infoText}>{i18n.t('noSpots')}</Text>
        }

        {props.queuePosition > 0 ?
            <Text style={styles.infoText}>{i18n.t('yourPosition')} {props.queuePosition}</Text> : <Text style={styles.infoText}>{i18n.t('notInQueue')}</Text>
        }
    </View>)
}





export default QueueInfo
