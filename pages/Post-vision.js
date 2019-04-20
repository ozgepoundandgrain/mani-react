import React from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  TextInput, 
  AsyncStorage,
  Dimensions,
  TouchableHighlight,
  Text,
  ScrollView,
  Image } from 'react-native';
  import Header from './components/header'
import { ImagePicker } from 'expo'

var {height, width} = Dimensions.get('window')

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

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ imageURI: result.uri });
    }
  }

  render() {
    return (
      <ImageBackground 
        source={require('./images/ocean.jpg')} 
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView style={styles.pageContainer}>
        <Header
          leftTitle=""
          rightTitle="Post"
          rightTitleAction={this.uploadImage} 
          leftTitleAction={() => {}}
        />
        <View style={styles.form}>
          <View style={styles.imageUploader}>
            <Image style={styles.image} source={{ uri: this.state.imageURI }}/>
            <TouchableHighlight onPress={this._pickImage}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableHighlight>
          </View>
          <TextInput 
            placeholder="Description"
            onChangeText={(val) => this.setState({ description: val})}
            placeholderTextColor="white"
            style={styles.textInput}
            multiline={true}
          />
        </View>
        </ScrollView>
      </View>
    </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'transparent', 
    height: '100%', 
    alignContent: 'center'
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
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
    height: 500,
    width: (width/3) * 2,
  },
  imageUploader: {
    backgroundColor: 'lightgrey',
    height: 50,
    width: 50
  },
  image: {
    height: width/3, 
    width: width/3,
    position: 'relative'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%'
  },
  editButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 2,
    color: 'white', 
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0
  }
})

export default PostVision