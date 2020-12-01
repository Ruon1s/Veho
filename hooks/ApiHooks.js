import React, { useState, useEffect, useRef } from "react";
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from "expo-secure-store";
import * as firebase from "firebase";

/**
 * file for holding all API related functionality
 * @returns {{fetchToken: *, fetchVin: *, soc: *, vin: *, fetchSoc: *}}
 */

const useApiHooks = () => {

   // soc, state of charge
  const [soc, setSoc] = useState(10);
   // vin, vehicle identification number
  const [vin, setVin] = useState('');

  /**
   * Function for getting the charge % of a single electric vehicle
   * @param vin, vehicle identification number for the api
   * @returns {Promise<number>}
   */
  //TODO put vin as a parameter after we have all necessary information in the fleet
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

      //TODO use vin in the fetch
      const res = await fetch(
        "https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/W1K2132111A869249",
        options
      );

      if (res.status == 200) {
        console.log("fetchSoc: Status OK, " + res.status);
        const toJSON = await res.json();
        setSoc(toJSON.items.soc); /* might have to remove the state thing or add it as an array */
        return toJSON.items.soc; /* Trying to also return the value of the SOC so i can use it in other files better than flooding a single state */
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

  /**
   * Fetches all cars from the API and filters them by given license plate number
   * so that the user doesnt have to insert the long and hard vin number to the application
   * but registration number instead
   * @param licPlate
   * @returns {Promise<boolean>}
   */

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
  /**
   * Function for fetching an API access token to be able to do actual API calls to the system
   * @returns {Promise<void>}
   */
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
