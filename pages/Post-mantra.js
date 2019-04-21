import React from 'react';
import { ScrollView, StyleSheet, Modal, View, ImageBackground, TextInput } from 'react-native';
import Header from './components/header'
import { DangerZone, Asset } from 'expo'
import LoadingAnimation from './animations/glow-loading.json'

let { Lottie } = DangerZone;

class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      mantras: [],
      animation: null,
      modalVisible: false
    }
    this.submitMantra = this.submitMantra.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName, data) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        mantras: data
      }
    )
  }


  async componentWillMount() {
    await Asset.loadAsync([
      require('./images/ocean.jpg'),
    ]);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this.setState({ animation: LoadingAnimation }, this._playAnimation);
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };

  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/mantras',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.props.navigation.state.params.email,
                                'X-User-Token': this.props.navigation.state.params.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: JSON.parse(response._bodyText).data})
          this.redirect('Home', this.state.mantras)
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async submitMantra() {
    this.setModalVisible(true)
    this._playAnimation()

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
            this.fetchData()
        } else {
            let errors = res;
            throw errors;
        }
    } catch(errors) {
    }
  }

  render() {
    return ([
        <ImageBackground 
          key={1}
          source={require('./images/ocean.jpg')} 
          style={styles.background}
        >
        <View style={styles.overlay}>
        <ScrollView>
        <Header
          leftTitle=""
          rightTitle="Post"
          rightTitleAction={this.submitMantra} 
          leftTitleAction={() => {}}
        />
          <TextInput 
            placeholder="Title for your manifestation"
            onChangeText={(val) => this.setState({ title: val})}
            placeholderTextColor="white"
            style={styles.textInputTitle}
            multiline={true}
          />
          <TextInput 
            placeholder="Description"
            onChangeText={(val) => this.setState({ description: val})}
            placeholderTextColor="white"
            style={styles.textInputDescription}
            multiline={true}
            numberOfLines={60}
          />
          </ScrollView>
        </View>
        </ImageBackground>,
        <Modal
        key={2}
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
        height: 150
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
  background: {
    width: '100%', 
    height: '100%'
  },
  textInputTitle: {
    padding: 20,
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
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%'
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
})

export default PostMantra