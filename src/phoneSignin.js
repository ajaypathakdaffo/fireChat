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
  const [loading, setLoading] = useState(false);
  const databaseRef = useRef(database().ref('/users'));

  useEffect(() => {
    checkAuth();
  }, []);

  const signInWithPhoneNumber = () => {
    setError(null);
    if (number == '' || number.length < 10) {
      setError('You have entered invalid number');
    } else {
      setLoading(true);
      auth()
        .signInWithPhoneNumber('+91' + number)
        .then(confirmation => {
          setConfirm(confirmation);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          console.log('error', err.message);
        });
    }
  };

  const confirmCode = async () => {
    setLoading(true);
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
              setCode('');
              setUserName('');
              setNumber('');
              setLoading(false);
              navigation.navigate('Connections');
            }
          })
          .catch(err => {
            setLoading(false);
            setError(err.message);
            console.log('error', err);
          });
      })
      .catch(err => {
        setLoading(false);
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
        setCode('');
        setUserName('');
        setNumber('');
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
  if (loading) {
    return (
      <View style={styles.Loading}>
        <Text>{'Loading...'}</Text>
      </View>
    );
  }

  if (!confirm) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{'Ginger Chat'}</Text>
        </View>
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
  Loading: {
    flex: 1,
    backgroundColor: '#fffffa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: '#81c5cf',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 20,
  },
  formContainer: {
    borderBottomWidth: 1,
    marginVertical: 10,
    justifyContent: 'center',
    marginHorizontal: 20,

    borderBottomColor: '#ccc',
  },
  logoContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoText: {
    color: '#000080',
    fontSize: 50,
  },
  textInput: {
    borderRadius: 10,
  },
});
