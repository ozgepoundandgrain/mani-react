import React from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  TextInput, 
  Modal,
  Dimensions,
  ScrollView,
  Text,
  Image } from 'react-native';
  import Header from './components/header'
import { ImagePicker, DangerZone, Asset } from 'expo'
import LoadingAnimation from './animations/glow-loading.json'

let { Lottie } = DangerZone;

var {width, height} = Dimensions.get('window')

class PostVision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      imageURI: this.props.navigation.state.params.imageURI,
      description: '',
      visions: [],
      persistedVisions: [],
      animation: null,
      modalVisible: false,
    }

    this.uploadImage = this.uploadImage.bind(this)
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
        visions: data
      }
    )
  }


  async componentWillMount() {
    await Asset.loadAsync([
      require('./images/ocean.jpg'),
    ]);
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this.setState({ animation: LoadingAnimation }, this._playAnimation);
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };

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
          this.redirect('Home', this.state.visions)
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

    this.setModalVisible(true)
    this._playAnimation()

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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

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
    return ([
      <ImageBackground 
        key={0}
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
            <Text style={styles.editButton}>Edit</Text>
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
    </ImageBackground>,
          <Modal
          key={1}
        animationType="fade"
        transparent
        visible={this.state.modalVisible}
      >
      <View style={styles.animationModal}>
      <View style={{ alignContent: 'center' }}>
      <Lottie
      ref={animation => {
        this.animation = animation;
      }}
      style={{
        width: 150,
        height: 150,
      }}
      source={this.state.animation}
    />
    </View>
        </View>
      </Modal>
    ]);
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
    height: height/2,
    width: (width/3) * 2,
  },
  animationModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
    width: '100%'
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
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0
  }
})

export default PostVision