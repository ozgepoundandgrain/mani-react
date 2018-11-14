import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient } from 'expo'

const ACCESS_TOKEN = 'authentication_token';

class Post extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: '',
      // this.props.navigation.state.params.accessToken,
      posts: []
    }
  }
  componentWillMount() {
    this.getToken();
  }

  componentDidMount(){
    this.getToken();
  }
  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if(!accessToken) {
          this.redirect('login');
      } else {
          this.setState({accessToken: accessToken})
      }
    } catch(error) {
        console.log("Something went wrong");
        this.redirect('login');
    }
  }
  async submitEntry() {
    let access_token = this.state.accessToken
    try {
        let response = await fetch('http://localhost:3000/v1/posts/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Email': this.props.navigation.state.params.email,
                'X-User-Token': this.state.accessToken
            },
            body: JSON.stringify({
              post: {
                title: this.state.title,
                description: this.state.description
              }
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
      console.log('YOOOO', this.state)
    return(
      <View style={{backgroundColor: 'white', height: '100%', alignContent: 'center', display: 'flex'}}>
        {/* <TouchableHighlight onPress={this.confirmDelete.bind(this)}>
          <Text>
            Delete Account
          </Text>
        </TouchableHighlight>  */}
        <View>
        <TextInput
          placeholderTextColor="grey"
          editable = {true}
          onChangeText={(title) => {this.setState({title})}}
          value={this.state.title}
          maxLength = {40}
          placeholder="Title for your manifestation"
          style={[styles.inputStyle, {height: 30, marginTop: '20%'}]}
        />

        <TextInput
          placeholderTextColor="grey"
          editable = {true}
          onChangeText={(description) => {this.setState({description})}}
          value={this.state.description}
          multiline = {true}
          numberOfLines = {100}
          style={[styles.inputStyle, {height: 400, textAlign: 'left', marginTop: 20, marginBottom: 20}]}
          placeholder={
            "I am so happy and grateful that.... \n\n\nDescribe your desired circumstance, with conviction and in as much detail as possible."
          }
          // placeholder={"Imagine a desired scenario or a circumstance and write about it below, assuming that it has already happened."}
        />
        <TouchableHighlight
          onPress={this.submitEntry.bind(this)}
          underlayColor="transparent" activeOpacity={0}
        >
        <LinearGradient start={[0.1, 0.1]} colors={['#00EDFE', '#6C02A1']} style={styles.button}>
          <Text style={{color: 'white', fontSize: 20, flexDirection: 'column', marginTop: 15}}>
            Manifest
          </Text>
          </LinearGradient>
        </TouchableHighlight>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    color: '#5631B3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#5631B3',
    width: '80%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '80%',
    height: 60,
    display: 'flex',
    alignSelf: 'center'
  }
});

export default Post
