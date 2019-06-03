import React from 'react';
import { ScrollView, StyleSheet, Modal, View, Text, TextInput, Dimensions } from 'react-native';
import Header from './components/header'

var {width} = Dimensions.get('window')

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
        data: this.state.mantras,
      }
    )
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


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
          this.redirect('Home', JSON.parse(response._bodyText).data)
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
            // this.redirect('Home')
        } else {
            let errors = res;
            throw errors;
        }
    } catch(errors) {
    }
  }

  render() {
    return ([
        <View style={styles.overlay} key={0}>
        <ScrollView>
        <Header
          leftTitle="Cancel"
          rightTitle="Post"
          rightTitleAction={this.submitMantra} 
          leftTitleAction={() => this.props.navigation.goBack()}
        />
          <TextInput 
            placeholder="Title for your manifestation"
            onChangeText={(val) => this.setState({ title: val})}
            placeholderTextColor="grey"
            style={styles.textInputTitle}
            multiline={true}
          />
          <TextInput 
            placeholder="Description"
            onChangeText={(val) => this.setState({ description: val})}
            placeholderTextColor="grey"
            style={styles.textInputDescription}
            multiline={true}
            numberOfLines={60}
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
  background: {
    width: '100%', 
    height: '100%'
  },
  textInputTitle: {
    padding: 5,
    marginBottom: (width === 320) ? 10 : 20,
    color: 'black',
    fontSize: 20,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  textInputDescription: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    height: (width === 320) ? 200 : 300,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  overlay: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
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

export default PostMantra