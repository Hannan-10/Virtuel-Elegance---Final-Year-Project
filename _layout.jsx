// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "@/Screens/Home";
// import AboutScreen from "@/Screens/AboutScreen";
// import SettingsScreen from "@/Screens/SettingsScreen";
// import { Ionicons } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator()

// export default function App() {
//     return (
//         //<NavigationContainer>
//             <Tab.Navigator>
//                 <Tab.Screen 
//                     name="Home" 
//                     component={HomeScreen}
//                     options={{
//                         tabBarIcon: ({color}) => <Ionicons name="home-outline" size={20} color={color}/>

//                     }}    
//                 />
//                 <Tab.Screen 
//                     name="Settings" 
//                     component={SettingsScreen}
//                     options={{
//                         tabBarIcon: ({color}) => <Ionicons name="settings-outline" size={20} color={color}/>

//                     }}    
//                 />
//                 <Tab.Screen 
//                     name="About" 
//                     component={AboutScreen}
//                     options={{
//                         tabBarIcon: ({color}) => <Ionicons name="person-outline" size={20} color={color}/>

//                     }}                    
//                 />
                
//             </Tab.Navigator>
//         //</NavigationContainer>
//     )
// }


// import { Stack } from 'expo-router';

// export default function Layout() {
//   return <Stack />;
// }