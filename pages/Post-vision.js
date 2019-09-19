import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Dimensions,
  TouchableHighlight,
  Keyboard,
  ScrollView,
  Text,
  Image } from 'react-native';
  import Header from './components/header'
  import * as ImagePicker from 'expo-image-picker';
import LoadingModal from './components/loading-modal'
import CarouselComponent from './components/carousel'

var {width} = Dimensions.get('window')


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
      showInfo: false,
      descriptionError: false
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.redirect = this.redirect.bind(this)
    this.setModalVisible = this.setModalVisible.bind(this)
    this.toggleInfo = this.toggleInfo.bind(this)
    this.submitButton = this.submitButton.bind(this)
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
        visions: this.state.visions,
      }
    )
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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

        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: res.data})
          this.redirect('Home')
        } else {
          let error = res;
          this.setModalVisible(false)
          this.setState({error: 'Oops, something went wrong. Try again!'})
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

    let res = await response.json();
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

  submitButton() {
    if (this.state.description) {
      this.uploadImage()
    } else if (!this.state.description) {
      this.setState({descriptionError: true});
    }
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

  toggleInfo() {
    this.state.showInfo ? 
    this.setState({showInfo: false})
    :
    this.setState({showInfo: true})
  }

  render() {
    return ([
        <View style={styles.overlay} key={0}>
          <Header
            leftTitle=""
            rightTitle="Post"
            rightTitleAction={this.submitButton} 
            leftTitleAction={() => this.props.navigation.goBack()}
            CTAactive={true}
          />
          <ScrollView style={styles.pageContainer}>
        <View style={styles.imagecontainer}>
          <View>
            <TouchableHighlight onPress={this._pickImage}>
              <View>
                <Image style={styles.image} source={{ uri: this.state.imageURI }}/>
                <Text style={styles.editButton}>Edit</Text>
              </View>
            </TouchableHighlight>
          </View>

        </View>

          <View>
            <TextInput 
              placeholder="Affirm in as much detail as possible. Smell it, taste, hear it, feel it."
              onChangeText={(val) => this.setState({ descriptionError: false, description: val})}
              placeholderTextColor="black"
              style={this.state.descriptionError ? styles.errorTextInput : styles.textInput}
              multiline={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          <CarouselComponent sliderWidth={width} itemWidth={width-100}/>
        </ScrollView>
      </View>,
      <LoadingModal 
      key={1}
      visible={this.state.modalVisible}
    />
    ]);
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'transparent', 
    height: '100%', 
    alignContent: 'center'
  },
  textInput: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    height: (width === 320) ? 240 : 280,
    width: width-30,
    fontWeight: '300',
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  errorTextInput: {
    borderColor: 'red',
    borderWidth: 1,
    padding: 20,
    color: 'black',
    fontSize: 20,
    backgroundColor: '#F6F6F6',
    height: (width === 320) ? 240 : 280,
    width: width-30,
    fontWeight: '300',
    marginLeft: 15,
    marginRight: 15,
  },
  image: {
    height: width/4, 
    width: width/4,
    position: 'relative'
  },
  imagecontainer: {
    flexDirection: 'row', 
    marginLeft: 15, 
    marginTop: 15
  },
  overlay: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  },
  editButton: {
    backgroundColor: 'rgba(0,0,0, 1)',
    borderRadius: 2,
    color: 'white', 
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0
  }
})

export default PostVision