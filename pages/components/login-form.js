import React from 'react';
import { Text, TextInput, View, TouchableHighlight, AsyncStorage, StyleSheet } from 'react-native';
import { Font } from 'expo';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fontLoaded: false,
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
    return ([
      <View style={styles.container} key={1}>
        {this.state.fontLoaded && <Text style={styles.title}>LOGIN</Text>}
        <TextInput 
          placeholder="Email"
          style={styles.textInput}
          placeholderTextColor="white"
          onChangeText={(val) => this.setState({ email: val})}
        />
        <TextInput 
          onChangeText={(val) => this.setState({ password: val})}
          placeholder="Password"
          placeholderTextColor="white"
          style={styles.textInput}
          secureTextEntry
        />
        <TouchableHighlight 
          underlayColor="white"
          activeOpacity={0.5}
          onPress={this.login}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        {this.state.error ? <Text style={styles.error}>Your username or password appears to be wrong, please try again</Text> : null }
      </View>,
      <TouchableHighlight
        key={2}
        underlayColor="transparent"
        activeOpacity={0}
        style={styles.redirectButton}
        onPress={this.props.onPressRedirect}
      >
        <Text style={styles.redirect}>Don't have an account? <Text style={styles.underline}>Register</Text></Text>
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
    textAlign: 'center',
    // fontFamily: 'Raleway-Thin',
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
    color: 'white',
    // fontFamily: 'Raleway-Thin',
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
    bottom: 0,
  },
  underline: {
    textDecorationLine: 'underline'
  }
});


export default LoginForm