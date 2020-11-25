import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, View, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeListLayout = (props) => {
    let carArray = props.carArray

    return (<Content padder>
        {carArray.map((car, key) => (
            <Card key={key}>
                <CardItem button onPress={() => alert('Pressed ' + car.name)}>
                    <View style={styles.left}>
                        <Text numberOfLines={1} style={styles.carName}>{car.name.toUpperCase()}</Text>
                    </View>
                    <View style={styles.bodyStyle}>
                        <Text numberOfLines={1} style={styles.licenceNumber}>{car.licencePlate.toUpperCase()}</Text>
                    </View>
                    <View style={styles.batteryStatus}>
                        <Icon name='bolt' size={32} color="#EAEAEA" />
                        <Text numberOfLines={1} style={styles.batteryPercentage}>42%</Text>
                    </View>
                </CardItem>
            </Card>
        ))}
    </Content>)
}

const styles = StyleSheet.create({
    left: {
        flex: 1
    },
    carName: {
        fontSize: 26
    },
    bodyStyle: {
        flex: 1,
        borderColor: '#EAEAEA',
        borderStartWidth: 1,
        borderEndWidth: 1
    },
    licenceNumber: {
        alignSelf: 'center',
        fontSize: 26
    },
    batteryStatus: {
        flex: 0.7,
        justifyContent: 'flex-end',
        display: 'flex',
        flexDirection: 'row'
    },
    batteryPercentage: {
        fontSize: 26,
        marginLeft: 8
    }
});

export default HomeListLayout