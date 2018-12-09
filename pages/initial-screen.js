import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient, DangerZone } from 'expo'
import { ScrollView } from 'react-native-gesture-handler';
import ANIME from './animations/loading.json'

let { Lottie } = DangerZone;


class InitialScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      animation: null
    }
  }
  componentWillMount() {
    this._playAnimation();
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this.setState({ animation: ANIME }, this._playAnimation);
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };
  
  render() {
    console.log(this.state)
    return(
      <LinearGradient start={[0.1, 0.1]} colors={['#523CB8', '#08DAF6']} style={styles.container}>
        <Text style={{ color: 'white', fontSize: 25, fontWeight: '200', textAlign: 'center', padding: 20 }}>Your mind must arrive at the destination before your life does</Text>
        <View style={{ alignContent: 'center' }}>
        {this.state.animation &&
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: 50,
              height: 50,
            }}
            source={this.state.animation}
          />}
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputStyle: {
    color: '#5631B3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#FBFBFD',
    width: '80%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '80%',
    height: 60,
    display: 'flex',
    alignSelf: 'center'
  }
});

export default InitialScreen
