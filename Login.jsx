import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button, KeyboardAvoidingView, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("http://192.168.43.29:3000/login", {  // 192.168.43.29  //192.168.18.142
          email,
          password,
        });
        
        if (response.status === 200) { // 200 for successful login
          alert("Logged in successfully!");
          // Navigate to the dashboard or home screen
          navigation.replace("MainTabs", {email}); // Replace "Home" with your desired screen name
        } else {
          alert("Failed to login. Please try again.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Something went wrong";
        alert(errorMessage);
      }
    }
  };
  
  
  const validateForm = () => {
      let errors = {}
  
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
  
      setErrors(errors);
  
      return Object.keys(errors).length === 0;
    };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      {/* Logo */}
      <Image
        source={require('../assets/images/logo.png')}
        style={{width: 200, height: 200}}
      />
      <Text style={styles.tagline}>Virtuel Elegance</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {
        errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null
      }
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Enter Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="#A9A9A9"
          />
        </TouchableOpacity>
      </View>
      {
        errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null
      }

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
      
      <Text style={styles.signUp}>Don't have an account?
        <Text onPress={() => navigation.navigate("SignUp")}>
          <Text style={{fontWeight: "bold", color: '#333333'}}> Sign Up</Text>
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 40,
    fontFamily: 'serif',
    color: '#333333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#777777',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  signUp: {
    fontSize: 14,
    color: '#777777',
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingRight: 10,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "red",
    alignSelf: 'flex-start', 
    paddingLeft: 10,
    marginBottom: 10,
    fontWeight: 'bold'
  }
});
