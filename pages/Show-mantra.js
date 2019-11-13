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
    return ([
      <Header
        key={1}
        leftTitle=""
        rightTitle="Edit"
        rightTitleAction={() => this.redirect('EditMantra')}
        leftTitleAction={() => {}}
        showCTA
      />,
      <ScrollView key={2} style={styles.scrollview}>
          <Text style={{fontSize: 30, paddingBottom: 15}}>{this.state.title}</Text>
          <Text style={{fontSize: 20, fontWeight: '300'}}>{this.state.description}</Text>
      </ScrollView>
    ])
  }
}

const styles = StyleSheet.create({
  scrollview: {padding: 20, paddingTop: 15, backgroundColor: 'white'}
})

export default ShowMantra
