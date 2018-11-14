import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo'

const ACCESS_TOKEN = 'authentication_token'
export default class Root extends React.Component {

//   static navigationOptions = {
//     drawerLabel: 'ROOT',
//     drawerIcon: ({ tintColor }) => {
//       <Image 
//         source={require('./images/add-button.png')}
//         style={[styles.icon, {tintColor: tintColor}]}
//       />
//     }
// }

// componentWillMount() {
//   this.getToken()
// }

// async getToken() {
//  try {
//   let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN)
//   if(!accessToken){
//     console.log('Token not set babe')
//   } else {
//     this.verifyToken(accessToken)
//     this.props.navigation.navigate('home')
//   }
//  } catch(error){
//   console.log('something went wrong dawg')
//  }
// }

// async verifyToken(token) {
//   let accessToken = token

//   try {
//     let response = await fetch('http://localhost:3000/api/v1/verify?session%5Baccess_token%5D='+accessToken)
//     let res = await response.text()
//     if (response.status >= 200 && response.status < 300) {
//       this.props.navigation.navigate('home')
//     } else {
//       let error = res
//       throw error
//     }
//   } catch(error) {
//     console.log(error)
//   }
// }

  render() {
    return (
        <LinearGradient colors={['#6C02A1', '#00EDFE']} style={styles.container}>
          <TouchableHighlight underlayColor="transparent" activeOpacity={0} style={styles.loginButton} onPress={() => {this.props.navigation.navigate('login')}}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <Text style={{color: 'white'}}>Or</Text>
          <TouchableHighlight underlayColor="transparent" activeOpacity={0} style={styles.registerButton} onPress={() => {this.props.navigation.navigate('register')}}>
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
  registerButton: {
    backgroundColor: 'transparent',
    width: '80%',
    height: 60,
    display: 'flex',
    margin: 20,
  },
  loginButton: {
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
  },
  icon: {
    width: 24,
    height: 24,
  },
});
