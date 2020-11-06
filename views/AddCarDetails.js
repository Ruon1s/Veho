import React from 'react';
import { Content, Container, Text, Button } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import RegisterCarForm from '../components/RegisterCarForm';

const AddCarDetails = ({ navigation }) => {
    return (
        <Container>
            <CustomHeader title='Add car details' />
            <Content padder>
                <RegisterCarForm navigation={navigation} />
            </Content>
        </Container>
    );
}

export default AddCarDetails;