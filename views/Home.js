import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';

const Home = ({ navigation }) => {
    const [state, setState] = useState({
        queue: 0,
        free: 0,
        queuePosition: 0
    });

    // QueueInfo re-renders according to this state change
    const handleClick = () => {
        if (state.queuePosition == 1) {
            setState({ queuePosition: 0 })
        } else {
            setState({ queuePosition: 1 })
        }
    }

    /* Functions needed, GET:
          - battery %
          - # of free spots in parking space
          - the length of queue
    */

    return (
        <Container>
            <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                <QueueInfo free={state.free} queue={state.queue} queuePosition={state.queuePosition} />
                <BatteryInfo batteryStatus={54} />

                <View>
                    <Button full style={GlobalStyles.button} onPress={handleClick}>
                        <Text>Queue</Text>
                    </Button>
                    <Grid>
                        <Col>
                            <Button
                                full
                                style={GlobalStyles.button}
                                onPress={() => navigation.navigate('ChargingView')}>
                                <Text>ChargingView</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                full
                                style={GlobalStyles.button}
                                warning
                                onPress={() => navigation.replace('Auth')}>
                                <Text>Logout</Text>
                            </Button>
                        </Col>
                    </Grid>
                </View>
            </View>
        </Container >
    );
}

export default Home;
