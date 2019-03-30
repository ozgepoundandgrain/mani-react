import React from 'react';
import arrow from './images/arrow.png'
import * as Animatable from 'react-native-animatable'
import Drawer from 'react-native-drawer'
import {
    StyleSheet, 
    Button,
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
    ListView,
    Switch } from 'react-native';
import { LinearGradient, ImagePicker, Permissions } from 'expo'
import Accordion from 'react-native-collapsible/Accordion';


const WIDTH = Dimensions.get('window').width
const ACCESS_TOKEN = 'authentication_token';

const swipeContainerStyle = (translateX) => (
  { transform: [{ translateX }]}
)

class AnimatedPostCards extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: this.props.accessToken,
      posts: [],
      visions: [],
      email: this.props.email,
      animation: null,
      viewOptions: false,
      image: null,
      uploadFile: '',
      displayEntries: true,
      displayVisions: false,

      isDrawerClosed: true,
      index: null
    }
    this.goToView = this.goToView.bind(this)
    this.goToVisionView = this.goToVisionView.bind(this)
    this.reset = this.reset.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
  }

  componentWillMount() {
    // this.getToken();
    // this.fetchData();
  }
  translateX = new Animated.Value(-120)

  reset() {
    this.translateX.setValue(-105)
  }

  async componentDidMount(){
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (newPermission.status === 'granted') {
        console.log('just granted')
      }
  } else {
    console.log('GRANTED ALREADY')
  }
    this.getToken();
    this.fetchData()
    this.fetchVisions()
    this.setState({ email: this.props.email })
    this.setState({accessToken: this.props.accessToken})
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
    this.deleteShit(this.props.id)
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
  goToVisionView(routeName, id, description, url) {
    this.props.navigation.navigate(
      routeName,
      { 
      visionId: id,
      visionURL: url,
      visionDescription: description,
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

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    this.setState({ uploadFile: result.uri })

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  async submitPhoto() {
    let access_token = this.state.accessToken
    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/visions/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Email': this.state.email,
                'X-User-Token': this.state.accessToken
            },
            body: JSON.stringify({
              vision: {
                title: 'dsfsfdsfdsfsd',
                body: 'dadsadasd',
                image: 'https://www.gstatic.com/webp/gallery/4.sm.jpg'
              }
            })
        });

        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
            console.log('res success is: ', res);
            this.props.navigation.navigate('home');
        } else {
            let errors = res;
            throw errors;
        }
      
    } catch(errors) {
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

  async fetchVisions(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/visions',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.state.email,
                                'X-User-Token': this.state.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: JSON.parse(response._bodyText).data})
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
        return (
        <View style={{position: 'relative'}}>
            <Animated.View
            style={swipeContainerStyle(this.translateX)}
            {...this.panResponder.panHandlers}
            >
            <TouchableOpacity
            style={styles.viewBox}
            underlayColor="transparent" activeOpacity={1}
            >
            <View style={{flex: 1}}>
                <Text style={styles.title}>{this.props.values.title}</Text>
                <Text style={styles.description}>{this.props.values.description}</Text>
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
  noborder: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  border: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: 'transparent',
    borderColor: 'black',
    width: 140,
    justifyContent: 'center',
    alignItems: 'center', 
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

export default AnimatedPostCards
