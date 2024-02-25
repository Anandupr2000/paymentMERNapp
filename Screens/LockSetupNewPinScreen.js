import { Alert, Animated, BackHandler, Dimensions, Easing, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../store/features/user/userSlice'
import { StackActions } from '@react-navigation/native'



const windowDimensions = Dimensions.get('window');

const dialPadSize = windowDimensions.width * 0.2
const dialPadFontSize = dialPadSize * 0.4
const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']
let keyPtr = -1;
const keyLength = 4;
const Headings = ['Enter Your New Pin Code', 'Re-enter Pincode']

const LockSetupNewPinScreen = ({ navigation }) => {
    let user = useSelector(selectUser)
    let msg = "Hi, " + user.name

    const [pinCode, setPincode] = useState(null)
    const [keyArr, setKeyArr] = useState(['', '', '', ''])
    const [keyChange, setKeyChange] = useState(false)
    const [validUser, setValidUser] = useState(true)

    // resetting pin
    const resetPin = () => {
        keyPtr = -1
        setKeyArr(['', '', '', ''])
        setKeyChange(true)
        setValidUser(true)
    }

    const handleDialPad = (item) => {
        console.log(keyPtr)
        if (item == null) return // if item is null
        if (item == 'del') {
            if (keyPtr < 0) return

            // changing the value of array 
            keyArr[keyPtr] = ''
            setKeyArr(keyArr)

            // animate the entered key
            animate(keyPtr)
            if (keyPtr >= 0) keyPtr--;
            console.log(keyArr)
        }
        else {
            if (keyPtr == keyLength - 1) return

            if (keyPtr < keyLength - 1) keyPtr++;

            // adding the value of array
            keyArr[keyPtr] = item
            setKeyArr(keyArr)

            // animate the entered key
            animate(keyPtr)
        }
        setKeyChange(!keyChange);
        if (keyPtr == keyLength - 1) {

            if (pinCode && parseInt(keyArr.join('')) === pinCode) {
                Alert.alert('Password matches')
                // navigation.dispatch(StackActions.replace(redirectPageName))
                // useDispatch(setPincode(parseInt(keyArr.join(''))))
                // navigation.dispatch(StackActions.pop(1))
            }
            else
                setPincode(parseInt(keyArr.join('')))
            resetPin()
        }
        console.log(keyArr)
    };

    // animating the elements
    const animations = keyArr.map(() => (useRef(new Animated.Value(0)).current));

    const animate = (index) => {
        Animated.timing(animations[index], {
            toValue: keyArr[index] === '' ? 0 : 1,
            duration: 370,
            easing: Easing.bounce,
            // easing: Easing.bezier(0, 2, 1, -1),
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        navigation.setOptions({ title: "Create Passcode" })
        const backAction = (count = 0) => {
            // if back button pressed more than once, goto previous screen
            if (count > 0) navigation.dispatch(StackActions.pop(1)) 
            
            // if back button pressed one time, reset the pincode and set the restart cycle to set new pincode
            setPincode(null)
            resetPin()
            count++
            
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.welcomeView}>
                <Text style={{ fontSize: dialPadFontSize }}>{msg}</Text>
                <Text style={{ fontSize: dialPadFontSize * .6, color: 'gray' }}>{pinCode ? Headings[1] : Headings[0]}</Text>
            </View>
            <Animated.View style={styles.inputKeys}>
                {
                    keyArr.map((elem, i) => (
                        <Animated.View key={i} style={[
                            (keyArr[i] === '') ? styles.inputKey : styles.pin,
                            (!validUser) && { backgroundColor: 'red' },
                            {
                                opacity: (!validUser) ? animations[i].interpolate({ inputRange: [0, 1], outputRange: (keyArr[i] === '') ? [1, 0] : [0, 1] }) : 1,
                                transform: [
                                    {
                                        scale: (keyArr[i] !== '') ? animations[i].interpolate({ inputRange: [0, 1], outputRange: [.5, 1] }) : 1,
                                    },
                                ]
                            }
                        ]}>
                            {
                                (keyArr[i] != '') &&
                                <Text style={{ fontSize: dialPadFontSize * 5 }}>{elem}</Text>
                            }
                        </Animated.View>
                    ))
                }
            </Animated.View>
            {/* <Text>LockScreen</Text> */}
            <FlatList data={dialPad} scrollEnabled={false} style={{ flexGrow: 0 }}
                keyExtractor={(_, i) => i.toString()} numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={e => { handleDialPad(item) }} >
                        <View style={[styles.dial, { backgroundColor: (typeof item == 'number') ? '#e3e1e1' : 0 }
                        ]}>
                            {
                                (item == 'del') ?
                                    <Image style={{ width: dialPadSize * 0.7, height: dialPadSize * 0.7 }}
                                    // source={require('../assets/delete.png')
                                    source={{uri:'asset:/delete.png'}}
                                 />
                                    :
                                    <Text style={{ fontSize: dialPadFontSize }}>{item}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                )
                }
            />
        </View>
    )
}

export default LockSetupNewPinScreen

const styles = StyleSheet.create({
    container: {
        height: windowDimensions.height,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1,
    },
    welcomeView: {
        alignItems: 'center',
        gap: 5
    },
    dial: {
        width: dialPadSize,
        height: dialPadSize,
        borderRadius: dialPadSize,
        margin: dialPadSize * 0.12,
        justifyContent: 'center',
        alignItems: 'center',
        borderBlockColor: 'black',
    },
    inputKeys: {
        height: dialPadFontSize,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 24,
    },
    inputKey: {
        width: dialPadFontSize,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        alignItems: 'center',
    },
    pin: {
        width: dialPadFontSize * 0.7,
        height: dialPadFontSize * 0.7,
        marginBottom: 15,
        borderRadius: dialPadFontSize,
        borderColor: 'black',
        backgroundColor: 'black',
    }
})