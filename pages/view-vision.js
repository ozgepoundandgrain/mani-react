import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableHighlight } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width

class ViewVision extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        url: this.props.navigation.state.params.visionURL,
        description: this.props.navigation.state.params.visionDescription,
        id: this.props.navigation.state.params.visionId,
        email: this.props.navigation.state.params.userEmail,
        accessToken: this.props.navigation.state.params.accessToken
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.deleteShit = this.deleteShit.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
  }

  async submitEdit(id) {
    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/posts/'+id, {
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
            this.props.navigation.navigate('home');
        } else {
            let errors = res;
            throw errors;
        }
      
    } catch(errors) {
    }
  }

  deleteAction(id){
    this.deleteShit(id)
    this.props.navigation.navigate('home')
  }

  deleteShit(id) {
    fetch('https://prana-app.herokuapp.com/v1/posts/'+id, {
      method: 'DELETE',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
  }

  completeAction(id) {
    fetch('https://prana-app.herokuapp.com/v1/completions?id='+id, {
      method: 'POST',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
  }

  goToView(routeName) {
    this.props.navigation.navigate(
      routeName,
      { visionId: this.state.id,
      visionDescription: this.state.description,
      visionURL: this.state.url,
      accessToken: this.state.accessToken,
      userEmail: this.state.email
    }
    )
  }
  render() {
      console.log('STATE', this.state)
    return(
    <ScrollView style={{ position: 'relative', backgroundColor: '#F5F9FB', height: '100%'}}>
      <View style={styles.page}>
        <Image source={{ uri: this.state.url }} style={{ width: (WIDTH), height: (WIDTH) }}/>
        <Text style={{padding: 20}}>{this.state.description}</Text>
        <TouchableHighlight onPress={() => this.goToView('editVision')}>
            <Text style={{color: 'blue', position: 'absolute', bottom: 0, right: 0}}>EDIT</Text>
        </TouchableHighlight>
      </View> 
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    color: 'grey',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#FBFBFD',
    width: '100%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  page: {backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center', display: 'flex'},
  save: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 20
  },
  delete: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingLeft: 20
  }
});

export default ViewVision
