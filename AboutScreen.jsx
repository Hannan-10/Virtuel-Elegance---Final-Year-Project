import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button} from 'react-native';
import { Tabs } from 'expo-router'
 
export default function AboutScreen({route}) {
    //const { email } = route.params;
    return (
        <View>
            <Text style={styles.tagline}>About</Text>
        </View>
        
    );
};

const styles = StyleSheet.create({
    tagline: {
        fontSize: 30,
        fontFamily: 'serif',
        color: '#333333',
        marginBottom: 40,
      },
})
  
  