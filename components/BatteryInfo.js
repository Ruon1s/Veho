import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Row, Grid } from 'react-native-easy-grid';
import { VictoryPie, VictoryLabel } from 'victory-native';

const BatteryInfo = (props) => {
    const batteryStatus = props.batteryStatus           // Number between 0-100
    const data = [                                      // Data for victorypie to show the charge correctly
        { x: `${batteryStatus}%`, y: batteryStatus },
        { x: 'null', y: 100 - batteryStatus }
    ]

    const sizeVariable = props.sizeVariable

    let textSize = {
        iconSize: 56,
        batteryContentHeight: 180,
        batteryContentMargin: 8,
        batteryGridSize: 170,
        batteryGridPadding: 34,
        batteryGridPaddingTop: 40,
        batteryTextFontSize: 24
    }
    let pieSize = {
        radius: 170,
        innerRadius: 80,
        padding: 10
    }

    // 'large' is 1.5 times bigger than the default layout
    if (sizeVariable === 'large') {
        textSize = {
            iconSize: 84,
            batteryContentHeight: 270,
            batteryContentMargin: 12,
            batteryGridSize: 255,
            batteryGridPadding: 51,
            batteryGridPaddingTop: 60,
            batteryTextFontSize: 36
        }
        pieSize = {
            radius: 255,
            innerRadius: 120,
            padding: 15
        }
    }

    const CenterText = () => {                          // Component in the middle of the piechart, contains the bolt-icon and the number
        return <Grid style={styles.batteryGrid}>
            <Row size={2}>
                <Icon name="bolt" size={textSize.iconSize} color={props.charging ? '#4fd966' : '#000'}></Icon>
            </Row>
            <Row size={1}>
                <Text style={styles.batteryText}>{batteryStatus}%</Text>
            </Row>
        </Grid>
    }

    const styles = StyleSheet.create({
        batteryContent: {
            height: textSize.batteryContentHeight,
            alignItems: 'center',
            margin: textSize.batteryContentMargin
        },
        batteryGrid: {
            position: 'absolute',
            width: textSize.batteryGridSize,
            height: textSize.batteryGridSize,
            backgroundColor: '#FFFFFF',
            borderRadius: textSize.batteryGridSize,
            alignItems: 'center',
            padding: textSize.batteryGridPadding,
            paddingTop: textSize.batteryGridPaddingTop
        },
        batteryText: {
            width: '100%',
            textAlign: 'center',
            fontSize: textSize.batteryTextFontSize,
            color: props.charging ? '#4fd966' : '#000'
        }
    });

    return (
        <View style={styles.batteryContent}>
            <CenterText />
            <VictoryPie
                standalone={true}
                width={pieSize.radius}
                height={pieSize.radius}
                colorScale={props.charging ? ['#4fd966', '#EAEAEA'] : ['#000', '#EAEAEA']}
                innerRadius={pieSize.innerRadius}
                padding={pieSize.padding}
                data={data}
                labelComponent={<VictoryLabel
                    style={{ fill: '#FFF' }}
                />}
            />
        </View>
    );
};



export default BatteryInfo;