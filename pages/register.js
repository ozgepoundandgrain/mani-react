import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo'

const ACCESS_TOKEN = 'authentication_token'

class Register extends React.Component {


  constructor(){
    super();

    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      errors: [],
      thing: {},
      accessToken: '',
      loggedOut: false
    }
    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
  }

  componentDidUpdate() {
    this.state.persistedToken && this.redirect(this.state.persistedToken, this.state.persistedEmail)
  }

  persistData(TOKEN) {
    let email = this.state.email
    let accessToken = this.state.accessToken
    AsyncStorage.setItem('email', email)
    AsyncStorage.setItem('accessToken', accessToken)
    this.setState({
      persistedEmail: email,
      persistedToken: TOKEN
    })
  }
  
  check() {
    AsyncStorage.getItem('email').then((email) => {
      this.setState({ persistedEmail: email})
    })
  
    AsyncStorage.getItem('accessToken').then((accessToken) => {
      this.setState({ persistedToken: accessToken})
    })
  }
  
  componentWillMount() {
    this.check()
  }

    redirect(accessToken, email) {
    this.props.navigation.navigate(
      'home',
      { accessToken: accessToken, 
        email: email,
        onLogout: () => this.clearData()
      }
    )
  }

  componentDidMount() {

  }

  clearData() {
    AsyncStorage.clear()
    this.setState({ persistedToken: '', persistedEmail: ''})
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN)
    } catch(error) {
      console.log('something went wrong:')
    }
  }



  async storeToken(accessToken) {
    try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
        this.setState({accessToken: accessToken})
        this.persistData(accessToken)
        console.log("Token was stored successfull ", accessToken);
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  async onRegisterPressed() {
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/users', {
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                user:{
                                  email: this.state.email,
                                  password: this.state.password,
                                  password_confirmation: this.state.password_confirmation,
                                }
                              })
                            });
      let res = await response._bodyText;
      if (response.status >= 200 && response.status < 300) {
          this.storeToken(JSON.parse(res).data.user.authentication_token);
          this.redirect(JSON.parse(res).data.user.authentication_token, this.state.email);
      } else {
          let error = res;
          throw error;
      }
    } catch(errors) {
        this.removeToken()
      }
    // this.setState({errors: errorsArray})
    }
  
  render() {
    return (
      <LinearGradient colors={['#523CB8', '#08DAF6']} style={styles.container}>
       <Image source={require('./images/logo.png')} style={{marginBottom: '10%'}}/>
       <Text style={{fontWeight: '200', color: 'white', marginBottom: '10%'}}>Create your profile now to start manifesting</Text>
        <TextInput 
          placeholderTextColor="white"
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
          style={styles.inputStyle}
        />
        <TextInput 
          placeholderTextColor="white"
          placeholder="Password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
          style={styles.inputStyle}
        />
        <TextInput 
          placeholderTextColor="white"
          placeholder="Confirm Password"
          onChangeText={(val) => this.setState({ password_confirmation: val})}
          secureTextEntry
          style={styles.inputStyle}
        />

        <TouchableHighlight underlayColor="transparent" activeOpacity={0} onPress={this.onRegisterPressed.bind(this)}>
          <Text style={styles.button}>Register</Text>
        </TouchableHighlight>
        {/* <Errors errors={this.state.errors} /> */}

      <TouchableHighlight 
        onPress={() => {this.props.navigation.navigate('login')}}
        underlayColor="transparent" activeOpacity={0}
        style={styles.btn}
      >
        <Text>Already have an account? Login</Text>
      </TouchableHighlight>
      </LinearGradient>
    );
  }
}


const Errors = (props) => {
  return (
  <View style={{margin: 100}}>
    {props.errors.map((error, i) => <Text key={i}>{error}</Text>)}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008976',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    color: 'white',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    width: '80%',
    margin: 30,
    fontSize: 15
  },
  button: {
    paddingTop: 50,
    fontSize: 20,
    color: 'white'
  },
  btn: {
    alignSelf: 'center', 
    margin: 100, 
    position: 'absolute', 
    bottom: 0, 
  }
});

export default Register