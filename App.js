import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import Root from './pages/root'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Post from './pages/post'


const AppNavigator = createStackNavigator({
  root: {
    screen: props=> <Root {...props} />,
    navigationOptions: {
      title: '',
      headerLeft: null
    },
  },
  home: {
     screen: props=> <Home {...props} />,
     navigationOptions: {
      title: '',
      headerLeft: null,
      gesturesEnabled: false
    },
  },
  register: {
    screen: props=> <Register {...props} />,
    navigationOptions: {
      title: "",
      headerLeft: null
    },
 },
  login: {
    screen: props=> <Login {...props} />,
    navigationOptions: {
      title: "",
      headerLeft: null
    },
    
  },
  post: {
    screen: props=> <Post {...props} />,
    navigationOptions: ({navigation})=>({
      title:'',
      headerBackTitle:'Back'
    })
  }
})

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator 
        initialRouteName="root"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
