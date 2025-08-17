import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';

export default function TryOn({route}) {
 

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="#333333" barStyle="light-content" />
        <Text style={styles.heading}>Try-On</Text>
        <View style={styles.camera}>

        </View>

        <View> </View>

        {/* <View style={styles.scroll}> */}
            <ScrollView horizontal={true}>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
                <View style={styles.imageScroll}></View>
            </ScrollView>
        {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: 'grey',
    height: '65%',
    width: '100%',
    marginTop: 40
  },
  heading: {
    textAlign: 'center',
    fontSize: 30
  },
  scroll: {
    backgroundColor: '#333333',
    height: 110,
    marginTop: 30,
    width: '85%',
    alignSelf: 'flex-end',
    borderStartEndRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row'
  },
  imageScroll: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '80%',
    height: '80%',
    backgroundColor: 'red',
    margin: 10,
    borderRadius: 10,
    

  }
});

