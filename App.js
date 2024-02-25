import { Button, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import reduxStore from './store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './Screens/LoginScreen';
import LockScreen from './Screens/LockScreen';
import LockSetupScreen from './Screens/LockSetupScreen';
import { PersistGate } from 'redux-persist/integration/react';
import VerifyScreen from './Screens/VerifyScreen';
// import BackgroundTask from 'react-native-background-task'

import { SCREEN_HOME, SCREEN_LOCKSCREEN, SCREEN_LOCKSETUP, SCREEN_LOCKSETUP_NEW_PIN, SCREEN_LOGIN, SCREEN_MAIN, SCREEN_PROFILE, SCREEN_SETTINGS, SCREEN_VERIFY, TASK_VALIDATE_USER } from './constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerRouter from './router/DrawerRouter';

// BackgroundTask.define(() => {
//   console.log('Hello from a background task')
//   BackgroundTask.finish()
// });
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}


const Stack = createNativeStackNavigator();




const AppRouter = () =>
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={SCREEN_LOCKSCREEN} component={LockScreen} initialParams={{ task: TASK_VALIDATE_USER, redirectPageName: SCREEN_HOME }} />
        <Stack.Screen name={SCREEN_LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREEN_VERIFY} component={VerifyScreen} />

        <Stack.Screen name={SCREEN_MAIN} component={DrawerRouter} options={{ headerShown: false }} />
        <Stack.Screen name={SCREEN_LOCKSETUP} component={LockSetupScreen} />

        {/* <Stack.Screen name={SCREEN_LOCKSETUP_NEW_PIN} component={LockSetupNewPinScreen} /> */}


        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>


export default function App() {
  // console.log("persistor ===>");
  // console.log(persistor.getState());
  // console.log(reduxStore());
  const { store, persistor } = reduxStore()
  // useEffect(() => {
  //   BackgroundTask.schedule()
  // }, [])
  return (
    <Provider store={store}>

      <PersistGate loading={null} persistor={persistor}>

        <GestureHandlerRootView style={{ flex: 1 }}>

          <BottomSheetModalProvider>
            <AppRouter />
          </BottomSheetModalProvider>

        </GestureHandlerRootView>

      </PersistGate>

    </Provider>

  );
}

