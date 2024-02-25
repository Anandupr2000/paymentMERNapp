import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons';
import { faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserPasscode, setUserPasscode } from '../store/features/user/userSlice';
import { SCREEN_LOCKSCREEN, SCREEN_LOCKSETUP, SCREEN_LOCKSETUP_NEW_PIN, TASK_CREATE_NEW_PINCODE, TASK_DELETE_USER_PINCODE, TASK_VALIDATE_USER } from '../constants';
import { isPasscodeEnabled, setPasscodeEnabledStatus } from '../store/features/app/appSettingsSlice';

const LockSetupScreen = ({ navigation }) => {
    const [passcodeEnabled, setPasscodeEnabled] = useState(useSelector(isPasscodeEnabled));
    const [isEnabled, setIsEnabled] = useState(true);

    let dispatch = useDispatch()
    // console.log(passcodeEnabled);
    let pincode = useSelector(selectUserPasscode)
    // console.log(pincode);

    useEffect(() => {
        navigation.setOptions({ title: "Setup Passcode" })
    }, [])
    useEffect(() => {

        dispatch(setPasscodeEnabledStatus(passcodeEnabled))
    }, [passcodeEnabled])

    const handleCreateNewPasscode = () => {
        // navigation.navigate(SCREEN_LOCKSCREEN, { redirectPageName: SCREEN_LOCKSETUP_NEW_PIN, redirectPageTask: TASK_CREATE_NEW_PINCODE, task: TASK_VALIDATE_USER })
        // redirecting to this page itself for task create new pincode
        navigation.navigate(SCREEN_LOCKSCREEN, { task: TASK_VALIDATE_USER, redirectPageTask: TASK_CREATE_NEW_PINCODE })
    }
    const handleDeletePasscode = () => {
        console.log(pincode);
        navigation.navigate(SCREEN_LOCKSCREEN, { task: TASK_DELETE_USER_PINCODE, redirectPageName: SCREEN_LOCKSETUP })
    }
    return (
        <View>
            <View style={styles.settingView} >
                <Text style={styles.title}> Enable Passcode </Text>
                <Switch value={passcodeEnabled} onChange={e => { setPasscodeEnabled(!passcodeEnabled) }} />
            </View>

            {/* <Switch disabled={!passcodeEnabled} value={isEnabled} onChange={e => { setIsEnabled(!isEnabled) }} /> */}
            {
                (passcodeEnabled) ?
                    // enabled item view
                    <View style={styles.settingView} onTouchEnd={handleCreateNewPasscode}>
                        <Text style={styles.title}> Setup New Passcode </Text>
                        <FontAwesome name={faChevronRight.iconName} size={20} style={{ paddingEnd: 10 }} />
                    </View>
                    :
                    // disabled item view
                    <View style={styles.settingView} >
                        <Text style={[styles.title, { color: 'gray' }]}> Setup New Passcode </Text>
                        <FontAwesome name={faChevronRight.iconName} size={20} style={{ paddingEnd: 10, color: 'gray' }} />
                    </View>
            }
            {
                (passcodeEnabled) ?
                    // enabled item view
                    <View style={styles.settingView} onTouchEnd={handleDeletePasscode}>
                        <Text style={[styles.title, { color: 'red' }]}> Delete Passcode </Text>
                        <FontAwesome name={faTrash.iconName} size={24} style={{ paddingEnd: 10, color: 'red' }} />
                    </View>
                    :
                    // disabled item view
                    <View style={styles.settingView}>
                        <Text style={[styles.title, { color: 'gray' }]}> Delete Passcode </Text>
                        <FontAwesome name={faTrash.iconName} size={24} style={{ paddingEnd: 10, color: 'gray' }} />
                    </View>
            }

        </View>
    )
}

export default LockSetupScreen

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