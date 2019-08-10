import React from 'react';
import { StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import Header from './components/header'
 
var {width} = Dimensions.get('window')


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
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
   },
   headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    marginBottom: 20,
  },
})

export default ShowMantra
