import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import Root from './pages/root'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Post from './pages/post'
import InitialScreen from './pages/initial-screen'
import ViewPost from './pages/view-post'
import ViewVision from './pages/view-vision'
import EditVision from './pages/edit-vision'

const AppNavigator = createStackNavigator({
  login: {
    screen: props=> <Login {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
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
      header: null,
      headerLeft: null,
      gesturesEnabled: false
    },
  },
  register: {
    screen: props=> <Register {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
 },
  post: {
    screen: props=> <Post {...props} />,
    navigationOptions: ({navigation})=>({
      header: null
    })
  },
  viewPost: {
    screen: props => <ViewPost {...props} />,
    navigationOptions: ({navigation})=>({
      header: null
    })
  },
  ViewVision: {
    screen: props=> <ViewVision {...props} />,
    navigationOptions: {
      title: ''
    }
  },
  editVision: {
    screen: props=> <EditVision {...props} />,
    navigationOptions: {
      title: ''
    }
  }
})



export default class App extends React.Component {

  constructor(){
    super();

    this.state = {
      loadApp: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loadApp: true })
    }, 3000);
  }
  
  render() {
    return (
      this.state.loadApp === false ? 
      <InitialScreen />
      :
      <AppNavigator 
        initialRouteName="login"
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
