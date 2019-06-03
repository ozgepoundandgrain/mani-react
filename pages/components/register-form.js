import React from 'react';
import { Text, View, TextInput, Image, TouchableHighlight, AsyncStorage, StyleSheet } from 'react-native';
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
      'Abril-Fatface': require('../../assets/fonts/AbrilFatface-Regular.ttf'),
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
                                  email: (this.state.email).toLowerCase(),
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
    console.log(this.state, this.props)
    return ([
      <View style={styles.container} key={1}>
        {this.state.fontLoaded && <Text style={styles.prana}>Prana.</Text>}
        <View style={styles.errorContainer}>
          {this.state.fontLoaded && <Text style={styles.error}>{this.state.error}</Text>}
        </View>
        {this.state.fontLoaded && <Text style={styles.title}>Register</Text>}
        <TextInput 
          placeholder="Email"
          onChangeText={(val) => this.setState({ email: val})}
          placeholderTextColor="black"
          style={styles.textInput}
          autoCapitalize = 'none'
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
          placeholderTextColor="black"
          style={styles.textInput}
          autoCapitalize = 'none'
        />
        <TextInput 
          placeholder="Confirm Password"
          onChangeText={(val) => this.setState({ password_confirmation: val})}
          secureTextEntry
          placeholderTextColor="black"
          style={styles.textInput}
          autoCapitalize = 'none'
        />
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0.5}
          onPress={this.register}
          style={styles.submitButton}
        >
          <Image style={styles.image} source={require('../images/Arrows-Right-icon.png')} />
        </TouchableHighlight>
      </View>,
      <TouchableHighlight
        key={2}
        underlayColor="transparent"
        activeOpacity={0}
        style={styles.redirectButton}
        onPress={this.props.onPressRedirect}
      >
        <Text style={styles.underline}>Login</Text>
      </TouchableHighlight>
    
    ])
  }
}

const styles = StyleSheet.create({
  prana: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface'
  },
  title: {
   fontSize: 30,
   color: 'black',
   textAlign: 'center',
   paddingBottom: '15%',
   fontFamily: 'Abril-Fatface'
  },
  textInput: {
    marginBottom: 40,
    color: 'black',
    alignItems: 'center',
    textAlign: 'center'
  },
  container: {
    width: '80%',
  },
  submitButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black'
  },
  error: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Raleway-Light',
    textAlign: 'center'
  },
  redirect: {
    marginTop: '50%',
    color: 'black',
    fontSize: 20
  },
  redirectButton: {
    position: 'absolute',
    bottom: 0
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'black',
    marginBottom: '10%'
  },
  image: {width: 30, height: 10},
  errorContainer: {
    height: '10%'
  }
});

export default RegisterForm