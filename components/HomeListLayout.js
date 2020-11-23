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
                <CardItem>
                    <Body style={{ padding: 4 }}>
                        <Grid>
                            <Col size={40}>
                                <Row><Text style={{ fontWeight: 'bold', fontSize: 22 }}>{car.name}</Text></Row>
                                <Row><Text>{car.vin}</Text></Row>
                            </Col>
                            <Col size={40}><Text style={{ fontSize: 24 }}>{car.licencePlate}</Text></Col>
                            <Col size={20}><Icon name='bolt' size={36} color="#000" ><Text>54%</Text></Icon></Col>
                        </Grid>
                    </Body>
                </CardItem>
            </Card>
        ))}
    </Content>)
}

export default HomeListLayout