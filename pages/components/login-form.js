import React from 'react';
import { Text, TextInput, View, TouchableHighlight, AsyncStorage } from 'react-native';

class LoginForm extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    }
    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
    this.storeToken = this.storeToken.bind(this)
    this.login = this.onLoginPressed.bind(this)
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

  redirect(accessToken, email) {
    this.props.navigation.navigate(
      'Home',
      { accessToken: accessToken, 
        email: email,
        onLogout: () => this.clearData()
      }
    )
  }

  
  componentWillMount() {
    this.check()
  }
  
  
  componentDidUpdate() {
    this.state.persistedToken && this.redirect(this.state.persistedToken, this.state.persistedEmail)
  }
  
  clearData() {
    console.log('clear data1')
    AsyncStorage.clear()
    this.setState({ persistedToken: '', persistedEmail: ''})
  }
  
  
    async storeToken(accessToken) {
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken)
        this.getToken()
        this.setState({accessToken: accessToken})
        this.persistData(this.state.accessToken)
      } catch(error) {
        console.log('something went wronsdfg:')
      }
    }
  
    async getToken() {
      try {
        let token = await AsyncStorage.getItem(ACCESS_TOKEN)
      } catch(error) {
        console.log('something went wrong:')
      }
    }
  
    async removeToken() {
      try {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        this.getToken()
      } catch(error) {
        this.setState({error})
        console.log('something went wrong:', error)
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
      let res = await response._bodyText;
      if (response.status >= 200 && response.status < 300) {
        let accessToken = JSON.parse(res).data.user.authentication_token
        this.storeToken(this.state.accessToken)
        this.redirect(accessToken, this.state.email)
      } else {
        let error =  res
        throw error
      } 
    } catch(error) {
      this.removeToken()
    }
  }

  render() {
    return (
      <View>
        <Text>LOGIN</Text>
        <TextInput 
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
        />
        <TextInput 
          onChangeText={(val) => this.setState({ password: val})}
          placeholder="Password"
          secureTextEntry
        />
          {this.state.error ? <Text>Your username of password appears to be wrong, please try again</Text> : null }

        <TouchableHighlight underlayColor="transparent" activeOpacity={0} onPress={this.login}>
          <Text>Login</Text>
        </TouchableHighlight>

      </View>
    
    )
  }
}


export default LoginForm