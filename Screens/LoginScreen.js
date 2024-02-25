import React, { useEffect, useState } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
// import styles from "./Login.module.css"
import { connectToServer, doLogin, doRegisteration } from '../api/server';
import { StackActions } from '@react-navigation/native';
import InternetChecker from '../components/InternetChecker';
import { selectUser, setUser, setUserValid, setUserVerified } from '../store/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTER_MSG, SCREEN_HOME, SCREEN_MAIN, SCREEN_VERIFY } from '../constants';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';


function LoginScreen({ navigation }) {

    // console.log("at login screen");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState();
    const [passCode, setPassCode] = useState();
    const [conformPassCode, setConformPassCode] = useState();
    const [loginFormVisibility, setLoginFormVisibility] = useState(true)
    const [loginStatus, setLoginStatus] = useState(false)
    const [registerationStatus, setRegisterationStatus] = useState(false)

    const [err, setErr] = useState();
    const dispatch = useDispatch()
    useEffect(() => {
        loginFormVisibility ? navigation.setOptions({ title: "Login" }) : navigation.setOptions({ title: "Registeration Yourself" })
    }, [loginFormVisibility])

    let user = useSelector(selectUser)
    useEffect(() => {
        // console.log("at login screen");
        // dispatch(setUser({}))
        console.log(user);

    }, [])

    const isValidInputs = () => {
        if (!phoneNum) {
            Alert.alert("Phone number", 'Please enter phone number', [{ text: 'OK' }])
            return false
        }
        if (!passCode) {
            Alert.alert("PassCode", 'Please enter passcode', [{ text: 'OK' }])
            return false
        }
        if (phoneNum.length != 10) {
            Alert.alert("Invalid phone number", 'Please enter a valid phone number', [{ text: 'OK' }])
            return false
        }
        if (passCode.length != 6) {
            Alert.alert("Invalid passcode", 'Please enter a valid pass code')
            return false
        }
        return true
    }

    const isValidRegInputs = () => {
        if (!name) {
            Alert.alert("Name", 'Please enter your name', [{ text: 'OK' }])
            return false
        }

        if (!email) {
            Alert.alert("Email address", 'Please enter your email address', [{ text: 'OK' }])
            return false
        }
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if (!emailPattern.test(email)) {
            Alert.alert("Invalid email address", 'Please enter a valid email address', [{ text: 'OK' }])
            return false
        }
        if (!isValidInputs())
            return false
        if (passCode != conformPassCode) {
            Alert.alert("Passcode", "Passcode doesn't match")
            return false
        }

        return true
    }

    const handleLogin = (e) => {
        // disabling login btn for login
        setLoginStatus(true)
        if (isValidInputs()) {
            // Alert.alert("Validation", 'Your data has sucessfully validated')
            loginUser()
        }
        else {
            setLoginStatus(false)
        }
    }
    const loginUser = async () => {
        // console.log(await doLogin(phoneNum, passCode))
        let res = await doLogin(phoneNum, passCode)
        if (res.success) {
            Alert.alert("Login", "You have successfully logged in")
            res.user.isLoggedIn = true
            // console.log(res)
            dispatch(setUser(res.user))


            if (!res.user.isVerified)
                navigation.dispatch(StackActions.replace(SCREEN_VERIFY))
            else {
                // console.log(res.user);
                dispatch(setUserValid(true))
                // navigation.dispatch(StackActions.replace("Home", { user: res.user }))
                navigation.dispatch(StackActions.replace(SCREEN_MAIN))
            }
        }
        else {
            console.log('Login failed')
            console.log(res.err)
            Alert.alert("Login", res.err)
            if (res.err == REGISTER_MSG)
                toggleFormVisibility()
        }
        // enabling login btn
        setLoginStatus(false)
    }
    const handleRegisteration = (e) => {
        // disabling register btn for registeration process
        setRegisterationStatus(true)
        if (isValidRegInputs()) {
            // Alert.alert("Validation", 'Your data has sucessfully validated')
            registerUser()
        }
    }

    const registerUser = async () => {
        let res = await doRegisteration(name, email, phoneNum, passCode)
        console.log(res)
        if (res.success) {
            Alert.alert("Registeration", "You have successfully completed the registeration")
            toggleFormVisibility()
        }
        else
            Alert.alert("Registeration", res.err)

        // enabling registration
        setRegisterationStatus(false)
    }

    const toggleFormVisibility = e => {
        setLoginFormVisibility(!loginFormVisibility)
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <InternetChecker /> */}
            {
                loginFormVisibility ?
                    <ScrollView contentContainerStyle={styles.form}>
                        <Image style={{ marginBottom: "20%", maxHeight: 100, objectFit: 'contain' }} source={require("../assets/images/app_logo-removebg.png")} />
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => { setPhoneNum(text.replace(/[^0-9]/g, '')) }}
                                style={styles.inputText}
                                // value=''
                                placeholder="Phone number"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'
                                textContentType='telephoneNumber'
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                textContentType='password'
                                onChangeText={text => setPassCode(text)}
                                style={styles.inputText}
                                secureTextEntry={true}
                                placeholder="Passcode"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={styles.formActions}>
                            <View style={styles.formActionBtn}>
                                <Button disabled={loginStatus} title=' Login ' onPress={handleLogin} />
                            </View>
                            <Text style={{ color: 'cyan', fontSize: 25, fontWeight: 100 }}>|</Text>
                            <Text style={[styles.registerBtn]} onPress={toggleFormVisibility}>
                                Register
                            </Text>
                            {/* <Button title='Register' style={styles.registerBtn} onPress={showRegisterationForm} /> */}
                        </View>
                    </ScrollView>
                    :
                    <ScrollView contentContainerStyle={[styles.form, styles.regForm]}>
                        <Text style={{ fontSize: 25, fontWeight: '600', marginTop: '10%', marginBottom: '5%', marginLeft: "auto", marginRight: "auto" }}>Enter details </Text>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => { setName(text) }}
                                style={styles.inputText}
                                placeholder="Full name"
                                placeholderTextColor="#003f5c"
                                textContentType='name'
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => { setEmail(text) }}
                                style={styles.inputText}
                                placeholder="Email"
                                placeholderTextColor="#003f5c"
                                keyboardType='email-address'
                                textContentType='emailAddress'
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => { setPhoneNum(text) }}
                                style={styles.inputText}
                                placeholder="Phone number"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'
                                textContentType='telephoneNumber'
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => setPassCode(text)}
                                style={styles.inputText}
                                secureTextEntry
                                placeholder="Passcode"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'

                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => setConformPassCode(text)}
                                style={styles.inputText}
                                secureTextEntry
                                placeholder="Re-Enter Passcode"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={styles.formActions}>
                            <View style={styles.formActionBtn}>
                                <Button disabled={registerationStatus} title='Register' onPress={handleRegisteration} />
                            </View>
                            <Text>|</Text>
                            <Text style={styles.registerBtn} onPress={toggleFormVisibility}>
                                Login
                            </Text>
                        </View>
                    </ScrollView>
            }

        </SafeAreaView>
    )
}
export default LoginScreen

const inpViewHeight = 10
const BORDER_COLOR = "#3AB4BA"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        maxWidth: '100%',
        backgroundColor: '#fff'
    },
    form: {
        justifyContent: 'center',
        alignItems: "center",
        maxWidth: "100%",
        minHeight: "100%",
        gap: 25
    },
    regForm: {
        minWidth: "100%",
        minHeight: "85%",
        paddingBottom: 20
    },
    inputView: {
        minWidth: "80%",
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        borderRadius: 18,
        height: "3.4rem",
        marginBottom: "20px",
        justifyContent: "center",
        padding: 10,
        paddingLeft: 30,
    },
    inputText: {
        fontSize: 18,
        height: 28,
    },
    formActions: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        gap: 35,
        /* height: max-content; */
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
    },
    registerBtn: {
        // background: "transparent",
        opacity: 1,
        color: "#299aa0",
        fontSize: 20
    },
    formActionBtn: {
        // height: 'auto'
    }
})
