import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Font } from 'expo';


class InitialScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      fontLoaded: false
    }
  }

  async componentWillMount() {
    try  {
      await Font.loadAsync({
      'Abril-Fatface': require('../assets/fonts/AbrilFatface-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
    } catch {
      console.log('could not load font')
    }
  }

  render() {
    return ([
      this.state.fontLoaded &&
      ([<Text key={0} style={styles.header}>Prana.</Text>,
      <View style={styles.container} key={1}>
        <Text style={styles.text}>Decide</Text>
        <Text style={styles.text}>Beleive</Text>
        <Text style={styles.text}>Visualize</Text>
        <Text style={styles.text}>Feel</Text>
        <Text style={styles.text}>Give thanks</Text>
        <Text style={styles.text}>Release</Text>
      </View>])
    ])
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    backgroundColor: "white",
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "white",
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface',
    paddingTop: 30,
  }
});

export default InitialScreen