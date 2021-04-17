import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import Header from './header';

const Connections = ({navigation, route}) => {
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [userNumber, setUserNumber] = useState(null);
  const databaseRef = useRef(database().ref('/users'));
  const groupRef = useRef(database().ref('/group'));

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

  useEffect(() => {
    const groupDataChange = groupRef.current.on('value', snapshot => {
      let groupSnap = snapshot._snapshot.value
        ? Object.values(snapshot._snapshot.value)
        : null;
      setGroupData(groupSnap);
    });
    return () => database().ref().off('value', groupDataChange);
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
    const id = item?.item?.number || null;
    const value = JSON.parse(await AsyncStorage.getItem('user'));
    setUserNumber(value.phoneNumber);
    const chatRoom =
      item?.item?.members?.length > 0
        ? item.item.id
        : getChatRoom(value.phoneNumber, id);
    navigation.navigate('ChatScreen', {
      user: value,
      chatRoom: chatRoom,
      isgroup: item?.item?.members?.length > 0,
    });
  };

  const renderItem = item => {
    if (
      item?.item?.number == userNumber ||
      (item?.item?.members?.length > 0 &&
        !item?.item?.members?.includes(userNumber))
    ) {
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

  const handleRightPress = () => {
    console.log('right press');
    navigation.navigate('CreateGroup');
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        isRightIocn={true}
        title={'Connections'}
        onRightPress={handleRightPress}
        isLeftIocn={false}
      />
      {console.log('userData', userData)}
      <FlatList
        data={groupData?.length > 0 ? [...userData, ...groupData] : userData}
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
    paddingHorizontal: 10,
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
  },
});
