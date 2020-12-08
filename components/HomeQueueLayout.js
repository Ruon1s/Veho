import React, { useEffect, useState } from "react";
import {
  Spinner,
  Text,
  View,
} from "native-base";
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
let setUpdatedSoc;

const updateSoc = async () => {
  try {

    console.log('Updating in bg..');

    //Do the basic fetch, same as ApiHooks..
    const token = await SecureStore.getItemAsync('token');

    console.log('token: ', token);

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

    console.log('Headers: ', headers);
    console.log('Options: ', options);

    const response = await fetch(`https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/${selectedCar.vin}`, options);
    const toJSON = await response.json();

    console.log('Selected Car: ', selectedCar);

    console.log('received update: ', toJSON.items);

    //If the car is fully charged, send notifications
    if (toJSON.items.soc === 100) {
      await TaskManager.unregisterTaskAsync('bgFetch');
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
    console.log('Error: ', error.message);
    return BackgroundFetch.Result.Failed;
  }
}

const initializeBackgroundFetch = async (taskName, taskFunction, interval = 60 * 15) => {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      console.log('Task: ', taskName, ' is going to be defined');
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
  setUpdatedSoc = setSelected;

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

  useEffect(() => {
    console.log('selectedState ' + selected.licencePlate)
    initializeBackgroundFetch('bgFetch', updateSoc, 5);
  }, [selected])

  const onSelect = (value) => {
    setSelected(value)
  }


  return (
    <View
      padder
      style={{ flex: 1, justifyContent: "space-between", marginBottom: 24 }}
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
        <BatteryInfo batteryStatus={selected.soc} sizeVariable="large" charging={parkingSpots.inSpot} />
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
                <View style={{ flexDirection: 'row' }}>
                  <QueueButton
                    onPress={() => startCharging(props.user.location.id)}
                    text={i18n.t('startCharging')}
                    style={{ flex: 1.5 }}
                  />
                  <QueueButton
                    onPress={() => removeUserFromQueue(props.user.location.id)}
                    text={i18n.t('skip')}
                    transparent={true}
                    style={{ flex: 0.5 }}
                    danger={true}
                  />
                </View>
                :
                !queue.inQueue && !available && !parkingSpots.inSpot ?
                  <QueueButton
                    onPress={() => addUserToQueue(props.user.location.id)}
                    text={i18n.t('queue')}
                  />
                  :
                  queue.inQueue && !available ?
                    <QueueButton
                      onPress={() => removeUserFromQueue(props.user.location.id)}
                      text={i18n.t('leaveQueue')}
                    />
                    :
                    !queue.inQueue && available ?
                      <QueueButton
                        onPress={() => startCharging(props.user.location.id)}
                        text={i18n.t('startCharging')}
                      />
                      :
                      parkingSpots.inSpot ?
                        <QueueButton
                          onPress={() => stopCharging(props.user.location.id)}
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
