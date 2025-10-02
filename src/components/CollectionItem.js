import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDairy } from './context';
import { Swipeable } from 'react-native-gesture-handler';

const CollectionItem = ({ item }) => {
  const { Delete } = useDairy();
  const swipeableRef = useRef(null); // store ref to swipeable

  const renderRightActions = (dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Delete(item);
          if (swipeableRef.current) {
            swipeableRef.current.close(); // close swipeable after delete
          }
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <AntDesign name="delete" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      containerStyle={{ marginBottom: 10 }}
    >
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.selectedSupplier?.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{item.selectedSupplier}</Text>
            <Text style={styles.id}>ID: {item.id || 'SP001'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Text style={styles.badge}>Fat: {item.fat || '4.2%'}</Text>
              <Text style={[styles.badge, { marginLeft: 8 }]}>
                SNF: {item.snf || '8.5%'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.liters}>{item.quantity} L</Text>
          <Text style={styles.amount}>₹{item.price}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  name: { fontSize: 15, fontWeight: '600', color: '#111827' },
  id: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  badge: {
    fontSize: 11,
    backgroundColor: '#EFF6FF',
    color: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liters: { fontSize: 15, fontWeight: '600', color: '#111827' },
  amount: { fontSize: 14, color: '#16A34A', marginTop: 2 },
  deleteButton: {
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 8,
    marginLeft: 10,
  },
});

export default CollectionItem;
