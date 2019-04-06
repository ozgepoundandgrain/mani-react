import React from 'react';
import { Text, TextInput, View, TouchableHighlight, AsyncStorage} from 'react-native';

class RegisterForm extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      password_confirmation: ''
    }
    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
    this.storeToken = this.storeToken.bind(this)
    this.register = this.onRegisterPressed.bind(this)
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
    this.state.persistedToken 
    && 
    this.redirect(
      this.state.persistedToken, 
      this.state.persistedEmail
      )
  }
  
  clearData() {
    console.log('clear data2')
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
        console.log('ERROR STORE TOKEN')
      }
    }
  
    async getToken() {
      try {
        let token = await AsyncStorage.getItem(ACCESS_TOKEN)
      } catch(error) {
        console.log('GET TOKEN ERROR')
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
        this.storeToken(JSON.parse(res).data.user.authentication_token)
        this.redirect(JSON.parse(res).data.user.authentication_token, this.state.email)
      } else {
          let error = res;
          throw error;
      }
    } catch(errors) {
        this.removeToken()
      }
    }

  render() {
    console.log('state', this.state)
    return (
      <View>
          <TextInput 
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
        />
        <TextInput 
          placeholder="Confirm Password"
          onChangeText={(val) => this.setState({ password_confirmation: val})}
          secureTextEntry
        />

        <TouchableHighlight underlayColor="transparent" activeOpacity={0} onPress={this.register}>
          <Text>Register</Text>
        </TouchableHighlight>

      </View>
    
    )
  }
}

export default RegisterForm