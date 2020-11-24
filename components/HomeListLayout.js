import React, { useEffect, useState } from 'react';
import { Container, Content, Text, Button, View, StyleProvider, Card, CardItem, Body, List, ListItem } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import BatteryInfo from './BatteryInfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeListLayout = (props) => {
    let carArray = props.carArray


    return (<Content padder>
        {carArray.map((car, key) => (
            <Card key={key}>
                <CardItem button onPress={() => alert('Pressed ' + car.name)}>
                    <Body style={{ padding: 4 }} >
                        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
                            <View style={{ flex: 40, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{car.name.toUpperCase()}</Text>
                                <Text>{car.vin}</Text>
                            </View>

                            <View style={{ flex: 50, borderColor: '#dedede', borderStartWidth: 1, borderEndWidth: 1, alignContent: 'center' }}>
                                <Text style={{ fontSize: 32, alignSelf: 'center' }}>{car.licencePlate.toUpperCase()}</Text>
                            </View>

                            <View style={{ flex: 30, flexDirection: 'row' }}>
                                <Icon name='bolt' size={42} color="#000" style={{ marginStart: 12 }} />
                                <Text style={{ margin: 8, fontSize: 24 }}>42%</Text>
                            </View>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        ))}
    </Content>)
}

export default HomeListLayout