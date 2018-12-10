import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo'


const ACCESS_TOKEN = 'authentication_token'
class Login extends React.Component {

  constructor() {
    super();
    this.state = {
        email: '',
        password: '',
        error: '',
        accessToken: '',
        loggedOut: false
    }
    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
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

componentDidUpdate() {
  this.state.persistedToken && this.redirect(this.state.persistedToken, this.state.persistedEmail)
}

clearData() {
  AsyncStorage.clear()
  this.setState({ persistedToken: '', persistedEmail: ''})
}


  async storeToken(accessToken) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken)
      this.getToken()
      this.setState({accessToken: accessToken})
      this.persistData(accessToken)
    } catch(error) {
      console.log('something went wronsdfg:')
    }
  }

  async getToken() {
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN)
      console.log('token is:', token)
    } catch(error) {
      console.log('something went wrong:')
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN)
      this.getToken()
    } catch(error) {
      console.log('something went wrong:')
    }
  }

  async onLoginPressed() {
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/sessions/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
      })
      console.log(await response)
      let res = await response._bodyText;
      if (response.status >= 200 && response.status < 300) {
        let accessToken = JSON.parse(res).data.user.authentication_token
        this.storeToken(accessToken)
        this.redirect(accessToken, this.state.email)
      } else {
        let error =  res
        throw error
        console.log('YOOOOO ERROR')
      } 
    } catch(error) {
    this.removeToken()
      console.log('yooohelo', res)
    }
  }
  render() {
    return (
      <LinearGradient colors={['#523CB8', '#08DAF6']} style={styles.container}>
       <Image source={require('./images/logo.png')} style={{marginBottom: '10%'}}/>
       <Text style={{fontWeight: '200', color: 'white', marginBottom: '10%'}}>Login to start manifesting</Text>
      {/* <TouchableHighlight onPress={this.clearData}>
      <Text>CLEAR</Text>
      </TouchableHighlight>
        

              <TouchableHighlight onPress={this.persistData}>
      <Text>SAVE</Text>
      </TouchableHighlight>


      <Text>{this.state.persistedEmail}</Text>
      <Text>{this.state.persistedToken}</Text> */}

        <TextInput 
          placeholderTextColor="white"
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
          style={styles.inputStyle}
        />
        <TextInput 
          placeholderTextColor="white"
          onChangeText={(val) => this.setState({ password: val})}
          placeholder="Password"
          secureTextEntry
          style={styles.inputStyle}
        />

        <TouchableHighlight underlayColor="transparent" activeOpacity={0} onPress={this.onLoginPressed.bind(this)}>
          <Text style={styles.button}>Login</Text>
        </TouchableHighlight>


        {/* <Text>{this.state.error}</Text> */}

      <TouchableHighlight 
        onPress={() => {this.props.navigation.navigate('register')}}
        underlayColor="transparent" activeOpacity={0}
        style={styles.btn}
      >
        <Text>Don't have an account? Register</Text>
      </TouchableHighlight>
      </LinearGradient>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignSelf: 'center', 
    margin: 100, 
    position: 'absolute', 
    bottom: 0, 
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
});

export default Login