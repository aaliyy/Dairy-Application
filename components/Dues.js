import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DueSystem() {
  const [dues, setDues] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [filter, setFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deadline, setDeadline] = useState(new Date());

  useEffect(() => {
    loadDues();
  }, []);

  useEffect(() => {
    saveDues();
  }, [dues]);

  const loadDues = async () => {
    try {
      const stored = await AsyncStorage.getItem('dues');
      if (stored) setDues(JSON.parse(stored));
    } catch (e) {
      console.log("Error loading dues", e);
    }
  };

  const saveDues = async () => {
    try {
      await AsyncStorage.setItem('dues', JSON.stringify(dues));
    } catch (e) {
      console.log("Error saving dues", e);
    }
  };

  const addDue = () => {
    if (name.trim() && amount) {
      const newDue = {
        id: Date.now().toString(),
        name,
        amount: parseFloat(amount),
        paid: false,
        deadline: deadline.toISOString()
      };
      setDues([...dues, newDue]);
      setName('');
      setAmount('');
      setDeadline(new Date());
    }
  };

  const togglePaid = (id) => {
    setDues(dues.map(d => d.id === id ? { ...d, paid: !d.paid } : d));
  };

  const deleteDue = (id) => {
    setDues(dues.filter(d => d.id !== id));
  };

  const filteredDues = dues.filter(d => {
    if (filter === 'Paid') return d.paid;
    if (filter === 'Unpaid') return !d.paid;
    return true;
  });

  const totalUnpaid = dues
    .filter(d => !d.paid)
    .reduce((sum, d) => sum + d.amount, 0);

  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp'
    });

    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDue(id)}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <AntDesign name="delete" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const getDueBackground = (deadlineStr) => {
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "#ffcccc"; // past deadline - red
    if (diffDays <= 2) return "#fff3cd"; // near deadline - yellow
    return "#fff"; // normal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Due Management</Text>
      <Text style={styles.total}>Total Unpaid: ₹{totalUnpaid}</Text>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', 'Paid', 'Unpaid'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: filter === f ? '#fff' : '#000', fontWeight: '600' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Due Inputs */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <AntDesign name="calendar" size={22} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={addDue}>
          <AntDesign name="pluscircle" size={24} color="#28a745" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDeadline(selectedDate);
            }
            if (Platform.OS !== 'ios') {
              setShowDatePicker(false);
            }
          }}
        />
      )}

      {/* List of Dues */}
      <FlatList
        data={filteredDues}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
            <View style={[styles.dueItem, { backgroundColor: getDueBackground(item.deadline) }]}>
              <View>
                <Text style={styles.dueName}>{item.name}</Text>
                <Text style={styles.dueAmount}>₹{item.amount}</Text>
                <Text style={styles.deadlineText}>
                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity onPress={() => togglePaid(item.id)}>
                {item.paid ? (
                  <AntDesign name="checkcircle" size={28} color="#28a745" />
                ) : (
                  <AntDesign name="closecircle" size={28} color="#dc3545" />
                )}
              </TouchableOpacity>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  total: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#444' },
  filterRow: { flexDirection: 'row', marginBottom: 10 },
  filterBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 5,
    paddingHorizontal: 12
  },
  activeFilter: { backgroundColor: '#007bff', borderColor: '#007bff' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  dateBtn: {
    padding: 5,
    marginRight: 5
  },
  addBtn: { padding: 5 },
  dueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2
  },
  dueName: { fontSize: 16, fontWeight: 'bold' },
  dueAmount: { fontSize: 14, color: '#555' },
  deadlineText: { fontSize: 12, color: '#666', marginTop: 4 },
  deleteButton: {
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 8,
    marginBottom: 8
  }
});
