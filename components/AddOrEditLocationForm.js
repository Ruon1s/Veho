import { Form, Input, Item, View, Text, Spinner } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import GlobalButton from './GlobalButton';
import i18n from 'i18n-js';

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
            <Text style={styles.titleText}>{Object.keys(location).length !== 0 ? i18n.t('editLocation') : i18n.t('addLocation')}</Text>
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
                                    placeholder={Object.keys(location).length !== 0 ? `${i18n.t('currentName')} ${location.name}` : i18n.t('currentNameConditional')}
                                    onChangeText={text => handleLocationName(text)}
                                />
                            </Item>
                            <Item>
                                <Input
                                    placeholder={Object.keys(location).length !== 0 ? `${i18n.t('publicStations')} ${location.publicSpots})` : i18n.t('publicStationsConditional')}
                                    onChangeText={text => handlePublicSpots(text)}
                                    keyboardType="number-pad"
                                />
                            </Item>
                            <Item>
                                <Input
                                    placeholder={Object.keys(location).length !== 0 ? `${i18n.t('dedicatedStations')} ${location.dedicatedSpots})` : i18n.t('dedicatedStationsConditional')}
                                    onChangeText={text => handleDedicatedSpots(text)}
                                    keyboardType="number-pad"
                                />
                            </Item>
                        </Form>
                        {Object.keys(location).length !== 0 ?
                            <>
                                <GlobalButton text={i18n.t('editLocation')} onPress={editLocation} />
                                <GlobalButton text={i18n.t('delete')} transparent={true} onPress={() => remove(location.id)} />
                            </>
                            :
                            <GlobalButton text={i18n.t('addNewLocation')} onPress={addLocation} />}
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
