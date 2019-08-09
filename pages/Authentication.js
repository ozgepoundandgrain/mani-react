import React from 'react';
import { 
  StyleSheet,
  ImageBackground,
  ScrollView } from 'react-native';
import LoginForm from './components/login-form'
import RegisterForm from './components/register-form'
import LoadingModal from './components/loading-modal';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      accessToken: '',
      showLogin: true,
      animationModalVisible: true
    }
    this.changeForm = this.changeForm.bind(this)
  }

  componentDidMount() {
    this.timer = setInterval(
        () => this.setState({ animationModalVisible: false }),
        3000,
    );
}

componentWillUnmount() {
    clearInterval(this.timer);
}

  changeForm = () => {
    this.state.showLogin ?
    this.setState({ showLogin: false })
    :
    this.setState({ showLogin: true })
  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.OuterContainer} key="0">
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
      </ScrollView>
    
    )
  }
}

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%'
  }
});


export default Authentication