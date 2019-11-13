import React from 'react';
import { 
  View,
  StyleSheet, 
  Dimensions } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';


var { width } = Dimensions.get('window')

class Header extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    return (
      <View  style={styles.container}>

        <View style={styles.actionButton}>
          <AnimateLoadingButton
            width={70}
            height={25}
            title={this.props.leftTitle}
            titleFontSize={16}
            titleColor="rgb(29,18,121)"
            backgroundColor="transparent"
            borderRadius={4}
            onPress={this.props.leftTitleAction}
          />
        </View>


        <View style={styles.CTAbutton}>
          <AnimateLoadingButton
            width={70}
            height={25}
            title={this.props.rightTitle}
            titleFontSize={16}
            titleColor="rgb(255,255,255)"
            backgroundColor='#020024'
            borderRadius={4}
            onPress={this.props.rightTitleAction}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: 'white'
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 10
   },
   CTAbutton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 10
   }
})

export default Header