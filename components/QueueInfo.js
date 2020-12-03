import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, LayoutAnimation, UIManager } from 'react-native';
import { Text, View, Button } from 'native-base';
import i18n from 'i18n-js';

const QueueInfo = (props) => {
    const charging = props.charging

    const [state, setState] = useState({
        height: null,
        fontSize: 24,
        borderBottomWidth: 1,
        padding: 12
    })

    useEffect(() => {
        switch (charging) {
            case (true): {
                // TODO: Invoke closing animation here
                setState({
                    height: 0,
                    fontSize: 0,
                    borderBottomWidth: 0,
                    padding: 0
                });
                break;
            }
            default: {
                // TODO: Invoke opening animation here
                setState({
                    height: null,
                    fontSize: 24,
                    borderBottomWidth: 1,
                    padding: 12
                });
                break;
            }
        }
    }, [charging])

    const styles = StyleSheet.create({
        textParent: {
            position: 'relative',
            borderBottomColor: '#EAEAEA',
            borderBottomWidth: state.borderBottomWidth,
            paddingBottom: state.padding,
            height: state.height,
        },
        infoText: {
            fontSize: state.fontSize,
        },
        charginText: {
            fontSize: state.fontSize,
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
