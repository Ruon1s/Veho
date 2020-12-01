import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  Button,
  View,
  StyleProvider,
  Toast,
  Root,
  Spinner,
} from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import GlobalStyles from "../styles/GlobalStyles";
import BatteryInfo from "./BatteryInfo";
import QueueInfo from "./QueueInfo";
import CustomHeader from "./CustomHeader";
import LocationInfo from "./LocationInfo";
import useQueueHooks from "../hooks/QueueHooks";
import useFirebase from "../hooks/FireBaseHook";
import useApiHooks from "../hooks/ApiHooks";
import CarDropdown from "./carDropdown";

const HomeQueueLayout = (props) => {
  const [available, setAvailable] = useState(); //To check if there is a spot available right away
  const [selected, setSelected] = useState('');

  const {
    soc,
    fetchSoc,
  } = useApiHooks();

  const {
    queue,
    parkingSpots,
    queueListener,
    parkingSpotListener,
    addUserToQueue,
    removeUserFromQueue,
    startCharging,
    checkStatus,
  } = useQueueHooks();

  useEffect(() => {
    if (props.user.location) {
      const unsubscribeQueueListener = queueListener(props.user.location.id);
      const unsubscribeParkingSpotListener = parkingSpotListener(
        props.user.location.id
      );

      return () => {
        unsubscribeQueueListener();
        unsubscribeParkingSpotListener();
      };
    }
  }, [props.user]);

  useEffect(() => {
    setAvailable(checkStatus());
  }, [parkingSpots, queue]);


  useEffect(() => {
    console.log('selectedState ' + selected.licencePlate)
  }, [selected])

  const onSelect = (value) => {
    setSelected(value)
  }

  useEffect(() => {
    fetchSoc();
  }, [soc]);

  return (
    <View
      padder
      style={{ flex: 1, justifyContent: "space-between", marginBottom: 24 }}
    >
      <QueueInfo
        free={parkingSpots.available.length}
        queue={queue.size}
        queuePosition={queue.position}
        style={{ flex: 2 }}
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <LocationInfo user={props.user} />
        </View>
        <View style={{ flex: 0.4 }}>
          {!queue.inQueue && !parkingSpots.inSpot ?
              <CarDropdown selected={selected} onSelect={onSelect} /> : null}
        </View>
      </View>
      <View style={{ display: "flex", justifyContent: "center", flex: 8 }}>
        <BatteryInfo batteryStatus={soc} sizeVariable="large" />
      </View>

      <View style={{ flex: 1 }}>
        {/*
            <Button  large block transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                <Text>Test notification</Text>
            </Button>
            <Button  large block onPress={fetchToken}>
                <Text>(DEV) Get Token</Text>
            </Button>
            <Button  large block onPress={fetchSoc}>
                <Text>(DEV) Refresh SOC</Text>
            </Button>
*/}
        {queue.inQueue && available ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              large
              block
              style={GlobalStyles.button}
              onPress={() =>
                startCharging(props.navigation, props.user.location.id)
              }
            >
              <Text>Start Charging</Text>
            </Button>
            <Button
              large
              block
              transparent
              style={GlobalStyles.button}
              onPress={() => removeUserFromQueue(props.user.location.id)}
              disabled={queue.processing}
            >
              {queue.processing ? <Spinner /> : <Text>Skip</Text>}
            </Button>
          </View>
        ) : null}
        {!queue.inQueue && !available && !parkingSpots.inSpot ? (
          <Button
            large
            block
            style={GlobalStyles.button}
            onPress={() => addUserToQueue(props.user.location.id)}
            disabled={queue.processing}
          >
            {queue.processing ? <Spinner /> : <Text>Queue</Text>}
          </Button>
        ) : null}
        {queue.inQueue && !available ? (
          <Button
            large
            block
            style={GlobalStyles.button}
            onPress={() => removeUserFromQueue(props.user.location.id)}
            disabled={queue.processing}
          >
            {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
          </Button>
        ) : null}
        {!queue.inQueue && available ? (
          <Button
            large
            block
            style={GlobalStyles.button}
            onPress={() =>
              startCharging(props.navigation, props.user.location.id)
            }
          >
            <Text>Start Charging</Text>
          </Button>
        ) : null}
        {parkingSpots.inSpot ? (
          <Button
            large
            block
            style={GlobalStyles.button}
            onPress={() =>
              props.navigation.navigate("ChargingView", {
                location: props.user.location.id,
              })
            }
          >
            <Text>To Charging View</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default HomeQueueLayout;
