import React from 'react';
import { Text, TextInput, View, Image, TouchableHighlight, AsyncStorage, StyleSheet } from 'react-native';
import { Font } from 'expo';

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
            email: (this.state.email).toLowerCase(),
            password: this.state.password
        })
      })
      let res = await response._bodyText;
      if (response.status >= 200 && response.status < 300) {
        this.storeToken(JSON.parse(res).data.user.authentication_token)
        this.redirect(JSON.parse(res).data.user.authentication_token, this.state.email)
      } else {
        let error =  res
        this.setState({error: error})
        this.setState({ error: 'Please try again' })
        throw error
      } 
    } catch(error) {
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
          placeholderTextColor="black"
          onChangeText={(val) => this.setState({ email: val})}
          autoCapitalize = 'none'
        />
        <TextInput 
          onChangeText={(val) => this.setState({ password: val})}
          placeholder="Password"
          placeholderTextColor="black"
          style={styles.textInput}
          secureTextEntry
          autoCapitalize = 'none'
        />
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0.5}
          onPress={this.login}
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
        <Text style={styles.underline}>Register</Text>
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
    alignItems: 'center'
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
    bottom: 0,
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'black',
    marginBottom: '10%'
  },
  image: {width: 30, height: 10}
});


export default LoginForm