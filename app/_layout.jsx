import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import GlobalProvider from '../context/GlobalProvider'


SplashScreen.preventAutoHideAsync();


const RootLayout = () => {
  const [fontsLoaded,error] =useFonts({
   "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  })

  useEffect(()=>{
    if (error) throw error; 
    if(fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded,error])

  if(!fontsLoaded && !error) return null
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
        <Stack.Screen name='(auth)' options={{headerShown: false}} />
        <Stack.Screen name='(tabs)' options={{headerShown: false}} />
        <Stack.Screen name="search/[query]" options={{headerShown: false}} />
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout

// in useFonts fontsLoaded is first parameter and error is second parameter if they not loaded it work as following * first give string as name and then address* 

// useEffects => it allows us to perform some action while page/screen is loading in this we provide a call back function and dependency array and within that array we call fontsLoaded when it change or error occur 