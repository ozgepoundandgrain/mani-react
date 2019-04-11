import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableHighlight } from 'react-native';

class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    }
    this.submitMantra = this.submitMantra.bind(this)
  }

  async submitMantra() {
    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/mantras/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Email': this.props.navigation.state.params.email,
                'X-User-Token': this.props.navigation.state.params.accessToken
            },
            body: JSON.stringify({
              mantra: {
                title: this.state.title,
                description: this.state.description
              }
            })
        });

        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
            this.props.navigation.navigate('Home');
            console.log(respose)
        } else {
            let errors = res;
            throw errors;
        }
    } catch(errors) {
    }
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <ImageBackground 
          source={require('./images/ocean.jpg')} 
          style={styles.background}
        >
        <TouchableHighlight
          underlayColor="transparent"
          activeOpacity={0}
          style={{padding: 50}}
          onPress={this.submitMantra}
        >
          <Text>Post</Text>
        </TouchableHighlight>
        <TextInput 
          placeholder="Title for your manifestation"
          onChangeText={(val) => this.setState({ title: val})}
          placeholderTextColor="white"
          style={styles.textInputTitle}
          multiline={true}
          maxLength={30}
        />
        <TextInput 
          placeholder="Description"
          onChangeText={(val) => this.setState({ description: val})}
          placeholderTextColor="white"
          style={styles.textInputDescription}
          multiline={true}
          numberOfLines={60}
        />
        </ImageBackground>
      </View>  
    );
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'transparent', 
    height: '100%', 
    alignContent: 'center'
  },
  background: {
    width: '100%', 
    height: '100%'
  },
  textInputTitle: {
    padding: 20,
    marginTop: '25%',
    marginBottom: 20,
    color: 'white',
    fontSize: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  textInputDescription: {
    padding: 20,
    color: 'white',
    fontSize: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    height: 300,
  }
})

export default PostMantra