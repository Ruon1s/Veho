import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { AUTH, GRANT, UNAME, PASS } from "@env";
import { Content, Text, View, Card, CardItem } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import useFirebase from "../hooks/FireBaseHook";
import i18n from "i18n-js";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import * as firebase from "firebase";
import "firebase/firestore";

const updateSocs = async () => {
  console.log("Updating in bg (updateSocs)");
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();

  const carsRef = db
    .collection("users")
    .doc(user.uid)
    .collection("cars")
    .orderBy("priority", "desc");
  const snapshot = await carsRef.get();

  snapshot.forEach(async (doc) => {
    const carData = doc.data();
    await fetchSocs(carData.vin);
  });
};

const fetchSocs = async (vin) => {
  try { 
    //Do the basic fetch, same as ApiHooks..
    
    console.log("Updating in bg (fetchSocs)");
    fetchToken();

    const token = await SecureStore.getItemAsync("token");
    console.log("token: ", token);

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

    console.log("Headers: ", headers);
    console.log("Options: ", options);

    const response = await fetch(
      `https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/${vin}`,
      options
    );

    const toJSON = await response.json();
    console.log("Fetched soc for vin " + vin + ": " + toJSON.items.soc);

    //If the car is fully charged, send notifications
    if (Math.round(toJSON.items.soc) === 100 && !toJSON.items.chargingActive) {
      console.log("Fully charged, sending notification.");
      await TaskManager.unregisterTaskAsync("bgFetch");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${carData.name} is ready!`,
          body: `Your car ${carData.name} has been fully charged`,
        },
        trigger: {
          seconds: 2,
        },
      });
    }
    return toJSON
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (error) {
    console.log("Error: ", error.message);
    return BackgroundFetch.Result.Failed;
  }
};

const fetchToken = async () => {
  //Do the basic fetch, same as ApiHooks..
  console.log("Executing fetchToken");
  try {
    const data = {
      grant_type: GRANT,
      username: UNAME,
      password: PASS,
    };

    const headers = {
      "Cache-Control": "no-cache",
      Authorization: AUTH,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };

    const formBody = Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");

    const options = {
      method: "POST",
      headers,
      body: formBody,
    };

    const res = await fetch(
      "https://api.connect-business.net/fleet/v1/oauth/token",
      options
    );

    if (res.status == 200) {
      console.log("FetchToken: Status OK, " + res.status);
      const toJSON = await res.json();
      console.log("access token: " + toJSON.access_token);
      await SecureStore.setItemAsync("token", toJSON.access_token);
    } else {
      console.log("FetchToken: Status BAD, " + res.status);
    }
  } catch (error) {
    console.log(error);
  }
};

const initializeBackgroundFetch = async (
  taskName,
  taskFunction,
  interval = 60 * 15
) => {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      console.log("Task: ", taskName, " is going to be defined");
      TaskManager.defineTask(taskName, taskFunction);
    }

    await BackgroundFetch.registerTaskAsync(taskName, {
      minimumInterval: interval,
    });
  } catch (error) {
    console.log(`Error initializing background fetch: ${error.message}`);
  }
};

const HomeListLayout = (props) => {
  let carArray = props.carArray;

  const createTwoButtonAlert = (car) => {
    // Manager clicks cardObject, they are asked to put car in queue or not
    let message = `${i18n.t("addCarMessage")} ${car.name}`;

    if (car.priority === true) {
      // If car is already priority
      message = `${i18n.t("removeCarMessage")} ${car.name}`;
    }

    Alert.alert(
      i18n.t("title"),
      message,
      [
        {
          text: i18n.t("cancel"), // Nothing happens
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: i18n.t("ok"),
          onPress: () => {
            // Set car on top of the list and mark the priority somehow -- firebase modifications needed
            props.prioritizeCar(car);
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    console.log("carArray length: " + carArray.length);
    initializeBackgroundFetch("bgFetch", updateSocs, 5);
  }, [carArray]);

  return (
    <Content padder>
      {carArray.map((car, key) => (
        <Card key={key}>
          <CardItem button onPress={() => createTwoButtonAlert(car)}>
            <View style={styles.left}>
              <Text numberOfLines={1} style={styles.carName}>
                {
                  car.priority && (
                    <Text style={styles.priorityIndicator}>* </Text>
                  ) /* render if car is set as priority in carArray, boolean value */
                }
                {car.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.bodyStyle}>
              <Text numberOfLines={1} style={styles.licenceNumber}>
                {car.licencePlate.toUpperCase()}
              </Text>
            </View>
            <View style={styles.batteryStatus}>
              <Icon name="bolt" size={32} color="#EAEAEA" />
              <Text numberOfLines={1} style={styles.batteryPercentage}>
                {car.soc}%
              </Text>
            </View>
          </CardItem>
        </Card>
      ))}
    </Content>
  );
};

const styles = StyleSheet.create({
  left: {
    flex: 1,
  },
  carName: {
    fontSize: 26,
  },
  priorityIndicator: {
    fontSize: 26,
    color: "#FB3664",
    fontWeight: "bold",
  },
  bodyStyle: {
    flex: 1,
    borderColor: "#EAEAEA",
    borderStartWidth: 1,
    borderEndWidth: 1,
  },
  licenceNumber: {
    alignSelf: "center",
    fontSize: 26,
  },
  batteryStatus: {
    flex: 0.7,
    justifyContent: "flex-end",
    display: "flex",
    flexDirection: "row",
  },
  batteryPercentage: {
    fontSize: 26,
    marginLeft: 8,
  },
});

export default HomeListLayout;
