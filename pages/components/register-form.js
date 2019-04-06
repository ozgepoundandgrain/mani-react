import React from 'react';
import { Text, TextInput, View, TouchableHighlight, AsyncStorage, StyleSheet } from 'react-native';
import { Font } from 'expo';

const ACCESS_TOKEN = 'authentication_token'

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: '',
      error: ''
    }

    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
    this.storeToken = this.storeToken.bind(this)
    this.register = this.onRegisterPressed.bind(this)
  }

  async componentDidMount() {
    try  {
      await Font.loadAsync({
      'Raleway-Thin': require('../../assets/fonts/Raleway-Thin.ttf'),
      'Raleway-Light': require('../../assets/fonts/Raleway-Light.ttf'),
    });
    this.setState({ fontLoaded: true });
    } catch {
      console.log('could not load font')
    }
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
          this.setState({ error: 'Please try again' })
          throw error;
      }
    } catch(errors) {
        this.removeToken()
        this.setState({ error: 'Oops, try again' })
      }
    }

  render() {
    console.log('state', this.state)
    return ([
      <View style={styles.container} key={1}>
        <Text style={styles.title}>REGISTER</Text>
        <TextInput 
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
          placeholderTextColor="white"
          style={styles.textInput}
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
          placeholderTextColor="white"
          style={styles.textInput}
        />
        <TextInput 
          placeholder="Confirm Password"
          onChangeText={(val) => this.setState({ password_confirmation: val})}
          secureTextEntry
          placeholderTextColor="white"
          style={styles.textInput}
        />
        <TouchableHighlight 
          underlayColor="white"
          activeOpacity={0.5}
          onPress={this.register}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>
        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null }
      </View>,
      <TouchableHighlight
        key={2}
        underlayColor="white"
        activeOpacity={0.5}
        style={styles.redirectButton}
        onPress={this.props.onPressRedirect}
      >
        <Text style={styles.redirect}>Already have an account? <Text style={styles.underline}>Login</Text></Text>
      </TouchableHighlight>
    
    ])
  }
}

const styles = StyleSheet.create({
  title: {
   fontSize: 50,
   color: 'white',
   textAlign: 'center',
   paddingBottom: '40%',
   fontFamily: 'Raleway-Thin',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: 'white',
    marginBottom: '20%',
    color: 'white',
    alignItems: 'center',
    textAlign: 'center'
  },
  container: {
    width: '80%',
  },
  submitButton: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white'
  },
  error: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Raleway-Light',
    textAlign: 'center'
  },
  redirect: {
    marginTop: '50%',
    color: 'white',
    fontSize: 20
  },
  redirectButton: {
    position: 'absolute',
    bottom: 0
  },
  underline: {
    textDecorationLine: 'underline'
  }
});

export default RegisterForm