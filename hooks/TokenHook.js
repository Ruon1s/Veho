import React, { useState, useEffect, useRef } from "react";
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from "expo-secure-store";
import * as firebase from "firebase";

const fetchToken = async () => {
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

export { fetchToken };
