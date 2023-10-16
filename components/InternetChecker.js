import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Alert, Button, Text, ToastAndroid, View } from 'react-native';

import styles from "./InternetChecker.module.css"

const InternetChecker = () => {
    const [netInfo, setNetInfo] = useState({});
    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetInfo(
                {
                    connectionType: state.type,
                    isConnected: state.isConnected,
                    ipAddress: state.details.ipAddress
                },
            );
        });
        return () => {
            // Unsubscribe to network state updates
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!netInfo.isConnected)
            ToastAndroid.show("No intenet connection", ToastAndroid.LONG)
    }, [netInfo])

    const checkInternetConnection = async () => {
        // To get the network state once
        let info = await NetInfo.fetch()
        return info.isConnected
    };
    return (
        <View style={styles.container}>

            {/* <Text>You are offline</Text> */}
        </View>
    )
}

export default InternetChecker