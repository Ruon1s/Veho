import React from 'react';
import { Form, Input, Item } from 'native-base';

const SearchInput = ({ handleTextChange, placeholder }) => {
    return(
        <Form>
            <Item>
                <Input placeholder={ placeholder } onChangeText={ text => handleTextChange(text) } />
            </Item>
        </Form>
    );
}

export default SearchInput;
