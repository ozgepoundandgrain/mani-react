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
    ScrollView,
    Image,
    Animated,
    PanResponder,
    Dimensions,
    } from 'react-native';
import { Permissions, ImagePicker } from 'expo'

const WIDTH = Dimensions.get('window').width
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
      visions: [],
      email: this.props.navigation.state.params.email,
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
    this.getToken();
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

  // async submitPhoto() {
  //   let access_token = this.state.accessToken
  //   try {
  //       let response = await fetch('https://prana-app.herokuapp.com/v1/visions/', {
  //           method: 'POST',
  //           headers: {
  //               'Accept': 'application/json',
  //               'Content-Type': 'application/json',
  //               'X-User-Email': this.state.email,
  //               'X-User-Token': this.state.accessToken
  //           },
  //           body: JSON.stringify({
  //             vision: {
  //               description: 'YOYOYOYOYO',
  //               image: this.state.uploadFile
  //             }
  //           })
  //       });

  //       let res = await response.text();
  //       if (response.status >= 200 && response.status < 300) {
  //           console.log('res success is: ', res);
  //           this.props.navigation.navigate('home');
  //       } else {
  //         console.log('RESSS ERROR:', res)
  //         console.log(this.state.accessToken, this.state.email)
  //           let errors = res;
  //           throw errors;
  //       }
      
  //   } catch(errors) {
  //   }
  // }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }


    let localUri = result.uri;
  let filename = localUri.split('/').pop();

  const stringdata = {
    description: "this is the description yooooo"
  };


  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  for (var k in stringdata) {
    formData.append(k, stringdata[k]);
  }
  formData.append('image', { uri: localUri, name: filename, type });

  return await fetch('https://prana-app.herokuapp.com/v1/visions/', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-User-Email': this.state.email,
      'X-User-Token': this.state.accessToken
    },
  });
  };
    
  // async fetchData(){
  //   try {
  //     let response = await fetch('https://prana-app.herokuapp.com/v1/posts',{
  //                             method: 'GET',
  //                             headers: {
  //                               'X-User-Email': this.state.email,
  //                               'X-User-Token': this.state.accessToken,
  //                               'Content-Type': 'application/json',
  //                             }
  //                           });
  //       if (response.status >= 200 && response.status < 300) {
  //         this.setState({posts: JSON.parse(response._bodyText).data})
  //       } else {
  //         let error = res;
  //         throw error;
  //       }
  //   } catch(error) {
  //       console.log("error: " + error)
  //   }
  // }

  // async fetchVisions(){
  //   try {
  //     let response = await fetch('https://prana-app.herokuapp.com/v1/visions',{
  //                             method: 'GET',
  //                             headers: {
  //                               'X-User-Email': this.state.email,
  //                               'X-User-Token': this.state.accessToken,
  //                               'Content-Type': 'application/json',
  //                             }
  //                           });
  //       if (response.status >= 200 && response.status < 300) {
  //         this.setState({visions: JSON.parse(response._bodyText).data})
  //       } else {
  //         let error = res;
  //         throw error;
  //       }
  //   } catch(error) {
  //       console.log("error: " + error)
  //   }
  // }

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
    if (this.props.flash) {
       flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
       flashMessage = null
    }

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
          {/* <TouchableHighlight onPress={this.submitPhoto.bind(this)}><Text>DUBMIT PHOTO</Text></TouchableHighlight> */}
          {/* <TouchableHighlight onPress={this.selectPhotoTapped.bind(this)}><Text>UPLOAD BIH</Text></TouchableHighlight> */}
          {/* <Text>{this.state.uploadFile}t</Text> */}
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
        <ScrollView style={{ position: 'relative', backgroundColor: '#F5F9FB' }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 150, width: '100%', flexDirection: 'row', paddingLeft: 50, paddingRight: 50}}>
          <TouchableHighlight 
            onPress={() => this.setState({displayEntries: true, displayVisions: false})}
            underlayColor="transparent" activeOpacity={0}
          >
            <View style={this.state.displayEntries ? styles.border : styles.noborder}>
              <Text>{this.state.posts.length}</Text>
              <Text>Entries</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight 
            onPress={() => this.setState({displayEntries: false, displayVisions: true})}
            underlayColor="transparent" activeOpacity={0}
          >
            <View style={this.state.displayVisions ? styles.border : styles.noborder}>
              <Text>{this.state.visions.length}</Text>
              <Text>Vision Board</Text>
            </View>
          </TouchableHighlight>
        </View>

{
  this.state.posts.map(post => {
    return (
    <Text>{post.title}</Text>
    )
  })
}
        {/* <View>
          <View style={styles.container}>
            <FlatList
              data={this.state.posts}
              renderItem={({post, index}) => <AnimatedPostCards accessToken={this.state.accessToken} email={this.state.email} key={index} values={post} />}
            />
          </View>
        </View> */}

        {this.state.displayVisions &&
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              title="Pick an image from camera roll"
              onPress={this._pickImage}
            />
            {this.state.image &&
              <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
          </View>}

          <View  style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            {this.state.displayVisions &&
              (this.state.visions).map((vis, index) => {
              return (
                 vis.image.url !== null && 
                 <TouchableHighlight 
                  onPress={() => this.goToVisionView('ViewVision', vis.id, vis.description, vis.image.url)}
                >
                  <Image 
                    source={{uri: vis.image.url}} 
                    style={{ width: (WIDTH/3), height: (WIDTH/3) }}
                  />
                </TouchableHighlight>
              )
            })
          }
          </View>
        </ScrollView>


        <View style={{width: '100%', height: 70, backgroundColor: 'white'}}>
          <TouchableHighlight
            underlayColor="transparent" activeOpacity={1}
            onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })}
          >
            <Image source={require('./images/plus.png')} style={{alignSelf: 'center', marginTop: 15, height: 15, width: 15}}/>
          </TouchableHighlight>
          {/* {!!this.state.viewOptions &&
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
            </TouchableOpacity> */}
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

export default Home
