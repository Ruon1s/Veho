import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, Text, Button, View, StyleProvider, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';
import CustomHeader from '../components/CustomHeader';
import { schedulePushNotification } from '../services/NotificationService';

const Home = ({ navigation }) => {
    // State: for queue information
    const [state, setState] = useState({
        queue: 0,
        free: 0,
        queuePosition: 0
    });

    const [batteryStatus, setBatteryStatus] = useState(54)

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
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Home' />

                <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                    <QueueInfo free={state.free} queue={state.queue} queuePosition={state.queuePosition} />
                    <BatteryInfo batteryStatus={batteryStatus} />

                    <Button full transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                        <Text>Test notification</Text>
                    </Button>

                    <View>
                        <Button full onPress={handleClick}
                            style={GlobalStyles.button}>
                            <Text>Queue</Text>
                        </Button>
                        <Grid>
                            <Col>
                                <Button
                                    full
                                    onPress={() => navigation.navigate('ChargingView')}
                                    style={GlobalStyles.button}>
                                    <Text>ChargingView</Text>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    full
                                    danger transparent
                                    onPress={() => navigation.replace('Auth')}
                                    style={GlobalStyles.button}>
                                    <Text>Logout</Text>
                                </Button>
                            </Col>
                        </Grid>
                    </View>
                </View>
            </Container >
        </StyleProvider>
    );
}

export default Home;
