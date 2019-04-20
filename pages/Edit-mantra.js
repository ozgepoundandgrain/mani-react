import React from 'react';
import { TextInput, View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import ConfirmationModal from './components/confirmation-modal';
import Header from './components/header'

class EditMantra extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: this.props.navigation.state.params.title,
      description: this.props.navigation.state.params.description,
      id: this.props.navigation.state.params.mantraId,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      modalVisible: false
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.submitDelete = this.submitDelete.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async submitEdit(id) {
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
            this.props.navigation.navigate('Home');
        } else {
            let errors = res;
            throw errors;
        }
      
    } catch(errors) {
    }
  }

  deleteAction(id){
    this.setModalVisible(!this.state.modalVisible)
    this.submitDelete(id)
    this.props.navigation.navigate('Home')
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
    return (
      <ImageBackground 
        source={require('./images/ocean.jpg')} 
        style={{width: '100%', height: '100%'}}
      >
        <View style={styles.overlay}>
        <Header
          leftTitle="Delete"
          rightTitle="Save"
          rightTitleAction={() => this.submitEdit(this.state.id)} 
          leftTitleAction={() => this.setModalVisible(true)}
        />
          <ScrollView>
            <TextInput
              placeholderTextColor="white"
              editable
              onChangeText={(title) => {this.setState({title})}}
              value={this.state.title}
              maxLength = {40}
              placeholder={this.state.title}
              style={styles.textInputTitle}
            />

            <TextInput
              placeholderTextColor="white"
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
            visible={this.state.modalVisible}
            onPressCancel={() => {this.setModalVisible(!this.state.modalVisible)}}
            onPressDelete={() => this.deleteAction(this.state.id)}
          />

        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
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
})

export default EditMantra