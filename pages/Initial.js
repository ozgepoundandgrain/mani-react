import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DangerZone } from 'expo'
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
    return(
      <View style={styles.container}>
        <Text style={styles.text}>
          Your mind must arrive at the destination before your life does
        </Text>
        <View style={{ alignContent: 'center' }}>
        {this.state.animation &&
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: 150,
              height: 150,
            }}
            source={this.state.animation}
          />}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  text: {
    color: 'white', 
    fontSize: 25, 
    fontWeight: '200', 
    textAlign: 'center', 
    padding: 20
  }
});

export default InitialScreen