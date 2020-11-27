import { Text, Button } from 'native-base';
import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';

const GlobalButton = ({ text, full=true, transparent=false, bordered=false, onPress }) => {

    return(
        <Button full={full} transparent={transparent} bordered={bordered} onPress={onPress} style={ GlobalStyles.button }>
            <Text> { text } </Text>
        </Button>
    );
}

export default GlobalButton;
