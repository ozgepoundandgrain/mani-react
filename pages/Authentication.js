import React from 'react';
import { 
  StyleSheet,
  ScrollView } from 'react-native';
import LoginForm from './components/login-form'
import RegisterForm from './components/register-form'
import LoadingModal from './components/loading-modal';


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
      </ScrollView>,
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%'
  }
});


export default Authentication