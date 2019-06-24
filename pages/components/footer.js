import React from 'react';
import { Animated, Easing, TouchableHighlight, Text, StyleSheet, View, Image } from 'react-native';
import { Permissions, ImagePicker } from 'expo'

class Footer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0), 
      rotateAnim: new Animated.Value(0), 
    }

    this.redirect = this.redirect.bind(this)
    this.showOptions = this.showOptions.bind(this)
    this.rotate = this.rotate.bind(this)
    this.animate = this.animate.bind(this)
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

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
  }

  showOptions() {
    Animated.timing(                  
      this.state.fadeAnim,            
      {
        toValue: this.state.fadeAnim._value === 0 ? 1 : 0,
        duration: 300,
      }
    ).start();
  }

  rotate() {
    Animated.timing(this.animatedValue, {
      toValue: this.animatedValue._value === 0 ? 1 : 0,
      duration: 300,
      easing: Easing.linear
    }).start()
  }

  animate() {
    this.rotate()
    this.showOptions()
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

    const interpolateRotation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    })
    const animatedStyle = {
      transform: [
        { rotate: interpolateRotation }
      ]
    }


    return (
      <View style={styles.FooterContainer}> 

        <View style={{flexDirection:'column'}}>

          <Animated.View style={{
            opacity: this.state.fadeAnim,
          }}
          >
            <View>
            <TouchableHighlight 
                onPress={() => this.redirect('PostMantra')} 
                style={styles.addButton}
                underlayColor="white"
                activeOpacity={0}
              >
                <Image style={{height: 20, width: 20}} source={require('../images/affirm.png')}/>
              </TouchableHighlight>
            </View>

        <View>
              <TouchableHighlight 
              onPress={this._pickImage} 
              style={styles.addButton}
              underlayColor="white"
              activeOpacity={0}
            >

              <Image style={{ width: 40, height: 40}} source={require('../images/eye.png')}/>
            </TouchableHighlight>
        </View>

          </Animated.View>

          <Animated.View style={[animatedStyle]}>
            <TouchableHighlight 
              onPress={() => this.animate()} 
              style={styles.addButtonMain}
              underlayColor="white"
              activeOpacity={0}
            >
              <Image style={{height: 20, width: 20}} source={require('../images/cross.png')}/>
            </TouchableHighlight>
          </Animated.View>

        </View>
       </View>

    )
  }
}

const styles = StyleSheet.create({
   addButton: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 2,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 24,
    margin: 10,
   },
   addButtonMain: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 24,
    margin: 10,
   },
   FooterContainer: {
     position: 'absolute',
     bottom: 0,
     right: 0,
     flexDirection:'column',
     justifyContent: 'center',
     alignItems: 'center',
     alignContent: 'center',
     marginBottom: 10,
     marginRight: 10
   },
   image: {
     height: 30,
     width: 30
   }
})

export default Footer