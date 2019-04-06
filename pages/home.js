import React from 'react';
import { Text, View, TouchableHighlight, Image, AsyncStorage } from 'react-native';
import Drawer from 'react-native-drawer'

const ACCESS_TOKEN = 'authentication_token';

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: this.props.navigation.state.params.accessToken,
      posts: [],
      visions: [],
      email: this.props.navigation.state.params.email,
      viewOptions: false,

      isDrawerClosed: true,
      index: null
    }
    this.onLogout = this.onLogout.bind(this)
    this.handleDrawer = this.handleDrawer.bind(this)
    this.redirect = this.redirect.bind(this)
    this.deleteToken = this.deleteToken.bind(this)
  }

  redirect(routeName, accessToken) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: accessToken,
        loggedOut: true
      }
    )
  }

  componentWillMount() {
    this.getToken();
  }

  componentDidMount(){
    this.getToken();
  }

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
    console.log('deleetteeee')
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
    console.log("drawer")
    this.state.isDrawerClosed ?
    this.setState({isDrawerClosed: false })
    :
    this.setState({isDrawerClosed: true })
  }

  render() {
    console.log(this.props, this.state)
    return (
    <View style={{backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center'}}>
      <Drawer
        openDrawerOffset={0.4}
        closedDrawerOffset={0}
        type={"static"}
        content={<View style={{height: '100%' }}>
        <View style={{position: 'absolute', bottom: 0, left: 0, marginBottom: 40, marginLeft: 20}}>
          <TouchableHighlight onPress={this.onLogout} >
            <Text style={{shadowColor: 'white', paddingBottom: 20}}>Logout</Text>
          </TouchableHighlight>
          <TouchableHighlight>
            <Text style={{shadowColor: 'white'}}>Contact: info@prana.com</Text>
          </TouchableHighlight>
          </View>
        </View>}
        styles={drawerStyles}
        onClose={() => this.setState({ isDrawerClosed: true })}
        tapToClose={true}
        open={!this.state.isDrawerClosed}
        >

           <View style={{ padding: 50, height: 100, width: '100%'}}>
            <View>
              <TouchableHighlight 
                
                onPress={this.handleDrawer}
                underlayColor="transparent" activeOpacity={0}
              >
                <Text style={{padding: 50}}>This is the home page</Text>
              </TouchableHighlight> 
            </View>
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

export default Home