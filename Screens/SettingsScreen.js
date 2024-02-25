import { Alert, BackHandler, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { SCREEN_HOME, SCREEN_LOCKSETUP, SCREEN_PROFILE } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/features/user/userSlice';
import About from '../components/About';
import { isPasscodeEnabled, setPasscodeEnabledStatus } from '../store/features/app/appSettingsSlice';
import { useFocusEffect } from '@react-navigation/native';

const Setting = forwardRef(({ navigation, config }, ref) => {
    const dispatch = useDispatch()

    const [count, setCount] = useState(config.enableCount);
    const [isEnabled, setIsEnabled] = useState(config.type === 'Status' ? config.value : false);
    useEffect(() => {
        console.log('component mounted');
        return () => console.log('component unmouted');
    }, [isEnabled])
    return (
        <View style={styles.settingView} onTouchEnd={e => {
            if (config.itemAction) // if fn to perform action for item exist
                config.itemAction(ref) // then perform action
        }}>
            <Text style={styles.title}> {config.name} </Text>
            {
                config.type === 'Status' ?
                    <Switch value={isEnabled} onChange={e => {
                        setCount(count + 1)
                        let status = !isEnabled
                        // console.log(status);
                        setIsEnabled(status)
                        dispatch(setPasscodeEnabledStatus(status))

                        // console.log(isEnabled);
                        console.log(count);
                        if (count < 1 && status) {
                            Alert.alert('Offline Payment', 'This type of payment happens when user is offline via sms or call using the user`s registered mobile number')
                        }
                    }} />
                    :
                    // config.type === 'Screen' &&
                    <TouchableOpacity style={{ padding: 15 }}>
                        {/* <FontAwesome name='chevron-right' size={16} color='gray' /> */}
                        {config.icon}
                    </TouchableOpacity>
            }
        </View>
    )
})

const SettingsScreen = ({ navigation }) => {

    let settingConfigs = [
        {
            name: 'Offline Payment',
            type: 'Status',
            value: useSelector(isPasscodeEnabled),
            enableCount: 0
        },
        {
            name: 'Passcode',
            type: 'Screen',
            // screenName: SCREEN_LOCKSETUP,
            icon: <FontAwesome name='chevron-right' size={16} color='gray' />,
            itemAction: () => {
                navigation.navigate(SCREEN_LOCKSETUP)
            },
        },
        {
            name: 'Profile',
            type: 'Screen',
            icon: <FontAwesome name='chevron-right' size={16} color='gray' />,
            // screenName: SCREEN_PROFILE
            itemAction: () => {
                navigation.navigate(SCREEN_PROFILE)
            },
        },
        {
            name: 'About',
            type: 'Component',
            value: false,
            icon: <FontAwesome name='chevron-right' size={16} color='gray' />,
            itemAction: (ref) => {
                // navigation.navigate(SCREEN_ABOUT)
                ref.current.present()
            },
            // screenName: 
        },
        // {
        //     name: 'Logout',
        //     type: 'Option',
        //     value: false,
        //     icon: <FontAwesome name='power-off' size={20} color='red' />,
        //     itemAction: () => {
        //         useDispatch(setUser({})) // resetting user from redux
        //         navigation.navigate(SCREEN_HOME) // redirecting to home for login checks
        //     },
        // },
    ]
    const [showBottomSheetAboutComponent, setShowBottomSheetAboutComponent] = useState(false)
    const aboutRef = useRef()

    // for closing modal about on back btn press if open 
    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                if (showBottomSheetAboutComponent)
                    aboutRef.current.dismiss()
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );

            return () => backHandler.remove();
        }, [navigation, showBottomSheetAboutComponent]
        ))
    return (
        <ScrollView>
            {
                settingConfigs.map(
                    (setting, i) =>
                        setting.name == 'About' ? // if about component is displayed reference is passed to control it
                            <Setting key={i} ref={aboutRef} navigation={navigation} config={setting} />
                            :
                            <Setting key={i} navigation={navigation} config={setting} />
                )
            }
            <About showThisComponent={setShowBottomSheetAboutComponent} ref={aboutRef} />
        </ScrollView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    settingView: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1
    },
    title: {
        flex: 1,
        fontSize: 18
    }
})