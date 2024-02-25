import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import userSlice, { selectUser, setUserValid, setUserVerified } from '../store/features/user/userSlice';
import { FontAwesome } from '@expo/vector-icons';
import { faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Keyboard } from 'react-native';
import { connectToServer, generateOTP, verifyOTP } from '../api/server';
import { StackActions } from '@react-navigation/native';
import { SCREEN_HOME, SCREEN_MAIN } from '../constants';


const PhoneNumberVerification = ({ value, mobileVerifiedHook, verificationHook }) => {
    const inpOtpRef = [useRef(), useRef(), useRef(), useRef()]

    const [keyArr, setKeyArr] = useState(['', '', '', ''])
    const [keyChange, setKeyChange] = useState(false)

    const [otp, setOtp] = useState(keyArr.join(''))

    console.log(useSelector(selectUser));
    useEffect(() => {
        setOtp(Number.toString(1234))

        generateOTP({ type: "mobileno", value: value })
        return () => {
            verificationHook(false)
            setKeyArr(['', '', '', ''])
        }
    }, [])
    useEffect(() => {
        console.log(keyArr);
        setOtp(Number.parseInt(keyArr.join("")))
        console.log(otp);
    }, [keyArr])
    const verifyMobileOtp = () => {
        console.log(keyArr);
        Keyboard.dismiss()
        verifyOTP({ otp: Number.parseInt(keyArr.join("")), value: value })
            .then(res => {
                console.log(res);
                verificationHook(false)
                if (res.success) {
                    mobileVerifiedHook(true)
                    Alert.alert('OTP', 'Mobile number verification success')
                    setKeyArr(['', '', '', ''])
                }
                else
                    Alert.alert('OTP', 'Mobile number verification failed, please try again')
            })
        // setKeyChange(true)
    }
    return (
        <View style={styles.view}>
            <Text style={styles.heading}>Enter Otp</Text>
            <View aria-disabled style={styles.inpView}>
                {
                    keyArr.map(
                        (_, i) =>
                            <TextInput ref={inpOtpRef[i]} keyboardType='number-pad' maxLength={1}
                                key={i} style={styles.inp}
                                onChangeText={text => {
                                    keyArr[i] = text
                                    if (text != '')
                                        if (i + 1 == keyArr.length) // if otp full entered then verify 
                                            verifyMobileOtp()
                                        else if (i + 1 != keyArr.length) // move cursor forward
                                            inpOtpRef[i + 1].current.focus()

                                    // moving cursor backward
                                    if (text == '' && i != 0)
                                        inpOtpRef[i - 1].current.focus()
                                }}
                            // value={keyChange ? '' : keyArr[i]}
                            />
                    )
                }
            </View>
            <View style={styles.info}>
                <FontAwesome style={styles.infoIcon} name={faInfo.iconName} />
                <Text style={styles.infoText}>Verify your mobile number</Text>
            </View>
        </View>
    )
}
const EmailVerification = ({ value, emailVerificationHook, verificationHook }) => {
    const inpOtpRef = [useRef(), useRef(), useRef(), useRef()]

    const [keyArr, setKeyArr] = useState(['', '', '', ''])
    const [keyChange, setKeyChange] = useState(false)

    // const [otpVerify, setOtpVerify] = useState(false)
    const [otp, setOtp] = useState(keyArr.join(''))
    useEffect(() => {
        setOtp(Number.toString(1234))
        generateOTP({ type: "email", value: value })
    }, [])


    const verifyMobileOtp = () => {
        Keyboard.dismiss()
        verifyOTP({ otp: Number.parseInt(keyArr.join("")), value: value })
            .then(res => {
                verificationHook(false)
                if (res.success) {
                    Alert.alert('OTP', 'Email verification success')
                    setKeyArr(['', '', '', ''])
                    emailVerificationHook(true)
                }
                else
                    Alert.alert('OTP', 'Email verification failed, please try again')
            })
        // setKeyChange(true)
    }
    return (
        <View style={styles.view}>
            <Text style={styles.heading}>Enter Otp</Text>
            <View aria-disabled style={styles.inpView}>
                {
                    keyArr.map(
                        (_, i) =>
                            <TextInput ref={inpOtpRef[i]} keyboardType='number-pad' maxLength={1}
                                key={i} style={styles.inp}
                                onChangeText={text => {
                                    keyArr[i] = text
                                    if (text != '')
                                        if (i + 1 == keyArr.length) // if otp full entered then verify 
                                            verifyMobileOtp()
                                        else if (i + 1 != keyArr.length) // move cursor forward
                                            inpOtpRef[i + 1].current.focus()

                                    // moving cursor backward
                                    if (text == '' && i != 0)
                                        inpOtpRef[i - 1].current.focus()
                                }}
                            />
                    )
                }
            </View>
            <View style={styles.info}>
                <FontAwesome style={styles.infoIcon} name={faInfo.iconName} />
                <Text style={styles.infoText}>Verify your email</Text>
            </View>
        </View>
    )
}

const VerifyScreen = ({ navigation, route }) => {
    // let verficationType = route.params.verificationType
    // console.log(verficationType);
    console.log("at verification screen");
    const dispatch = useDispatch()
    let user = useSelector(selectUser)

    console.log(user.phn);
    const [otpVerify, setOtpVerify] = useState(false)
    const [mobileVerified, setMobileVerfied] = useState(false)
    const [emailVerified, setEmailVerfied] = useState(false)

    useEffect(() => {
        navigation.setOptions({ title: "Verify Yourself" })
    }, [])
    useEffect(() => {
        if (mobileVerified && emailVerified) {
            dispatch(setUserVerified(true))
            dispatch(setUserValid(true))
            navigation.dispatch(StackActions.replace(SCREEN_MAIN))
        }
    }, [mobileVerified, emailVerified])
    return (
        <View style={styles.container}>
            <View style={[styles.loading, { display: otpVerify ? 'flex' : 'none' }]}>
                <ActivityIndicator size='large' />
            </View>
            {
                mobileVerified ?
                    <EmailVerification value={user.email} emailVerificationHook={setEmailVerfied} verificationHook={setOtpVerify} />
                    // <EmailVerification value={"ananduprajesh@gmail.com"} emailVerificationHook={setEmailVerfied} verificationHook={setOtpVerify} />
                    :
                    // <PhoneNumberVerification value={8848081856} mobileVerifiedHook={setMobileVerfied} verificationHook={setOtpVerify} />
                    <PhoneNumberVerification value={user.phn} mobileVerifiedHook={setMobileVerfied} verificationHook={setOtpVerify} />
            }
        </View>
    )
}

export default VerifyScreen

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'space-evenly',
        // minHeight: SCREEN_HEIGHT * 0.5
    },
    loading: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        // flex:1,
        position: 'absolute',
        zIndex: 100,
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
        justifyContent: 'center'
    },
    view: {
        alignItems: 'center',
        gap: 10
    },
    heading: {
        marginTop: SCREEN_HEIGHT * 0.1,
        letterSpacing: 2,
        textTransform: 'capitalize',
        margin: 10,
        fontSize: 22
    },
    inpView: {
        margin: SCREEN_HEIGHT * 0.02,
        flexDirection: 'row',
        // backgroundColor:'gray',
        minHeight: 40,
        gap: 30
    },
    inp: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 6,
        // minHeight:20,
        minWidth: 40,
        textAlign: 'center'
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    infoIcon: {
        borderColor: 'green',
        borderWidth: 1,
        width: 17,
        borderRadius: 10,
        textAlign: 'center',
        color: 'green',
        // margin: 5,
        textAlignVertical: 'center',
        paddingVertical: 1
    },
    infoText: {
        // backgroundColor: 'gray'
    }
})