import React, { useEffect, useState } from "react";
import { Dimensions } from 'react-native';
import {
  Spinner,
  Text,
  View,
} from "native-base";
import { Grid, Row, Col } from 'react-native-easy-grid';
import BatteryInfo from "./BatteryInfo";
import QueueInfo from "./QueueInfo";
import LocationInfo from "./LocationInfo";
import useQueueHooks from "../hooks/QueueHooks";
import QueueButton from "./QueueButton";
import { StyleSheet } from "react-native";
import ErrorText from './ErrorText';
import useFirebase from "../hooks/FireBaseHook";
import useApiHooks from "../hooks/ApiHooks";
import CarDropdown from "./CarDropdown";
import i18n from 'i18n-js';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

let selectedCar;

const updateSoc = async () => {
  try {

    //Do the basic fetch, same as ApiHooks..
    const token = await SecureStore.getItemAsync('token');

    const headers = {
      "Cache-Control": "no-cache",
      Authorization: "Bearer " + token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };

    const options = {
      method: "GET",
      withCredentials: true,
      headers,
    };

    const response = await fetch(`https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/${selectedCar.vin}`, options);
    const toJSON = await response.json();

    //If the car is fully charged, send notifications
    if (Math.round(toJSON.items.soc) === 100) {
      await TaskManager.unregisterTaskAsync('updateSoc');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${i18n.t('carIsFullPrefix')} ${selectedCar.name} ${i18n.t('carIsFullTitle')}`,
          body: i18n.t('carIsFullBody')
        },
        trigger: {
          seconds: 2,
        },
      });
    }
    return toJSON ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
}

const initializeBackgroundFetch = async (taskName, taskFunction, interval = 60 * 10) => {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, taskFunction);
    }

    await BackgroundFetch.registerTaskAsync(taskName, { minimumInterval: interval });
  } catch (error) {
    console.log(`Error initializing background fetch: ${error.message}`);
  }
}

const HomeQueueLayout = (props) => {
  const [available, setAvailable] = useState(); //To check if there is a spot available right away
  const [selected, setSelected] = useState('');
  const { getUserCars } = useFirebase();
  selectedCar = selected;

  const {
    soc,
    fetchSoc,
  } = useApiHooks();

  const {
    queue,
    parkingSpots,
    errors,
    queueListener,
    parkingSpotListener,
    addUserToQueue,
    removeUserFromQueue,
    startCharging,
    stopCharging,
    checkStatus,
  } = useQueueHooks();

  useEffect(() => {
    if (props.user.location !== '' && props.user.location.id !== '') {
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

  /* useEffect(() => {
    fetchSoc();
  }, [soc]); */

  const onSelect = (value) => {
    setSelected(value)
  }

  const handleStartCharging = async () => {
    try {
      await startCharging(props.user.location.id);
      await initializeBackgroundFetch('updateSoc', updateSoc, 600);
    } catch (error) {
      console.log(`Start Charging error: ${error.message}`);
    }
  }

  const handleStopCharging = async () => {
    try {
      await stopCharging(props.user.location.id);
      await TaskManager.unregisterTaskAsync('updateSoc');
    } catch (error) {
      console.log(`Error stopping the charging: ${error.message}`);
    }
  }
  let large = true
  if (Dimensions.get('window').width < 400) { large = false }

  return (
    <View
      padder
      style={{ flex: 1, justifyContent: "space-between", marginBottom: 30 }}
    >
      <QueueInfo
        free={parkingSpots.available.length}
        queue={queue.size}
        queuePosition={queue.position}
        charging={parkingSpots.inSpot}
        style={{ flex: 2 }}
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <LocationInfo user={props.user} />
        </View>
        <View style={{ flex: 0.4 }}>
          {!queue.inQueue && !parkingSpots.inSpot ?
            <CarDropdown selected={selected} onSelect={onSelect} carArray={props.carArray} /> : null}
        </View>
      </View>
      <View style={{ display: "flex", justifyContent: "center", flex: 8 }}>
        {large ? <BatteryInfo batteryStatus={selected.soc} sizeVariable="large" charging={parkingSpots.inSpot} /> :
          <BatteryInfo batteryStatus={selected.soc} sizeVariable="small" charging={parkingSpots.inSpot} />}
        {/** 
        {parkingSpots.inSpot ? <Text style={styles.estimatedText}>Estimated time: TODO</Text> : null}
        */}
      </View>
      <View style={{ flex: 1 }}>
        {props.carArray.length === 0 || props.user.location.id === '' ?
          <ErrorText text="Please add a car and/or a location in the settings." />
          :
          errors ?
            <ErrorText text={errors} />
            :
            queue.processing ?
              <Spinner />
              :
              queue.inQueue && available ?
                <Grid>
                  <QueueButton
                    onPress={() => startCharging(props.user.location.id)}
                    large={false}
                    text={i18n.t('startCharging')}
                    style={{ flex: 1 }}
                  />
                  <QueueButton
                    onPress={() => removeUserFromQueue(props.user.location.id)}
                    large={false}
                    text={i18n.t('skip')}
                    transparent={true}
                    style={{ flex: 0.7 }}
                    danger={true}
                  />
                </Grid>
                :
                !queue.inQueue && !available && !parkingSpots.inSpot ?
                  <QueueButton
                    large={large}
                    onPress={() => addUserToQueue(props.user.location.id)}
                    text={i18n.t('queue')}
                  />
                  :
                  queue.inQueue && !available ?
                    <QueueButton
                      large={large}
                      onPress={() => removeUserFromQueue(props.user.location.id)}
                      text={i18n.t('leaveQueue')}
                    />
                    :
                    !queue.inQueue && available ?
                      <QueueButton
                        onPress={handleStartCharging}
                        large={large}
                        text={i18n.t('startCharging')}
                      />
                      :
                      parkingSpots.inSpot ?
                        <QueueButton
                          onPress={handleStopCharging}
                          large={large}
                          text={i18n.t('stopCharging')}
                        />
                        :
                        null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  estimatedText: {
    fontSize: 24,
  }
})

export default HomeQueueLayout;
