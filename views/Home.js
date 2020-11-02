import React from 'react';
import { Container, Text, Button, Content, Header, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';

const Home = ({ navigation }) => {
    const btnMargin = 8
    /*
        testing ci
     */

    /* Functions needed, GET:
        - battery %
        - # of free spots in parking space
        - the length of queue
    */

    return (
        <Container>
            <Content padder>
                <Text>Home</Text>
                <BatteryInfo batteryStatus={54} />
                <QueueInfo />

                <Button full style={{ marginTop: btnMargin }}>
                    <Text>Queue</Text>
                </Button>

                <Button full style={{ marginTop: btnMargin }} transparent onPress={() => navigation.replace('Auth')}>
                    <Text>
                        Logout
                    </Text>
                </Button>
            </Content>
        </Container >
    );
}

export default Home;
