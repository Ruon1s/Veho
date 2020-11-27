import React from 'react';
import { Container, Text, Content, StyleProvider, Label, Input, Item, Button, Form } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import NotificationTest from '../components/NotificationTest';
import useSettingsForm from '../hooks/SettingsHook.js'
import { useState, useEffect } from 'react'
import GlobalStyles from "../styles/GlobalStyles";
import firebase from 'firebase';
import 'firebase/firestore';



const Settings = ({ navigation }) => {
    const [admin, setAdmin] = useState(false);

    const {
        getCarVin,
        carVin,
        setCarVin,
        changeEditable,
        editable,
        editCarVin
    } = useSettingsForm();

    useEffect(() => {
        getCarVin().then(r => setCarVin(r))
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const currentUserId = firebase.auth().currentUser.uid;
            const response = await firebase.firestore().collection('users').doc(currentUserId).get();
            if (response.data().role === 'admin') {
                setAdmin(true);
            }
        } catch (error) {
            console.log(`Error while retrieving admin status: ${ error.message }`)
        }
    }

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>
                    <Form>
                        <Item floatingLabel>
                            <Label>Edit your car vin</Label>
                            {editable === false ?
                                <Input
                                    autoCapitalize='none'
                                    editable={false}
                                    defaultValue={carVin}
                                    value={carVin}
                                /> :
                                <Input
                                    autoCapitalize='none'
                                    editable={true}
                                    defaultValue={carVin}
                                />
                            }
                        </Item>
                        {editable === false ?
                            <Button
                                full
                                style={GlobalStyles.button}
                                onPress={changeEditable}>
                                <Text>edit</Text>
                            </Button>
                            :
                            <Button
                                full
                                style={GlobalStyles.button}
                                onPress={editCarVin}>  //do 1 function that runs 2 functions editCarVin and changeEditable
                                <Text>Save</Text>
                            </Button>
                        }

                    </Form>
                    {admin ?
                    <Button full style={ GlobalStyles.button } onPress={ () => navigation.navigate('AdminPanel') }>
                        <Text>Admin Panel</Text>
                    </Button>
                    : null}
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;
