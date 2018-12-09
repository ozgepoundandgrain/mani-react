import React from 'react';
import arrow from './images/arrow.png'
import * as Animatable from 'react-native-animatable'
import {
    StyleSheet, 
    Text,
    View,
    TouchableHighlight,
    AsyncStorage,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    PanResponder,
    Animated,
    Switch } from 'react-native';
import { LinearGradient } from 'expo'

const ACCESS_TOKEN = 'authentication_token';


class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: this.props.navigation.state.params.accessToken,
      posts: [],
      email: this.props.navigation.state.params.email,
      animation: null
    }
    this.deleteShit = this.deleteShit.bind(this)
  }

  componentWillMount() {
    this.getToken();
  }

  componentDidMount(){
    this.getToken();
    this.fetchData()
    this.setState({ email: this.props.navigation.state.params.email })
  }

  componentWillUpdate() {
    // this.fetchData();
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
      let response = await fetch('http://localhost:3000/v1/users'+access_token,{
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

  fetchData(){
    fetch('http://localhost:3000/v1/posts', {
      method: 'GET',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    }).then(response => 
      this.setState({posts: JSON.parse(response._bodyText).data})
    )
  }

  deleteShit(id) {
    fetch('http://localhost:3000/v1/posts/'+id, {
      method: 'DELETE',
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
    return(
      <View style={{backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center'}}>
     
      {/* <View style={styles.container}>
        <Text style={{color: 'black', textAlign: 'center'}}>
          Your life is the physical manfestation of the thoughts in your head. Make them worthy.
        </Text>
      </View>
      <View style={styles.label}><Text style={{ alignSelf: 'center', marginTop: 15}}>{this.state.posts.length} ongoing manfestations</Text></View> */}

        {/* {flashMessage} */}
        {/* <Text> Welcome User </Text>
        <Text> Your new token is {this.state.accessToken} </Text> */}
   
          <View style={{alignSelf: "center", marginTop: 50, paddingBottom: 15}}>
            <Switch onValueChange={() => {}}/>
          </View>
           <View style={styles.logout}>
            <TouchableHighlight onPress={this.onLogout.bind(this)} underlayColor="transparent" activeOpacity={0}>
              <Text>Logout</Text>
            </TouchableHighlight> 
          </View>


      <ScrollView>
         {/* 

        {/* <ActivityIndicatorIOS animating={this.state.showProgress} size="large" style={styles.loader} /> */}
        
        { (this.state.posts).map(mant => {
             return (
              <View style={styles.viewBox} key={mant.id}>
                <View style={{flex: 1}}>
                  <Text style={styles.title}>{mant.title}</Text>
                  <Text style={styles.description}>{mant.description}</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingTop: 10, position: 'absolute', top: 0, right: 0}}>
                <View onPress={() => {}}>
                  <View style={styles.dot}/>
                  <View style={styles.dot}/>
                  <View style={styles.dot}/>
                </View>
                </View>
                <TouchableHighlight onPress={() => this.deleteShit(mant.id)}><Text>DEETE</Text></TouchableHighlight>
              </View>
             )
          })
        }
      </ScrollView>


{
//   this.state.posts.length === 0 ? 
//   <View>
//   <Animatable.View animation="slideInDown" iterationCount="infinite" direction="alternate" style={styles.pointer}>
//   <Text style={{color: '#D8D8D8', fontSize: 25}}>Get Started</Text>
//   <Image source={require('./images/arrow.png')} style={{alignSelf: 'center', marginTop: 15}}/>
// </Animatable.View>
//   <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
//     <TouchableHighlight 
//     onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })} 
//     style={styles.imageStyle}
//     underlayColor="transparent" activeOpacity={0}
//     >
//     <LinearGradient colors={['#08DAF6', '#523CB8']} style={{borderRadius: 50, height: 70, width: 70}}>
//       <Image source={require('./images/plus.png')} style={{alignSelf: 'center', marginTop: 15}}/>
//       </LinearGradient>
//     </TouchableHighlight>
//   </Animatable.View>
//   </View>
//   :
  <TouchableHighlight 
    onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })} 
    style={styles.imageStyle}
    underlayColor="transparent" activeOpacity={0}
  >
    <LinearGradient colors={['#08DAF6', '#523CB8']} style={{borderRadius: 50, height: 70, width: 70}}>
    <Image source={require('./images/plus.png')} style={{alignSelf: 'center', marginTop: 15}}/>
    </LinearGradient>
  </TouchableHighlight>

}
      </View>
    );
  }
}

const Metrics = {
  containerWidth: 100 - 30,
  switchWidth: 30
}
const styles = StyleSheet.create({
  cont: {
    width: 300,
    height: 55,
    flexDirection: 'row',
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 27.5
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150
  },
  label: {
    width: 200, 
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10, 
    marginTop: -30, 
    alignSelf: 'center', 
     shadowOffset:{  width: 5,  height: 5,  },
     shadowColor: 'grey', shadowOpacity: 0.5
  },
  buttonStyle: {
    flex: 1,
    width: 100 / 3,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputStyle: {
    color: '#5631B3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#5631B3',
    width: '80%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '80%',
    height: 60,
    display: 'flex',
    alignSelf: 'center'
  },
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
  dot: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: '#5631B3',
    margin: 3
  },
  pointer: {
    alignSelf: 'center', 
    marginBottom: 140, 
    position: 'absolute', 
    bottom: 0, 
  },
  imageStyle: {
    alignSelf: 'center', 
    margin: 40, 
    position: 'absolute', 
    bottom: 0, 
  },
  logout: {
    alignSelf: 'center', 
    marginTop: 60, 
    paddingRight: 25,
    position: 'absolute', 
    top: 0, 
    right: 0
  }
});

export default Home
