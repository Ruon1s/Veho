import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Button } from 'native-base';

const QueueInfo = (props) => {
    return (<View style={styles.textParent}>
        {props.queue > 0 ?
            <Text style={styles.infoText}>Number of cars in queue: {props.queue}</Text> : <Text style={styles.infoText}>The queue is empty</Text>
        }

        {props.free > 0 ?
            <Text style={styles.infoText}>Free spots: {props.free}</Text> : <Text style={styles.infoText}>No spots are open</Text>
        }

        {props.queuePosition > 0 ?
            <Text style={styles.infoText}>Your position in queue: {props.queuePosition}</Text> : <Text style={styles.infoText}>You are not in queue</Text>
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
