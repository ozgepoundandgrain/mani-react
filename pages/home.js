import React from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  Text,
  TouchableHighlight, 
  Image, 
  ScrollView, 
  View, 
  FlatList } from 'react-native';
import DrawerComponent from './components/drawer.js'
import Footer from './components/footer.js'
import ViewMoreText from 'react-native-view-more-text';
import Expo, { LinearGradient } from 'expo'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

var {width, height} = Dimensions.get('window')


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
      mantras: this.props.navigation.state.params.mantras || [],
      visions: this.props.navigation.state.params.visions || [],
      updated: this.props.navigation.state.params.updated,
      data: this.props.navigation.state.params.data,
      index: 0,
      image: '',
      isReady: false,
      imagesURLarray: [],

      routes: [
        { key: 'first', title: 'Vision Board' },
        { key: 'second', title: 'Affirm' },
      ],
    }  
  }

  componentDidMount() {
    this.fetchData()
    this.fetchVision()
    this.registerForPushNotificationsAsync()
    getToken()
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
    return fetch(`https://prana-app.herokuapp.com/v1/users/${this.state.accessToken}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          expo_push_token: this.state.expo_push_token
        },
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
  }

  imagesArray() {
    (this.state.visions).filter(vision => {
      this.setState({ imagesURLarray: vision.image_url })
    })
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      this.state.imagesURLarray
    ]);
    try {
      await Promise.all([...imageAssets]);
    } catch(error) {
      console.log(error)
    }
  }


  _renderVision = ({item}) => (
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
  );

  _renderData = ({item, index}) => (
    <View style={{margin: 10}}>
        <LinearGradient
          colors={['#F27F64', '#D74F67']}
          style={{borderRadius: 3, padding: 20}}
          start={[1.5, 0.9]}
          end={[0.5, 0.9]}
        >
      <View style={styles.mantraCard} key={item.id}>

        <Text style={styles.title}>{item.title}</Text>
        <ViewMoreText
          numberOfLines={2}
          renderViewMore={this.renderViewMore}
          renderViewLess={this.renderViewLess}
        >
          <Text style={styles.description}>{item.description}</Text>
        </ViewMoreText>
        
      </View>
      </LinearGradient>

      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0}
        style={styles.buttonTouchable} 
        onPress={() => this.redirect('EditMantra', item.id, item.title, item.description)}
      >
        <View style={{flexDirection: 'row'}}>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
        </View>
      </TouchableHighlight>
      </View>
  );

  renderViewMore(onPress){
    return(
      <Text style={{paddingTop: 10,color: 'white', textDecorationLine: 'underline'}} onPress={onPress}>View more</Text>
    )
  }

  renderViewLess(onPress){
    return(
      <Text style={{paddingTop: 10,color: 'white', textDecorationLine: 'underline'}} onPress={onPress}>View less</Text>
    )
  }

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



  render() {
    console.log(this.state)
    return (
      <DrawerComponent {...this.props}>
      <TabView
        renderTabBar={props =>
          <TabBar
            labelStyle={{color: 'black'}}
            bounces
            {...props}
            indicatorStyle={{ backgroundColor: 'black' }}
            style={styles.tabStyle}
            renderLabel={SceneMap({
              'first': () => <Text>Vision board</Text>,
              'second': () => <Text>Affirm</Text>
            })
            }
          />
        }
        navigationState={this.state}
        renderScene={SceneMap({
          'first': () => <ScrollView style={styles.scrollView}>
          {this.state.visions.length > 0 ?
          <FlatList
            keyExtractor={(item, index) => index}
            numColumns={2}
            data={this.state.visions}
            renderItem={this._renderVision}
        />
        :
          <Text style={{marginTop: '10%', padding: '10%', fontSize: 20, fontWeight: '300', textAlign: 'center'}}>Use this blank canvas to manifest all of your desires 🤩</Text>
          }
        </ScrollView>,
          'second': () =>   <ScrollView style={styles.scrollView}>
          <View style={styles.innerScroll}>
            {
              this.state.mantras.length > 0 ?
              <FlatList
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              data={this.state.mantras}
              renderItem={this._renderData}
              />
              :
              <Text style={{marginTop: '10%', padding: '10%', fontSize: 20, fontWeight: '300', textAlign: 'center'}}>Use this blank canvas to affirm your best life 👑</Text>
            }
          </View>
        </ScrollView>,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
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
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    backgroundColor: 'transparent',
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  scene: {
    flex: 1,
  },
  tabStyle: {
    backgroundColor: 'white'
  },
  mantraCard: {
    height: 'auto',
    position: 'relative',
    width: '100%'
  }, 
  scrollView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 10
  },
  innerScroll: {     
    marginBottom: 200
  },
  title: {
    fontSize: 20,
    color: 'white',
    paddingBottom: 10
  },
  description: {
    fontSize: 18,
    color: 'white',
    fontWeight: "300"
  },
  view: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 20,
  },
  buttonTouchable: {
    position: 'absolute', 
    top: 5, 
    right: 0,
    paddingRight: 10,
    paddingTop: 5
  },
  circle: {
    height: 4, 
    width: 4, 
    borderRadius: 2, 
    backgroundColor: 'white', 
    margin: 2
  }
})

export default Home