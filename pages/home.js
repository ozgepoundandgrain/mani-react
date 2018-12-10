import React from 'react';
import arrow from './images/arrow.png'
import * as Animatable from 'react-native-animatable'
import Drawer from 'react-native-drawer'
import {
    StyleSheet, 
    Text,
    View,
    TouchableHighlight,
    AsyncStorage,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Switch } from 'react-native';
import { LinearGradient } from 'expo'
import Accordion from 'react-native-collapsible/Accordion';


const ACCESS_TOKEN = 'authentication_token';



class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: this.props.navigation.state.params.accessToken,
      posts: [],
      email: this.props.navigation.state.params.email,
      animation: null,

      isDrawerClosed: true
    }
    this.goToView = this.goToView.bind(this)
  }

  componentWillMount() {
    this.getToken();
    // this.fetchData();

  }

  componentDidMount(){
    this.getToken();
    this.fetchData()
    this.setState({ email: this.props.navigation.state.params.email })
  }

  componentDidUpdate() {  

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
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        this.redirect('login')
        this.props.navigation.state.params.onLogout()
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  redirect(routName, accessToken) {
    this.props.navigation.navigate(
      routName,
      { accessToken: accessToken,
        loggedOut: true
      }
    )
  }
  goToView(routeName, id, description, title) {
    this.props.navigation.navigate(
      routeName,
      { postId: id,
      postDescription: description,
      postTitle: title,
      accessToken: this.state.accessToken,
      userEmail: this.state.email
    }
    )
  }
  onLogout(){
    this.setState({showProgress: true})
    this.deleteToken();
  }

  confirmDelete() {
    AlertIOS.alert("Are you sure?", "This action cannot be undone", [
      {text: 'Cancel'}, {text: 'Delete', onPress: () => this.onDelete()}
    ]);
  }

  async onDelete(){
    let access_token = this.state.accessToken
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/users'+access_token,{
                              method: 'DELETE',
                            });
        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
          console.log("success sir: " + res)
          this.redirect('home', this.state.accessToken);
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/posts',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.state.email,
                                'X-User-Token': this.state.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({posts: JSON.parse(response._bodyText).data})
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }
  handleDrawer() {
    this.state.isDrawerClosed ?
    this.setState({isDrawerClosed: false })
    :
    this.setState({isDrawerClosed: true })
  }
  
  render() {
    let flashMessage;
    if (this.props.flash) {
       flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
       flashMessage = null
    }
    console.log(this.props, this.state)
    return(
      <View style={{backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center'}}>
      <Drawer
        openDrawerOffset={0.5}
        closedDrawerOffset={0}
        type={"static"}
        content={<View style={{height: '100%' }}>
          <TouchableHighlight style={{position: 'absolute', bottom: 0, left: 0, marginBottom: 40, marginLeft: 20}}>
            <Text onPress={this.onLogout.bind(this)} style={{shadowColor: 'white'}}>Logout</Text>
          </TouchableHighlight>
        </View>}
        styles={drawerStyles}
        onClose={() => this.setState({ isDrawerClosed: true })}
        tapToClose={true}
        open={!this.state.isDrawerClosed}
        >
           <View style={{ paddingBottom: 15, height: 100, width: '100%'}}>
            <View style={styles.logout}>
              <TouchableHighlight 
                
                onPress={this.handleDrawer.bind(this)}
                underlayColor="transparent" activeOpacity={0}
              >
                <Image source={require('./images/more.png')} style={{height: 30, width: 30}}/>
              </TouchableHighlight> 
            </View>
          </View> 

        <ScrollView style={{ backgroundColor: '#F5F9FB' }}>
          { (this.state.posts).map(mant => {
              return (
  
                <TouchableOpacity style={styles.viewBox} key={mant.id} onPress={() => this.goToView('viewPost', mant.id, mant.description, mant.title)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.title}>{mant.title}</Text>
                      <Text style={styles.description}>{mant.description}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }

        </ScrollView>

        <TouchableHighlight 
          onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })} 
          style={styles.imageStyle}
          underlayColor="transparent" activeOpacity={0}
        >
          <LinearGradient colors={['#08DAF6', '#523CB8']} style={{borderRadius: 50, height: '100%', width: '100%'}}>
          <Image source={require('./images/plus.png')} style={{alignSelf: 'center', marginTop: 15, height: 15, width: 15}}/>
          </LinearGradient>
        </TouchableHighlight>
        </Drawer>
      </View>
    );
  }
}


const drawerStyles = {
  drawer: {},
  main: {},
}

const styles = StyleSheet.create({
  viewBox: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    // borderColor: '#5631B3',
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 10,
    minHeight: 100,
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'grey', shadowOpacity: 0.1
  },
  title: {
    fontSize: 20,
    padding: 10,
    marginRight: 20,
    color: '#494949'
  },
  description: {
    padding: 10,
    color: '#494949'
  },
  logout: {
    alignSelf: 'center', 
    marginTop: 60, 
    paddingLeft: 25,
    position: 'absolute', 
    top: 0, 
    left: 0
  },
  imageStyle: {
    alignSelf: 'center', 
    margin: 40, 
    position: 'absolute', 
    bottom: 0, 
    height: 45,
    width: 45
  },
  container: {
    flex: 1,
  },
  drawer: {
    backgroundColor: 'red'
  }
});

export default Home
