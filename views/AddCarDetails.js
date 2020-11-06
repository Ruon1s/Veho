import React from 'react';
import { Content, Container, Text, Button, StyleProvider } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import RegisterCarForm from '../components/RegisterCarForm';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

const AddCarDetails = ({ navigation }) => {
    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Add car details' />
                <Content padder>
                    <RegisterCarForm navigation={navigation} />
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default AddCarDetails;