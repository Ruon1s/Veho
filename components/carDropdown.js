
import React from "react";
import { Picker } from "native-base";

/**
 * component that displays a custom picker view with users cars in it
 * @param props
 * @returns {*}
 * @constructor
 */
const CarDropdown = (props) => {
    const selected = props.selected

    /**
     * Sets the array of cars to the picker in order
     */
    const itemsList = () => {
        return (props.carArray.map((item, index) => {
            return ((<Picker.Item label={item.name} key={index} value={item} />))
        }));
    };

    return (
        <Picker
            note
            mode="dropdown"
            selectedValue={selected}
            onValueChange={(value) => { props.onSelect(value) }}>
            {itemsList()}
        </Picker>
    );
};

export default CarDropdown
