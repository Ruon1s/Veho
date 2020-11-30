import { Form, Input, Item, View, Text, Spinner } from 'native-base';
import React, { useEffect } from 'react';
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

    useEffect(() => {
        console.log(location);
    })

    return (
        <View>
            <Text style={styles.titleText}>{Object.keys(location).length !== 0 ? 'Edit Location' : 'Add a new Location'}</Text>
            {adding || editing || removing ?
            <Spinner />
            :
            error.type === 'addNewLocation' || error.type === location.id ?
            <Text style={styles.errorMessage}> {error.message} </Text>
            :
            <>
                <Form>
                    <Item>
                        <Input 
                            placeholder={Object.keys(location).length !== 0 ? `Name (Current: ${location.name})` : "Location name..."} 
                            onChangeText={text => handleLocationName(text)}
                        />
                    </Item>
                    <Item>
                        <Input 
                            placeholder={Object.keys(location).length !== 0 ? `Public stations (Current: ${location.publicSpots})` : "Number of public charging stations..."} 
                            onChangeText={text => handlePublicSpots(text)}
                            keyboardType="number-pad"
                        />
                    </Item>
                    <Item>
                        <Input 
                            placeholder={Object.keys(location).length !== 0 ? `Dedicated stations (Current: ${location.dedicatedSpots})` : "Number of dedicated charging stations..."} 
                            onChangeText={text => handleDedicatedSpots(text)}
                            keyboardType="number-pad"
                        />
                    </Item>
                </Form>
                {Object.keys(location).length !== 0  ?
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
    errorMessage: {
        alignSelf: "center",
        fontSize: 15,
        color: "#FB3664",
    }
});

export default AddOrEditLocationForm;
