import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { VictoryPie } from 'victory-native';

const BatteryInfo = (props) => {
    const [batteryStatus, setBatteryStatus] = useState(props.batteryStatus)
    const data = [
        { x: `${batteryStatus}%`, y: batteryStatus },
        { x: 'null', y: 100 - batteryStatus }
    ]

    const Default = () => {
        return (
            <Grid style={styles.batteryGrid}>
                <Row size={2}>
                    <Icon name="bolt" size={56} color="#000"></Icon>
                </Row>
                <Row size={1}>
                    <Text style={styles.batteryText}>{batteryStatus}%</Text>
                </Row>
            </Grid>)
    }

    // GET-function from parent changes shown batteryStatus
    return (
        <View style={styles.batteryContent}>
            <Default />
            <VictoryPie standalone={true} width={170} height={170} colorScale={['#000', '#EAEAEA']} innerRadius={80} padding={10} data={data} />
        </View>
    );
};

// StyleSheet is needed to get custom content working. Global style will be used for colors and fonts
const styles = StyleSheet.create({
    batteryContent: {
        height: 180,
        alignItems: 'center',
        margin: 8
    },
    batteryGrid: {
        position: 'absolute',
        width: 170,
        height: 170,
        backgroundColor: '#FFFFFF',
        borderRadius: 170,
        alignItems: 'center',
        padding: 34,
        paddingTop: 40
    },
    batteryText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 24
    }
});

export default BatteryInfo;