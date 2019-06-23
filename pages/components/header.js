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
        <View style={styles.CTAcontainer}>
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0}
          onPress={this.props.rightTitleAction}
          style={styles.CTAbutton}
        >
          <Text style={styles.CTAtext}>{this.props.rightTitle}</Text>
        </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    height: (width === 320) ? 60 : 100,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
    paddingBottom: 10,
   },
   CTAbutton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
    marginBottom: 5,
    padding: 5,
    borderRadius: 6,
     backgroundColor: '#F25252',
     height: 'auto',
     width: 60
   },
   CTAcontainer: {
    height: 100, 
    justifyContent: 'flex-end'
   },
   CTAtext: {
     color: 'white'
   }

})

export default Header