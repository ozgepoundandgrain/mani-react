import React from 'react';
import { TextInput, View, StyleSheet, Text, Dimensions, ScrollView, Modal } from 'react-native';
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
            console.log('res success is: ', res);
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
    console.log(this.state, this.props)
    return ([
        <View style={styles.overlay} key={0}>
        <Header
          leftTitle="Delete"
          rightTitle="Save"
          rightTitleAction={() => this.submitEdit(this.state.id)} 
          leftTitleAction={() => this.setModalVisible(true)}
        />
          <ScrollView>
            <TextInput
              placeholderTextColor="black"
              editable
              onChangeText={(title) => {this.setState({title})}}
              value={this.state.title}
              maxLength = {40}
              placeholder={this.state.title}
              style={styles.textInputTitle}
            />

            <TextInput
              placeholderTextColor="black"
              onChangeText={(description) => {this.setState({description})}}
              value={this.state.description}
              multiline
              editable
              numberOfLines = {60}
              style={styles.textInputDescription}
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
    fontSize: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    fontWeight: '300'
  },
  textInputDescription: {
    padding: 20,
    color: 'black',
    fontSize: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    height: (width === 320) ? 200 : 300,
    fontWeight: '300'
  },
  overlay: {
    backgroundColor: '#f6f8fa',
    height: '100%',
    width: '100%'
  }
})

export default EditMantra