import {
    Platform,
    StyleSheet
} from 'react-native'
//import Colors from '../../configs/Colors'
import ScreenDimensions from '../../configs/ScreenDimensions'
const BluetoothPoiItemStyle = StyleSheet.create({
    container: {
        backgroundColor: 'white', //Colors.beige,
        paddingLeft: ScreenDimensions.widthScreen * 0.05,
        paddingRight: ScreenDimensions.widthScreen * 0.05,
        paddingTop:  ScreenDimensions.heightScreen * 0.01,
        paddingBottom:  ScreenDimensions.heightScreen * 0.01,
        marginBottom: ScreenDimensions.heightScreen * 0.01,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: (ScreenDimensions.widthScreen * 0.25) / 4,
    },
    styleImagePOI: {
        borderRadius: (ScreenDimensions.widthScreen * 0.2) / 5
    },
    containerTextPOI: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    InfosPOI: {
        flex: 1,
        paddingHorizontal: ScreenDimensions.widthScreen * 0.01,
        marginRight: ScreenDimensions.widthScreen * 0.04
    },
    titlePOI: {
        color: 'black', //Colors.cafe,
        fontFamily: 'Poppins-Bold',
        fontSize: ScreenDimensions.widthScreen * 0.039,
        textAlign: "left",
    },
    descriptionPOI: {
        fontSize: ScreenDimensions.widthScreen * 0.033,
        color: 'black',//Colors.black,
        fontFamily: "Poppins-Regular",
    },
   
 

})
export default BluetoothPoiItemStyle