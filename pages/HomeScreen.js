import React, { useEffect, useState } from 'react'
import Popup from '../components/Popup';
import { StatusBar } from 'expo-status-bar';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Animated, Button, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import styles from "./HomeScreen.module.css"
import InternetChecker from '../components/InternetChecker';
import Payment from '../components/Payment';
import Video from 'react-native-video';

function HomeScreen({ navigation, route }) {
    let user = route.params.user
    // let user = { "_id": "6529be9e239997e717c80518", "name": "user", "email": "user@gmail.com", "phn": "9089781232", "pwd": "$2b$10$mD2cdi30y6bfOT0QydIfd.tNvjM13k2dS86xRD3EyAzYrR5RCWuUC", "balance": 11 }

    // const [message, setMessage] = useState("");
    const [showPaymentView, setShowPaymentView] = useState(false);
    const [balance, setBalance] = useState(user.balance);
    // console.log(user)

    const [activated, setActivated] = useState(false)
    const [animation, setAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        const toValue = activated ? 0 : 1
        setActivated(!activated)
        Animated.timing(animation, {
            toValue,
            duration: true
        }).start()
    }

    useEffect(() => {

        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault()
            ToastAndroid.show(message = "Click again to exit", duration = ToastAndroid.SHORT)
        })
    }, []);

    const animatedStyles = {
        backgroundColor: '',
        lower: {
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -25]
                    })
                }
            ]
        },
        upper: {
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 25]
                    })
                }
            ]
        },
        burgerButton: {
            backgroundColor: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['green', 'red']
            })
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <InternetChecker /> */}
            <StatusBar style="auto" />
            {/* <View style="width:100%;height:0;padding-bottom:100%;position:relative;">
                <Video  source={{ uri: "https://giphy.com/embed/3o7aD6ydPRgEPllYQM" }}
                    style={styles1.backgroundVideo}
                    muted={true}
                    repeat={true}
                    resizeMode={"cover"}
                    rate={1.0}
                    ignoreSilentSwitch={"obey"} />
                <iframe src="https://giphy.com/embed/3o7aD6ydPRgEPllYQM" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
            <p><a href="https://giphy.com/gifs/trippy-weird-psychedelic-3o7aD6ydPRgEPllYQM">via GIPHY</a></p> 
            </View> */}
            <View style={styles.balanceView}>
                {/* <Animated.View style={styles.rotatorView}></Animated.View> */}
                <Text style={styles.balanceHeadingText}>Your Balance</Text>
                <Text style={styles.balanceText}>₹ {balance}</Text>
                {/* <Text style={styles.balanceText}>₹ 10</Text> */}
            </View>
            <View style={styles.payBtn}>
                <Button title='Pay now' onPress={() => { setShowPaymentView(!showPaymentView) }} />
                {/* <Text>aasd</Text> */}
            </View>
            {/* <View style={{alignSelf:"flex-end"}}> */}
            <Payment balanceChangedHook={setBalance} visibility={showPaymentView} userPhn={user.phn} showThisComponent={setShowPaymentView} />
            {/* </View> */}
        </SafeAreaView>
        // </MenuProvider>
    );
}
const styles1 = {
    backgroundVideo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default HomeScreen

