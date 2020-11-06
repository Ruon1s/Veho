import React, { useEffect, useState } from 'react';
import { Header, Body, Title, Left, Right, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5'

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
        </Body>
        <Right />
    </Header>)
};

export default CustomHeader;