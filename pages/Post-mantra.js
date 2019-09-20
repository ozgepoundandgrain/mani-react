import React from 'react';
import { 
  ScrollView, 
  Keyboard, 
  View, 
  TextInput, 
  Dimensions, 
  StyleSheet } from 'react-native';
import Header from './components/header'
import LoadingModal from './components/loading-modal'

var {width} = Dimensions.get('window')


class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      mantras: [],
      modalVisible: false,
      descriptionError: false,
      titleError: false
    }
    this.submitMantra = this.submitMantra.bind(this)
    this.redirect = this.redirect.bind(this)
    this.submitButton = this.submitButton.bind(this)
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


  submitButton() {
    if (this.state.description && this.state.title) {
      this.submitMantra()
    } else if (!this.state.description && this.state.title) {
      this.setState({descriptionError: true});
    } else if (this.state.description && !this.state.title) {
      this.setState({titleError: true})
    } else {
      this.setState({titleError: true, descriptionError: true})
    }
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
        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: res.data})
          this.redirect('Home', res.data)
        } else {
          let error = res;
          this.setModalVisible(true)
          this.setState({error: 'Oops, something went wrong. Try again!'})
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

        let res = await response.json();
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
          <Header
            leftTitle=""
            rightTitle="Post"
            rightTitleAction={this.submitButton} 
            leftTitleAction={() => this.props.navigation.goBack()}
            CTAactive={true}
          />
          
          <ScrollView style={styles.scrollView}>
            <TextInput 
              placeholder="Affirmation title"
              onChangeText={(val) => this.setState({titleError: false,  title: val})}
              placeholderTextColor="black"
              style={this.state.titleError ? styles.textInputTitleError : styles.textInputTitle}
              multiline={false}
              onSubmitEditing={() => { this.secondTextInput.focus(); }}
              returnKeyType = { "next" }
            />
            <View>
              <TextInput 
                placeholder="Affirm in as much detail as possible. Smell it, taste, hear it, feel it."
                onChangeText={(val) => this.setState({descriptionError: false, description: val})}
                placeholderTextColor="black"
                style={this.state.descriptionError ? styles.textInputDescriptionError : styles.textInputDescription}
                multiline={true}
                numberOfLines={60}
                returnKeyType = { "next" }
                ref={(input) => { this.secondTextInput = input; }}
                onSubmitEditing={() => Keyboard.dismiss()}
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
  textInputTitle: {
    fontWeight: '300',
    padding: 10,
    marginBottom: 10,
    color: 'black',
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  scrollView: {
    marginTop: 15
  },
  textInputDescription: {
    fontWeight: '300',
    padding: 20,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    height: (width === 320) ? 200 : 280,
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  textInputDescriptionError: {
    fontWeight: '300',
    padding: 20,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    height: (width === 320) ? 200 : 280,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#F6F6F6',
    marginLeft: 15,
    marginRight: 15,
  },
  textInputTitleError: {
    fontWeight: '300',
    padding: 10,
    marginBottom: 10,
    color: 'black',
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#F6F6F6',
    marginLeft: 15,
    marginRight: 15,
  },
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  }
})

export default PostMantra