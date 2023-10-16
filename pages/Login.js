import React, { useEffect, useState } from 'react'
import { Alert, Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import styles from "./Login.module.css"
import { connectToServer, doLogin, doRegisteration } from '../api/server';
import { StackActions } from '@react-navigation/native';
import InternetChecker from '../components/InternetChecker';


function Login({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState();
    const [passCode, setPassCode] = useState();
    const [conformPassCode, setConformPassCode] = useState();
    const [loginFormVisibility, setLoginFormVisibility] = useState(true)

    const [err, setErr] = useState();

    useEffect(() => {
        loginFormVisibility ? navigation.setOptions({ title: "Login" }) : navigation.setOptions({ title: "Registeration" })
    }, [loginFormVisibility])
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
        if (isValidInputs()) {
            // Alert.alert("Validation", 'Your data has sucessfully validated')
            loginUser()
        }
    }
    const loginUser = async () => {
        // console.log(await doLogin(phoneNum, passCode))
        let res = await doLogin(phoneNum, passCode)
        if (res.success) {
            Alert.alert("Login", "You have successfully logged in")
            // console.log(res.user);
            navigation.dispatch(StackActions.replace("Home", { user: res.user }))
        }
        else {
            Alert.alert("Login", res.err)
            toggleFormVisibility()
        }
    }
    const handleRegisteration = (e) => {
        if (isValidRegInputs()) {
            // Alert.alert("Validation", 'Your data has sucessfully validated')
            registerUser()
        }
    }

    const registerUser = async () => {
        let res = await doRegisteration(name, email, phoneNum, passCode)
        if (res.success) {
            Alert.alert("Registeration", "You have successfully completed the registeration")
            toggleFormVisibility()
        }
        else
            Alert.alert("Registeration", res.err)
    }

    // useEffect(() => {
    //     connectToServer()
    //         .catch(err => {
    //             setErr(err)
    //             console.log(err)
    //             alert("Internet connection failed")
    //         })
    // })
    const toggleFormVisibility = e => {
        setLoginFormVisibility(!loginFormVisibility)
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <InternetChecker /> */}
            {
                loginFormVisibility ?
                    <>
                        <View style={styles.inputView}>
                            <TextInput
                                onChangeText={text => { setPhoneNum(text.replace(/[^0-9]/g, '')) }}
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
                                secureTextEntry={true}
                                placeholder="Passcode"
                                placeholderTextColor="#003f5c"
                                keyboardType='numeric'

                            />
                        </View>
                        <View style={styles.formActions}>
                            <Button title='Login' onPress={handleLogin} />
                            <Text>|</Text>
                            <Text style={styles.registerBtn} onPress={toggleFormVisibility}>
                                Register
                            </Text>
                            {/* <Button title='Register' style={styles.registerBtn} onPress={showRegisterationForm} /> */}
                        </View>
                    </>
                    :
                    <>
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
                            <Button title='Register' onPress={handleRegisteration} />
                            <Text>|</Text>
                            <Text style={styles.registerBtn} onPress={toggleFormVisibility}>
                                Login
                            </Text>
                        </View>
                    </>
            }

        </SafeAreaView>
    )
}

export default Login
