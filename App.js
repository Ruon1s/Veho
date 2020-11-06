import React, { useState, useEffect } from 'react';
import { Text } from 'native-base';
import * as Expo from "expo";
import * as Font from 'expo-font';
import Navigator from './navigators/Navigator';

const App = () => {
  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      OpenSans_Light: require("./assets/fonts/OpenSans-Light.ttf"),
      OpenSans_Bold: require("./assets/fonts/OpenSans-Bold.ttf"),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    setFontReady(true);
  }
  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontReady) {
    console.log('Waiting for fonts...');
    return (<>
      <Text>Installing fonts...</Text>
      <Expo.AppLoading />
    </>
    );
  }

  return (
    <Navigator />
  );
}

export default App;
