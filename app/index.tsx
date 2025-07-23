// import { useEffect, useState } from 'react';
// import { Redirect, Stack } from 'expo-router';
// import { getUserId } from '@utils/session';

// export default function Index() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkSession = async () => {
//       const userId = await getUserId();
//       setIsLoggedIn(!!userId);
//     };

//     checkSession();
//   }, []);

//   if (isLoggedIn === null) return null; // ⏳ wait for session check

//   return (
//     <>
//       <Stack.Screen options={{ headerShown: false }} />
//       <Redirect href={isLoggedIn ? '/(home)/dashboard' : '/login'} />
//     </>
//   );
// }

// index.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

function RedirectScreen({ navigation }: any) {
  useEffect(() => {
    navigation.replace('Welcome');
  }, [navigation]);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Redirect">
        <Stack.Screen name="Redirect" component={RedirectScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
