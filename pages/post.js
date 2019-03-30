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
        let response = await fetch('https://prana-app.herokuapp.com/v1/mantras/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Email': this.props.navigation.state.params.email,
                'X-User-Token': this.state.accessToken
            },
            body: JSON.stringify({
              mantra: {
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
    return(
      <View style={styles.page}>
        <View style={styles.navStyle}>
          <TouchableHighlight
              onPress={this.submitEntry.bind(this)}
              disabled={!this.state.title || !this.state.description}
              underlayColor="transparent" activeOpacity={0}
              style={styles.button}
            >
              <Text style={{color: 'blue'}}>
                Manifest!
              </Text>
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
    width: '100%',
    fontSize: 15,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  button: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingBottom: 10,
    paddingRight: 10,
  },
  navStyle: {
    height: 100, width: '100%', backgroundColor: 'white'
  },
  page: {backgroundColor: '#F5F9FB', height: '100%', alignContent: 'center', display: 'flex'},

});

export default Post
