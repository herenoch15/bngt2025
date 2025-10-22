/* eslint-disable eqeqeq */
import { Platform, Dimensions } from 'react-native'
const width = Dimensions.get('window').width < 600 ? Dimensions.get('window').width : Dimensions.get('window').width * 0.81
const height = Dimensions.get('window').height
const height2 = Dimensions.get('screen').height
const ScreenDimensions = {
  widthScreen: width < height ? width : Platform.OS == 'ios' ? height : height * 0.94,
  heightScreen: width < height ? Platform.OS == 'ios' ? height : height * 0.94 : width,
  heightScreen2: height2
}
export default ScreenDimensions
