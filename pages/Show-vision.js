import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text, ScrollView, TouchableHighlight } from 'react-native';
import Header from './components/header'


var {height, width} = Dimensions.get('window')

class ShowVision extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: this.props.navigation.state.params.image_url,
      description: this.props.navigation.state.params.description,
      id: this.props.navigation.state.params.visionId,
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
        visionId: this.state.id,
        image_url: this.state.image,
        description: this.state.description
      }
    )
  }



  render() {
    return ([
      <Header
        leftTitle=""
        rightTitle="Edit"
        rightTitleAction={() => this.redirect('EditVision')}
      />,
      <ScrollView>
        <Image 
          source={{uri: this.state.image}} 
          style={{width: width, height: width}}
        />
        <Text>{this.state.description}</Text>
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

export default ShowVision
