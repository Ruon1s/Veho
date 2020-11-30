import { Card, CardItem, Text, Button, Right, Left, Spinner, View, Icon } from 'native-base';
import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import GlobalButton from './GlobalButton';

const AdminPanelListItem = ({ item, remove, removing, error, edit, currentUser, switchToLocation }) => {
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
                    <Text> {error.message} </Text>
                    :
                    <Button transparent style={GlobalStyles.button} onPress={ () => remove(item.id) }>
                        <Text>Remove</Text>
                    </Button>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {item.id === currentUser.location.id ?
                        <Icon name="checkmark" /> 
                        :
                        <Button transparent style={GlobalStyles.button} onPress={() => switchToLocation(item)}>
                            <Icon name="sync" />
                        </Button>}
                        <Button transparent style={ GlobalStyles.button} onPress={ () => edit('addLocation', true, item) } >
                            <Text>Edit</Text>
                        </Button>
                    </View>}
                </Right>
            </CardItem>
        </Card>
    );
}

export default AdminPanelListItem;
