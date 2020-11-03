import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'native-base';

const QueueInfo = (props) => {
    return (<View>
        {props.queue > 0 ?
            <Text>Number of cars in queue: {props.queue}</Text> : <Text>The queue is empty</Text>
        }

        {props.free > 0 ?
            <Text>Free spots: {props.free}</Text> : <Text>No spots are open</Text>
        }

        {props.queuePosition > 0 ?
            <Text>Your position in queue: {props.queuePosition}</Text> : <Text>You are not in queue</Text>
        }
    </View>)
}

export default QueueInfo
