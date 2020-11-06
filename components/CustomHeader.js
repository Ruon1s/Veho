import React, { useEffect, useState } from 'react';
import { Header, Body, Title, Left, Right } from 'native-base';

// For cleaner code, need in many views anyway
const CustomHeader = (props) => {
    return (<Header>
        <Left>
        </Left>
        <Body>
            <Title>{props.title}</Title>
        </Body>
        <Right />
    </Header>)
};

export default CustomHeader;