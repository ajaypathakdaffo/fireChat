import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

const Connections = ({navigation, route}) => {
  const [userData, setUserData] = useState([]);
  const [userNumber, setUserNumber] = useState(null);
  const databaseRef = useRef(database().ref('/users'));
  useEffect(() => {
    getUser();
    const onValueChange = databaseRef.current.on('value', snapshot => {
      let snap = snapshot._snapshot.value
        ? Object.values(snapshot._snapshot.value)
        : null;
      setUserData(snap);
    });
    return () => database().ref().off('value', onValueChange);
  }, []);
  const getChatRoom = (user1, user2) => {
    let number1 = parseInt(user1.substring(3));
    let number2 = parseInt(user2.substring(3));

    if (number1 > number2) {
      return `${number1}${number2}`;
    } else {
      return `${number2}${number1}`;
    }
  };
  const getUser = async () => {
    const value = JSON.parse(await AsyncStorage.getItem('user'));
    setUserNumber(value.phoneNumber);
  };

  const handleClick = async item => {
    const id = item?.item?.number;
    const value = JSON.parse(await AsyncStorage.getItem('user'));
    setUserNumber(value.phoneNumber);
    const chatRoom = getChatRoom(value.phoneNumber, id);
    navigation.navigate('ChatScreen', {
      user: value,
      chatRoom: chatRoom,
    });
  };

  const renderItem = item => {
    if (item?.item?.number == userNumber) {
      return;
    } else {
      return (
        <TouchableOpacity
          onPress={() => handleClick(item)}
          style={styles.itemContainer}>
          <View style={styles.dp} />
          <Text>{item?.item?.name ?? ''}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Connections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
  },
});
