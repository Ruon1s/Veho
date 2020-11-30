import React, { useState, useEffect, useRef } from "react";
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from "expo-secure-store";
import { fetchToken } from "./TokenHook";
import * as firebase from "firebase";

const useChargeHook = () => {
  const [soc, setSoc] = useState(10);

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
      /*
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
    console.log("fetchSoc finished.")
  }
  return {
    soc,
    fetchSoc
  }
};

export default useChargeHook;
