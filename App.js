import React from 'react';
import { createStackNavigator } from 'react-navigation'
import Home from './pages/home'
import Authentication from './pages/Authentication'
import PostMantra from './pages/Post-mantra'
import PostVision from './pages/Post-vision'
import EditMantra from './pages/Edit-mantra'
import ShowVision from './pages/Show-vision'
import ShowMantra from './pages/Show-mantra'
import EditVision from './pages/Edit-vision'
import * as Font from 'expo-font'

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
  },
  ShowVision: {
    screen: props=> <ShowVision {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
  ShowMantra: {
    screen: props=> <ShowMantra {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
  EditVision: {
    screen: props=> <EditVision {...props} />,
    navigationOptions: {
      title: "",
      header: null
    }
  },
  EditMantra: {
    screen: props=> <EditMantra {...props} />,
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
      loadApp: false,
      fontLoaded: false
    }
  }
  
  async componentDidMount() {
    try  {
      await Font.loadAsync({
      'Abril-Fatface': require('./assets/fonts/AbrilFatface-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
    } catch {
      console.log('could not load font')
    }

  }



  render() {
    console.log(this.state)
    return (
     this.state.fontLoaded &&
     <AppNavigator 
     key={1}
      //  fontLoaded={this.state.fontLoaded}
       initialRouteName="PostMantra"
    />
    );
  }
}
