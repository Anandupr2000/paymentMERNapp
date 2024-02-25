import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isConnectedToInternet, isInternetIndicatorVisibile, setConnectedToInternet, setInternetIndicatorVisibilityStatus } from '../store/features/app/appSettingsSlice';

const NetworkStatus = () => {
    const dispatch = useDispatch()
    let isInternetConnection = useSelector(isConnectedToInternet)

    const [isConnected, setIsConnected] = useState(false);
    const [visibility, setVisibility] = useState(isInternetConnection);


    useEffect(() => {
        setVisibility(true)
        dispatch(setConnectedToInternet(isConnected))
    }, [])
    useEffect(() => {
        dispatch(setConnectedToInternet(isConnected))
        // if (isConnected)
        //     setTimeout(() => { setVisibility(false) }, 3000)
    }, [isConnected])

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <View style={styles.container}>
        <Text>{isConnected ? 'Connected to the Internet' : 'No Internet Connection'}</Text>
        {/* Your component logic here */}
    </View>;
};

export default NetworkStatus;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        elevation: 10,
        backgroundColor: '#b9dcfc'
    }
})