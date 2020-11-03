import React, { useState } from 'react';
import { Container, Text, View } from 'native-base';
import BatteryInfo from '../components/BatteryInfo';

const ChargingView = () => {
    const [estimated, setEstimated] = useState(0)
    return (
        <Container>
            <View padder>
                <BatteryInfo batteryStatus={54} />
                <Text>Estimated time: {estimated}</Text>
            </View>
        </Container>
    );
}

export default ChargingView;