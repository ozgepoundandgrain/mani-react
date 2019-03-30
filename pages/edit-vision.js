import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width

class EditVision extends React.Component {
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
                image: this.state.url,
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


  render() {
    return(
    <ScrollView style={{ position: 'relative', backgroundColor: '#F5F9FB', height: '100%'}}>
      <View style={styles.page}>
      <View style={{alignSelf: 'center'}}>
      <Image source={{ uri: this.state.url }} style={{width: 200, height: 200 }}/>
      <TouchableHighlight onPress={() => this.submitEdit(this.state.id)}style={{alignSelf: 'center'}}>
            <Text style={{color: 'blue'}}>SAVE</Text>
        </TouchableHighlight>
      </View>
        <TextInput 
            style={styles.inputStyle}
            value={this.state.description}
            onChangeText={(description) => {this.setState({description})}}
            multiline = {true}
        />
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
    borderColor: 'black',
    width: '100%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
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

export default EditVision
