import React from 'react';
import { 
  Text, 
  View, 
  TextInput,
  TouchableHighlight, 
  AsyncStorage, 
  StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AnimateLoadingButton from 'react-native-animate-loading-button';


const ACCESS_TOKEN = 'authentication_token'

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: '',
      error: '',
      focusedPasswordConfirm: false,
      focusedEmailInput: false,
      focusedPassword: false
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

  redirect(accessToken, email, id) {
    this.props.navigation.navigate(
      'Home',
      { accessToken: accessToken, 
        email: email,
        userId: id,
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
    this.setState({ persistedToken: '', persistedEmail: ''})
    AsyncStorage.clear()
    this.removeToken()
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
    this.loadingButton.showLoading(true);
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/users', {
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                user: {
                                  email: (this.state.email).toLowerCase(),
                                  password: this.state.password,
                                  password_confirmation: this.state.password_confirmation,
                                }
                              })
                            });
      let res = await response.json();
      if (response.status >= 200 && response.status < 300) {
        this.storeToken(res.data.user.authentication_token)
        this.redirect(res.data.user.authentication_token, this.state.email, res.data.user.id)
        this.loadingButton.showLoading(false);
      } else {
        this.loadingButton.showLoading(false);
          let error = res;
          this.setState({ error: 'Please try again' })
          throw error;
      }
    } catch(errors) {
        console.log('REGISTER', errors)
        this.loadingButton.showLoading(false);
        this.removeToken()
        this.setState({ error: 'Oops, try again' })
      }
    }

  render() {
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
          onFocus={() => this.setState({ focusedEmailInput: true})}
          onBlur={() => this.setState({ focusedEmailInput: false})}
          placeholderTextColor="white"
          style={this.state.focusedEmailInput ? styles.focused : styles.textInput}
          autoCapitalize = 'none'
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          returnKeyType = { "next" }
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(val) => this.setState({ password: val})}
          secureTextEntry
          onFocus={() => this.setState({ focusedPassword: true})}
          onBlur={() => this.setState({ focusedPassword: false})}
          placeholderTextColor="white"
          style={this.state.focusedPassword ? styles.focused : styles.textInput}
          autoCapitalize = 'none'
          onSubmitEditing={() => { this.thirdTextInput.focus(); }}
          returnKeyType = { "next" }
          ref={(input) => { this.secondTextInput = input; }}
        />
        <TextInput 
          placeholder="Confirm Password"
          onChangeText={(val) => this.setState({ password_confirmation: val})}
          secureTextEntry
          onFocus={() => this.setState({ focusedPasswordConfirm: true})}
          onBlur={() => this.setState({ focusedPasswordConfirm: false})}
          style={this.state.focusedPasswordConfirm ? styles.focused : styles.textInput}
          placeholderTextColor="white"
          autoCapitalize = 'none'
          onSubmitEditing={this.register}
          returnKeyType = { "next" }
          ref={(input) => { this.thirdTextInput = input; }}
        />

        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={200}
          height={50}
          title="Register"
          titleFontSize={16}
          titleColor="#020024"
          backgroundColor="#e8ee1c"
          borderRadius={25}
          onPress={this.register}
        />
      </View>,
      <View
        key={2}
        style={styles.redirectButton}
      >
        <AnimateLoadingButton
          width={240}
          height={30}
          title="Already have an account?"
          titleFontSize={16}
          titleColor="#e8ee1c"
          backgroundColor="transparent"
          borderRadius={25}
          onPress={this.props.onPressRedirect}
        />
      </View>
    
    ])
  }
}

const styles = StyleSheet.create({
  focused: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
    color: 'white'
  },
  prana: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Abril-Fatface'
  },
  title: {
   fontSize: 30,
   color: 'white',
   textAlign: 'center',
   paddingBottom: '15%',
   fontFamily: 'Abril-Fatface'
  },
  textInput: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  container: {
    width: '80%',
  },
  submitButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    height: 50
  },
  buttonText: {
    color: 'white'
  },
  error: {
    color: 'red',
    fontSize: 15,
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
    bottom: 20
  },
  image: {width: 30, height: 10},
  errorContainer: {
    height: '10%'
  }
});

export default RegisterForm