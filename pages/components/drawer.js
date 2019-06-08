import React from 'react';
import { Text, View, TouchableHighlight, AsyncStorage, StyleSheet, Image } from 'react-native';
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

      isDrawerClosed: true,
    }
    this.onLogout = this.onLogout.bind(this)
    this.redirect = this.redirect.bind(this)
    this.deleteToken = this.deleteToken.bind(this)
    this.handleDrawer = this.handleDrawer.bind(this)
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
        this.redirect('Authentication')
        this.props.navigation.state.params.onLogout()
    } catch(error) {
        console.log("Something went wrong1");
    }
  }

  onLogout(){
    this.setState({showProgress: true})
    this.deleteToken();
  }

  handleDrawer() {
    this.state.isDrawerClosed ?
    this.setState({isDrawerClosed: false })
    :
    this.setState({isDrawerClosed: true })
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Drawer
          openDrawerOffset={0.4}
          closedDrawerOffset={0}
          type={"static"}
          content={drawerView(this.onLogout)}
          styles={drawerStyles}
          onClose={() => this.setState({ isDrawerClosed: true })}
          tapToClose={true}
          open={!this.state.isDrawerClosed}
          >
            <View style={styles.overlay}>
              <TouchableHighlight
                underlayColor="transparent"
                activeOpacity={0}
                // style={this.state.isDrawerClosed ? styles.hamburger : styles.hamburgerRotated}
                onPress={this.handleDrawer}
              >
                <View style={styles.hamburgerContainer}>
                  <View style={styles.hamburger}></View>
                  <View style={styles.hamburger}></View>
                </View>
              </TouchableHighlight>
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
  hamburger: {
    height: 2,
    width: 20,
    backgroundColor: 'black',
    marginBottom: 4
  },
  hamburgerContainer: {
    marginTop: 0,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10
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