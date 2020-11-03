import React from 'react';
import { Content, Container, Text, Button } from 'native-base';

const AddCarDetails = ({ navigation }) => {
    return (
        <Container>
            <Content padder>
                <Text>Welcome!</Text>
                <Button
                    full
                    onPress={() => navigation.replace('App')}>
                    <Text>Save</Text>
                </Button>
            </Content>
        </Container>
    );
}

export default AddCarDetails;