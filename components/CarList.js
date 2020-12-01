import {Card, CardItem, Content, Text, View, Button} from "native-base";
import React from "react";
import useFirebase from "../hooks/FireBaseHook";


const CarList = (props) => {
    console.log('ree', props.carArray);
    let carArray = props.carArray;

    const {deleteCar,
    } = useFirebase();

    return (
        <Content padder>
    {carArray.map((car, key) => (
        <Card key={key}>
            <CardItem>
                <View>
                    <Text numberOfLines={1}>
                        {car.name.toUpperCase()}
                    </Text>
                </View>
                <View>
                    <Text numberOfLines={1}>{car.licencePlate.toUpperCase()}</Text>
                </View>
                <View>
                    <Button onPress={() => props.deleteCar(car)}>
                        <Text>{'Delete'}</Text>
                    </Button>
                </View>
            </CardItem>
        </Card>
    ))}
</Content>)
};
export default CarList
