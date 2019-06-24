import React from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, TouchableHighlight } from 'react-native';
import Header from './components/header'
import LoadingModal from './components/loading-modal'
import { LinearGradient } from 'expo'

var {width} = Dimensions.get('window')

const Info = ({visible}) => (
  visible &&
  <LinearGradient
          colors={['#FD9308', '#F83953']}
          style={{borderRadius: 3, padding: 10, margin: 10}}
          start={[1.5, 0.9]}
          end={[0.5, 0.9]}
        >
        <View>
          <Text style={{color: 'white', fontWeight: '600', paddingBottom: 10}}>Use this space to affirm your visions into existence.</Text>
          <Text style={{color: 'white', paddingBottom: 5}}>1. Be grateful for all that you currently have, for the magic is in the journey</Text>
          <Text style={{color: 'white', paddingBottom: 5}}>2. Say it like your desires are already on their way to you</Text>
          <Text style={{color: 'white', paddingBottom: 5}}>3. Describe it in such detail that you can see it, hear it, smell it</Text>
          <Text style={{color: 'white'}}>4. Detach from the outcome</Text>
        </View>
        </LinearGradient>
)

class PostMantra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      mantras: [],
      animation: null,
      modalVisible: false,
      showInfo: false
    }
    this.submitMantra = this.submitMantra.bind(this)
    this.redirect = this.redirect.bind(this)
    this.toggleInfo = this.toggleInfo.bind(this)
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
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: JSON.parse(response._bodyText).data})
          this.redirect('Home', JSON.parse(response._bodyText).data)
        } else {
          let error = res;
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

        let res = await response.text();
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

  toggleInfo() {
    this.state.showInfo ? 
    this.setState({showInfo: false})
    :
    this.setState({showInfo: true})
  }

  render() {
    return ([
        <View style={styles.overlay} key={0}>
        
      
          <Header
            leftTitle="Cancel"
            rightTitle="Post"
            rightTitleAction={this.submitMantra} 
            leftTitleAction={() => this.props.navigation.goBack()}
          />

            <Info visible={this.state.showInfo} />
            <ScrollView>
            <TextInput 
              placeholder="Affirmation title"
              onChangeText={(val) => this.setState({ title: val})}
              placeholderTextColor="grey"
              style={styles.textInputTitle}
              multiline={true}
            />
            <View style={{ alignSelf: 'flex-end', paddingRight: 10}}>
              <TouchableHighlight 
                underlayColor="transparent"
                activeOpacity={0.5}
                onPress={this.toggleInfo}
                style={{backgroundColor: 'grey', width: 20, height: 20, borderRadius: 10, justifyContent: 'center'}}
              >
                <Text style={{color: 'white', alignSelf: 'center'}}>?</Text>
              </TouchableHighlight>
            </View>
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
  background: {
    width: '100%', 
    height: '100%'
  },
  textInputTitle: {
    fontWeight: '300',
    padding: 5,
    marginBottom: 10,
    color: 'black',
    fontSize: 15,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  textInputDescription: {
    fontWeight: '300',
    padding: 20,
    color: 'black',
    fontSize: 15,
    alignItems: 'center',
    height: (width === 320) ? 200 : 300,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  overlay: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  },
  animationModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
    width: '100%'
  },
  text: {
    backgroundColor: "white",
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Abril-Fatface',
    paddingBottom: 40,
  },
})

export default PostMantra