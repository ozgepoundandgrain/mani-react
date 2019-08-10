import React from 'react';
import { Text, View, Animated, Easing, TouchableHighlight, AsyncStorage, StyleSheet } from 'react-native';
import Drawer from 'react-native-drawer'

const ACCESS_TOKEN = 'authentication_token';

const drawerView = (logout) => (
  <View style={styles.outerDrawerContainer}>
    <View style={styles.innerDrawerContainer}>
      <TouchableHighlight 
        onPress={logout} 
        underlayColor="white"
        activeOpacity={0}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableHighlight>
      <TouchableHighlight>
        <Text style={{shadowColor: 'white'}}>Contact: info@prana.com</Text>
      </TouchableHighlight>
    </View>
  </View>
)

class DrawerComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      accessToken: this.props.navigation.state.params.accessToken,
      viewOptions: false,
      fadeAnim: new Animated.Value(0), 
      rotateAnim: new Animated.Value(0),
      isDrawerClosed: true
    }
    this.onLogout = this.onLogout.bind(this)
    this.redirect = this.redirect.bind(this)
    this.deleteToken = this.deleteToken.bind(this)
    this.handleDrawer = this.handleDrawer.bind(this)
    this.rotate = this.rotate.bind(this)
  }

  redirect(routeName, accessToken) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: accessToken,
        loggedOut: true
      }
    )
  }

  async componentWillMount() {
    this.getToken();
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount(){
    this.getToken();
  }

  handleViewRef = ref => this.view = ref;
  
  bounce = () => 
    this.view.bounce(800).then(endState => 
      console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if(!accessToken) {
          this.redirect('login');
      } else {
          this.setState({accessToken: accessToken})
      }
    } catch(error) {
        console.log("Something went wrong");
        this.redirect('login');
    }
  }

  async deleteToken() {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        this.props.navigation.state.params.onLogout()
        this.redirect('Authentication')
    } catch(error) {
        console.log("Something went wrong1");
    }
  }

  onLogout(){
    this.deleteToken();
  }

  rotate() {
    Animated.timing(this.animatedValue, {
      toValue: this.animatedValue._value === 0 ? 1 : 0,
      duration: 300,
      easing: Easing.linear
    }).start()
  }

  handleDrawer() {
    this.rotate()

    this.state.isDrawerClosed ?
    this.setState({isDrawerClosed: false })
    :
    this.setState({isDrawerClosed: true })
  }

  render() {

    const interpolateRotation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    })
    const animatedStyle = {
      transform: [
        { rotate: interpolateRotation }
      ]
    }


    return (
      <View style={styles.pageContainer}>
        <Drawer
          openDrawerOffset={0.4}
          closedDrawerOffset={0}
          type={"static"}
          content={drawerView(this.onLogout)}
          styles={drawerStyles}
          onClose={() => {this.setState({ isDrawerClosed: true }), this.rotate()}}
          tapToClose={true}
          open={!this.state.isDrawerClosed}
          >
            <View style={styles.overlay}>
            
            <View style={styles.headerContainer}>
            <Animated.View style={[animatedStyle]}>
              <TouchableHighlight
                underlayColor="transparent"
                activeOpacity={0}
                onPress={this.handleDrawer}
              >
                  <View style={styles.hamburgerContainer}>
                    <View style={styles.hamburger}></View>
                    <View style={styles.hamburger}></View>
                  </View>
              </TouchableHighlight>
              </Animated.View>

              <Text style={styles.header}>Prana.</Text>

              <Text style={styles.headerInvisible}>Prana.</Text>
            
              </View>

                  {this.props.children}
              </View>

        </Drawer> 
      </View>   
    )
  }
}
const drawerStyles = {
  drawer: { backgroundColor: 'white'},
  main: {backgroundColor: '#F5F9FB'},
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%', 
    height: 40, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 30,
    marginBottom: 20
  },
  headerInvisible: {
    color: 'transparent',
  },
  header: {
    backgroundColor: "white",
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface',
  },
  hamburger: {
    height: 2,
    width: 20,
    backgroundColor: 'black',
    marginBottom: 4
  },
  hamburgerContainer: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: 40
  },
  logoutText: {
    shadowColor: 'white',
    paddingBottom: 20
  },
  innerDrawerContainer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    marginBottom: 40, 
    marginLeft: 20
  },
  outerDrawerContainer: {
    height: '100%'
  },
  background: {
    width: '100%', 
    height: '100%',
  },
  pageContainer: {
    height: '100%', 
    alignContent: 'center',
    backgroundColor: 'white'
  },
  overlay: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  }
})


export default DrawerComponent