import React from 'react';
import { ScrollView, View, TextInput, Dimensions, StyleSheet } from 'react-native';
import Header from './components/header'
import LoadingModal from './components/loading-modal'

var {width} = Dimensions.get('window')


class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      mantras: [],
      modalVisible: false,
    }
    this.submitMantra = this.submitMantra.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName, data) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        data: this.state.mantras,
      }
    )
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: res.data})
          this.redirect('Home', res.data)
        } else {
          let error = res;
          this.setModalVisible(true)
          this.setState({error: 'Oops, something went wrong. Try again!'})
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  async submitMantra() {
    this.setModalVisible(true)

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

        let res = await response.json();
        if (response.status >= 200 && response.status < 300) {
            this.fetchData()
            // this.redirect('Home')
        } else {
            let errors = res;
            throw errors;
        }
    } catch(errors) {
    }
  }

  render() {
    return ([
        <View style={styles.overlay} key={0}>
        
          <Header
            leftTitle="Cancel"
            rightTitle="Post"
            rightTitleAction={this.submitMantra} 
            leftTitleAction={() => this.props.navigation.goBack()}
            showCTA={!!this.state.description && !!this.state.title}
          />
          
          <ScrollView style={styles.scrollView}>
            <TextInput 
              placeholder="Affirmation title"
              onChangeText={(val) => this.setState({ title: val})}
              placeholderTextColor="grey"
              style={styles.textInputTitle}
              multiline={true}
            />
            <View>
              <TextInput 
                placeholder="Affirm in detail"
                onChangeText={(val) => this.setState({ description: val})}
                placeholderTextColor="grey"
                style={styles.textInputDescription}
                multiline={true}
                numberOfLines={60}
              />
            </View>
          </ScrollView>
        </View>,
        <LoadingModal 
        key={1}
        visible={this.state.modalVisible}
      />
    ]);
  }
}


const styles = StyleSheet.create({
  textInputTitle: {
    fontWeight: '300',
    paddingBottom: 5,
    marginBottom: 10,
    color: 'black',
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  scrollView: {
    marginTop: 15
  },
  textInputDescription: {
    fontWeight: '300',
    padding: 20,
    color: 'black',
    fontSize: 15,
    alignItems: 'center',
    height: (width === 320) ? 200 : 300,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  overlay: {
    height: '100%',
    width: '100%'
  }
})

export default PostMantra