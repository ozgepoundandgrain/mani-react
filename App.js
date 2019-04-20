import React from 'react';
import { createStackNavigator } from 'react-navigation'
import Home from './pages/home'
import Authentication from './pages/Authentication'
import Initial from './pages/Initial'
import PostMantra from './pages/Post-mantra'
import PostVision from './pages/Post-vision'
import EditMantra from './pages/Edit-mantra'
import ShowVision from './pages/Show-vision'
import EditVision from './pages/Edit-vision'

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
