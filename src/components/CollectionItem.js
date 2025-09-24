import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Animated } from 'react-native';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import { useDairy } from './context';
import { Swipeable } from 'react-native-gesture-handler';
const CollectionItem = () => {
const { collections,Delete } = useDairy(); 
const item = collections[0]; // Example: Display the first collection item
const renderRightActions = (dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp'
    });
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => Delete(item)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <AntDesign name="delete" size={38} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };
    return(
        <Swipeable
        renderRightActions={(dragX) =>
        renderRightActions(dragX, item)
        }
        containerStyle={{ height: 100,marginBottom:10 }}
    >
       <View style={styles.card}>
  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>   
    <Ionicons name="person-circle-outline" size={45} color="black"  />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.listName}>{item.selectedSupplier}</Text>
      <Text style={styles.subtitle}>{item.morningORevening}</Text>
      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString("en-GB")}
      </Text>
    </View>
  </View>
  <View style={{ alignItems: "flex-end" }}>
    <Text style={styles.liters}>{item.quantity}L</Text>
    <Text style={styles.amount}>₹{item.price}</Text>
  </View>
</View>
</Swipeable>
)
};

const styles = StyleSheet.create({
    card: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
 
  listName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  liters: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  amount: {
    fontSize: 14,
    color: "green",
    marginTop: 4,
  },
   deleteButton: {
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 8,
    marginBottom: 8,
    height: 75
  },
});

export default CollectionItem;