import React from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  Text,
  TouchableHighlight, 
  Modal,
  Image, 
  AsyncStorage, 
  View, 
  FlatList } from 'react-native';
import DrawerComponent from './components/drawer.js'
import InitialHome from './components/initial-home.js'
import Footer from './components/footer.js'


var {width} = Dimensions.get('window')


import { Permissions, Notifications } from 'expo';
import { TouchableOpacity } from 'react-native-gesture-handler';


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
      imagesURLarray: [],
      modalVisible: false,
      scrollToIndex: 1
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

  redirect(routeName, mantraId, title, description) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        data: this.state.data,
        mantraId: mantraId,
        title: title,
        description: description
      }
    )
    this.setState({modalVisible: false})
  }


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
    this.setState({modalVisible: false})
  }

  renderItemsForModal = ({item}) => (
    <View style={{paddingBottom: 30}}>
    {item.image_url ?
    <View style={{backgroundColor: 'white'}}>
      <TouchableHighlight
        id={item.id}
        onPress={() => this.redirectToImage('ShowVision', item.id, item.image_url, item.description)}
        underlayColor="transparent"
        activeOpacity={0}
      >
        <Image 
          key={item.id} 
          style={{height: width, width: width}} 
          source={{uri: item.image_url}}
        />
      </TouchableHighlight>
      {/* <Text style={{color: 'black', fontSize: 20, padding: 20}}>{item.description}</Text> */}
    </View>
    :
    <TouchableHighlight
      id={item.id}
      onPress={() => this.redirect('ShowMantra', item.id, item.title, item.description)}
      underlayColor="transparent"
      activeOpacity={0}
    >
      <View style={{height: width, width: width, backgroundColor: 'white', padding: 20, overflow: 'hidden'}}>
        <Text numberOfLines={2} style={{fontSize: 20}}>{item.title}</Text>
        <Text numberOfLines={16} style={{fontSize: 16}}>{item.description}</Text>
      </View>
    </TouchableHighlight>}
    </View>
)



  renderItems = ({item, index}) => (
      item.image_url ?
      <TouchableHighlight
        id={item.id}
        onPress={() => this.setState({modalVisible: true, topItem: item, scrollToIndex: index})}
        underlayColor="transparent"
        activeOpacity={0}
        style={{margin: 2}}
      >
        <Image 
          key={item.id} 
          style={{height: (width/2 - 4), width: (width/2 - 4)}} 
          source={{uri: item.image_url}}
        />
      </TouchableHighlight>
      :
      <TouchableHighlight
        id={item.id}
        onPress={() => this.setState({modalVisible: true, topItem: item, scrollToIndex: index})}
        underlayColor="transparent"
        activeOpacity={0}
        style={{margin: 2}}
      >
        <View style={{height: (width/2 - 4), width: (width/2 - 4), backgroundColor: '#FFEFBA', overflow: 'hidden', padding: 10}}>
          <Text numberOfLines={2} style={{fontSize: 20}}>{item.title}</Text>
          <Text numberOfLines={6} style={{fontSize: 16}}>{item.description}</Text>
        </View>
      </TouchableHighlight>
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
    const list = (this.state.mantras.concat(this.state.visions)).sort(function(a,b){return new Date(a.created_at) - new Date(b.created_at)})
    return (
      <DrawerComponent {...this.props}>
        {this.state.mantras.concat(this.state.visions.length) < 1 ? 
        <InitialHome 
          {...this.props}
          email={this.state.email}
          accessToken={this.state.accessToken}
        />
        :
        [<FlatList
          key={1}
          keyExtractor={(item, index) => `list-item-${index}`}
          numColumns={2}
          data={list}
          renderItem={this.renderItems}
        />,
        <Modal
          key={4}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <TouchableOpacity 
            style={styles.closeContainer}
            onPress={() => this.setState({modalVisible: false})}
            activeOpacity={1}
          >
            <Text style={styles.close}>
                Close
              </Text>
          </TouchableOpacity>

          <View style={styles.modalContentContainer}>
            <FlatList
              getItemLayout={(data, index) => (
                {length: width, offset: width * index, index}
              )}
              initialScrollIndex={(this.state.scrollToIndex).toString()}
              keyExtractor={(item, index) => `modal-list-item-${index}`}
              numColumns={1}
              data={list}
              renderItem={this.renderItemsForModal}
            />
          </View>
      </Modal>,
        <Footer 
          key={2}
          email={this.state.email}
          accessToken={this.state.accessToken}
          {...this.props}
        />]}
      </DrawerComponent>
    )
  }
}

const styles = StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    minHeight: '100%',
    paddingBottom: 100
  },
  close: {color: 'white', textAlign: 'right', marginTop: 50, marginRight: 15},
  closeContainer: {width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', height: 70}
})

export default Home