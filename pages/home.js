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
    PanResponder,
    Dimensions,
    Switch } from 'react-native';
import { LinearGradient } from 'expo'
import Accordion from 'react-native-collapsible/Accordion';


const ACCESS_TOKEN = 'authentication_token';

const swipeContainerStyle = (translateX) => (
  { transform: [{ translateX }]}
)

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: this.props.navigation.state.params.accessToken,
      posts: [],
      email: this.props.navigation.state.params.email,
      animation: null,
      viewOptions: false,

      isDrawerClosed: true,
      index: null
    }
    this.goToView = this.goToView.bind(this)
    this.reset = this.reset.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
  }

  componentWillMount() {
    this.getToken();
    // this.fetchData();
  }
  translateX = new Animated.Value(-120)

  reset() {
    this.translateX.setValue(-105)
  }

  componentDidMount(){
    this.getToken();
    this.fetchData()
    this.setState({ email: this.props.navigation.state.params.email })
    Animated.timing(this.translateX, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200,
    }).start()
  }

  componentDidUpdate() {  

  }

  panResponder = (id) => PanResponder.create({
    onMoveShouldSetResponderCapture: (id) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => (
      Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dx) > 1
    ),
    onPanResponderMove: (e, gestureState) => {
      if (Math.abs(gestureState.x0) > Math.abs(gestureState.moveX)) {
        Animated.event([null, { dx: this.translateX }])(e, gestureState)
      }
    },
    onPanResponderRelease: (e, { x0, moveX }) => {
      if ((Math.abs(x0) - Math.abs(moveX)) >= 85) {
        Animated.timing(this.translateX, {
          useNativeDriver: true,
          toValue: -85,
          duration: 200,
        }).start()
      } else {
        Animated.timing(this.translateX, {
          useNativeDriver: true,
          toValue: 0,
          duration: 200,
        }).start()
      }
    }
  })

  deleteAction(id){
    this.deleteShit(id)
  }

  deleteShit(id) {
    fetch('https://prana-app.herokuapp.com/v1/posts/'+id, {
      method: 'DELETE',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
  }

  viewOptions() {
    !!this.state.viewOptions ?
    this.setState({viewOptions: false}) 
    :
    this.setState({viewOptions: true}) 
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
  
  completeAction(id) {
    fetch('https://prana-app.herokuapp.com/v1/completions?id='+id, {
      method: 'POST',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
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
        openDrawerOffset={0.4}
        closedDrawerOffset={0}
        type={"static"}
        content={<View style={{height: '100%' }}>
        <View style={{position: 'absolute', bottom: 0, left: 0, marginBottom: 40, marginLeft: 20}}>
          <TouchableHighlight>
            <Text onPress={this.onLogout.bind(this)} style={{shadowColor: 'white', paddingBottom: 20}}>Logout</Text>
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
          { (this.state.posts).map((mant, index) => {
              return (
                <View style={{position: 'relative'}} key={mant.id}>
                  <Animated.View
                    style={swipeContainerStyle(this.translateX)}
                    {...this.panResponder(mant.id).panHandlers}
                  >
                  <TouchableOpacity
                    style={styles.viewBox} key={mant.id}
                    underlayColor="transparent" activeOpacity={1}
                  >
                    <View style={{flex: 1}}>
                      <Text style={styles.title}>{mant.title}</Text>
                        <Text style={styles.description}>{mant.description}</Text>
                    </View>
                  </TouchableOpacity>
                  </Animated.View>
                  <View style={styles.buttons}>
                    <TouchableOpacity underlayColor="transparent" activeOpacity={1} style={styles.deleteButton} onPress={() => this.deleteAction(mant.id)}><Text style={{color: 'white', textAlign: 'right', paddingRight: 20}}>Delete</Text></TouchableOpacity>
                    <TouchableOpacity underlayColor="transparent" activeOpacity={1} style={styles.EditButton} onPress={() => this.goToView('viewPost', mant.id, mant.description, mant.title)}><Text style={{color: 'white', textAlign: 'right', paddingRight: 20}}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity underlayColor="transparent" activeOpacity={1} style={styles.completeButton} onPress={() => this.completeAction(mant.id)} ><Text style={{color: 'white', textAlign: 'right', paddingRight: 20}}>Complete!</Text></TouchableOpacity>
                  </View>
                </View>
              )
            })
          }

        </ScrollView>


        <View 
          underlayColor="transparent" activeOpacity={0}
        >
        <View>
          {!!this.state.viewOptions &&
            <View style={styles.booboo}>
              <TouchableHighlight underlayColor="transparent" activeOpacity={1} style={{flexGrow: 1, alignItems: 'center', transform: [{ rotate: '-25deg'}], width: 15, margin: 5}} onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })}><Text>Post</Text></TouchableHighlight>
              <TouchableHighlight underlayColor="transparent" activeOpacity={1} disabled style={{flexGrow: 1, alignItems: 'center', transform: [{ rotate: '25deg'}], width: 15, margin: 5}}><Text style={{fontSize: 10}}>Vision board (coming soon)</Text></TouchableHighlight>
            </View>
          }
            <TouchableOpacity
              underlayColor="transparent" activeOpacity={1}
              onPress={() => this.viewOptions()}
              style={styles.imageStyle}
            >
              <LinearGradient colors={['#08DAF6', '#523CB8']} style={{borderRadius: 50, height: '100%', width: '100%'}}>
              <Image source={require('./images/plus.png')} style={{alignSelf: 'center', marginTop: 15, height: 15, width: 15}}/>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        </Drawer>
      </View>
    );
  }
}


const drawerStyles = {
  drawer: { backgroundColor: 'white'},
  main: {backgroundColor: '#F5F9FB'},
}

const styles = StyleSheet.create({
  deleteButton: {
    height: 20,
    backgroundColor: '#523CB8',
    flexGrow: 3,
    borderTopRightRadius: 10
  },
  EditButton: {
    height: 20,
    backgroundColor: '#08DAF6',
    flexGrow: 3,
  },
  completeButton: {
    height: 20,
    backgroundColor: '#3E8888',
    flexGrow: 3,
    overflow: 'hidden',
    borderBottomRightRadius: 10
  },
  buttons: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -1,
    minHeight: 140,
    width: '90%',
    margin: 10,
    alignSelf: 'center',
  },
  viewBox: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 10,
    minHeight: 140,
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'grey', shadowOpacity: 0.1,
    zIndex: 100,
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
  booboo: {
    alignSelf: 'center', 
    marginBottom: 80, 
    position: 'absolute', 
    bottom: 0,
    flexDirection: 'row',
    width: '50%',
  },
  container: {
    flex: 1,
  },
  drawer: {
    backgroundColor: 'red'
  },
  containerStyle: {
    // width: 100,
    // height: 100,
    position: 'relative'
  }
});

export default Home
