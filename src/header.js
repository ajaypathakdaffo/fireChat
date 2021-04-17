import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Header = props => {
  const {navigation, isRightIocn = false, title, isLeftIocn = true} = props;
  return (
    <View style={styles.container}>
      {isLeftIocn && (
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => navigation.goBack()}>
          <Text>{'<<'}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity>
        <Text>{title || 'Screen title'}</Text>
      </TouchableOpacity>
      {isRightIocn ? (
        <TouchableOpacity style={{padding: 10}} onPress={props.onRightPress}>
          <Text>{'+'}</Text>
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
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#8B30ff',
  },
});
