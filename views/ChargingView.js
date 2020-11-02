import React from 'react';
import { Container, Text, Body } from 'native-base';
import BatteryInfo from '../components/BatteryInfo';

const ChargingView = () => {
    return (
        <Container>
            <BatteryInfo batteryStatus={ 54 } />
            <Text>Estimated time:</Text>
        </Container>
    );   
}

export default ChargingView;