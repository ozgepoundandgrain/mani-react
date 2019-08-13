import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Text,
  Image } from 'react-native';
  import Header from './components/header'
import { ImagePicker } from 'expo'
import LoadingModal from './components/loading-modal'

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
      showInfo: false
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.redirect = this.redirect.bind(this)
    this.toggleInfo = this.toggleInfo.bind(this)
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

  toggleInfo() {
    this.state.showInfo ? 
    this.setState({showInfo: false})
    :
    this.setState({showInfo: true})
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
          showCTA={!!this.state.description && !!this.state.imageURI}
        />
        <View style={styles.imagecontainer}>
          <View>
          <Image style={styles.image} source={{ uri: this.state.imageURI }}/>
            <TouchableHighlight onPress={this._pickImage}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableHighlight>
          </View>
        </View>

          <View>
            <TextInput 
              placeholder="Affirm in detail"
              onChangeText={(val) => this.setState({ description: val})}
              placeholderTextColor="grey"
              style={styles.textInput}
              multiline={true}
            />
          </View>
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
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    height: (width === 320) ? 240 : 300,
    width: width,
    fontWeight: '300'
  },
  image: {
    height: width/3, 
    width: width/3,
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