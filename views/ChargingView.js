import React, { useState } from 'react';
import { Container, Text, View, Button, StyleProvider } from 'native-base';
import BatteryInfo from '../components/BatteryInfo';
import GlobalStyles from '../styles/GlobalStyles';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

const ChargingView = ({ navigation }) => {
    const [estimated, setEstimated] = useState(0)

    const handleBackButton = () => {
        navigation.goBack(null)
    }

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Charging info' handleBackButton={handleBackButton} />
                <View padder>
                    <BatteryInfo batteryStatus={54} />
                    <Text>Estimated time: {estimated}</Text>
                </View>
            </Container>
        </StyleProvider>
    );
}

export default ChargingView;