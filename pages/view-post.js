import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient } from 'expo'
import { ScrollView } from 'react-native-gesture-handler';

const ACCESS_TOKEN = 'authentication_token';

class ViewPost extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: this.props.navigation.state.params.postTitle,
      description: this.props.navigation.state.params.postDescription,
      id: this.props.navigation.state.params.postId,
      email: this.props.navigation.state.params.userEmail,
      accessToken: this.props.navigation.state.params.accessToken
    }

    this.submitEdit = this.submitEdit.bind(this)
    this.deleteShit = this.deleteShit.bind(this)
  }

  async submitEdit(id) {
    try {
        let response = await fetch('http://localhost:3000/v1/posts/'+id, {
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


  deleteShit(id) {
    fetch('http://localhost:3000/v1/posts/'+id, {
      method: 'DELETE',
      headers: {
        'X-User-Email': this.state.email,
        'X-User-Token': this.state.accessToken,
        'Content-Type': 'application/json',
      }
    })
  }

  render() {
    console.log(this.state)
    return(
      <View style={styles.page}>
      <View style={{ height: 100, width: '100%'}}>
        <TouchableHighlight onPress={() => this.submitEdit(this.state.id)} style={styles.save}>
          <Text>Save</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.deleteShit(this.state.id)} style={styles.delete}>
          <Text>Delete</Text>
        </TouchableHighlight>
      </View>

        <ScrollView>
          <TextInput
            placeholderTextColor="grey"
            editable = {true}
            onChangeText={(title) => {this.setState({title})}}
            value={this.state.title}
            maxLength = {40}
            placeholder="Title for your manifestation"
            style={[styles.inputStyle, {marginTop: 10}]}
          />

          <TextInput
            placeholderTextColor="grey"
            editable = {true}
            onChangeText={(description) => {this.setState({description})}}
            value={this.state.description}
            multiline = {true}
            numberOfLines = {60}
            style={[styles.inputStyle, {height: 300, textAlign: 'left', marginTop: 20, marginBottom: 20}]}
            placeholder={
              "I am so happy and grateful that.... \n\n\nDescribe your desired circumstance, with conviction and in as much detail as possible. \n\n\nSwitching 'I want' with 'I have' and 'I am' will assist you in your manifestation endeavors as this will perpetuate the reality that you already have whatever it is that you desire. "
            }
          />
        </ScrollView>

      </View> 
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

export default ViewPost
