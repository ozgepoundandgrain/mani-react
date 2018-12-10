import React from 'react';
import arrow from './images/arrow.png'
import * as Animatable from 'react-native-animatable'
import {
    StyleSheet, 
    Text,
    View} from 'react-native';
import { LinearGradient, DangerZone } from 'expo'
import ANIME from './animations/firework.json'

let { Lottie } = DangerZone;



class PostSuccessful extends React.Component {

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

  render () {
    console.log('EXIUSFSF MEEEE')
    return(
      <View style={styles.container}>
        <View style={{ alignContent: 'center' }}>
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: 50,
              height: 50,
            }}
            source={this.state.animation}
          />
          </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    height: '100%',
    alignContent: 'center',
    display: 'flex'
  },
});

export default PostSuccessful
