import React from 'react';
import { Modal, View, StyleSheet, Text, Image } from 'react-native';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import IMAGE from './logo.png'
import { LinearGradient } from 'expo-linear-gradient';

const content = [
  'Decide',
  'Believe',
  'Visualize',
  'Feel',
  'Give Thanks',
  'Release'
]

class LoadingModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      fontLoaded: false
    }
  }

  async componentDidMount() {
    try  {
      await Font.loadAsync({
      'Abril-Fatface': require('../../assets/fonts/AbrilFatface-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
    } catch {
      console.log('could not load font')
    }

  }


  render() {
    return (
      <Modal visible={this.props.visible}>
        <LinearGradient key={2} colors={['#020024', '#191140', '#3a2155']} style={{height: '100%'}}>
        <Image
          source={IMAGE}
          style={{width: 100.5, height: 56.25, alignSelf: 'center', marginTop: 70}}
        />
        <View style={styles.animationModal}>
        <View style={{ alignContent: 'center' }}>
          {
            content.map((cont, index)=> {
              return (
              <Animatable.Text
                key={index}
                delay={index*600} 
                animation="slideInDown" 
                iterationCount={15} 
                direction="alternate">
                  <Text style={[this.state.fontLoaded && {fontFamily: 'Abril-Fatface'}, styles.text]}>
                    {cont}
                  </Text>
                </Animatable.Text>
              )
            })
          }
        </View>
      </View>
      </LinearGradient>
    </Modal>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: "transparent",
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
    paddingBottom: 40,
    fontWeight: '200'
  },
  animationModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  }
})

export default LoadingModal