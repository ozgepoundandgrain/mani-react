import React from 'react';
import { 
  StyleSheet,
  ScrollView } from 'react-native';
import LoginForm from './components/login-form'
import RegisterForm from './components/register-form'
import LoadingModal from './components/loading-modal';
import { LinearGradient } from 'expo-linear-gradient';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
      loadApp: false
    }
    this.changeForm = this.changeForm.bind(this)
  }

  changeForm = () => {
    this.state.showLogin ?
    this.setState({ showLogin: false })
    :
    this.setState({ showLogin: true })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loadApp: true })
    }, 4000)
  }


  render() {
    return ([
      
    <LinearGradient key={2} colors={['#B8BCF1', '#FBCDCF', '#FDE8C3']} style={{height: '100%'}}>
      <ScrollView key={1} contentContainerStyle={styles.OuterContainer} key="0">
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
        </LinearGradient>
      ,
      <LoadingModal 
        key={3}
        visible={!this.state.loadApp}
      />

      ])
  }
}

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
    backgroundColor: 'transparent'
  }
});


export default Authentication