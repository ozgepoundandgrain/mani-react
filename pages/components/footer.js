import React from 'react';
import { Text, TouchableHighlight, StyleSheet, View, Image } from 'react-native';
import { Permissions, ImagePicker } from 'expo'

class Footer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }

    this.redirect = this.redirect.bind(this)
  }

  async componentDidMount(){
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (newPermission.status === 'granted') {
        console.log('just granted')
      }
  } else {
      console.log('GRANTED ALREADY')
  }
  }


  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.props.accessToken, 
        email: this.props.email,
        imageURI: this.state.image,
      }
    )
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.redirect('PostVision')
    }
  }

  render() {
    return (
      <View style={styles.FooterContainer}> 
        <TouchableHighlight 
            onPress={() => this.redirect('PostMantra')} 
            style={styles.addButton}
            underlayColor="white"
            activeOpacity={0}
          >
            <Image style={{height: 30, width: 30}} source={require('../images/feather-btn.png')}/>
          </TouchableHighlight>

        <TouchableHighlight 
          onPress={this._pickImage} 
          style={styles.addButton}
          underlayColor="white"
          activeOpacity={0}
        >
          <Image style={{ width: 29, height: 18}} source={require('../images/eye-btn.png')}/>
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
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 24,
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
     height: 90,
     marginBottom: 20,
   },
   image: {
     height: 30,
     width: 30
   }
})

export default Footer