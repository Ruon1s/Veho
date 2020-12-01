import React, { useEffect, useState } from 'react';
import { Container, Text, View, Button, StyleProvider, Spinner } from 'native-base';
import BatteryInfo from '../components/BatteryInfo';
import GlobalStyles from '../styles/GlobalStyles';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import useQueueHooks from '../hooks/QueueHooks';
import useApiHooks from "../hooks/ApiHooks";

const ChargingView = ({ navigation, route }) => {
    const [estimated, setEstimated] = useState(0)
    const { stopCharging, queue } = useQueueHooks();

    const handleBackButton = () => {
        navigation.goBack(null)
    }

    const {
        soc,
        fetchSoc
      } = useApiHooks();

      useEffect(() => {
        fetchSoc();
      }, [soc]);

    const location = route.params.location;

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Charging info' handleBackButton={handleBackButton} />
                <View padder>
                    <BatteryInfo batteryStatus={soc} />
                    <Text>Estimated time: {estimated}</Text>
                    <Button full style={GlobalStyles.button} onPress={ () => stopCharging(navigation, location) } disabled={ queue.processing }>
                        { queue.processing ? <Spinner /> : <Text>Stop Charging</Text> }
                    </Button>
                </View>
            </Container>
        </StyleProvider>
    );
}

export default ChargingView;