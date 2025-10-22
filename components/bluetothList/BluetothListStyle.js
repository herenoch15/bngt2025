import {
    Platform,
    StyleSheet
} from 'react-native'
import Colors from '../../configs/Colors'
import ScreenDimensions from '../../configs/ScreenDimensions'
const BluetothListStyle = StyleSheet.create({
    container: {
        backgroundColor: 'white', //Colors.white,
        paddingTop:  ScreenDimensions.heightScreen * 0.02,
        paddingBottom:  ScreenDimensions.heightScreen * 0.02,
        marginRight: ScreenDimensions.widthScreen * 0.034,
        marginLeft: ScreenDimensions.widthScreen * 0.034,
        marginBottom: ScreenDimensions.heightScreen * 0.05,
        marginTop: ScreenDimensions.heightScreen * 0.05,
        borderRadius: (ScreenDimensions.widthScreen * 0.25) / 3,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    labelBluetothList: {
        marginLeft: ScreenDimensions.widthScreen * 0.02,//ScreenDimensions.widthScreen * 0.01,
        marginRight: ScreenDimensions.widthScreen * 0.02,
        marginBottom: ScreenDimensions.heightScreen * 0.015,
        alignItems:"center",
        color: '#412312',//Colors.cafe,
        fontSize: ScreenDimensions.widthScreen * 0.054,
        textAlign: "center",
      
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
        letterSpacing:2
    },
    noBluetothList: {
        flex: 1,
        marginTop:  ScreenDimensions.heightScreen * 0.04,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: ScreenDimensions.widthScreen * 0.04,
        color: '#8A5D3B' //Colors.maronClair,
    },
    containerButtonCancel: {
        justifyContent: "center",
        alignItems: 'center',
        width: '96%',
        backgroundColor: '#299bc4', //Colors.range,
        borderRadius: (ScreenDimensions.heightScreen * 0.07) / 3,
        height: ScreenDimensions.heightScreen * 0.07,
        marginRight: ScreenDimensions.widthScreen * 0.01,
        marginLeft: ScreenDimensions.widthScreen * 0.01,
        paddingLeft: ScreenDimensions.widthScreen * 0.05,
        paddingRight: ScreenDimensions.widthScreen * 0.05,
        marginTop: ScreenDimensions.heightScreen * 0.015
    },
    flatListBluetothList: {
        width: '100%', 
        flex: 1,
        paddingLeft: ScreenDimensions.widthScreen * 0.02,
        paddingRight: ScreenDimensions.widthScreen * 0.02,
    },
    labelCancel:{
        color: 'white', //Colors.white,
        fontSize: ScreenDimensions.widthScreen * 0.05,
        textAlign: "center",
        fontFamily: 'Poppins-Medium',
    },
   

})
export default BluetothListStyle