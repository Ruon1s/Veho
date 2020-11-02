import React from 'react';
import { Body, Container, Text, Button } from 'native-base';

const AddCarDetails = ({ navigation }) => {
    return (
        <Container>
            <Body>
                <Text>Welcome!</Text>
                <Button
                full
                onPress={ () => navigation.replace('App') }>
                    <Text>Save</Text>
                </Button>
            </Body>
        </Container>
    );
}

export default AddCarDetails;