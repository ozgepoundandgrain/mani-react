import React from 'react';
import { StyleSheet, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import ConfirmationModal from './components/confirmation-modal';
import Header from './components/header'
import LoadingModal from './components/loading-modal'

var {width} = Dimensions.get('window')

class EditVision extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: this.props.navigation.state.params.image_url,
      description: this.props.navigation.state.params.description,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      modalVisible: false,
      id: this.props.navigation.state.params.visionId,
      visions: [],
      animationModalVisible: false,
      animation: null,
      descriptionError: false
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.submitDelete = this.submitDelete.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
    this.redirect = this.redirect.bind(this)
    this.submitButton = this.submitButton.bind(this)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setAnimationModalVisible(visible) {
    this.setState({animationModalVisible: visible});
  }


  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        visions: this.state.visions
      }
    )
  }


  async submitEdit(id) {

    this.setAnimationModalVisible(true)

    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/visions/'+id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': this.state.email,
                'X-User-Token': this.state.accessToken
            },
            body: JSON.stringify({
                description: this.state.description
            })
        });

        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
          this.redirect('Home')
        } else {
            let errors = res;
            throw errors;
        }
      
    } catch(errors) {
      console.log('ERRROSS ', errors);

    }
  }

  async submitDelete(id) {

    try { let response = await fetch('https://prana-app.herokuapp.com/v1/visions/'+id, {
      method: 'DELETE',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    });

    let res = await response.text();
    if (response.status >= 200 && response.status < 300) {
      this.redirect('Home')
    } else {
        let errors = res;
        throw errors;
    }

  } catch(errors) {
    console.log('error')
  }

  }

  submitButton() {
    if (this.state.description) {
      this.submitEdit(this.state.id)
    } else {
      this.setState({descriptionError: true})
    }
  }

  deleteAction(id){
    this.setModalVisible(!this.state.modalVisible)
    this.submitDelete(id)
    this.props.navigation.navigate('Home')
  }

  render() {
    return ([
      <Header
        key={1}
        leftTitle="Delete"
        rightTitle="Save"
        rightTitleAction={this.submitButton} 
        leftTitleAction={() => this.setModalVisible(true)}
        CTAactive
      />,
      <ScrollView key={2} style={styles.scrollview}>
        <Image 
          source={{uri: this.props.navigation.state.params.image_url}} 
          style={{width: width/3, height: width/3, marginLeft: 15}}
        />
        <TextInput
          placeholderTextColor="black"
          editable
          onChangeText={(description) => {this.setState({description, descriptionError: false})}}
          value={this.state.description}
          multiline
          placeholder={this.state.description}
          style={this.state.descriptionError ? styles.errorState : styles.textInputDescription}
        />
      </ScrollView>,
      <ConfirmationModal
        key={3}
        title="Delete this vision?"
        visible={this.state.modalVisible}
        onPressCancel={() => {this.setModalVisible(!this.state.modalVisible)}}
        onPressDelete={() => this.deleteAction(this.state.id)}
      />,
      <LoadingModal 
      key={4}
      visible={this.state.animationModalVisible}
    />
    ])
  }
}

const styles = StyleSheet.create({
  textInputDescription: {
    marginLeft: 15,
    marginRight: 15,
    color: 'black',
    fontSize: 20,
    height: (width === 320) ? 240 : 280,
    width: width - 30,
    fontWeight: '300',
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    padding: 20,
  },
  errorState: {
    marginLeft: 15,
    marginRight: 15,
    color: 'black',
    fontSize: 20,
    backgroundColor: '#F6F6F6',
    height: (width === 320) ? 240 : 280,
    width: width - 30,
    fontWeight: '300',
    borderColor: 'red',
    borderWidth: 1,
    padding: 20,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
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
  scrollview: {
    paddingTop: 30,
    backgroundColor: 'white'
  }
})

export default EditVision