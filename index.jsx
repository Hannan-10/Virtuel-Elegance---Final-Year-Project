import LoginScreen from '../Screens/Login';
import SignUpScreen from '../Screens/SignUp';
import HomeScreen from '../Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AboutScreen from '../Screens/AboutScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import BrowseScreen from '../Screens/Browse';

import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image,  ActivityIndicator, View } from 'react-native';
import axios from "axios";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



function MainTabs({navigation, route}) {
  const { email } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = () => {
    setIsLoading(true); // Show loading icon
    setTimeout(() => {
      setIsLoading(false); // Hide loading icon after 2 seconds
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Navigate to Login screen
      });
    }, 2000); // 2-second delay
  };

  return (
    <Tab.Navigator screenOptions={{headerStyle: {backgroundColor: '#333333'}, headerTintColor: '#ffffff'}}>
      <Tab.Screen 
          name="Browse" 
          component={HomeScreen}
          options={{
              tabBarIcon: ({color}) => <Ionicons name="person-outline" size={20} color={color}/>

          }}    
      />
      
      <Tab.Screen 
          name="TryOn" 
          component={BrowseScreen}
          options={{
              tabBarIcon: ({color}) => <Ionicons name="home-outline" size={20} color={color}/>

          }}                    
      />
      <Tab.Screen 
          name="About" 
          children={() => <SettingsScreen email={email} />}
          
          options={{
              tabBarIcon: ({color}) => <Ionicons name="settings-outline" size={20} color={color}/>,
              headerRight: () => (
                <View style={{ marginRight: 15 }}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <TouchableOpacity onPress={handleLogout}>
                  <Image
                    source={require("../assets/images/more.png")} // Replace with your icon
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            ),

          }}    
          
      />
                
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    //<NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#333333'}, headerTintColor: '#ffffff'}}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false, title: 'Welcome' }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    //</NavigationContainer>
  );
}


const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 15, // Add spacing from the left
    padding: 10, // Increase touchable area
},
menuIcon: {
    width: 24, // Icon width
    height: 24, // Icon height
    resizeMode: 'contain', // Ensure proper scaling
},

})



// import React, { useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// // Screens
// import LoginScreen from '../Screens/Login';
// import SignUpScreen from '../Screens/SignUp';
// import HomeScreen from '../Screens/Home';
// import AboutScreen from '../Screens/AboutScreen';
// import SettingsScreen from '../Screens/SettingsScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // Tab Navigator for main app screens
// function MainTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={20} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="settings-outline" size={20} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="About"
//         component={AboutScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={20} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Root Navigator for managing authentication and main app
// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage login state

//   return (
//     //<NavigationContainer>
//       <Stack.Navigator>
//         {!isAuthenticated ? (
//           <>
//             {/* Authentication Screens */}
//             <Stack.Screen
//               name="Login"
//               options={{ headerShown: false }}
//               children={(props) => (
//                 <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />
//               )}
//             />
//             <Stack.Screen
//               name="SignUp"
//               options={{ headerShown: false }}
//               component={SignUpScreen}
//             />
//           </>
//         ) : (
//           // Main App Screens
//           <Stack.Screen
//             name="Main"
//             component={MainTabs}
//             options={{ headerShown: false }}
//           />
//         )}
//       </Stack.Navigator>
//     //</NavigationContainer>
//   );
// }
