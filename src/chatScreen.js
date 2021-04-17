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
import _ from 'lodash';
import Header from './header';

function ChatScreen({navigation, route}) {
  const {isgroup, item} = route?.params;
  console.log('KKKKKK', item);
  const chatRoom = '/chat/' + route?.params?.chatRoom;
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();
  const [username, setUserName] = useState('');
  const databaseRef = useRef(database().ref(chatRoom));
  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
  }, [newMessage]);

  useEffect(() => {
    setUserName(route?.params?.user?.phoneNumber ?? 'alian');
  }, []);

  useEffect(() => {
    const onValueChange = databaseRef.current.on('value', snapshot => {
      let snap = snapshot._snapshot.value
        ? Object.values(snapshot._snapshot.value)
        : null;

      setMessage(
        _.reverse(
          Object.values(
            _.groupBy(snap, item => moment(item.time).format('DD MM YYYY')),
          ),
        ),
      );
    });
    return () => database().ref().off('value', onValueChange);
  }, []);
  const onChangeText = useCallback(text => {
    setNewMessage(text);
  }, []);
  const onPressSend = useCallback(() => {
    if (newMessage == '') {
      return;
    }
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
        navigation.navigate('LoginScreen');
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  return (
    <>
      <Header
        isRightIocn={true}
        navigation={navigation}
        title={item?.item?.name ?? ''}
        rightText={'Log out'}
        onRightPress={handleSignout}
      />
      <View style={styles.wraper}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          {message?.map(messageItem => {
            return (
              <View key={messageItem[0].time}>
                <View
                  style={{
                    alignSelf: 'center',
                    padding: 10,
                    backgroundColor: '#222422',
                    borderRadius: 10,
                    elevation: 5,
                  }}>
                  <Text style={{color: '#fff'}}>
                    {moment(messageItem[0].time).format('DD MM YYYY')}
                  </Text>
                </View>
                {_.orderBy(messageItem, ['time'], ['asc'])?.map(item => {
                  return (
                    <View
                      key={item.time}
                      style={[
                        styles.messageView,
                        {
                          alignSelf:
                            item.source == username ? 'flex-end' : 'flex-start',
                          backgroundColor:
                            item.source == username ? '#04668c' : '#f5024f',
                          elevation: 25,
                        },
                      ]}>
                      {isgroup && (
                        <Text style={styles.sourceStyle}>{item.source}</Text>
                      )}
                      <Text style={styles.messageText}>{item.text}</Text>
                      <Text style={styles.time}>
                        {moment(item.time).format('h:mm A')}
                      </Text>
                    </View>
                  );
                })}
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
    </>
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
  sourceStyle: {
    color: '#ccc',
    alignSelf: 'flex-end',
  },
  textInputView: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ccc',
    borderBottomWidth: 1,
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
  day: {
    color: 'red',
    alignSelf: 'center',
  },
  dayContainer: {
    padding: 10,
    backgroundColor: '#aaffaa',
    alignSelf: 'center',
  },
});
export default ChatScreen;
