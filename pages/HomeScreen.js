import React, { useEffect, useState } from 'react'
import Popup from '../components/Popup';
import { StatusBar } from 'expo-status-bar';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Button, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import styles from "./HomeScreen.module.css"
import InternetChecker from '../components/InternetChecker';
import Payment from '../components/Payment';

function HomeScreen({ navigation, route }) {
    let user = route.params.user
    // const [message, setMessage] = useState("");
    const [showPaymentView, setShowPaymentView] = useState(false);
    const [balance, setBalance] = useState(user.balance);
    // console.log(user)

    useEffect(() => {

        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault()
            ToastAndroid.show(message = "Click again to exit", duration = ToastAndroid.SHORT)
        })
    }, []);

    return (
        // <MenuProvider>
        //     <Menu>
        //         <MenuTrigger text='Select action' />
        //         <MenuOptions>
        //             <MenuOption onSelect={() => alert(`Save`)} text='Save' />
        //             <MenuOption onSelect={() => alert(`Delete`)} >
        //                 <Text style={{ color: 'red' }}>Delete</Text>
        //             </MenuOption>
        //             <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
        //         </MenuOptions>
        //     </Menu>
        <SafeAreaView style={styles.container}>
            {/* <InternetChecker /> */}
            <View style={styles.balanceView}>
                <Text style={styles.balanceHeadingText}>Your Balance</Text>
                <Text style={styles.balanceText}>₹ {balance}</Text>
                {/* <Text style={styles.balanceText}>₹ 10</Text> */}
            </View>
            <View style={styles.payBtn}>
                <Button title='Pay now' onPress={() => { setShowPaymentView(!showPaymentView) }} />
            </View>
            <Payment balanceChangedHook={setBalance} visibility={showPaymentView} userPhn={user.phn} showThisComponent={setShowPaymentView} />
            <StatusBar style="auto" />
        </SafeAreaView>
        // </MenuProvider>
    );
}

export default HomeScreen

