import React from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window')

class VisionFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visions: []
    }

  }

  // async componentDidUpdate(){
  //   this.fetchVision()
  // }

  async componentDidMount(){
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

        let res = await response;
        
        if (response.status >= 200 && response.status < 300) {
          this.setState({visions: JSON.parse(response._bodyText).data})
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + JSON.stringify(error))
    }
  }

  render() {
    console.log(this.state)
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerScroll}>
          {Object.values(this.state.visions).map(vis => {
            return (
              <Image key={vis.id} style={styles.image} source={{uri: vis.image_url}}/>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 40
  },
  innerScroll: {     
    marginBottom: 200,
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    height: width/3,
    width: width/3
  }
})

export default VisionFeed