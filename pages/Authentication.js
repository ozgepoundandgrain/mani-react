import React from 'react';
import { 
  StyleSheet,
  ImageBackground,
  View } from 'react-native';
import LoginForm from './components/login-form'
import RegisterForm from './components/register-form'

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      accessToken: '',
      showLogin: true
    }
    this.changeForm = this.changeForm.bind(this)
  }

  changeForm = () => {
    this.state.showLogin ?
    this.setState({ showLogin: false })
    :
    this.setState({ showLogin: true })
  }


  render() {
    return (
      <ImageBackground source={require('./images/eye.jpg')} style={{width: '100%', height: '100%'}}>
      <View style={styles.OuterContainer}>
      {this.state.showLogin ?
        <LoginForm
          {...this.props}
          onPressRedirect={this.changeForm}
        />
        :
        <RegisterForm 
          {...this.props}
          onPressRedirect={this.changeForm}
        />}
      </View>
      </ImageBackground>
    
    )
  }
}

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '30%'
  }
});


export default Authentication