import React, { useEffect, useState } from 'react';
import { Header, Body, Title } from 'native-base';

// For cleaner code, need in many views anyway
const CustomHeader = (props) => {
    return (<Header>
        <Body>
            <Title>{props.title}</Title>
        </Body>
    </Header>)
};

export default CustomHeader;