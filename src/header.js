import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Header = props => {
  const {
    navigation,
    isRightIocn = false,
    title,
    isLeftIocn = true,
    rightText,
  } = props;
  return (
    <View style={styles.container}>
      {isLeftIocn && (
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => navigation.goBack()}>
          <Text style={styles.titleText}>{'<<'}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.titleContainer}>
        <Text style={styles.titleText}>{title || 'Screen title'}</Text>
      </TouchableOpacity>
      {isRightIocn ? (
        <TouchableOpacity style={{padding: 10}} onPress={props.onRightPress}>
          <Text style={styles.titleText}>{rightText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{width: 5}} />
      )}
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#6b0200',
  },
  titleText: {
    color: 'white',
    fontSize: 15,
  },
  titleContainer: {
    flex: 1,
  },
});
