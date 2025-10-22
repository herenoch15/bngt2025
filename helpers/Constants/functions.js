import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const formatNumber = number => {
    return number <= 9 ? '0'+number : number
}

//return date to timeStamp format
const returnTimeStamp = () => Math.floor(Date.now() / 1000).toString()

const showAlert = (text, btn = false) => {
    if (!btn) {
        Alert.alert( 'BNGT',
            text,
            [{text: 'Ok'}]
        );
    }else{
        Alert.alert( 'BNGT',
            text,
            btn
        );
    }
}

const getLang = async () => {
    let lang = await AsyncStorage.getItem('@lang')
    return lang
}

const getStore = async (key) =>
{
  try
  {
    const countStr = await AsyncStorage.getItem(key);
    if (!countStr) return null;

    const count = parseInt(countStr);
    let fullData = "";

    for (let i = 0; i < count; i++) {
      const part = await AsyncStorage.getItem(`${key}_${i}`);
      if (part) {
        fullData += part;
      }
    }

    return fullData;
  }
  catch (error)
  {
    console.log("Could not get [" + key + "] from store.");
    return null;
  }
};

const saveStore = async (key, data) =>
{
  try
  {
    const json = data;  // ← c'est ici que ça doit être fait

    const parts = json.match(/.{1,1000000}/g);

    for (let i = 0; i < parts.length; i++) {
      await AsyncStorage.setItem(`${key}_${i}`, parts[i]);
    }

    await AsyncStorage.setItem(key, parts.length.toString());
  }
  catch (error)
  {
    console.log("Could not save store : ");
    console.log(error.message);
  }
};

const clearStore = async (key) =>
{
  try
  {
    console.log("Clearing store for [" + key + "]");
    let numberOfParts = await AsyncStorage.getItem(key);
    if(typeof(numberOfParts) !== 'undefined' && numberOfParts !== null)
    {
      numberOfParts = parseInt(numberOfParts);
      for (let i = 0; i < numberOfParts; i++) { AsyncStorage.removeItem(key + i); }
      AsyncStorage.removeItem(key);
    }
  }
  catch (error)
  {
    console.log("Could not clear store : ");
    console.log(error.message);
  }
};

export default {
    showAlert,
    formatNumber,
    getLang,
    getStore,
    saveStore,
    returnTimeStamp
}
