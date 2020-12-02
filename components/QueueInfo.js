import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Button } from 'native-base';
import i18n from 'i18n-js';

const QueueInfo = (props) => {
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

const styles = StyleSheet.create({
    textParent: {
        position: 'relative',
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    infoText: {
        fontSize: 24,
    }
})

export default QueueInfo
