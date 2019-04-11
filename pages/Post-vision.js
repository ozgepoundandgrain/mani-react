import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableHighlight, Image } from 'react-native';

class PostVision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: ''
    }
    this.uploadImage = this.uploadImage.bind(this)
  }

  async uploadImage() {

  let localUri = this.props.navigation.state.params.imageURI;
  let filename = localUri.split('/').pop();

  const stringdata = {
    description: this.state.description
  };

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  for (var k in stringdata) {
    formData.append(k, stringdata[k]);
  }
  formData.append('image', { uri: localUri, name: filename, type });

  try {
    let response = await fetch('https://prana-app.herokuapp.com/v1/visions/', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-User-Email': this.props.navigation.state.params.email,
      'X-User-Token': this.props.navigation.state.params.accessToken
    },
  });

  let res = await response.text();
  console.log(response)
  if (response.status >= 200 && response.status < 300) {
      this.props.navigation.navigate('Home');
      console.log(res)
  } else {
      let errors = res;
      throw errors;
  }

  } catch(errors) {

  }

  };


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
          onPress={this.uploadImage}
        >
          <Text>Post</Text>
        </TouchableHighlight>
        <View style={styles.imageUploader}>
          <Image style={styles.image} source={{uri: this.props.navigation.state.params.imageURI}}/>
        </View>
        <TextInput 
          placeholder="Description"
          onChangeText={(val) => this.setState({ description: val})}
          placeholderTextColor="white"
          style={styles.textInput}
          multiline={true}
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
  textInput: {
    padding: 20,
    color: 'white',
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    height: 300,
    width: '100%',
  },
  imageUploader: {
    backgroundColor: 'lightgrey',
    height: 50,
    width: 50
  },
  image: {
    height: 50, 
    width: 50
  }
})

export default PostVision