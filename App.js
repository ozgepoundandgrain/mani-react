import React from 'react';
import { createStackNavigator } from 'react-navigation'
import Home from './pages/home'
import Authentication from './pages/Authentication'
import Initial from './pages/Initial'
import PostMantra from './pages/Post-mantra'
import PostVision from './pages/Post-vision'

const AppNavigator = createStackNavigator({
  Authentication: {
    screen: props=> <Authentication {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
  PostMantra: {
    screen: props=> <PostMantra {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
  Home: {
    screen: props=> <Home {...props} />,
    navigationOptions: {
     title: '',
     header: null,
     headerLeft: null,
     gesturesEnabled: false
   },
 },
  PostVision: {
    screen: props=> <PostVision {...props} />,
    navigationOptions: {
      title: "",
      header: null
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
      // this.state.loadApp === false ? 
      // <Initial />
      // :
      // <AppNavigator 
      //   initialRouteName="Authentication"
      // />
      <AppNavigator 
      initialRouteName="PostMantra"
    />
    );
  }
}
