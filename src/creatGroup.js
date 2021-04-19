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

  const getUser = async () => {
    const value = JSON.parse(await AsyncStorage.getItem('user'));
    setUserNumber(value.phoneNumber);
    setSelected([...selected, value.phoneNumber]);
  };

  const onSelect = number => {
    if (selected.includes(number)) {
      let newSelection = selected.filter(item => {
        return item !== number;
      });
      setSelected(newSelection);
    } else {
      setSelected([...selected, number]);
    }
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
            <View style={styles.dp}>
              <Text style={styles.dpText}>
                {item?.item?.name.substring(0, 1).toUpperCase()}
              </Text>
            </View>
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
          style={styles.textInputStyle}
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
        <Text style={styles.button}>{'Create Group'}</Text>
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
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpText: {
    color: '#FF7F50',
    fontSize: 30,
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
    backgroundColor: '#81c5cf',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  button: {
    color: 'white',
  },
  textInputStyle: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
