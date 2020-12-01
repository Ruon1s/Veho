import React, { useState, useEffect, useRef } from "react";
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from "expo-secure-store";
import * as firebase from "firebase";

const useApiHooks = () => {
  const [soc, setSoc] = useState(10);
  const [vin, setVin] = useState('');

  const fetchSoc = async () => {
    console.log('Executing fetchSoc');
    const token = await SecureStore.getItemAsync("token");
    try {
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
      /*  ADD THIS 'carVin' AFTER USERS HAVE VIN'S IN BACKEND
      const user = firebase.auth().currentUser;
      console.log(user);
      const db = firebase.firestore();

      const carsRef = db.collection("cars");
      const snapshot = await carsRef.where("uid", "==", user.uid).get();
      if (snapshot.empty) {
        console.log("No documents.");
        return;
      }
      const carVin = snapshot.docs[0].data().vin;
      console.log("current users cars vin number: ", carVin);
      */

      const res = await fetch(
        "https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/W1K2132111A869249",
        options
      );

      if (res.status == 200) {
        console.log("fetchSoc: Status OK, " + res.status);
        const toJSON = await res.json();
        setSoc(toJSON.items.soc);
      } else if (res.status == 401) {
        console.log("fetchSoc: Status Unauthorized, " + res.status);
        fetchToken();
        fetchSoc();
      } else {
        console.log("fetchSoc: Status BAD, " + res.status);
        fetchToken();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchVin = async (licPlate) => {
    console.log('Executing fetchVin');
    const token = await SecureStore.getItemAsync("token");
    try {
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

      const res = await fetch(
        "https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.snapshots?_filter=licensePlate=eq=" + licPlate,
        options
      );

      if (res.status == 200) {
        console.log("fetchVin: Status OK, " + res.status);
        const toJSON = await res.json();
        setVin(toJSON.items[0].vin);
        console.log("items[0].vin: " + toJSON.items[0].vin)
        return true
      } else if (res.status == 401) {
        console.log("fetchVin: Status Unauthorized, " + res.status);
        fetchToken();
        fetchVin();
      } else {
        console.log("fetchVin: Status BAD, " + res.status);
        fetchToken();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchToken = async () => {
    console.log('Executing fetchToken');
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
  }

  return {
    soc,
    vin,

    fetchSoc,
    fetchVin,
    fetchToken
  }
};

export default useApiHooks;
