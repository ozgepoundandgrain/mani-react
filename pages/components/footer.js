import React from 'react';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

class Footer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }

    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.props.accessToken, 
        email: this.props.email
      }
    )
  }

  render() {
    return (
      <View style={styles.FooterContainer}> 
        <TouchableHighlight onPress={() => this.redirect('PostMantra')} style={styles.addButton}>
          <Text>mantra</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.redirect('PostVision')} style={styles.addButton}>
          <Text>vision</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
   addButton: {
    width: 80,
    height: 80,
    borderRadius: 80/2,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 60,
    zIndex: 2,
   },
   FooterContainer: {
     width: '100%',
     position: 'absolute',
     bottom: 0,
     right: 0,
     left: 0,
     flexDirection:'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   }
})

export default Footer