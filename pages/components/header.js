import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  TouchableHighlight } from 'react-native';
  

var {height, width} = Dimensions.get('window')

class Header extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: ''
    }
  }



  render() {
    return (
      <View  style={styles.container} >
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0}
          onPress={this.props.leftTitleAction}
          style={styles.actionButton}
        >
          <Text>{this.props.leftTitle}</Text>
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0}
          onPress={this.props.rightTitleAction}
          style={styles.actionButton}
        >
          <Text>{this.props.rightTitle}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    height: 100,
    
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
    paddingBottom: 10,
   },

})

export default Header