import React from 'react';
import { Container, Text, Button, Content } from 'native-base';

const Home = ({ navigation }) => {
    return (
        <Container>
            <Content padder>
                <Text>Home</Text>
                <Button onPress={() => navigation.replace('Auth')}>
                    <Text>
                        Logout
                </Text>
                </Button>
            </Content>
        </Container>
    );
}

export default Home;