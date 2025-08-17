// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
// import { getDatabase, ref, get } from "firebase/database";
// import { initializeApp } from "firebase/app";
// import { Ionicons } from '@expo/vector-icons';

// // Firebase web configuration (replace with your Firebase configuration)
// const firebaseConfig = {
//     apiKey: "AIzaSyC_sHvsE5N2fwqXCgBdo7WGpfr95huGW_k",
//     authDomain: "virtuelelegance.firebaseapp.com",
//     projectId: "virtuelelegance",
//     storageBucket: "virtuelelegance.firebasestorage.app",
//     messagingSenderId: "1043668191393",
//     appId: "1:1043668191393:web:7e57dfad5bf9611a1d88e0",
//     measurementId: "G-SDLZ6ELG2G"
//   };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export default function BrowseScreen() {
//   const [photos, setPhotos] = useState([]);

//   useEffect(() => {
//     // Fetch photos from Firebase Realtime Database
//     const reference = ref(database, 'photos');
//     get(reference).then((snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         // Convert the object to an array of photos
//         const photoArray = Object.values(data);
//         setPhotos(photoArray);
//       } else {
//         console.log("No data available");
//       }
//     }).catch((error) => {
//       console.error(error);
//     });
//   }, []);

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity style={styles.card}>
//       <Image
//         source={{ uri: `data:image/jpeg;base64,${item.base64}` }} // Construct Base64 data URL
//         style={styles.cardImage}
//       />
//       <Text style={styles.cardText}>Item {index + 1}</Text>
//     </TouchableOpacity>
//   );



//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={photos}
//         renderItem={renderItem}
//         keyExtractor={(_, index) => index.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.grid}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   grid: {
//     padding: 16,
//   },
//   card: {
//     flex: 1,
//     aspectRatio: 1,
//     margin: 8,
//     backgroundColor: '#eee',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardImage: {
//     width: '70%',
//     height: '70%',
//     borderRadius: 8,
//   },
//   cardText: {
//     color: '#aaa',
//     fontSize: 16,
//   },
//   heartIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     borderRadius: 15,
//     padding: 5,
//   },
// });



// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as FileSystem from 'expo-file-system';
// import { Ionicons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

// const BrowseScreen = () => {
//   // Camera and permissions
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState('front');
//   const cameraRef = useRef(null);
  
//   // Try-on state
//   const [processedImage, setProcessedImage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectionMode, setSelectionMode] = useState('shirt');
//   const [imageNumberShirt, setImageNumberShirt] = useState(0);
//   const [imageNumberPants, setImageNumberPants] = useState(0);
//   const [scalingFactorShirt, setScalingFactorShirt] = useState(1.15);
//   const [scalingFactorPants, setScalingFactorPants] = useState(1.3);
//   const [availableShirts, setAvailableShirts] = useState([]);
//   const [availablePants, setAvailablePants] = useState([]);
//   const [poseDetected, setPoseDetected] = useState(false);
  
//   // Continuous capture
//   const [isContinuousCapture, setIsContinuousCapture] = useState(false);
//   const continuousCaptureRef = useRef(false);
  
//   // Server connection
//   const SERVER_URL = 'http://192.168.18.142:5000'; // Update with your server IP
  
//   useEffect(() => {
//     // Request camera permission when the component mounts
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
    
//     // Fetch available clothing items when component mounts
//     fetchAvailableItems();
    
//     // Cleanup function to stop continuous capture when unmounting
//     return () => {
//       continuousCaptureRef.current = false;
//     };
//   }, [permission]);

//   // Update the ref whenever state changes
//   useEffect(() => {
//     continuousCaptureRef.current = isContinuousCapture;
//   }, [isContinuousCapture]);
  
//   const fetchAvailableItems = async () => {
//     try {
//       const response = await fetch(`${SERVER_URL}/available_items`);
//       const data = await response.json();
//       if (data.shirts && data.shirts.length > 0) {
//         setAvailableShirts(data.shirts);
//       }
//       if (data.pants && data.pants.length > 0) {
//         setAvailablePants(data.pants);
//       }
//     } catch (error) {
//       console.error('Error fetching available items:', error);
//       Alert.alert('Connection Error', 'Could not connect to the server. Make sure the server is running.');
//     }
//   };
  
//   const takePicture = async () => {
//     if (cameraRef.current && !isProcessing) {
//       try {
//         setIsProcessing(true);
        
//         // Take a picture with the new API
//         const photo = await cameraRef.current.takePictureAsync({ 
//           quality: 0.5,
//           base64: true
//         });
        
//         // Send to server for processing
//         await processImage(photo.base64);
//       } catch (error) {
//         console.error('Error taking picture:', error);
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };
  
//   const processImage = async (base64Image) => {
//     try {
//       const response = await fetch(`${SERVER_URL}/process_frame`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           image: base64Image,
//           selectionMode,
//           imageNumberShirt,
//           imageNumberPants,
//           scalingFactorShirt,
//           scalingFactorPants
//         }),
//       });
      
//       const data = await response.json();
      
//       if (data.error) {
//         console.error('Processing error:', data.error);
//       } else {
//         setProcessedImage(`data:image/jpeg;base64,${data.processedImage}`);
//         setPoseDetected(data.poseDetected);
//       }
//     } catch (error) {
//       console.error('Error processing image:', error);
//     }
//   };
  
//   const toggleContinuousCapture = () => {
//     const newState = !isContinuousCapture;
//     setIsContinuousCapture(newState);
    
//     if (newState) {
//       continuousCaptureRef.current = true;
//       continuousCapture();
//     } else {
//       continuousCaptureRef.current = false;
//     }
//   };
  
//   const continuousCapture = async () => {
//     if (continuousCaptureRef.current && cameraRef.current && !isProcessing) {
//       await takePicture();
      
//       // Schedule next capture only if continuous capture is still enabled
//       if (continuousCaptureRef.current) {
//         setTimeout(continuousCapture, 200); // Capture faster for more real-time feel
//       }
//     }
//   };
  
//   const switchSelectionMode = () => {
//     setSelectionMode(prevMode => prevMode === 'shirt' ? 'pants' : 'shirt');
//   };
  
//   const increaseItem = () => {
//     if (selectionMode === 'shirt') {
//       setImageNumberShirt(prev => Math.min(prev + 1, availableShirts.length - 1));
//     } else {
//       setImageNumberPants(prev => Math.min(prev + 1, availablePants.length - 1));
//     }
//   };
  
//   const decreaseItem = () => {
//     if (selectionMode === 'shirt') {
//       setImageNumberShirt(prev => Math.max(prev - 1, 0));
//     } else {
//       setImageNumberPants(prev => Math.max(prev - 1, 0));
//     }
//   };
  
//   const increaseScaling = () => {
//     if (selectionMode === 'shirt') {
//       setScalingFactorShirt(prev => prev + 0.1);
//     } else {
//       setScalingFactorPants(prev => prev + 0.1);
//     }
//   };
  
//   const decreaseScaling = () => {
//     if (selectionMode === 'shirt') {
//       setScalingFactorShirt(prev => Math.max(prev - 0.1, 0.5));
//     } else {
//       setScalingFactorPants(prev => Math.max(prev - 0.1, 0.5));
//     }
//   };

//   // Check if permissions are still loading
//   if (!permission) {
//     return <View style={styles.container}><Text style={styles.messageText}>Loading camera permissions...</Text></View>;
//   }
  
//   // Check if permission is not granted
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.messageText}>Camera access is required for virtual try-on</Text>
//         <TouchableOpacity 
//           style={styles.permissionButton} 
//           onPress={requestPermission}
//         >
//           <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="light" />
      
//       <View style={styles.cameraContainer}>
//         <CameraView
//           ref={cameraRef}
//           style={styles.camera}
//           facing={facing}
//         />
        
//         {/* Overlay processed image on top of camera view */}
//         {processedImage && (
//           <Image
//             source={{ uri: processedImage }}
//             style={styles.processedImage}
//             resizeMode="cover"
//           />
//         )}
//       </View>
      
//       {/* Selected item indicator */}
//       <View style={styles.itemIndicator}>
//         <Text style={styles.itemText}>
//           {selectionMode === 'shirt' 
//             ? `Shirt: ${imageNumberShirt + 1}/${availableShirts.length}` 
//             : `Pants: ${imageNumberPants + 1}/${availablePants.length}`}
//         </Text>
//       </View>
      
//       {/* Warning when pose not detected */}
//       {(!poseDetected && processedImage) && (
//         <View style={styles.warningContainer}>
//           <Text style={styles.warningText}>No pose detected! Please stand back and ensure your full body is visible.</Text>
//         </View>
//       )}
      
//       <View style={styles.controlsContainer}>
//         <View style={styles.modeRow}>
//           <TouchableOpacity 
//             style={[styles.modeButton, selectionMode === 'shirt' && styles.activeMode]} 
//             onPress={() => setSelectionMode('shirt')}
//           >
//             <Ionicons name="shirt-outline" size={24} color="white" />
//             <Text style={styles.buttonText}>Shirts</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.modeButton, selectionMode === 'pants' && styles.activeMode]} 
//             onPress={() => setSelectionMode('pants')}
//           >
//             <Ionicons name="ios-apps-outline" size={24} color="white" />
//             <Text style={styles.buttonText}>Pants</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={decreaseItem}
//           >
//             <Ionicons name="arrow-back" size={24} color="white" />
//             <Text style={styles.buttonText}>Previous</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={increaseItem}
//           >
//             <Ionicons name="arrow-forward" size={24} color="white" />
//             <Text style={styles.buttonText}>Next</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={decreaseScaling}
//           >
//             <Ionicons name="remove" size={24} color="white" />
//             <Text style={styles.buttonText}>Smaller</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.iconButton, styles.captureButton, isContinuousCapture && styles.activeCapture]} 
//             onPress={toggleContinuousCapture}
//           >
//             {isProcessing ? (
//               <ActivityIndicator color="white" size="large" />
//             ) : (
//               <>
//                 <Ionicons name={isContinuousCapture ? "stop-circle" : "play"} size={30} color="white" />
//                 <Text style={styles.buttonText}>{isContinuousCapture ? "Stop" : "Start"}</Text>
//               </>
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={increaseScaling}
//           >
//             <Ionicons name="add" size={24} color="white" />
//             <Text style={styles.buttonText}>Larger</Text>
//           </TouchableOpacity>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.flipButton} 
//           onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
//         >
//           <Ionicons name="camera-reverse" size={24} color="white" />
//           <Text style={styles.buttonText}>Flip Camera</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   cameraContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   camera: {
//     flex: 1,
//   },
//   processedImage: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   itemIndicator: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   itemText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   warningContainer: {
//     position: 'absolute',
//     top: 100,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(255, 0, 0, 0.7)',
//     padding: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   warningText: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   controlsContainer: {
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 15,
//   },
//   modeButton: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     width: '45%',
//   },
//   activeMode: {
//     backgroundColor: 'rgba(0, 120, 255, 0.8)',
//   },
//   buttonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   iconButton: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     minWidth: 80,
//   },
//   captureButton: {
//     backgroundColor: 'rgba(0, 120, 255, 0.8)',
//     width: 100,
//   },
//   activeCapture: {
//     backgroundColor: 'rgba(255, 60, 60, 0.8)',
//   },
//   flipButton: {
//     alignItems: 'center',
//     alignSelf: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     width: 120,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   messageText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     margin: 20,
//   },
//   permissionButton: {
//     backgroundColor: 'rgba(0, 120, 255, 0.8)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default BrowseScreen;



///------------------------------------------------------------------------------------------------------------------------------------




// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { Ionicons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

// const BrowseScreen = () => {
//   // Camera and permissions
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState('front');
//   const cameraRef = useRef(null);
  
//   // Try-on state
//   const [processedImage, setProcessedImage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectionMode, setSelectionMode] = useState('shirt');
//   const [imageNumberShirt, setImageNumberShirt] = useState(0);
//   const [imageNumberPants, setImageNumberPants] = useState(0);
//   const [scalingFactorShirt, setScalingFactorShirt] = useState(1.15);
//   const [scalingFactorPants, setScalingFactorPants] = useState(1.3);
//   const [availableShirts, setAvailableShirts] = useState([]);
//   const [availablePants, setAvailablePants] = useState([]);
//   const [poseDetected, setPoseDetected] = useState(false);
  
//   // Processing queue variables - for smoother real-time experience
//   const processingQueueRef = useRef(false);
//   const lastProcessedTimeRef = useRef(0);
//   const processingIntervalRef = useRef(null);
//   const MIN_PROCESSING_INTERVAL = 150; // milliseconds between processing frames
  
//   // Server connection
//   const SERVER_URL = 'http://192.168.18.142:5000'; //192.168.43.29 Mobile IP   //192.168.18.142 Home IP
  
//   useEffect(() => {
//     // Request camera permission when the component mounts
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
    
//     // Fetch available clothing items when component mounts
//     fetchAvailableItems();
    
//     // Setup continuous processing
//     if (permission && permission.granted) {
//       startContinuousProcessing();
//     }
    
//     // Cleanup function when unmounting
//     return () => {
//       if (processingIntervalRef.current) {
//         clearInterval(processingIntervalRef.current);
//       }
//     };
//   }, [permission]);
  
//   const fetchAvailableItems = async () => {
//     try {
//       const response = await fetch(`${SERVER_URL}/available_items`);
//       const data = await response.json();
//       if (data.shirts && data.shirts.length > 0) {
//         setAvailableShirts(data.shirts);
//       }
//       if (data.pants && data.pants.length > 0) {
//         setAvailablePants(data.pants);
//       }
//     } catch (error) {
//       console.error('Error fetching available items:', error);
//       Alert.alert('Connection Error', 'Could not connect to the server. Make sure the server is running.');
//     }
//   };
  
//   const startContinuousProcessing = () => {
//     // Set up an interval to capture frames at a reasonable rate
//     processingIntervalRef.current = setInterval(() => {
//       captureAndProcessFrame();
//     }, MIN_PROCESSING_INTERVAL);
//   };
  
//   const captureAndProcessFrame = async () => {
//     // Skip if already processing or if not enough time has passed
//     const currentTime = Date.now();
//     if (
//       isProcessing || 
//       processingQueueRef.current || 
//       currentTime - lastProcessedTimeRef.current < MIN_PROCESSING_INTERVAL ||
//       !cameraRef.current
//     ) {
//       return;
//     }
    
//     processingQueueRef.current = true;
    
//     try {
//       setIsProcessing(true);
      
//       // Take a picture with the new API
//       const photo = await cameraRef.current.takePictureAsync({ 
//         quality: 0.5,  // Lower quality for better performance
//         base64: true
//       });
      
//       lastProcessedTimeRef.current = currentTime;
      
//       // Send to server for processing
//       await processImage(photo.base64);
//     } catch (error) {
//       console.error('Error in continuous capture:', error);
//     } finally {
//       setIsProcessing(false);
//       processingQueueRef.current = false;
//     }
//   };
  
//   const processImage = async (base64Image) => {
//     try {
//       const response = await fetch(`${SERVER_URL}/process_frame`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           image: base64Image,
//           imageNumberShirt,
//           imageNumberPants,
//           scalingFactorShirt,
//           scalingFactorPants
//         }),
//       });
      
//       const data = await response.json();
      
//       if (data.error) {
//         console.error('Processing error:', data.error);
//       } else {
//         setProcessedImage(`data:image/jpeg;base64,${data.processedImage}`);
//         setPoseDetected(data.poseDetected);
//       }
//     } catch (error) {
//       console.error('Error processing image:', error);
//     }
//   };
  
//   const switchSelectionMode = () => {
//     setSelectionMode(prevMode => prevMode === 'shirt' ? 'pants' : 'shirt');
//   };
  
//   const increaseItem = () => {
//     if (selectionMode === 'shirt') {
//       setImageNumberShirt(prev => Math.min(prev + 1, availableShirts.length - 1));
//     } else {
//       setImageNumberPants(prev => Math.min(prev + 1, availablePants.length - 1));
//     }
//   };
  
//   const decreaseItem = () => {
//     if (selectionMode === 'shirt') {
//       setImageNumberShirt(prev => Math.max(prev - 1, 0));
//     } else {
//       setImageNumberPants(prev => Math.max(prev - 1, 0));
//     }
//   };
  
//   const increaseScaling = () => {
//     if (selectionMode === 'shirt') {
//       setScalingFactorShirt(prev => prev + 0.1);
//     } else {
//       setScalingFactorPants(prev => prev + 0.1);
//     }
//   };
  
//   const decreaseScaling = () => {
//     if (selectionMode === 'shirt') {
//       setScalingFactorShirt(prev => Math.max(prev - 0.1, 0.5));
//     } else {
//       setScalingFactorPants(prev => Math.max(prev - 0.1, 0.5));
//     }
//   };

//   // Check if permissions are still loading
//   if (!permission) {
//     return <View style={styles.container}><Text style={styles.messageText}>Loading camera permissions...</Text></View>;
//   }
  
//   // Check if permission is not granted
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.messageText}>Camera access is required for virtual try-on</Text>
//         <TouchableOpacity 
//           style={styles.permissionButton} 
//           onPress={requestPermission}
//         >
//           <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="light" />
      
//       <View style={styles.cameraContainer}>
//         <CameraView
//           ref={cameraRef}
//           style={styles.camera}
//           facing={facing}
//         />
        
//         {/* Overlay processed image on top of camera view */}
//         {processedImage && (
//           <Image
//             source={{ uri: processedImage }}
//             style={styles.processedImage}
//             resizeMode="cover"
//           />
//         )}
//       </View>
      
//       {/* Real-time processing indicator */}
//       <View style={styles.processingIndicator}>
//         <Text style={styles.processingText}>
//           Real-time Try On {isProcessing && <ActivityIndicator size="small" color="white" />}
//         </Text>
//       </View>
      
//       {/* Selected item indicator */}
//       <View style={styles.itemIndicator}>
//         <Text style={styles.itemText}>
//           {selectionMode === 'shirt' 
//             ? `Shirt: ${imageNumberShirt + 1}/${availableShirts.length}` 
//             : `Pants: ${imageNumberPants + 1}/${availablePants.length}`}
//         </Text>
//       </View>
      
//       {/* Warning when pose not detected */}
//       {(!poseDetected && processedImage) && (
//         <View style={styles.warningContainer}>
//           <Text style={styles.warningText}>No pose detected! Please stand back and ensure your full body is visible.</Text>
//         </View>
//       )}
      
//       <View style={styles.controlsContainer}>
//         <View style={styles.modeRow}>
//           <TouchableOpacity 
//             style={[styles.modeButton, selectionMode === 'shirt' && styles.activeMode]} 
//             onPress={() => setSelectionMode('shirt')}
//           >
//             <Ionicons name="shirt-outline" size={24} color="white" />
//             <Text style={styles.buttonText}>Shirts</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.modeButton, selectionMode === 'pants' && styles.activeMode]} 
//             onPress={() => setSelectionMode('pants')}
//           >
//             <Ionicons name="ios-apps-outline" size={24} color="white" />
//             <Text style={styles.buttonText}>Pants</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={decreaseItem}
//           >
//             <Ionicons name="arrow-back" size={24} color="white" />
//             <Text style={styles.buttonText}>Previous</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={increaseItem}
//           >
//             <Ionicons name="arrow-forward" size={24} color="white" />
//             <Text style={styles.buttonText}>Next</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={decreaseScaling}
//           >
//             <Ionicons name="remove" size={24} color="white" />
//             <Text style={styles.buttonText}>Smaller</Text>
//           </TouchableOpacity>
          
//           <View style={styles.spacer} />
          
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={increaseScaling}
//           >
//             <Ionicons name="add" size={24} color="white" />
//             <Text style={styles.buttonText}>Larger</Text>
//           </TouchableOpacity>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.flipButton} 
//           onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
//         >
//           <Ionicons name="camera-reverse" size={24} color="white" />
//           <Text style={styles.buttonText}>Flip Camera</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   cameraContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   camera: {
//     flex: 1,
//   },
//   processedImage: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   processingIndicator: {
//     position: 'absolute',
//     top: 10,
//     left: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   processingText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   itemIndicator: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   itemText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   warningContainer: {
//     position: 'absolute',
//     top: 100,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(255, 0, 0, 0.7)',
//     padding: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   warningText: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   controlsContainer: {
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 15,
//   },
//   modeButton: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     width: '45%',
//   },
//   activeMode: {
//     backgroundColor: 'rgba(0, 120, 255, 0.8)',
//   },
//   buttonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   iconButton: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     minWidth: 80,
//   },
//   spacer: {
//     width: 100,
//   },
//   flipButton: {
//     alignItems: 'center',
//     alignSelf: 'center',
//     backgroundColor: 'rgba(80, 80, 80, 0.5)',
//     borderRadius: 10,
//     padding: 12,
//     width: 120,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   messageText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     margin: 20,
//   },
//   permissionButton: {
//     backgroundColor: 'rgba(0, 120, 255, 0.8)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default BrowseScreen;










import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView, Share, Platform, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const BrowseScreen = () => {
  // Get screen dimensions
  const { width: screenWidth } = Dimensions.get('window');
  
  // Camera and permissions
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState('front');
  const cameraRef = useRef(null);
  
  // Try-on state
  const [selectionMode, setSelectionMode] = useState('shirt');
  const [imageNumberShirt, setImageNumberShirt] = useState(0);
  const [imageNumberPants, setImageNumberPants] = useState(0);
  const [scalingFactorShirt, setScalingFactorShirt] = useState(1.15);
  const [scalingFactorPants, setScalingFactorPants] = useState(1.3);
  const [availableShirts, setAvailableShirts] = useState([]);
  const [availablePants, setAvailablePants] = useState([]);
  const [poseDetected, setPoseDetected] = useState(true); // Default to true
  
  // Active clothing items - determines what will be tried on
  const [enabledShirt, setEnabledShirt] = useState(true);
  const [enabledPants, setEnabledPants] = useState(true);
  
  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerCount, setTimerCount] = useState(5);
  
  // Captured photo state
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Local state to store loaded clothing images
  const [currentShirtImage, setCurrentShirtImage] = useState(null); 
  const [currentPantsImage, setCurrentPantsImage] = useState(null);
  
  // Server connection
  const SERVER_URL = 'http://192.168.43.29:5000';         //192.168.43.29     //192.168.18.142
  
  useEffect(() => {
    // Request camera permission when the component mounts
    if (permission && !permission.granted) {
      requestPermission();
    }
    
    // Request media library permission for saving photos
    if (mediaLibraryPermission && !mediaLibraryPermission.granted) {
      requestMediaLibraryPermission();
    }
    
    // Fetch available clothing items when component mounts
    fetchAvailableItems();
  }, [permission, mediaLibraryPermission]);
  
  // Effect to load the clothing images when selection changes
  useEffect(() => {
    // Load the selected shirt
    if (availableShirts.length > 0 && imageNumberShirt >= 0 && imageNumberShirt < availableShirts.length) {
      fetchClothingImage('shirt', availableShirts[imageNumberShirt]);
      console.log(`Loading shirt: ${availableShirts[imageNumberShirt]}, index: ${imageNumberShirt}`);
    }
  }, [availableShirts, imageNumberShirt]);
  
  // Effect to load pants image when pants selection changes
  useEffect(() => {
    // Load the selected pants
    if (availablePants.length > 0 && imageNumberPants >= 0 && imageNumberPants < availablePants.length) {
      fetchClothingImage('pants', availablePants[imageNumberPants]);
      console.log(`Loading pants: ${availablePants[imageNumberPants]}, index: ${imageNumberPants}`);
    }
  }, [availablePants, imageNumberPants]);
  
  // Fetch the clothing items available on the server
  const fetchAvailableItems = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/available_items`);
      const data = await response.json();
      
      if (data.shirts && data.shirts.length > 0) {
        console.log(`Received ${data.shirts.length} shirts from server`);
        setAvailableShirts(data.shirts);
      } else {
        console.warn('No shirts received from server');
      }
      
      if (data.pants && data.pants.length > 0) {
        console.log(`Received ${data.pants.length} pants from server`);
        setAvailablePants(data.pants);
      } else {
        console.warn('No pants received from server');
      }
    } catch (error) {
      console.error('Error fetching available items:', error);
      Alert.alert('Connection Error', 'Could not connect to the server. Make sure the server is running.');
    }
  };
  
  // Fetch a specific clothing image from the server
  const fetchClothingImage = async (type, filename) => {
    try {
      // Construct the URL to the clothing item on the server
      const imageUrl = `${SERVER_URL}/Resources/${type === 'shirt' ? 'Shirts' : 'Pants'}/${filename}`;
      console.log(`Fetching ${type} image: ${imageUrl}`);
      
      // Update the corresponding state
      if (type === 'shirt') {
        setCurrentShirtImage(imageUrl);
      } else {
        setCurrentPantsImage(imageUrl);
      }
    } catch (error) {
      console.error(`Error fetching ${type} image:`, error);
    }
  };
  
  // Function to take a photo
  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    // Check if at least one item is enabled
    if (!enabledShirt && !enabledPants) {
      Alert.alert('Selection Required', 'Please enable at least one item (shirt or pants) to try on.');
      return;
    }
    
    try {
      setIsCapturing(true);
      console.log('Taking picture...');
      
      if (enabledShirt) {
        console.log(`Selected shirt: ${imageNumberShirt}`);
      }
      if (enabledPants) {
        console.log(`Selected pants: ${imageNumberPants}`);
      }
      
      // Take a picture with high quality
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: true
      });
      
      console.log('Picture taken, processing with clothing overlay...');
      
      // Process the photo on the server to add clothing overlay
      const processedPhoto = await processPhotoWithClothing(photo.base64);
      
      if (processedPhoto) {
        console.log('Successfully processed photo with clothing overlay');
        setCapturedPhoto(processedPhoto);
      } else {
        console.error('Failed to process the photo');
        Alert.alert('Error', 'Failed to process the photo. Please try again.');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  // Process the photo with clothing overlay
  const processPhotoWithClothing = async (base64Image) => {
    try {
      console.log('Processing photo with selected clothing...');
      console.log(`Shirt enabled: ${enabledShirt}, Pants enabled: ${enabledPants}`);
      if (enabledShirt) {
        console.log(`Using shirt #${imageNumberShirt} with scaling: ${scalingFactorShirt}`);
      }
      if (enabledPants) {
        console.log(`Using pants #${imageNumberPants} with scaling: ${scalingFactorPants}`);
      }
      
      const response = await fetch(`${SERVER_URL}/process_frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          imageNumberShirt: enabledShirt ? imageNumberShirt : -1, // -1 indicates disabled
          imageNumberPants: enabledPants ? imageNumberPants : -1, // -1 indicates disabled
          scalingFactorShirt,
          scalingFactorPants,
          enabledShirt,
          enabledPants
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Processing error:', data.error);
        return null;
      } else {
        console.log('Photo processed successfully');
        const processedImageUri = `data:image/jpeg;base64,${data.processedImage}`;
        setPoseDetected(data.poseDetected);
        return processedImageUri;
      }
    } catch (error) {
      console.error('Error processing photo with clothing:', error);
      return null;
    }
  };
  
  // Return to camera view
  const tryAgain = () => {
    setCapturedPhoto(null);
  };
  
  // Save photo to gallery
  const savePhoto = async () => {
    if (!capturedPhoto || !mediaLibraryPermission.granted) {
      if (!mediaLibraryPermission.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save photos to your gallery.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Grant Permission', onPress: requestMediaLibraryPermission }
          ]
        );
      }
      return;
    }
    
    try {
      setIsSavingPhoto(true);
      
      // Convert base64 data URI to local file
      const fileUri = FileSystem.documentDirectory + 'virtual_tryon_' + new Date().getTime() + '.jpg';
      const base64Data = capturedPhoto.split(',')[1];
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Save to media library
      const asset = await MediaLibrary.saveToLibraryAsync(fileUri);
      
      // Delete the temporary file
      await FileSystem.deleteAsync(fileUri);
      
      Alert.alert('Success', 'Photo saved to gallery!');
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo to gallery.');
    } finally {
      setIsSavingPhoto(false);
    }
  };
  
  // Share photo
  const sharePhoto = async () => {
    if (!capturedPhoto) return;
    
    try {
      // Convert base64 to temporary file for sharing
      const fileUri = FileSystem.documentDirectory + 'share_tryon_' + new Date().getTime() + '.jpg';
      const base64Data = capturedPhoto.split(',')[1];
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Share the file
      await Share.share({
        url: fileUri,
        title: 'My Virtual Try-On'
      });
      
      // Delete temporary file after sharing
      setTimeout(async () => {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }, 1000);
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Error', 'Failed to share photo.');
    }
  };
  
  // Start the timer countdown
  const startTimer = () => {
    // Check if at least one item is enabled
    if (!enabledShirt && !enabledPants) {
      Alert.alert('Selection Required', 'Please enable at least one item (shirt or pants) to try on.');
      return;
    }
    
    // Start the timer with 5 seconds
    setTimerCount(5);
    setTimerActive(true);
    
    // Create the countdown timer
    const intervalId = setInterval(() => {
      setTimerCount(prevCount => {
        if (prevCount <= 1) {
          // When timer reaches 0, clear the interval and take the picture
          clearInterval(intervalId);
          setTimerActive(false);
          takePicture();
          return 5; // Reset timer for next use
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  // Toggle the enabled state of shirt or pants
  const toggleItem = (itemType) => {
    if (itemType === 'shirt') {
      setEnabledShirt(!enabledShirt);
      // If toggling off, and pants is also off, turn pants on to ensure at least one item is selected
      if (enabledShirt && !enabledPants) {
        setEnabledPants(true);
      }
    } else if (itemType === 'pants') {
      setEnabledPants(!enabledPants);
      // If toggling off, and shirt is also off, turn shirt on to ensure at least one item is selected
      if (enabledPants && !enabledShirt) {
        setEnabledShirt(true);
      }
    }
  };
  
  const increaseItem = () => {
    if (selectionMode === 'shirt') {
      const newIndex = Math.min(imageNumberShirt + 1, availableShirts.length - 1);
      console.log(`Moving to next shirt: ${newIndex}/${availableShirts.length - 1}`);
      setImageNumberShirt(newIndex);
    } else {
      const newIndex = Math.min(imageNumberPants + 1, availablePants.length - 1);
      console.log(`Moving to next pants: ${newIndex}/${availablePants.length - 1}`);
      setImageNumberPants(newIndex);
    }
  };
  
  const decreaseItem = () => {
    if (selectionMode === 'shirt') {
      const newIndex = Math.max(imageNumberShirt - 1, 0);
      console.log(`Moving to previous shirt: ${newIndex}/${availableShirts.length - 1}`);
      setImageNumberShirt(newIndex);
    } else {
      const newIndex = Math.max(imageNumberPants - 1, 0);
      console.log(`Moving to previous pants: ${newIndex}/${availablePants.length - 1}`);
      setImageNumberPants(newIndex);
    }
  };
  
  const increaseScaling = () => {
    if (selectionMode === 'shirt') {
      setScalingFactorShirt(prev => prev + 0.1);
    } else {
      setScalingFactorPants(prev => prev + 0.1);
    }
  };
  
  const decreaseScaling = () => {
    if (selectionMode === 'shirt') {
      setScalingFactorShirt(prev => Math.max(prev - 0.1, 0.5));
    } else {
      setScalingFactorPants(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  // Permission loading check
  if (!permission || !mediaLibraryPermission) {
    return <View style={styles.container}><Text style={styles.messageText}>Loading permissions...</Text></View>;
  }
  
  // Camera permission check
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Camera access is required for virtual try-on</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Render photo review mode
  if (capturedPhoto) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.photoReviewContainer}>
          <Image 
            source={{ uri: capturedPhoto }} 
            style={styles.capturedPhoto}
            resizeMode="contain"
          />
          
          <View style={styles.photoReviewControls}>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={tryAgain}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={savePhoto}
              disabled={isSavingPhoto}
            >
              {isSavingPhoto ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="save" size={20} color="white" />
              )}
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={sharePhoto}
            >
              <Ionicons name="share" size={20} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  // Main camera view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.cameraContainer}>
        {/* Live camera preview */}
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
        
        {/* Flip camera button - moved to bottom right of camera view */}
        <TouchableOpacity 
          style={styles.flipButton} 
          onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}
        >
          <Ionicons name="camera-reverse" size={20} color="white" />
        </TouchableOpacity>
        
        {/* Timer countdown overlay */}
        {timerActive && (
          <View style={styles.timerOverlay}>
            <Text style={{
              color: 'white',
              fontSize: 80,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 5
            }}>{timerCount}</Text>
          </View>
        )}
      </View>
      
      {/* Status indicator */}
      <View style={styles.statusIndicator}>
        <Text style={styles.statusText}>
          Virtual Try-On
          {isCapturing && <ActivityIndicator size="small" color="white" style={{marginLeft: 5}} />}
        </Text>
      </View>
      
      {/* Selected item indicator */}
      <View style={styles.itemIndicator}>
        <Text style={styles.itemText}>
          {selectionMode === 'shirt' 
            ? `Shirt: ${imageNumberShirt + 1}/${availableShirts.length || 1}` 
            : `Pants: ${imageNumberPants + 1}/${availablePants.length || 1}`}
        </Text>
      </View>
      
      <View style={styles.controlsContainer}>
        {/* Compact preview with clothing items side by side */}
        <View style={styles.compactControlsRow}>
          {/* Clothing previews in a more compact layout */}
          <View style={styles.previewsWrapper}>
            {/* Shirt preview */}
            <TouchableOpacity 
              style={[
                styles.previewItemContainer, 
                selectionMode === 'shirt' && styles.activePreview,
                !enabledShirt && styles.disabledPreview
              ]} 
              onPress={() => setSelectionMode('shirt')}
              onLongPress={() => toggleItem('shirt')}
            >
              <View style={styles.previewHeader}>
                <Text style={styles.previewLabel}>
                  Shirt {imageNumberShirt + 1}/{availableShirts.length || 1}
                </Text>
                <TouchableOpacity 
                  style={styles.toggleButton} 
                  onPress={() => toggleItem('shirt')}
                >
                  <Ionicons 
                    name={enabledShirt ? "eye" : "eye-off"} 
                    size={16} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.previewImageFrame, !enabledShirt && styles.disabledImageFrame]}>
                {currentShirtImage ? (
                  <Image 
                    source={{ uri: currentShirtImage }}
                    style={[styles.previewImage, !enabledShirt && styles.disabledImage]}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.emptyPreview}>
                    <Ionicons name="shirt-outline" size={24} color={enabledShirt ? "white" : "gray"} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            {/* Pants preview */}
            <TouchableOpacity 
              style={[
                styles.previewItemContainer, 
                selectionMode === 'pants' && styles.activePreview,
                !enabledPants && styles.disabledPreview
              ]} 
              onPress={() => setSelectionMode('pants')}
              onLongPress={() => toggleItem('pants')}
            >
              <View style={styles.previewHeader}>
                <Text style={styles.previewLabel}>
                  Pants {imageNumberPants + 1}/{availablePants.length || 1}
                </Text>
                <TouchableOpacity 
                  style={styles.toggleButton} 
                  onPress={() => toggleItem('pants')}
                >
                  <Ionicons 
                    name={enabledPants ? "eye" : "eye-off"} 
                    size={16} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.previewImageFrame, !enabledPants && styles.disabledImageFrame]}>
                {currentPantsImage ? (
                  <Image 
                    source={{ uri: currentPantsImage }}
                    style={[styles.previewImage, !enabledPants && styles.disabledImage]}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.emptyPreview}>
                    <Ionicons name="ios-apps-outline" size={24} color={enabledPants ? "white" : "gray"} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Take photo button with timer */}
          <View style={styles.photoButtonsContainer}>
            {/* Timer button */}
            <TouchableOpacity 
              style={styles.timerButton} 
              onPress={startTimer}
              disabled={isCapturing || timerActive}
            >
              <Ionicons 
                name="timer-outline" 
                size={22} 
                color={timerActive ? "yellow" : "white"} 
              />
              {timerActive && (
                <Text style={styles.timerCountText}>{timerCount}</Text>
              )}
            </TouchableOpacity>
            
            {/* Take photo button */}
            <TouchableOpacity 
              style={styles.takePhotoButton} 
              onPress={takePicture}
              disabled={isCapturing || timerActive}
            >
              <Ionicons 
                name="camera" 
                size={24} 
                color={timerActive ? "gray" : "white"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.controlButtonsRow}>
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={decreaseItem}
            disabled={selectionMode === 'shirt' ? imageNumberShirt === 0 : imageNumberPants === 0}
          >
            <Ionicons 
              name="arrow-back" 
              size={18} 
              color={(selectionMode === 'shirt' ? imageNumberShirt === 0 : imageNumberPants === 0) ? 'gray' : 'white'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={increaseItem}
            disabled={selectionMode === 'shirt' ? 
              imageNumberShirt === availableShirts.length - 1 : 
              imageNumberPants === availablePants.length - 1}
          >
            <Ionicons 
              name="arrow-forward" 
              size={18} 
              color={(selectionMode === 'shirt' ? 
                imageNumberShirt === availableShirts.length - 1 : 
                imageNumberPants === availablePants.length - 1) ? 'gray' : 'white'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.smallButton} onPress={decreaseScaling}>
            <Ionicons name="remove" size={18} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.smallButton} onPress={increaseScaling}>
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  // Status indicators
  statusIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 10,
    display: 'none', // Hide this since we now show it directly in the preview
  },
  // Timer countdown display
  timerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 15,
  },
  timerCountText: {
    color: 'yellow',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  itemText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Flip button positioned at bottom right of camera view
  flipButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  // New compact controls container
  controlsContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  compactControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.8,
  },
  previewItemContainer: {
    alignItems: 'center',
    width: '48%',
    padding: 5,
    borderRadius: 8,
  },
  activePreview: {
    backgroundColor: 'rgba(0, 120, 255, 0.4)',
  },
  previewLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  previewImageFrame: {
    width: '100%',
    height: 70, // Reduced height
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '90%',
    height: '90%',
  },
  emptyPreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Photo button container
  photoButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Timer button
  timerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 35,
    width: 50,
    height: 50,
    marginRight: 10,
  },
  // Take photo button
  takePhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 40,
    width: 60,
    height: 60,
  },
  // Control buttons row
  controlButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.5)',
    borderRadius: 8,
    padding: 8,
    width: 50,
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    marginTop: 3,
  },
  // Message and permission styles
  messageText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: 'rgba(0, 120, 255, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Photo review styles
  photoReviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: '100%',
    height: '85%',
  },
  photoReviewControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 15,
  },
  photoButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 8,
    padding: 10,
    width: '28%',
  },
});

export default BrowseScreen;