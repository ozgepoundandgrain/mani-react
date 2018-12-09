import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo'

export default class Root extends React.Component {

  render() {
    return (
        <LinearGradient colors={['#6C02A1', '#00EDFE']} style={styles.container}>
          <TouchableHighlight underlayColor="transparent" activeOpacity={0} style={styles.button} onPress={() => {this.props.navigation.navigate('login')}}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <Text style={{color: 'white'}}>Or</Text>
          <TouchableHighlight underlayColor="transparent" activeOpacity={0} style={styles.button} onPress={() => {this.props.navigation.navigate('register')}}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A04170',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  button: {
    backgroundColor: 'transparent',
    width: '80%',
    height: 60,
    display: 'flex',
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    margin: 'auto',
    alignSelf: 'center',
    paddingTop: 15
  }
});
