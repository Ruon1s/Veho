
import React, { Component } from "react";
import { Container, Header, Content, Picker, Form } from "native-base";
import {useState, useEffect} from 'react'
import useFirebase from "../hooks/FireBaseHook";
import * as firebase from "firebase";

const DropDownMenu = () => {
    const [selected, setSelected] = useState(0);
    const {
        getLocations,
        locations,
    } = useFirebase();


    useEffect(() => {
        getLocations().then(console.log('locations?', locations))
        console.log('useEffect called')
        console.log(locations)
    }, []);

    const itemsList = (locations) => {
        return (locations.map((item, index) => {
            return((<Picker.Item label={item} key={index} value={item}/>))
        }));
    };

    const onSelect = (value) => {
        setSelected(value)
        console.log(value)
    }


        return (
                            <Picker
                            note
                            style={{ width: 120 }}
                            mode="dropdown"
                            selectedValue={selected}
                            onValueChange={(value) => {onSelect(value)}}>
                            {itemsList(locations)}

                        </Picker>
        );

    };
export default DropDownMenu

