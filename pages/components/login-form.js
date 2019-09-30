import React from 'react';
import { 
  Text, 
  TextInput, 
  View, 
  TouchableHighlight, 
  AsyncStorage, 
  StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AnimateLoadingButton from 'react-native-animate-loading-button';


const ACCESS_TOKEN = 'authentication_token'

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fontLoaded: false,
      persistedEmail: '',
      persistedToken: '',
      error: ''
    }

    this.clearData = this.clearData.bind(this)
    this.persistData = this.persistData.bind(this)
    this.storeToken = this.storeToken.bind(this)
    this.login = this.onLoginPressed.bind(this)
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
    this.state.persistedToken && this.redirect(this.state.persistedToken, this.state.persistedEmail)
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
    this.loadingButton.showLoading(true);
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/sessions/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: (this.state.email).toLowerCase(),
            password: this.state.password
        })
      })
      let res = await response.json();
      if (response.status >= 200 && response.status < 300) {
        console.log('RES', res.data.user)
        this.storeToken(res.data.user.authentication_token)
        this.redirect(res.data.user.authentication_token, this.state.email, res.data.user.id)
        this.loadingButton.showLoading(false);
      } else {
        this.loadingButton.showLoading(false);
        let error =  res
        this.setState({ error: 'Please try again' })
        throw error
      } 
    } catch(error) {
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
        {this.state.fontLoaded && <Text style={styles.title}>Login</Text>}
        <TextInput 
          placeholder="Email"
          style={styles.textInput}
          placeholderTextColor="white"
          onChangeText={(val) => this.setState({ email: val})}
          autoCapitalize = 'none'
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          returnKeyType = { "next" }
        />
        <TextInput 
          onChangeText={(val) => this.setState({ password: val})}
          placeholder="Password"
          placeholderTextColor="white"
          style={styles.textInput}
          secureTextEntry
          autoCapitalize = 'none'
          onSubmitEditing={this.login}
          returnKeyType = { "next" }
          ref={(input) => { this.secondTextInput = input; }}
        />
        <View style={{height: 57}}/>

        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={200}
          height={50}
          title="Login"
          titleFontSize={16}
          titleColor="#FBCDCF"
          backgroundColor="white"
          borderRadius={25}
          onPress={this.login}
        />
      </View>,
      <View
        key={2}
        style={styles.redirectButton}
      >
        <AnimateLoadingButton
          width={240}
          height={30}
          title="Don't have an account?"
          titleFontSize={16}
          titleColor="#F39D00"
          backgroundColor="white"
          borderRadius={25}
          onPress={this.props.onPressRedirect}
        />
      </View>
    ])
  }
}

const styles = StyleSheet.create({
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
   fontFamily: 'Abril-Fatface',
  },
  textInput: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40
  },
  container: {
    width: '80%',
  },
  submitButton: {
    alignItems: 'center',
    width:'100%',
    height: 50,
    justifyContent: 'center',
    padding: 10,
  },
  error: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Raleway-Light',
    textAlign: 'center'
  },
  errorContainer: {
    height: '10%'
  },
  redirectButton: {
    position: 'absolute',
    bottom: 20,
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'white',
    marginBottom: '10%'
  },
  image: {width: 30, height: 10}
});


export default LoginForm