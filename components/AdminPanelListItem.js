import { Card, CardItem, Text, Button, Right, Left, Spinner, View } from 'native-base';
import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';

const AdminPanelListItem = ({ item, remove, removing, error, edit }) => {
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
                    <Button transparent style={ GlobalStyles.button} onPress={ () => edit('addLocation', true, item) } >
                        <Text>Edit</Text>
                    </Button>}
                </Right>
            </CardItem>
        </Card>
    );
}

export default AdminPanelListItem;
