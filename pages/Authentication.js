import React from 'react';
import { 
  StyleSheet,
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
    }
  }


  render() {
    return (
      <View style={styles.OuterContainer}>
        <LoginForm
          {...this.props}
        />

        <RegisterForm 
          {...this.props}
        />


      </View>
    
    )
  }
}

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  }
});


export default Authentication