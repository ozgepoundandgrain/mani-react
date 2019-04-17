import React from 'react';
import { StyleSheet, Image, Dimensions, Text, ScrollView } from 'react-native';
import ConfirmationModal from './components/confirmation-modal';

var {height, width} = Dimensions.get('window')

class ShowVision extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }

  }

  render() {
    return (
      <ScrollView>
        <Image 
          source={{uri: this.props.navigation.state.params.image_url}} 
          style={{width: width, height: width}}
        />
        <Text>
          {this.props.navigation.state.params.description}
        </Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
})

export default ShowVision