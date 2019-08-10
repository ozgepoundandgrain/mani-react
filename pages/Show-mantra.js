import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import Header from './components/header'
 

class ShowMantra extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: this.props.navigation.state.params.title,
      description: this.props.navigation.state.params.description,
      mantraId: this.props.navigation.state.params.mantraId,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
    }
    
    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        mantraId: this.state.mantraId,
        title: this.state.title,
        description: this.state.description
      }
    )
  }



  render() {
    console.log('SHOW', this.props)
    return ([
      <Header
        key={1}
        leftTitle=""
        rightTitle="Edit"
        rightTitleAction={() => this.redirect('EditMantra')}
      />,
      <ScrollView key={2} style={{padding: 20}}>
          <Text style={{fontSize: 20, paddingBottom: 15}}>{this.state.title}</Text>
          <Text style={{fontSize: 16}}>{this.state.description}</Text>
      </ScrollView>
    ])
  }
}

const styles = StyleSheet.create({
})

export default ShowMantra
