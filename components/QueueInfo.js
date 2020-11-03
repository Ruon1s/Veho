import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';

const QueueInfo = (props) => {
    const [free, setFree] = useState(0)
    const [queue, setQueue] = useState(0)
    //wee
    // useEffect to update numbers in text whenever there's a change
    return (<View>
        <Text>Number of cars in queue: {queue}</Text>
        <Text>Free spots: {free}</Text>
    </View>)
}

export default QueueInfo
