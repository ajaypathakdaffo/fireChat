import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ChatScreen(props) {
  const chatRoom = '/chat/' + props.route?.params?.chatRoom;
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();
  const [username, setUserName] = useState('');
  const databaseRef = useRef(database().ref(chatRoom));
  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
    setUserName(props.route?.params?.user?.phoneNumber ?? 'alian');
  }, []);
  useEffect(() => {
    const onValueChange = databaseRef.current
      .orderByValue()
      .on('value', snapshot => {
        let snap = snapshot._snapshot.value
          ? Object.values(snapshot._snapshot.value)
          : null;
        setMessage(snap?.reverse());
      });
    return () => database().ref().off('value', onValueChange);
  }, []);
  const onChangeText = useCallback(text => {
    setNewMessage(text);
  }, []);
  const onPressSend = useCallback(() => {
    databaseRef.current
      .push({
        text: newMessage,
        source: username,
        time: new Date().getTime(),
      })
      .then(() => {
        console.log('Data set.');
      });
    setNewMessage('');
  }, [newMessage, username]);

  const handleSignout = async () => {
    AsyncStorage.clear()
      .then(() => {
        auth()
          .signOut()
          .then(() => console.log('User signed out!'));
        props.navigation.navigate('LoginScreen');
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  return (
    <View style={styles.wraper}>
      <TouchableOpacity
        onPress={handleSignout}
        style={{
          backgroundColor: 'cyan',
          padding: 10,
          margin: 10,
          alignSelf: 'flex-end',
        }}>
        <Text>{'Sign Out'}</Text>
      </TouchableOpacity>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {message?.map(item => {
          return (
            <View
              key={item.text}
              style={[
                styles.messageView,
                {
                  alignSelf:
                    item.source == username ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    item.source == username ? '#0000ffaa' : '#FF000099',
                },
              ]}>
              <Text style={styles.messageText}>{item.text}</Text>
              {/* <Text style={styles.source}>{item.source}</Text> */}
              <Text style={styles.time}>
                {moment(item.time).format('h:mm')}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.textInputView}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => onChangeText(text)}
          value={newMessage}
          onSubmitEditing={onPressSend}
          placeholder="Message"
        />
        <TouchableOpacity onPress={onPressSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>{'send >'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wraper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  messageView: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  messageText: {fontSize: 18},
  source: {
    color: 'white',
  },
  time: {
    color: 'white',
    alignSelf: 'flex-end',
  },
  textInputView: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ccc',
    borderWidth: 5,
    borderRadius: 8,
  },
  textInputStyle: {
    width: '85%',
    fontSize: 20,
  },
  userText: {
    fontSize: 20,
    borderWidth: 1,
  },
  sendButton: {},
  loaderStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  sendButtonText: {fontSize: 18},
});
export default ChatScreen;
