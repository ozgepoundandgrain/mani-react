import React from 'react';
import { createStackNavigator } from 'react-navigation'
import Home from './pages/home'
import { Text } from 'react-native';
import Authentication from './pages/Authentication'
import Initial from './pages/Initial'
import PostMantra from './pages/Post-mantra'
import PostVision from './pages/Post-vision'
import EditMantra from './pages/Edit-mantra'
import ShowVision from './pages/Show-vision'
import EditVision from './pages/Edit-vision'
import { Font } from 'expo';

const Header = (fontLoaded) => {
  return (
    fontLoaded && <Text style={styles.header}>Prana.</Text>
  )
}

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
     header: props => <Header fontLoaded={props.fontLoaded} />,
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

const styles = {
  header: {
    backgroundColor: "white",
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface',
    paddingTop: 30,
  }
}



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

    setTimeout(() => {
      this.setState({ loadApp: true })
    }, 3000);
  }

  render() {
    return (
     this.state.fontLoaded &&
     <AppNavigator 
       fontLoaded={this.state.fontLoaded}
       initialRouteName="PostMantra"
    />
    );
  }
}
