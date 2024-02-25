import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, selectUser } from '../store/features/user/userSlice';
import { StackActions } from '@react-navigation/native';
import { APP_NAME, OPTION_LOGOUT, SCREEN_HOME, SCREEN_LOGIN, SCREEN_PROFILE, SCREEN_SETTINGS, SCREEN_TRANSACTIONS, TOP_TAB_NAVIGATION as TOP_TAB_NAVIGATION } from '../constants';
import HomeScreen from '../Screens/HomeScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Transactions from '../components/Transactions';
import { isConnectedToInternet, isNetworkStatusBarVisibile, isOfflinePayment } from '../store/features/app/appSettingsSlice';

const Drawer = createDrawerNavigator()
const Logout = ({ navigation }) => {
    useEffect(() => {

    }, [navigation])
    return (
        <SafeAreaView>
            <Text>Logout</Text>
        </SafeAreaView>
    );
}


const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
    const networkStatusBarVisibile = useSelector(isNetworkStatusBarVisibile)
    const a = useSelector(isOfflinePayment)
    // console.log(useSelector(isNetworkStatusBarVisibile));
    useEffect(() => {
        console.log('internet status : ', networkStatusBarVisibile);
    }, [networkStatusBarVisibile])

    useEffect(() => {
        // console.log('offlinePayment : ', a);
        // console.log('internet status : ', networkStatusBarVisibile);
    })

    // console.log('internetStatus : ', useSelector(networkStatusBarVisibile)); 
    return (
        <View style={[styles.tab, networkStatusBarVisibile ? { top: 10 } : { top: 0 }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.setOptions({ title: route.name })
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Pressable key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={[styles.tabItem, isFocused && styles.focusedTabItem]}
                    >
                        {options.tabBarIcon && options.tabBarIcon()}
                        {/* {
                            isFocused &&
                            <Text style={{ letterSpacing: 1, fontWeight: '100', color: '#007aff' }}>{route.name}</Text>
                        } */}
                    </Pressable>
                );
            })}
        </View>
    );
}

const TopTabRouter = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({ title: APP_NAME })
    }, [])
    return (
        <Tab.Navigator tabBarPosition='bottom' initialRouteName={SCREEN_HOME} tabBar={MyTabBar}>
            <Tab.Screen name={SCREEN_HOME} component={HomeScreen}
                options={{
                    tabBarIcon: (focused, _) => <Image source={require('../assets/images/home-active.png')}
                        style={{ height: 20, width: 20 }} />,
                    // tabBarShowLabel: false
                }}
            />
            <Tab.Screen name={SCREEN_TRANSACTIONS} component={Transactions}
                options={{
                    tabBarIcon: (focused, _) => <Image source={require('../assets/images/transaction-active.png')} style={{ height: 30, width: 30 }} />,
                    // tabBarShowLabel: false
                }}
            />
        </Tab.Navigator>
    )
}
const DrawerRouter = ({ navigation }) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    useEffect(() => {
        if (Object.keys(user).length == 0)
            navigation.dispatch(StackActions.replace(SCREEN_LOGIN))
    }, [user])
    return (
        // <SafeAreaView>
        <Drawer.Navigator initialRouteName={TOP_TAB_NAVIGATION} screenOptions={{ drawerItemStyle: { height: 60 } }}>
            <Drawer.Screen name={TOP_TAB_NAVIGATION} component={TopTabRouter}
                options={{ drawerLabel: SCREEN_HOME, drawerIcon: ({ focused, size }) => <Image source={require('../assets/images/home-active.png')} style={{ height: size, width: size }} /> }}
            />
            {/* <Drawer.Screen name={SCREEN_HOME} component={HomeScreen} options={{ headerBackVisible: false, }}/> */}
            {/* <Drawer.Screen name={SCREEN_HOME} component={HomeScreen}
                options={{ drawerIcon: ({ focused, size }) => <Image source={require('../assets/images/home.png')} style={{ height: size, width: size }} /> }}
            /> */}
            <Drawer.Screen name={SCREEN_SETTINGS} component={SettingsScreen}
                options={{ drawerIcon: ({ focused, size }) => <Image source={require('../assets/images/gear-active.png')} style={{ height: size, width: size }} /> }} />
            <Drawer.Screen name={SCREEN_PROFILE} component={ProfileScreen}
                options={{ drawerIcon: ({ focused, size }) => <Image source={require('../assets/images/user-active.png')} style={{ height: size, width: size }} /> }} />
            <Drawer.Screen name={OPTION_LOGOUT} component={Logout} listeners={{ drawerItemPress: () => dispatch(clearUser()) }}
                options={{ drawerIcon: ({ focused, size }) => <Image source={require('../assets/images/logout.png')} style={{ height: size, width: size }} /> }} />
        </Drawer.Navigator>
        // {/* </SafeAreaView> */}
    )
}
export default DrawerRouter

const styles = StyleSheet.create({
    tab: {
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        // gap: 20,
        marginTop: 10,
        shadowOpacity: 0.8,
        borderRadius: 11,
        backgroundColor: '#f8f4f4'
    },
    tabItem: {
        flexDirection: 'row',
        gap: 10,
        width: 70,
        height: 50,
        // marginTop: 3,
        padding: 20,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    focusedTabItem: {
        // marginTop: 0,
        // width: 150,
        borderBottomWidth: 4,
        borderBlockColor: '#E0DDDF',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10
    }
})