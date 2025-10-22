import { NavigationContainer, } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';
import {
     Platform,
     View} from 'react-native';
import { Provider } from 'react-redux';
import Loading from './components/Loading';
import Accueil from './screens/accueil/Accueil';
import Apropos from './screens/apropos/Apropos';
import Carte from './screens/carte/Carte';
import CarteRefresher from './screens/carte/CarteRefresher';
import Recherche from './screens/recherche/Recherche';
import Scan from './screens/scan/Scan';
import Start from './screens/start/Start';
import Update from './screens/start/Update';
import DetailThematique from './screens/thematique/DetailThematique';
import Interet from './screens/thematique/Interet';
import Thematique from './screens/thematique/Thematique';
import DetailTroncon from './screens/Troncon/DetailTroncon';
import Troncon from './screens/Troncon/Troncon';
import DetailUnite from './screens/unite/DetailUnite';
import Unite from './screens/unite/Unite';
import store from './store';

const Stack = createStackNavigator()
export default function App() {
    const [loading, setLoading] = useState(true);
    const { Navigator, Screen } = createStackNavigator();
    useEffect(() => {
       // timer()
        setLoading(false);
      //  loadRessources();
    }, []);
    return loading ?
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Loading />
        </View>
        : (<Provider store={store}>
            <NavigationContainer>
                <Navigator>
                    <Screen name="Start" component={Start} options={{ headerShown: false }} />
                    <Screen name="Update" component={Update} options={{ headerShown: true, title: "" }} />
                    <Screen name="Accueil" component={Accueil} options={{ headerShown: false, }} />
                    <Screen name="Carte" component={Carte}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#299bc4',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen name="CarteRefresher" component={CarteRefresher} options={{ headerShown: false }} />
                    <Screen
                        name="Troncon"
                        component={Troncon}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#2ca331',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen
                        name="DetailTroncon"
                        component={DetailTroncon}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#2ca331',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen
                        name="Unite"
                        component={Unite}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#d46e2c',
                            },
                            headerTintColor: '#000',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}/>
                    <Screen
                        name="DetailUnite"
                        component={DetailUnite}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#d46e2c',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}/>

                    <Screen
                        name="Thematique"
                        component={Thematique}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStyle: {
                                borderBottomWidth: 0,
                                backgroundColor: '#de382f',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen
                        name="DetailThematique"
                        component={DetailThematique}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#de382f',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />

                    <Screen
                        name="Recherche"
                        component={Recherche}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#de382f',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen
                        name="Interet"
                        component={Interet}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#de382f',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Screen name="Apropos"
                        component={Apropos}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#209ed5',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                            //unmountOnBlur: true
                        }}/>
                    <Screen name="Scan"
                        component={Scan}
                        options={{
                            headerTitleAlign: "left",
                            headerShown: true,
                            title: "Scan QR-Code",
                            headerStatusBarHeight: Platform.select({android:20}),
                            headerStyle: {
                                borderBottomWidth: 0,
                                height: Platform.select({android:60}),
                                backgroundColor: '#299bc4'
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Navigator>
            </NavigationContainer>
            </Provider>
        );

}
