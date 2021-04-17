import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

function LoginScreen({navigation}) {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [number, setNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const databaseRef = useRef(database().ref('/users'));

  useEffect(() => {
    checkAuth();
  }, []);

  const signInWithPhoneNumber = () => {
    setError(null);
    if (number == '') {
      setError('Number can not be empty');
    } else {
      auth()
        .signInWithPhoneNumber('+91' + number)
        .then(confirmation => {
          setConfirm(confirmation);
        })
        .catch(err => {
          setError(err.message);
          console.log('error', err.message);
        });
    }
  };

  const confirmCode = async () => {
    confirm
      .confirm(code)
      .then(res => {
        console.log('user', res.additionalUserInfo.isNewUser);
        let user = JSON.stringify(res.user);
        AsyncStorage.setItem('user', user)
          .then(() => {
            if (res.additionalUserInfo.isNewUser) {
              signUp();
            } else {
              navigation.navigate('Connections');
            }
          })
          .catch(err => {
            console.log('error', err);
          });
      })
      .catch(err => {
        setError(err.message);
        console.log('error', err);
      });
  };
  const handleChange = text => {
    setNumber(text);
    if (error) {
      setError(null);
    }
  };
  const handleCode = text => {
    setCode(text);
    if (error) {
      setError(null);
    }
  };

  const signUp = useCallback(() => {
    databaseRef.current
      .push({
        id: new Date().getTime(),
        name: userName,
        number: `+91${number}`,
      })
      .then(() => {
        setConfirm(null);
        navigation.navigate('Connections');
        console.log('Data set.');
      });
    setNewMessage('');
  }, [number]);

  const checkAuth = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('user'));
      if (value !== null) {
        navigation.navigate('Connections');
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!confirm) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            value={userName}
            onChangeText={text => setUserName(text)}
            placeholder="User Name"
          />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            value={number}
            onChangeText={text => handleChange(text)}
            placeholder="Phone number"
          />
          {error && (
            <Text style={{color: 'red', alignSelf: 'flex-end'}}>{error}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
          <Text>{'Sign in'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.textInput}
          value={code}
          onChangeText={text => handleCode(text)}
          placeholder="Verification Code"
        />
        {error && (
          <Text style={{color: 'red', alignSelf: 'flex-end'}}>{error}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => confirmCode()}>
        <Text>{'Confirm Code'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#61b33b',
    width: 160,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    borderWidth: 1,
    marginVertical: 10,
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  textInput: {
    borderRadius: 10,
  },
});
