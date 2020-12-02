import { Card, CardItem, Text, Button, Right, Left, Spinner, View, Icon, Body } from 'native-base';
import React, { useEffect } from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import GlobalButton from './GlobalButton';
import ErrorText from './ErrorText';

const AdminPanelListItem = ({ item, remove, removing, error, edit, currentUser, switchToLocation, switching }) => {
    return (
        <Card>
            <CardItem>
                <Left style={{ flex: 1 }}>
                    <Text numberOfLines={1}> { item.email ? item.email : item.name } </Text>
                </Left>
                {item.publicSpots || item.dedicatedSpots ?
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <Text> { `${item.publicSpots}/${item.dedicatedSpots}` } </Text>
                </View>
                :
                null}
                <Right style={{ flex: 1 }}>
                    {item.email ?
                    removing === item.id ?
                    <Spinner />
                    :
                    error.type === item.id ?
                    <ErrorText text={error.message} />
                    :
                    <GlobalButton text="Remove" onPress={() => remove(item.id)} transparent={true} />
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {item.id === currentUser.location.id ?
                        <Icon name="checkmark" /> 
                        :
                        error.type === 'switchToLocation' ?
                        <ErrorText text={error.message} />
                        :
                        switching === item.id ?
                        <Spinner />
                        :
                        <Button transparent style={GlobalStyles.button} onPress={() => switchToLocation(item)}>
                            <Icon name="sync" />
                        </Button>}
                        <GlobalButton text="Edit" onPress={() => edit('addLocation', true, item)} transparent={true} />
                    </View>}
                </Right>
            </CardItem>
        </Card>
    );
}

export default AdminPanelListItem;
