import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, TextInput, ScrollView, Image } from 'react-native';
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
    }
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
    }).then(response => this.setState({posts: JSON.parse(response._bodyText).data}))
  }

  render() {
    let flashMessage;
    if (this.props.flash) {
       flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
       flashMessage = null
    }
    console.log('selam', this.props)
    return(
      <View style={{backgroundColor: 'white', height: '100%', alignContent: 'center'}}>
      <ScrollView style={{height: '100%'}}>
      <LinearGradient colors={['#6C02A1', '#00EDFE']} style={styles.container}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Your life is the physical manfestation of the thoughts in your head. Make them worthy.
        </Text>
      </LinearGradient>
      <View style={styles.label}><Text style={{ alignSelf: 'center', marginTop: 15}}> ongoing manfestations</Text></View>
        {/* {flashMessage} */}
        {/* <Text> Welcome User </Text>
        <Text> Your new token is {this.state.accessToken} </Text> */}

        <TouchableHighlight onPress={this.onLogout.bind(this)}>
           <Text>
             Logout
           </Text>
          </TouchableHighlight> 
         {/* 

        {/* <ActivityIndicatorIOS animating={this.state.showProgress} size="large" style={styles.loader} /> */}
        
        {
           (this.state.posts).map(mant => {
             return (
              <View style={styles.viewBox} key={mant.id}>
                <View style={{flex: 1}}>
                  <Text style={styles.title}>{mant.title}</Text>
                  <Text style={styles.description}>{mant.mantra}</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingTop: 10, position: 'absolute', top: 0, right: 0}}>
                <View onPress={() => {}}>
                  <View style={styles.dot}/>
                  <View style={styles.dot}/>
                  <View style={styles.dot}/>
                </View>
                </View>
              </View>
             )
          })
        }
      </ScrollView>
      <TouchableHighlight onPress={() => this.props.navigation.navigate('post', { email: this.props.navigation.state.params.email })} >
        <Image source={require('./images/add-button.png')} style={styles.imageStyle}/>
      </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: '#5631B3',
    minHeight: 100,
    width: '90%',
    alignSelf: 'center',
    margin: 10
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
  imageStyle: {
    height: 70, 
    width: 70, 
    alignSelf: 'center', 
    margin: 40, 
    position: 'absolute', 
    bottom: 0, 
  }
});

export default Home
