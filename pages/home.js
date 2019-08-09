import React from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  Text,
  TouchableHighlight, 
  Image, 
  AsyncStorage, 
  View, 
  FlatList } from 'react-native';
import DrawerComponent from './components/drawer.js'
import Footer from './components/footer.js'


var {width} = Dimensions.get('window')


import { Permissions, Notifications } from 'expo';


async function getToken() {
  // Remote notifications do not work in simulators, only on device
  if (!Expo.Constants.isDevice) {
    return;
  }
  let { status } = await Expo.Permissions.askAsync(
    Expo.Permissions.NOTIFICATIONS,
  );
  if (status !== 'granted') {
    return;
  }
  let value = await Expo.Notifications.getExpoPushTokenAsync();
  console.log('Our token', value);
  /// Send this to a server
}




class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      userId: this.props.navigation.state.params.userId,
      mantras: this.props.navigation.state.params.mantras || [],
      visions: this.props.navigation.state.params.visions || [],
      updated: this.props.navigation.state.params.updated,
      data: this.props.navigation.state.params.data,
      index: 0,
      image: '',
      isReady: false,
      imagesURLarray: []
    }  
  }

  componentDidMount() {
    this.fetchData()
    this.fetchVision()
    getToken()
    this._storeData()
    this._retrieveData()
  }

  componentDidUpdate(prevProps) {

    if (this.props.navigation.state.params.data !== prevProps.navigation.state.params.data) {
      this.fetchData()
    }

    if (this.props.navigation.state.params.visions !== prevProps.navigation.state.params.visions) {
      this.fetchVision()
    }
  }

  handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
    );
  };

  
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({expo_push_token: token})
    
  
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(`https://prana-app.herokuapp.com/v1/users/${this.state.userId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          expo_push_token: this.state.expo_push_token
      })
      
    });
  
  }

  // redirect(routeName, mantraId, title, description) {
  //   this.props.navigation.navigate(
  //     routeName,
  //     { accessToken: this.state.accessToken, 
  //       email: this.state.email,
  //       data: this.state.data,
  //       mantraId: mantraId,
  //       title: title,
  //       description: description
  //     }
  //   )
  // }


  redirectToImage(routeName, visionId, image_url, description) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        visionId: visionId,
        image_url: image_url,
        description: description
      }
    )
  }

  renderItems = ({item}) => (
      item.image_url ?
      <TouchableHighlight
        id={item.id}
        onPress={() => this.redirectToImage('ShowVision', item.id, item.image_url, item.description)}
        underlayColor="transparent"
        activeOpacity={0}
      >
        <Image 
          key={item.id} 
          style={{height: width/2, width: width/2}} 
          source={{uri: item.image_url}}
        />
      </TouchableHighlight>
      :
      <View style={{height: width/2, width: width/2, backgroundColor: 'pink'}}>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
  )

  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/mantras',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.state.email,
                                'X-User-Token': this.state.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: JSON.parse(response._bodyText).data})
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async fetchVision(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/visions/',{
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
    }
  }


  async _storeData (){
    const userId = this.state.userId ? (this.state.userId).toString() : ''
    try {
      await AsyncStorage.setItem('UserId', userId);
    } catch (error) {
      // Error saving data
    }
  };

  async _retrieveData () {
    try {
      const value = await AsyncStorage.getItem('UserId');
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({userId: value})
        this.registerForPushNotificationsAsync()
      }
    } catch (error) {
      // Error retrieving data
    }
  };



  render() {
    return (
      <DrawerComponent {...this.props}>
        <FlatList
          keyExtractor={(item, index) => index}
          numColumns={2}
          data={(this.state.mantras.concat(this.state.visions)).sort(function(a,b){return new Date(a.created_at) - new Date(b.created_at)})}
          renderItem={this.renderItems}
        />
        <Footer 
          email={this.state.email}
          accessToken={this.state.accessToken}
          {...this.props}
        />
      </DrawerComponent>
    )
  }
}

const styles = StyleSheet.create({
})

export default Home