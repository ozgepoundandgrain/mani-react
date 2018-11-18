import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage } from 'react-native';

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
  // !!this.props.navigation.state.params.loggedOut ? this.setState({ loggedOut: true }) : undefined
  // !!this.state.loggedOut ? this.clearData() : undefined
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
      let response = await fetch('http://localhost:3000/v1/sessions/', {
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
        // this.setState({error: ''})
        let accessToken = JSON.parse(res).data.user.authentication_token
        this.storeToken(accessToken)
        this.redirect(accessToken, this.state.email)
        console.log('access token:', accessToken)
      } else {
        let error =  res
        throw error
        console.log('YOOOOO ERROR')
      } 
    } catch(error) {
    this.removeToken()
    //   this.setState({error: error})
      console.log('yooohelo', res)
    }
  }
  render() {
    console.log('LOGIN', this.props)
    return (
      <View style={styles.container}>
      <TouchableHighlight onPress={this.clearData}>
      <Text>CLEAR</Text>
      </TouchableHighlight>
        

              <TouchableHighlight onPress={this.persistData}>
      <Text>SAVE</Text>
      </TouchableHighlight>


      <Text>{this.state.persistedEmail}</Text>
      <Text>{this.state.persistedToken}</Text>
        <TextInput 
          placeholder="email"
          onChangeText={(val) => this.setState({ email: val})}
        />
        <TextInput 
          placeholder="password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
        />
        <TouchableHighlight 
          underlayColor="transparent" activeOpacity={0} 
          onPress={this.onLoginPressed.bind(this)}
          // onPress={() => this.redirect(accessToken)}
        >
          <Text>Login</Text>
        </TouchableHighlight>
        {/* <Text>{this.state.error}</Text> */}

      <TouchableHighlight 
        onPress={() => {this.props.navigation.navigate('register')}}
        underlayColor="transparent" activeOpacity={0}
      >
        <Text>Don't have an account? Register</Text>
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
  },
});

export default Login