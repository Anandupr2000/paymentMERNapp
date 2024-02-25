import { View, Text, StyleSheet, Dimensions, FlatList, Touchable, TouchableOpacity, Image, Animated, Easing, Alert, Vibration } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { clearUser, isUserValid, selectUser, selectUserPasscode, setUser, setUserPasscode, setUserValid } from '../store/features/user/userSlice';
import { StackActions } from '@react-navigation/native';
import { SCREEN_HOME, SCREEN_LOCKSCREEN, SCREEN_LOCKSETUP, SCREEN_LOGIN, SCREEN_MAIN, TASK_CREATE_NEW_PINCODE, TASK_DELETE_USER_PINCODE, TASK_VALIDATE_USER } from '../constants';
import { isPasscodeEnabled, setPasscodeEnabledStatus } from '../store/features/app/appSettingsSlice';
import { connectToServer } from '../api/server';

const windowDimensions = Dimensions.get('window');

const dialPadSize = windowDimensions.width * 0.2
const dialPadFontSize = dialPadSize * 0.4
const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']


let keyPtr = -1;
const newPinCodeHeadings = ['Enter Your New Pin Code', 'Re-enter Pincode']


export default function LockScreen({ navigation, route }) {
  // console.log(route.params);
  let { redirectPageName, redirectPageTask, task, msg } = route.params
  const dispatch = useDispatch()
  // console.log('================')
  console.log('at lock screen')
  let user = useSelector(selectUser)
  const passcodeEnabled = useSelector(isPasscodeEnabled)
  // console.log(user)
  // console.log('================')
  const keyLength = 4;

  const [newPinCode, setNewPincode] = useState(null)

  const [keyArr, setKeyArr] = useState(['', '', '', ''])
  const [keyChange, setKeyChange] = useState(false)
  const [wrongPinAnimationRunningStatus, setWrongPinAnimationRunningStatus] = useState(false)
  const [validUser, setValidUser] = useState(true)
  // animating pin box
  const shake = useRef(new Animated.Value(0.5)).current;

  const [subtle, setSubtle] = useState(true);

  useEffect(() => {
    // dispatch(setUser({}))
    const validUser = user.isValid
    // connectToServer().then(res => {
    //   console.log(res);
    // })

    // dispatch(setUser({ isValid: true }))
    // console.log(user.isValid);
    // dispatch(clearUser())
    console.log(user);
    // if (!validUser)
    //   navigation.dispatch(StackActions.replace(SCREEN_LOCKSCREEN, { redirectPageName: SCREEN_HOME, task: TASK_VALIDATE_USER, msg: `Hello, ${user.name}` },))


    if (!task)
      task = TASK_VALIDATE_USER

    if (!user.pincode)
      task = TASK_CREATE_NEW_PINCODE

    if (!user.isLoggedIn) {
      console.log("No existing user found, redirecting to login screen");
      navigation.dispatch(StackActions.replace(SCREEN_LOGIN))
    }
    else if (validUser && !passcodeEnabled)
      navigation.dispatch(StackActions.replace(SCREEN_MAIN))
  }, [])

  const handleTasks = () => {
    if (task === TASK_VALIDATE_USER || task === TASK_DELETE_USER_PINCODE)
      verifyUser()

    // create new pincode 
    if (task === TASK_CREATE_NEW_PINCODE) {
      if (newPinCode)
        if (newPinCode == parseInt(keyArr.join(''))) {
          dispatch(setUserPasscode(newPinCode)) // changing user pincode
          dispatch(setPasscodeEnabledStatus(true))
          resetPin()
          navigation.dispatch(StackActions.replace(redirectPageName))
        }
        else {
          // console.log("wrong pin");
          setValidUser(false)
          setWrongPinAnimationRunningStatus(true)
          runPinAnimation(2)
        }
      else {
        setNewPincode(parseInt(keyArr.join('')))
        resetPin()
      }
    }
  }

  const verifyUser = () => {
    if (parseInt(keyArr.join('')) === user.pincode) {
      // Alert.alert('', 'User verification success')
      setValidUser(true)
      console.log('User verification success')

      keyPtr = -1 // reseting ptr

      dispatch(setUserValid(true))

      if (task === TASK_DELETE_USER_PINCODE) dispatch(setUserPasscode(''))

      // navigating back to respective pages
      // navigation.dispatch(StackActions.replace('Home'))
      if (redirectPageTask && redirectPageTask === TASK_CREATE_NEW_PINCODE)
        navigation.dispatch(StackActions.replace(SCREEN_LOCKSCREEN, { redirectPageName: SCREEN_LOCKSETUP, task: TASK_CREATE_NEW_PINCODE }))
      else
        navigation.dispatch(StackActions.replace(redirectPageName,))
    }
    else {
      setValidUser(false)
      setSubtle(true)
      setWrongPinAnimationRunningStatus(true) // set pinanimation value true
      runPinAnimation(2) // runs animation for pincode , indicating invalid pincode
    }
  }

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
    // if (keyPtr == keyLength - 1) verifyUser()
    if (keyPtr == keyLength - 1) handleTasks()
    console.log(keyArr)
  };


  const translateXAnim = shake.interpolate({
    inputRange: [0, 1],
    outputRange: [subtle ? -8 : -16, subtle ? 8 : 16],
  });

  const getAnimationStyles = () => ({
    transform: [
      {
        translateX: translateXAnim,
      },
    ],
  });
  const runPinAnimation = (MAX_REPEAT_VALUE = 1, iteration = 1) => {
    // vibrate for each animation
    Vibration.vibrate([230, 130, 200])
    // animation
    Animated.sequence([
      Animated.timing(shake, {
        // delay: 10,
        toValue: 1,
        duration: subtle ? 300 : 200,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: subtle ? 200 : 100,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 1,
        duration: subtle ? 200 : 100,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: subtle ? 200 : 100,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0.5,
        duration: subtle ? 300 : 200,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (iteration < MAX_REPEAT_VALUE) {
        runPinAnimation(MAX_REPEAT_VALUE, ++iteration)
      }
      else {
        setWrongPinAnimationRunningStatus(false)
        resetPin()
      }
    });
  };


  // animating the elements
  const animations = keyArr.map(() => (useRef(new Animated.Value(0)).current));

  const animate = (index) => {
    // console.log(`animating element=>${index}`);
    // animatedOpacities[index].setValue(0);
    // console.log(animations[index]);
    Animated.timing(animations[index], {
      toValue: keyArr[index] === '' ? 0 : 1,
      duration: 370,
      easing: Easing.bounce,
      // easing: Easing.bezier(0, 2, 1, -1),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={style.container}>
      <View style={style.welcomeView}>
        <Text style={{ fontSize: dialPadFontSize }}>{msg}</Text>
        {
          (task === TASK_CREATE_NEW_PINCODE) ?
            newPinCode ?
              <Text style={style.taskName}>
                {newPinCodeHeadings[1]}
              </Text>
              :
              <Text style={style.taskName}>
                {newPinCodeHeadings[0]}
              </Text>
            :
            <Text style={style.taskName}>
              Enter Your Pin Code
            </Text>
        }
      </View>
      <Animated.View style={[style.inputKeys, getAnimationStyles()]}>
        {
          keyArr.map((elem, i) => (
            <Animated.View key={i} style={[
              (keyArr[i] === '') ? style.inputKey : style.pin,
              (!validUser) && { backgroundColor: 'red' },
              {
                opacity: (!validUser) ? animations[i].interpolate({ inputRange: [0, 1], outputRange: (keyArr[i] === '') ? [1, 0] : [0, 1] }) : 1,
                transform: [
                  {
                    scale: (keyArr[i] !== '') ? animations[i].interpolate({ inputRange: [0, 1], outputRange: [.5, 1] }) : 1,
                  },
                  // {
                  //   translateX: (keyFull) ? animations[i].interpolate({ inputRange: [0, 1], outputRange: (!validUser) ? [0, 20] : [-20, 0] }) : 0
                  // },
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
          <TouchableOpacity onPress={e => { handleDialPad(item) }} disabled={(item === 'del') && wrongPinAnimationRunningStatus}>
            <View style={[style.dial,
            // { borderWidth: (typeof item == 'number') ? 1 : 0 }
            { backgroundColor: (typeof item == 'number') ? '#e3e1e1' : 0 }
            ]}>
              {
                (item == 'del') ?
                  <Image style={{ width: dialPadSize * 0.7, height: dialPadSize * 0.7 }}
                    // source={require('../assets/delete.png')} 
                    source={{ uri: 'assets:/delete.png' }}
                  />
                  :
                  <Text style={{ fontSize: dialPadFontSize }}>{item}</Text>
              }
            </View>
          </TouchableOpacity>
        )
        }
      />
    </View >
  )
}

const style = StyleSheet.create({
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
  , taskName: {
    fontSize: dialPadFontSize * .6,
    color: 'gray'
  }
})  