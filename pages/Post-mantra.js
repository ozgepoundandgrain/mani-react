import React from 'react';
import { AsyncStorage, StyleSheet, View, ImageBackground, TextInput } from 'react-native';
import Header from './components/header'

class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      persistedMantras: '',
      mantras: []
    }
    this.submitMantra = this.submitMantra.bind(this)
    this.persistMantra = this.persistMantra.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName, data) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        persistedMantras: data
      }
    )
  }

  persistMantra() {
    AsyncStorage.setItem('mantras', JSON.stringify(this.state.mantras))
    this.setState({
      persistedMantras: this.state.mantras
    })
  }

  check() {
    AsyncStorage.getItem('mantras').then((mantras) => {
      this.setState({ persistedMantras: mantras})
    })
  }

  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/mantras',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.props.navigation.state.params.email,
                                'X-User-Token': this.props.navigation.state.params.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: JSON.parse(response._bodyText).data})
          this.persistMantra()
          this.check()
          this.redirect('Home', this.state.persistedMantras)
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async submitMantra() {
    try {
        let response = await fetch('https://prana-app.herokuapp.com/v1/mantras/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-Email': this.props.navigation.state.params.email,
                'X-User-Token': this.props.navigation.state.params.accessToken
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
            this.fetchData()
        } else {
            let errors = res;
            throw errors;
        }
    } catch(errors) {
    }
  }

  render() {
    return (
        <ImageBackground 
          source={require('./images/ocean.jpg')} 
          style={styles.background}
        >
        <View style={styles.overlay}>
        <ScrollView>
        <Header
          leftTitle=""
          rightTitle="Post"
          rightTitleAction={this.submitMantra} 
          leftTitleAction={() => {}}
        />
          <TextInput 
            placeholder="Title for your manifestation"
            onChangeText={(val) => this.setState({ title: val})}
            placeholderTextColor="white"
            style={styles.textInputTitle}
            multiline={true}
            maxLength={30}
          />
          <TextInput 
            placeholder="Description"
            onChangeText={(val) => this.setState({ description: val})}
            placeholderTextColor="white"
            style={styles.textInputDescription}
            multiline={true}
            numberOfLines={60}
          />
          </ScrollView>
        </View>
        </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  background: {
    width: '100%', 
    height: '100%'
  },
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
  }
})

export default PostMantra