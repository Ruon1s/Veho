import React from 'react';
import { Container, Text, Button } from 'native-base';

const Home = ({ navigation }) => {
    return (
        <Container>
            <Text>Home</Text>
            <Button onPress={() => navigation.replace('Auth')}>
                <Text>
                    Logout
                </Text>
            </Button>
        </Container>
    );
}

export default Home;