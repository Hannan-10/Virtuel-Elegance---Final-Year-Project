import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login'; // Your Login Screen
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export default function SignUpScreen({navigation}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errors, setErrors] = useState({});



  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("http://192.168.43.29:3000/create", {   //192.168.43.29 //192.168.18.142
          email,
          password,
          firstName,
          lastName,
        });
        if (response.status === 201) {
          alert("Account created successfully!");
          navigation.replace("Login");
        } else {
          alert("Failed to create account. Please try again.");
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
    if (!firstName) errors.firstName = "Name is required";
    if (!lastName) errors.lastName = "Last name is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.img}
      />
      <Text style={styles.tagline}>Virtuel Elegance</Text>
      <Text style={styles.reg}>Please register to login.</Text>
      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter First Name"
        placeholderTextColor="#A9A9A9"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      {
        errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null
      }
      <TextInput
        style={styles.input}
        placeholder="Enter Last Name"
        placeholderTextColor="#A9A9A9"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      {
        errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null
      }
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

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!passwordVisible}
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signUp}>Already have an account?
        <Text onPress={() => navigation.goBack()}>
          <Text style={{fontWeight: "bold", color: '#333333'}}> Login</Text>
        </Text>
      </Text>

      
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  img: {
    height:200,
    width:200,
    marginTop:0
  },
  tagline: {
    fontSize: 40,
    fontFamily: 'serif',
    color: '#333333',
    marginBottom: 8,
  },
  reg: {
    fontSize: 15,
    fontFamily: 'serif',
    color: '#333333',
    marginBottom: 12,
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
  },
});
