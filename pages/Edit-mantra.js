import React from 'react';
import { TextInput, View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import ConfirmationModal from './components/confirmation-modal';
import Header from './components/header'
import LoadingModal from './components/loading-modal'

var {width} = Dimensions.get('window')

class EditMantra extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: this.props.navigation.state.params.title,
      description: this.props.navigation.state.params.description,
      id: this.props.navigation.state.params.mantraId,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      modalVisible: false,
      animationModalVisible: false,
      data: []
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.submitDelete = this.submitDelete.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
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
        data: this.state.data
      }
    )
  }

  submitButton() {
    if (this.state.title && this.state.description) {
      this.submitEdit(this.state.id)
    } else if (!this.state.title && this.state.description) {
      this.setState({titleError: true})
    } else if (this.state.title && !this.state.description) {
      this.setState({descriptionError: true})
    } else {
      this.setState({descriptionError: true, titleError: true})
    }
  }



  async submitEdit(id) {
    this.setAnimationModalVisible(true)

    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/mantras/'+id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': this.state.email,
                'X-User-Token': this.state.accessToken
            },
            body: JSON.stringify({
                title: this.state.title,
                description: this.state.description
            })
        });

        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
            this.redirect('Home')
        } else {
            let errors = res;
            throw errors;
        }
      
    } catch(errors) {
    }
  }

  deleteAction(id){
    this.setAnimationModalVisible(true)
    
    this.setModalVisible(!this.state.modalVisible)
    this.submitDelete(id)
    this.redirect('Home')
  }

  submitDelete(id) {
    fetch('https://prana-app.herokuapp.com/v1/mantras/'+id, {
      method: 'DELETE',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
  }


  render() {
    return ([
        <View style={styles.overlay} key={0}>
        <Header
          leftTitle="Delete"
          rightTitle="Save"
          rightTitleAction={this.submitButton} 
          leftTitleAction={() => this.setModalVisible(true)}
          CTAactive
        />
          <ScrollView style={styles.scrollview}>
            <TextInput
              placeholderTextColor="black"
              editable
              onChangeText={(title) => {this.setState({title, titleError: false})}}
              value={this.state.title}
              placeholder={this.state.title}
              style={this.state.titleError ? styles.titleErrorState : styles.textInputTitle}
            />

            <TextInput
              placeholderTextColor="black"
              onChangeText={(description) => {this.setState({description, descriptionError: false})}}
              value={this.state.description}
              multiline
              editable
              numberOfLines = {60}
              style={this.state.descriptionError ? styles.descriptionErrorState: styles.textInputDescription}
              placeholder={this.state.description}
            />
          </ScrollView>
          <ConfirmationModal
            title="Delete this mantra?"
            visible={this.state.modalVisible}
            onPressCancel={() => {this.setModalVisible(!this.state.modalVisible)}}
            onPressDelete={() => this.deleteAction(this.state.id)}
          />
        </View>,
        <LoadingModal 
          key={1}
          visible={this.state.animationModalVisible}
        />
    ])
  }
}

const styles = StyleSheet.create({
  textInputTitle: {
    padding: 5,
    marginBottom: 10,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    paddingLeft: 20,
    fontWeight: '300',
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  titleErrorState: {
    padding: 5,
    marginBottom: 10,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingLeft: 20,
    fontWeight: '300',
    borderColor: 'red',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  descriptionErrorState: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    height: (width === 320) ? 200 : 280,
    fontWeight: '300',
    borderColor: 'red',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  textInputDescription: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    alignItems: 'center',
    height: (width === 320) ? 200 : 280,
    fontWeight: '300',
    backgroundColor: '#F6F6F6',
    borderColor: '#F6F6F6',
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  overlay: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  },
  scrollview: {
    marginTop: 15
  }
})

export default EditMantra