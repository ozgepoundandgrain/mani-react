import React from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';


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
      <Modal
        transparent
        visible={this.props.visible}
      >
        <View style={styles.animationModal}>
        <View style={{ alignContent: 'center' }}>
          {
            content.map((cont, index)=> {
              return (
              <Animatable.Text 
                key={index}
                delay={index*400} 
                animation="slideInDown" 
                iterationCount={5} 
                direction="alternate">
                  <Text 
                    style={[this.state.fontLoaded && {fontFamily: 'Abril-Fatface'}, styles.text]}
                  >
                      {cont}
                  </Text>
                </Animatable.Text>
              )
            })
          }
        </View>
      </View>
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
        color: 'black',
        paddingBottom: 40
      },
      animationModal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        height: '100%',
        width: '100%'
      }
})

export default LoadingModal