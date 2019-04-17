import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableHighlight, 
  AsyncStorage,
  Keyboard,
  Image } from 'react-native';

class PostVision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      imageURI: this.props.navigation.state.params.imageURI,
      description: '',
      visions: [],
      persistedVisions: []
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.persistVision = this.persistVision.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  componentDidMount(){
    this.mounted = true;
  }
  
  redirect(routeName, data) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        persistedVisions: data
      }
    )
  }

  persistVision() {
    AsyncStorage.setItem('visions', JSON.stringify(this.state.visions))
    this.setState({
      persistedVisions: this.state.visions
    })
  }

  check() {
    console.log('check is called')
    AsyncStorage.getItem('visions').then((visions) => {
      if(this.mounted) {
        this.setState({ persistedVisions: visions})
      }
    })
  }

  async fetchVision(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/visions/',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.state.email,
                                'X-User-Token': this.state.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });

        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: JSON.parse(response._bodyText).data})
          this.persistVision()
          this.check()
          this.redirect('Home', this.state.persistedVisions)
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
    }
  }


  async uploadImage() {

    let localUri = this.state.imageURI;
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
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken
      },
    });

    let res = await response.text();
    if (response.status >= 200 && response.status < 300) {
        this.fetchVision()
    } else {
      console.log(error)
        let errors = res;
        throw errors;
    }

    } catch(errors) {
      console.log("error: ", 'ERROR CAUGHT IN UPLOAD')
    }

  };

  render() {
    console.log(this.state)
    return (
      <View style={styles.pageContainer}>
        <TouchableHighlight
          onPress={() => Keyboard.dismiss()}
          underlayColor="transparent"
          activeOpacity={0}
        >
          <ImageBackground 
            source={require('./images/ocean.jpg')} 
            style={styles.background}
          >
            <View style={styles.overlay}>
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
            </View>
          </ImageBackground>
        </TouchableHighlight>
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
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%'
  }
})

export default PostVision