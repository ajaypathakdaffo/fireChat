import React, {useState, useEffect, useRef, useCallback} from 'react';
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

const CreateGroup = ({navigation, route}) => {
  const [userData, setUserData] = useState([]);
  const [userNumber, setUserNumber] = useState(null);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState('');

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
    setSelected([...selected, value.phoneNumber]);
  };

  const onSelect = number => {
    setSelected([...selected, number]);
  };

  const onPressCreate = useCallback(() => {
    if (groupName && selected.length) {
      groupRef.current
        .push({
          id: new Date().getTime(),
          name: groupName,
          members: selected,
        })
        .then(() => {
          console.log('Data set.');
          navigation.navigate('Connections');
        });
      setGroupName('');
      setSelected([]);
    }
  }, [groupName, selected]);

  const renderItem = item => {
    if (item?.item?.number == userNumber) {
      return;
    } else {
      return (
        <TouchableOpacity
          onPress={() => onSelect(item?.item?.number)}
          style={styles.itemContainerWrapper}>
          <View style={styles.itemContainer}>
            <View style={styles.dp} />
            <Text>{item?.item?.name ?? ''}</Text>
          </View>
          {selected.includes(item?.item?.number) && (
            <View style={styles.checkBox} />
          )}
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
        title={'New Group'}
        onRightPress={handleRightPress}
      />
      <View style={{}}>
        <TextInput
          style={{borderBottomWidth: 1}}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>
      <FlatList
        data={userData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.createGroup} onPress={onPressCreate}>
        <Text>{'Create'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    elevation: 5,
  },

  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginRight: 20,
  },
  checkBox: {
    width: 20,
    height: 20,
    backgroundColor: '#61b33b',
    borderRadius: 10,
  },
  createGroup: {
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
