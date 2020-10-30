import React, { useState, useEffect } from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from 'react-native-easy-grid';

const BatteryInfo = (props) => {
    const [batteryStatus, setBatteryStatus] = useState(props.batteryStatus)

    return (
        <Content>
            <Grid style={{
                width: 150,
                height: 150,
                backgroundColor: 'rgba(255,255,255,1.0)',
                borderRadius: 150,
                alignItems: 'center',
                padding: 30,
                borderStyle: 'solid',
                borderColor: 'black',
                borderWidth: 1
            }}>
                <Row size={3}>
                    <Icon name="bolt" size={50} color="#000"></Icon>
                </Row>
                <Row size={1}>
                    <Text style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: 24
                    }}>{batteryStatus}%</Text>
                </Row>
            </Grid>
        </Content>
    )
}

export default BatteryInfo