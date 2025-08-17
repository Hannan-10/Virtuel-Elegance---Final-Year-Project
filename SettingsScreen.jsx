import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button, ScrollView } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({email}) {
    // Sample settings categories for a virtual try-on app
    const settingsCategories = [
        { icon: 'person-outline', title: 'Account' },
        { icon: 'body-outline', title: 'My Measurements' },
        { icon: 'color-palette-outline', title: 'Style Preferences' },
        { icon: 'notifications-outline', title: 'Notifications' },
        { icon: 'lock-closed-outline', title: 'Privacy' },
        { icon: 'help-circle-outline', title: 'Help & Support' }
    ];
    
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <View style={styles.profileContent}>
                    <Image
                        source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                        style={styles.profilePic}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.title}>Settings</Text>
                        <Text style={styles.email}>Logged in as: {email}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.tab}>
                <Text style={styles.tabText}>Customize your experience</Text>
            </View>
            
            <ScrollView style={styles.settingsContainer}>
                {settingsCategories.map((category, index) => (
                    <TouchableOpacity key={index} style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name={category.icon} size={24} color="#333333" />
                        </View>
                        <Text style={styles.settingText}>{category.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999999" />
                    </TouchableOpacity>
                ))}
                
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    profile: {
        backgroundColor: '#333333',
        height: 200,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    profileInfo: {
        marginLeft: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
        fontFamily: 'serif',
    },
    email: {
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'serif',
    },
    tab: {
        height: 50,
        backgroundColor: '#d3d3d3',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    tabText: {
        fontSize: 16,
        color: '#555555',
        fontFamily: 'serif',
    },
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingIcon: {
        width: 40,
        alignItems: 'center',
    },
    settingText: {
        flex: 1,
        fontSize: 17,
        fontFamily: 'serif',
        color: '#333333',
        marginLeft: 10,
    },
    logoutButton: {
        marginTop: 30,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    tagline: {
        fontSize: 30,
        fontFamily: 'serif',
        color: '#333333',
        marginBottom: 40,
    },
});