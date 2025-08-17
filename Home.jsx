import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  // Sample clothing items that could be tried on
  const clothingItems = [
    { id: 1, name: 'Article 1', type: 'shirt', image: require('../assets/images/1.png') },
    { id: 2, name: 'Article 2', type: 'shirt', image: require('../assets/images/3.png') },
    { id: 3, name: 'Article 3', type: 'pants', image: require('../assets/images/pants1.png') },
    { id: 4, name: 'Article 4', type: 'shirt', image: require('../assets/images/2.png') },
    { id: 5, name: 'Article 5', type: 'pants', image: require('../assets/images/pant.png') }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredItems = selectedCategory === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.type === selectedCategory);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      
      {/* Header */}
      
      
      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity 
          style={[styles.categoryButton, selectedCategory === 'all' && styles.selectedCategory]} 
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'all' && styles.selectedCategoryText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.categoryButton, selectedCategory === 'shirt' && styles.selectedCategory]} 
          onPress={() => setSelectedCategory('shirt')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'shirt' && styles.selectedCategoryText]}>Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.categoryButton, selectedCategory === 'pants' && styles.selectedCategory]} 
          onPress={() => setSelectedCategory('pants')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'pants' && styles.selectedCategoryText]}>Bottoms</Text>
        </TouchableOpacity>
      </View>
      
      {/* Available Clothing Items */}
      <Text style={styles.sectionTitle}>Available Items</Text>
      
      {/* Grid Display of Items */}
      <ScrollView style={styles.itemsContainer}>
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridItem}
              onPress={() => handleItemPress(item)}
            >
              <Image 
                source={item.image} 
                style={styles.itemImage} 
                defaultSource={require('../assets/images/cam.png')}
              />
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Item Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
            
            {selectedItem && (
              <View style={styles.itemDetailContainer}>
                <Image 
                  source={selectedItem.image} 
                  style={styles.largeItemImage} 
                  resizeMode="contain"
                />
                <Text style={styles.largeItemName}>{selectedItem.name}</Text>
                <Text style={styles.itemType}>
                  Category: {selectedItem.type === 'shirt' ? 'Top' : 'Bottom'}
                </Text>
                
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={20} color="#333333" />
                    <Text style={styles.actionText}>Save</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={20} color="#333333" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  profileButton: {
    padding: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eeeeee',
  },
  selectedCategory: {
    backgroundColor: '#333333',
  },
  categoryText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    padding: 15,
    fontFamily: 'serif',
  },
  itemsContainer: {
    flex: 1,
    padding: 10,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 5,
  },
  itemDetailContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
  },
  largeItemImage: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  largeItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  itemType: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 5,
    color: '#333333',
    fontFamily: 'serif',
  }
});