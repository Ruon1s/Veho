import React from 'react';
import { Container, Text, Content, StyleProvider, Label, Input, Item, Button, Form } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import NotificationTest from '../components/NotificationTest';
import useSettingsForm from '../hooks/SettingsHook.js'
import { useState, useEffect } from 'react'
import GlobalStyles from "../styles/GlobalStyles";



const Settings = ({navigation}) => {
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
    }, []);

    const toAddCar = () => {
        navigation.navigate('AddCarDetails')
    }

    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Settings' />
                <Content padder>
                    <Button
                        full
                        style={GlobalStyles.button}
                        onPress={toAddCar}
                        >
                        <Text>Add new car</Text>
                    </Button>


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
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Settings;
