import React from 'react';
import { View } from 'react-native';
import { Container, Text, Button, Content, Header, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';

const Home = ({ navigation }) => {
    /*
       yes
    */

    /* Functions needed, GET:
        - battery %
        - # of free spots in parking space
        - the length of queue
    */

    // What is the modern way to create flex-layout to get those buttons to the bottom of the screen?

    return (
        <Container>
            <Content padder>
                <View >
                    <Text>Home</Text>
                    <BatteryInfo batteryStatus={54} />
                    <QueueInfo />
                </View>

                <View>
                    <Button full style={GlobalStyles.button}>
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
            </Content>
        </Container >
    );
}

export default Home;
