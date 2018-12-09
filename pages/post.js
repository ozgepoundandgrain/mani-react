import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient } from 'expo'
import { ScrollView } from 'react-native-gesture-handler';

const ACCESS_TOKEN = 'authentication_token';

class Post extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      accessToken: '',
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
      <View style={{backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center', display: 'flex'}}>
      <ScrollView>
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
          numberOfLines = {60}
          style={[styles.inputStyle, {height: 300, textAlign: 'left', marginTop: 20, marginBottom: 20}]}
          placeholder={
            "I am so happy and grateful that.... \n\n\nDescribe your desired circumstance, with conviction and in as much detail as possible. \n\n\nSwitching 'I want' with 'I have' and 'I am' will assist you in your manifestation endeavors as this will perpetuate the reality that you already have whatever it is that you desire. "
          }
        />
        <TouchableHighlight
          onPress={this.submitEntry.bind(this)}
          disabled={!this.state.title || !this.state.description}
          underlayColor="transparent" activeOpacity={0}
        >
        <LinearGradient start={[0.1, 0.1]} colors={['#523CB8', '#08DAF6']} style={styles.button}>
          <Text style={{color: 'white', fontSize: 20, flexDirection: 'column', marginTop: 15}}>
            Manifest
          </Text>
          </LinearGradient>
        </TouchableHighlight>
      </View>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    color: '#5631B3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#FBFBFD',
    width: '80%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
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
