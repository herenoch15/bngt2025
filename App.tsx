/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { 
  Platform,
  PermissionsAndroid,
  DeviceEventEmitter,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Beacons from '@hkpuits/react-native-beacons-manager'
import { useEffect } from 'react';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
     const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            return true
          }
          if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
            const apiLevel = parseInt(Platform.Version.toString(), 10)
  
            if (apiLevel < 31) {
              const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              return granted === PermissionsAndroid.RESULTS.GRANTED
            }
            if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
              const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              ])
  
              return (
                result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
              )
            }
          }
         
                  return true;
        }
  const asyncBlueThouth =async () => {
        console.log("APPPP////////////")
        await requestLocationPermission()
          // Tells the library to detect iBeacons
          Beacons.init(); // to set the NotificationChannel, and enable background scanning
          Beacons.detectIBeacons();
          console.log("Start detecting all iBeacons in the nearby")
          // Start detecting all iBeacons in the nearby
          try {
            await Beacons.startRangingBeaconsInRegion('REGION1')
            console.log(`Beacons ranging started succesfully!`);
          } catch (error: any) {
            console.log(`Beacons ranging not started, error: ${error}`);
          }

          // Print a log of the detected iBeacons (1 per second)
          DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            console.log('Found beacons!', data.beacons);
          })
  }
    useEffect(  () => {
          asyncBlueThouth()
    }, []);
  
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
