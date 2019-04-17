import React from 'react';
import { 
  Image, 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableHighlight } from 'react-native';

var {height, width} = Dimensions.get('window')

class VisionFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: ''
    }
  }
  
  componentWillMount() {
    this.fetchVision()
  }

  async fetchVision(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/visions/',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.props.email,
                                'X-User-Token': this.props.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });

        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: JSON.parse(response._bodyText).data})
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
    }
  }

  redirect(routeName, visionId, image_url, description) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.props.accessToken, 
        email: this.props.email,
        visionId: visionId,
        image_url: image_url,
        description: description
      }
    )
  }


  render() {
    return (
      this.state.visions ?
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerScroll}>
          {Object.values(this.state.visions).map(vis => {
            return (
              <TouchableHighlight
                key={vis.id}
                onPress={() => this.redirect('ShowVision', vis.id, vis.image_url, vis.description)}
                underlayColor="transparent"
                activeOpacity={0}
              >
                <Image 
                  key={vis.id} 
                  style={{height: width/3, width: width/3}} 
                  source={{uri: vis.image_url}}
                />
              </TouchableHighlight>
            )
          })}
        </View>
      </ScrollView>
      :
      <Text>nothing</Text>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    marginTop: 40
  },
  scrollViewNoContent: {
    paddingTop: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerScroll: {     
    marginBottom: 200,
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
})

export default VisionFeed