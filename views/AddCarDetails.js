import React, { useEffect, useState } from 'react';
import { Content, Container, Text, Button, StyleProvider } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import RegisterCarForm from '../components/RegisterCarForm';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import * as firebase from 'firebase';

const AddCarDetails = ({ navigation, route }) => {
    const [currentUser, setCurrentUser] = useState('')

    useEffect(() => {
        const user = firebase.auth().currentUser
        setCurrentUser(user.uid)
    });

    const { fromRegister } = route.params;  //If the user comes from the register screen, disable the back button.

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader handleBackButton={fromRegister ? null : () => navigation.goBack(null)} title='Add car details' />
                <Content padder>
                    <RegisterCarForm navigation={navigation} />
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default AddCarDetails;