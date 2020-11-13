import React, { useEffect, useState } from 'react';
import { Container, Content, Text, Button, View, StyleProvider, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';
import CustomHeader from '../components/CustomHeader';
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from 'expo-secure-store';

const Home = ({ navigation }) => {

    const fetchSoc = async () => {
        const token = await SecureStore.getItemAsync('token');
        try {
            const headers = {
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }

            const options = {
                method: 'GET',
                withCredentials: true,
                headers,
            }

            const response = await fetch('https://api.connect-business.net/fleet/v1/fleets/DF89D145A29C43BE80FC2464B54405F9/vehicles.dynamic/C0NNECT0000000100', options);
            //const toJSON = await response.json();
            // HTML response (404/500), response.text
            const toJSON = await response.json();

            console.log(toJSON);


        } catch (error) {
            console.log(error);
        }
    }

    const fetchToken = async () => {
        try {

            const data = {
                'grant_type': GRANT,
                'username': UNAME,
                'password': PASS
            }

            const headers = {
                'Cache-Control': 'no-cache',
                'Authorization': AUTH,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }

            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

            const options = {
                method: 'POST',
                headers,
                body: formBody,
            }

            const response = await fetch('https://api.connect-business.net/fleet/v1/oauth/token', options);
            const toJSON = await response.json();
            console.log('access token: ' + toJSON.access_token);
            await SecureStore.setItemAsync('token', toJSON.access_token);
        } catch (error) {
            console.log(error);
        }
    }

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

    // platform.js contains the color and font variables ordered by veho 
    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Home' />

                <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                    <QueueInfo free={state.free} queue={state.queue} queuePosition={state.queuePosition} />
                    <BatteryInfo batteryStatus={20} />

                    <View>
                        <Button full onPress={fetchToken}
                            style={GlobalStyles.button}>
                            <Text>(DEV) Get Token</Text>
                        </Button>
                        <Button full onPress={fetchSoc}
                            style={GlobalStyles.button}>
                            <Text>(DEV) Refresh SOC</Text>
                        </Button>
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
