import React, { useState, useEffect } from 'react';
import { Container, Text, Button, Content, Header, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const QueueInfo = (props) => {
    const [free, setFree] = useState(0)
    const [queue, setQueue] = useState(0)
    //wee
    // useEffect to update numbers in text whenever there's a change
    return (<>
        <Text>Free spots: {free}</Text>
        <Text>Number of cars in queue: {queue}</Text>
    </>)
}

export default QueueInfo
