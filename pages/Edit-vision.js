import React from 'react';
import { StyleSheet, Image, Dimensions, ScrollView, AsyncStorage, View, TextInput } from 'react-native';
import ConfirmationModal from './components/confirmation-modal';
import Header from './components/header'

var {height, width} = Dimensions.get('window')

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
      persistedVisions: []
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.submitDelete = this.submitDelete.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
    this.persistVision = this.persistVision.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  redirect(routeName, data) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        persistedVisions: data
      }
    )
  }

  persistVision() {
    AsyncStorage.setItem('visions', JSON.stringify(this.state.visions))
    this.setState({
      persistedVisions: this.state.visions
    })
  }

  check() {
    AsyncStorage.getItem('visions').then((visions) => {
      this.setState({ persistedVisions: visions})
    })
  }


  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/visions',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.state.email,
                                'X-User-Token': this.state.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: JSON.parse(response._bodyText).data})
          this.persistVision()
          this.check()
          this.redirect('Home', this.state.persistedVisions)
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async submitEdit(id) {
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

        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
          this.fetchData()
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
      this.fetchData()
    } else {
        let errors = res;
        throw errors;
    }

  } catch(errors) {
    console.log('error')
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
        leftTitle="Delete"
        rightTitle="Save"
        rightTitleAction={() => this.submitEdit(this.state.id)} 
        leftTitleAction={() => this.setModalVisible(true)}
      />,
      <ScrollView>
         <View style={styles.form}>
        <Image 
          source={{uri: this.props.navigation.state.params.image_url}} 
          style={{width: width/3, height: width/3}}
        />
        <TextInput
          placeholderTextColor="black"
          editable
          onChangeText={(description) => {this.setState({description})}}
          value={this.state.description}
          multiline
          placeholder={this.state.description}
          style={styles.textInputDescription}
        />
          </View>
      </ScrollView>,
      <ConfirmationModal
        visible={this.state.modalVisible}
        onPressCancel={() => {this.setModalVisible(!this.state.modalVisible)}}
        onPressDelete={() => this.deleteAction(this.state.id)}
      />
    ])
  }
}

const styles = StyleSheet.create({
  textInputDescription: {
    padding: 20,
    color: 'black',
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    height: 500,
    width: (width/3) * 2
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
})

export default EditVision