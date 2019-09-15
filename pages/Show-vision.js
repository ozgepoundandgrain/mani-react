import React from 'react';
import { StyleSheet, Image, Dimensions, Text, ScrollView, View } from 'react-native';
import Header from './components/header'
import { Asset, AppLoading } from 'expo'
 
var {width} = Dimensions.get('window')

const cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

class ShowVision extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: this.props.navigation.state.params.image_url,
      description: this.props.navigation.state.params.description,
      id: this.props.navigation.state.params.visionId,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      isReady: false
    }
    
    this.redirect = this.redirect.bind(this)
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      this.state.image
    ]);
    try {
      await Promise.all([...imageAssets]);
    } catch(error) {
      console.log(error)
    }
  }

  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email,
        visionId: this.state.id,
        image_url: this.state.image,
        description: this.state.description
      }
    )
  }



  render() {

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return ([
      <Header
        showCTA
        key={1}
        leftTitle=""
        rightTitle="Edit"
        rightTitleAction={() => this.redirect('EditVision')}
        leftTitleAction={() => {}}
      />,
      <ScrollView key={2} style={styles.scrollview}>
        <Image 
          source={{uri: this.state.image}} 
          style={styles.image}
        />
        <Text style={styles.text}>{this.state.description}</Text>
      </ScrollView>
    ])
  }
}

const styles = StyleSheet.create({
  scrollview: {
    marginTop: 15,
  },
  image: {
    width: width-32, 
    height: width-32, 
    borderRadius: 10, 
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 20,
    fontWeight: '300'
  }
})

export default ShowVision
