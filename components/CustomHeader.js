import React, { useEffect, useState } from 'react';
import { Header, Body, Title, Left, Right, Button, Subtitle, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

// For cleaner code, need in many views anyway
const CustomHeader = (props) => {
    return (<Header>
        <Left>
            {props.handleBackButton && <Button transparent onPress={props.handleBackButton}>
                <Icon name='arrow-left' size={25} color={'#FFF'} />
            </Button>}
        </Left>
        <Body>
            <Title>{props.title}</Title>
            {props.subtitle.firstname !== null && <Subtitle>{props.subtitle.firstname}</Subtitle>}
        </Body>
        <Right >
            {props.picker !== null && <Button block onPress={props.onValueChange}>
                <Text>{props.userType}</Text>
            </Button>}
        </Right>
    </Header>)
};

export default CustomHeader;
