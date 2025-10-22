import React from 'react'
import { View, Image, StyleSheet, Animated, Easing } from 'react-native'

const Loading = () => {

  spinValue = new Animated.Value(0);

  // First set up animation 
  Animated.loop(
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.in, // Easing is an additional import from react-native
        useNativeDriver: true  // To make use of native driver for performance
      }
    )).start()

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const scale = this.spinValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.7, 1, 0.7]
  })

  return (
    <View style={styles.container}>
      <View style={[styles.loader__content, styles.logo__content]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Animated.Image
            style={{ transform: [{ scale: scale }], width: "80%", height: "80%" }}
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo__content: {
    width: "100%",
    height: "60%",
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },

  logo: {
    width: "100%",
    height: "100%"
  },

  loader__content: {
    width: "100%",
    height: "40%",
  },

});

export default Loading