import React, { useCallback, useEffect, useRef, useState } from 'react'
import Popup from '../components/Popup';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Animated, AppState, BackHandler, Button, Dimensions, ImageBackground, Modal, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

// import * as styles from "./HomeScreen.module.css"
// import InternetChecker from '../components/InternetChecker';
import Payment from '../components/Payment';
import Video from 'react-native-video';
import { connect, useDispatch, useSelector } from 'react-redux';
import { isUserValid, selectUser, setUser, setUserValid, setUserVerified } from '../store/features/user/userSlice';
import Icon from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { SCREEN_HOME, SCREEN_LOCKSCREEN, SCREEN_LOGIN, TASK_VALIDATE_USER, UPI_MOBILE_PHN_N0 } from '../constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { isConnectedToInternet, isNetworkStatusBarVisibile, isPasscodeEnabled, setNetworkStatusBarVisibility } from '../store/features/app/appSettingsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Feather } from '@expo/vector-icons';

import { connectToServer, syncUserData } from '../api/server';
import NetworkStatus from '../components/NetworkStatus';
import call from 'react-native-phone-call';

// import bg from;
const windowDimensions = Dimensions.get('window');


function HomeScreen({ navigation }) {

    console.log("at home screen");
    // let user = route.params.user
    const dispatch = useDispatch()

    const [user, setUserData] = useState(useSelector(selectUser))
    const [loadingModalVisible, setLoadingModalVisible] = useState(false)
    const passcodeEnabled = useSelector(isPasscodeEnabled)


    const [showPaymentView, setShowPaymentView] = useState(false);
    const [balance, setBalance] = useState(user.balance);

    const [dimensions, setDimensions] = useState(windowDimensions)
    const [width, setWidth] = useState(windowDimensions.width)
    const [height, setHeight] = useState(windowDimensions.height)
    // console.log(user)

    const [activated, setActivated] = useState(false)
    const [animation, setAnimation] = useState(new Animated.Value(0))

    const bottomSheetModalRef = useRef(null);

    const [networkStatusBarVisible, setNetworkStatusBarVisible] = useState(true)
    const internetAvailable = useSelector(isConnectedToInternet)
    const networkStatusBar = useSelector(isNetworkStatusBarVisibile)

    const [modalVisibleForOfflinePayment, setModalVisibleForOfflinePayment] = useState(false)


    const showInternetStatus = (clear = false) => {
        setNetworkStatusBarVisible(true)
        const timeoutFn = setTimeout(() => {
            // console.log("network status bar hided");
            setNetworkStatusBarVisible(false)
        }, 5000)
        if (clear)
            clearTimeout(timeoutFn)
    }

    useEffect(() => {
        dispatch(setNetworkStatusBarVisibility(networkStatusBarVisible))
    }, [networkStatusBarVisible])

    // useEffect(() => {
    //     if (!internetAvailable) {
    //         setModalVisibleForOfflinePayment(true)
    //         console.log("internetAvailable ", internetAvailable);
    //     }
    // }, [internetAvailable])

    useEffect(() => {
        // console.log(user);

        showInternetStatus()

        const validUser = user.isValid
        if (validUser && !passcodeEnabled)
            Alert.alert('Security', "Please setup Pincode for more secure access")
        if (validUser && !internetAvailable)
            Alert.alert("Internet", "It seems you have no internet connection found. Don't worry you can still perform payment via : Call, SMS or even Bluetooth")

        // connectToServer(5000)
        //     .then(res => {
        //         // console.log(res)
        //         // console.log(res.AbortError)
        //         // if (res.name == 'Error')
        //         //     Alert.alert('Status', "It seems you are offline. You can still make payment if you enabled offline payment in settings")
        //     })

        // dispatch(setPaymentBottomSheetRef(bottomSheetModalRef))

        return () => {
            showInternetStatus(clear = true)
        }
    }, [])

    useEffect(() => {
        dispatch(setUser(user))
    }, [user])

    useEffect(() => {
        // console.log(showPaymentView);
    }, [showPaymentView])

    // controlling app lock when user closes the app
    // implementing back handler for this specific screen
    useFocusEffect(
        useCallback(() => {

            // if(navigation)
            const backAction = () => {
                // console.log("=============");
                // console.log(showPaymentView);
                // console.log("=============");
                if (showPaymentView)
                    bottomSheetModalRef.current.dismiss()
                else if (modalVisibleForOfflinePayment)
                    setModalVisibleForOfflinePayment(!modalVisibleForOfflinePayment)
                else
                    Alert.alert('Hold on!', 'Are you sure you want to exit?', [
                        {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                        },
                        { text: 'YES', onPress: () => BackHandler.exitApp() },
                    ]);
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );

            return () => backHandler.remove();
        }, [navigation, showPaymentView]
        )
    )

    const startAnimation = () => {
        const toValue = activated ? 0 : 1
        setActivated(!activated)
        Animated.timing(animation, {
            toValue,
            duration: true
        }).start()
    }

    Dimensions.addEventListener('change', () => {
        setDimensions(Dimensions.get('window'))
    })
    useEffect(() => {
        // console.log('device rotated');
        let screen = dimensions
        if (screen.width < screen.height) {
            setHeight(screen.height)
            setWidth(screen.width)
        } else {
            setHeight(screen.width)
            setWidth(screen.height)
        }
    }, [dimensions])

    const checkUserValidity = () => {
    }

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

    const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };


    function syncData() {
        setLoadingModalVisible(true)
        syncUserData(user.phn)
            .then(res => {
                // console.log(res);
                if (!res.user)
                    navigation.dispatch(StackActions.replace(SCREEN_LOGIN))

                setLoadingModalVisible(false)
                if (res.success) {
                    // console.log(typeof res.user);
                    setUserData(res.user)
                }
                else {
                    Alert.alert('Sync', 'Failed to fetch details')
                }
            })
            .catch(errRes => {
                setLoadingModalVisible(false)
                console.log(errRes);
                Alert.alert("Network", errRes.err)
            })
    }

    const showModalForOfflinePayment = () => {
        setModalVisibleForOfflinePayment(true)
    }

    const styles = StyleSheet.create({
        container: {
            // background: '#fff',
            // background: '../assets/images/index_bg.jpeg',
            // flexDirection:'row',
            alignItems: 'center',
            // marginTop: width * 0.1,
            // paddingBottom: 30,
            justifyContent: 'space-between',
            minHeight: height
        },
        balanceView: {
            width: width * .80,
            height: width * .80,
            borderRadius: width * .90,
            borderColor: 'gray',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        balanceHeadingText: {
            fontSize: 36
        },
        balanceText: {
            fontSize: 60
        },
        payBtn: {
            minWidth: 130,
            maxHeight: 10,
            alignItems: 'center'
        },
        sendBtn: {
            width: 300,
            height: 43,
            gap: 20,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'lightgray',
            paddingHorizontal: 20
        },
        image: {
            flex: 1,
            margin: 0,
            paddingTop: 20,
            paddingBottom: 100,
        },
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            // alignItems: 'center',
            // marginTop: '60%',
            backgroundColor: 'rgba(155,155,155,0.7)',

        },
        modalView: {
            margin: 20,
            backgroundColor: 'lightgray',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'lightgray',
            padding: 50,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.55,
            shadowRadius: 4,
            elevation: 200,
            gap: 30,
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            {
                networkStatusBarVisible &&
                <NetworkStatus />
            }
            <View style={
                {
                    width: '100%',
                    flexDirection: 'row',
                    // backgroundColor: 'pink',
                    justifyContent: 'flex-end',
                    paddingRight: 10,
                    top: 0,
                    // margin:-20
                }
            }>
                <TouchableOpacity
                    role='button'
                    accessibilityRole='button'
                    accessibilityLabel='refresh'
                    onPress={e => {
                        // console.log('settings icon pressed')
                        syncData()
                    }}>
                    <FontAwesome name='rotate-right' size={26} style={{ color: 'gray', paddingTop: 20, marginRight: 10 }} />
                    {/* <FontAwesomeIcon icon={'fa-solid fa-rotate'}/> */}
                    {/* <FontAwesomeIcon size={24} icon="fas fa-solid fa-rotate" /> */}
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={loadingModalVisible}
                    visible={loadingModalVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 18 }}>Refreshing ...</Text>
                            <ActivityIndicator size={'large'} />
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.balanceView}>
                <Text style={styles.balanceHeadingText}>Your Balance</Text>
                <Text style={styles.balanceText}>₹ {balance}</Text>
            </View>
            {/* <View style={style1.payBtn}> */}
            {/* </View> */}


            {/* <CustomBottomSheetModal /> */}
            <TouchableOpacity style={styles.sendBtn} onPress={() => {
                if (!internetAvailable) {

                    showModalForOfflinePayment()
                }
                else
                    bottomSheetModalRef.current?.present()
            }}>
                {/* <FontAwesome size={32} color="red" /> */} 
                <Icon name='search' size={20} />
                <Text >Send money </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={() => { bottomSheetModalRef.current?.present() }}>
                <FontAwesome size={32} color="red" />
                <Icon name='money' size={20} />
                <Text >Receive money from user friends </Text>
            </TouchableOpacity>

            <Payment balanceChangedHook={setBalance} ref={bottomSheetModalRef} userPhn={user.phn} showThisComponent={setShowPaymentView} />
            <CustomModal modalVisibleForOfflinePayment={modalVisibleForOfflinePayment} toggleVisibilityHook={setModalVisibleForOfflinePayment} />
        </SafeAreaView>
    );
}
// const styles1 = {
//     backgroundVideo: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// };

const CustomModal = ({ modalVisibleForOfflinePayment, toggleVisibilityHook }) => {
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)'
            // alignItems: 'center',
            // marginTop: '60%',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'lightgray',
            padding: 35,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.55,
            shadowRadius: 4,
            elevation: 200,
            gap: 40
        },
        modalHead: {
            gap: 20,
            alignItems: 'center'
        },
        modalHeading: {
            fontSize: 25,
            textTransform: 'capitalize',
            letterSpacing: 2,
            fontWeight: '100'
        },
        modalInfo: {
            color: 'red'
        },
        modalBody: {
            flexDirection: 'row',
            gap: 30,
        },
        modalItem: {
            alignItems: 'center',
            gap: 5
        },
        modalItemIcon: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'lightgray',
            padding: 15,
            alignItems: 'center',
        },
        alt: {
            color: 'gray'
        },
        bglayer: {
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            position: 'absolute',
            // zIndex:-1
        }
    })
    const args = {
        number: UPI_MOBILE_PHN_N0, // String value with the number to call
        prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
        skipCanOpen: true // Skip the canOpenURL check
    }
    const makeCall = () => {
        call(args).catch(console.error)
    }
    return <Modal
        animationType="slide"
        transparent={modalVisibleForOfflinePayment}
        visible={modalVisibleForOfflinePayment}>
        <View style={styles.centeredView}>
            <View style={styles.bglayer} onTouchStart={e => { toggleVisibilityHook(!modalVisibleForOfflinePayment) }}></View>
            <View style={styles.modalView}>

                <View style={styles.modalHead}>
                    <Text style={styles.modalHeading}>Offline Payment</Text>
                    <Text style={styles.modalInfo}>Oh! it seems you are not connected to Internet.</Text>
                    <Text style={[styles.modalInfo, { color: "#57adad" }]}>We got you! use these methods : </Text>
                </View>
                <View style={styles.modalBody}>
                    <View style={styles.modalItem}>
                        <TouchableOpacity style={styles.modalItem} onPress={makeCall}>
                            <Feather selectionColor={'orange'} role='button' style={[styles.modalItemIcon, { color: 'green', borderColor: 'lightgreen' }]} name="phone-call" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.alt}>phone</Text>
                    </View>

                    <View style={styles.modalItem}>
                        <TouchableOpacity style={styles.modalItem}>
                            <Feather role='button' style={[styles.modalItemIcon, { color: 'orange', borderColor: 'orange' }]} name="message-square" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.alt}>message</Text>
                    </View>
                    <View style={styles.modalItem}>
                        <TouchableOpacity style={styles.modalItem}>
                            <FontAwesome role='button' style={[styles.modalItemIcon, { color: 'blue', borderColor: 'lightblue' }]} name="bluetooth" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.alt}>bluetooth</Text>
                    </View>
                </View>
                <View style={{ alignSelf: 'flex-end' }}>
                    <TouchableOpacity onPress={e => toggleVisibilityHook(!modalVisibleForOfflinePayment)} >
                        {/* <Text>Close</Text> */}
                        <Feather name="arrow-left-circle" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
}

export default HomeScreen
