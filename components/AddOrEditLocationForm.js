import { Form, Input, Item, View, Button, Text, Spinner } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import GlobalButton from './GlobalButton';

const AddOrEditLocationForm = (props) => {

    const {
        adding, 
        handleLocationName, 
        handlePublicSpots, 
        handleDedicatedSpots, 
        addLocation, 
        error, 
        editing, 
        remove, 
        removing, 
        location,
        editLocation,
    } = props;

    return (
        <View>
            <Text style={styles.titleText}>{location ? 'Edit Location' : 'Add a new Location'}</Text>
            {adding || editing || removing ?
            <Spinner />
            :
            error.type === 'addNewLocation' ?
            <Text> {error.message} </Text>
            :
            <>
                <Form>
                    <Item>
                        <Input 
                            placeholder={location ? `Name (Current: ${location.name})` : "Location name..."} 
                            onChangeText={text => handleLocationName(text)}
                        />
                    </Item>
                    <Item>
                        <Input 
                            placeholder={location ? `Public stations (Current: ${location.publicSpots})` : "Number of public charging stations..."} 
                            onChangeText={text => handlePublicSpots(text)}
                            keyboardType="number-pad"
                        />
                    </Item>
                    <Item>
                        <Input 
                            placeholder={location ? `Dedicated stations (Current: ${location.dedicatedSpots})` : "Number of dedicated charging stations..."} 
                            onChangeText={text => handleDedicatedSpots(text)}
                            keyboardType="number-pad"
                        />
                    </Item>
                </Form>
                {location ?
                <>
                    <GlobalButton text="Edit Location" onPress={editLocation} />
                    <GlobalButton text="Delete" transparent={true} onPress={() => remove(location.id)} />
                </>
                :
                <GlobalButton text="Add a New Location" onPress={addLocation} />}
            </>}
        </View>
    );
}

const styles = StyleSheet.create({ 
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default AddOrEditLocationForm;
