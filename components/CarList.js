import { Card, CardItem, Content, Text, View, Button, Right } from "native-base";
import React from "react";
import useFirebase from "../hooks/FireBaseHook";
import Icon from 'react-native-vector-icons/FontAwesome5';
import i18n from 'i18n-js';

const CarList = (props) => {
    console.log('ree', props.carArray);
    let carArray = props.carArray;

    return (
        <Content padder>
            {carArray.map((car, key) => (
                <Card key={key} >
                    <CardItem style={{ display: "flex", flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1}>
                                {car.name.toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text numberOfLines={1}>{car.licencePlate.toUpperCase()}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button transparent onPress={() => props.deleteCar(car)}>
                                <Right>
                                    <Icon name="trash-alt" size={26} color='#FB3664'></Icon>
                                </Right>
                            </Button>
                        </View>
                    </CardItem>
                </Card>
            ))}
        </Content>)
};
export default CarList
