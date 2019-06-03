import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Modal,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Text,
  Image } from 'react-native';
  import Header from './components/header'
import { ImagePicker } from 'expo'

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
        visions: this.state.visions,
      }
    )
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
          this.redirect('Home')
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
        <View style={styles.overlay} key={0}>
          <ScrollView style={styles.pageContainer}>
        <Header
          leftTitle="Cancel"
          rightTitle="Post"
          rightTitleAction={this.uploadImage} 
          leftTitleAction={() => this.props.navigation.goBack()}
        />
            <Image style={styles.image} source={{ uri: this.state.imageURI }}/>
            <TouchableHighlight onPress={this._pickImage}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableHighlight>
          <TextInput 
            placeholder="Description"
            onChangeText={(val) => this.setState({ description: val})}
            placeholderTextColor="grey"
            style={styles.textInput}
            multiline={true}
          />
        </ScrollView>
      </View>,
      <Modal
        key={1}
        animationType="fade"
        transparent
        visible={this.state.modalVisible}
      >
      <View style={styles.animationModal}>
      <View style={{ alignContent: 'center' }}>
      <Text style={styles.text}>Decide</Text>
        <Text style={styles.text}>Beleive</Text>
        <Text style={styles.text}>Visualize</Text>
        <Text style={styles.text}>Feel</Text>
        <Text style={styles.text}>Give thanks</Text>
        <Text style={styles.text}>Release</Text>
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
  background: {
    width: '100%', 
    height: '100%'
  },
  textInput: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    height: (width === 320) ? 240 : 300,
    width: width
  },
  animationModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
    width: '100%'
  },
  image: {
    height: width/3, 
    width: width/3,
    position: 'relative'
  },
  overlay: {
    backgroundColor: 'white',
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
})

export default PostVision