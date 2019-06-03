import React from 'react';
import { StyleSheet, Image, Dimensions, Text, ScrollView } from 'react-native';
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

    console.log('SHOW', this.props)
    return ([
      <Header
        key={1}
        leftTitle=""
        rightTitle="Edit"
        rightTitleAction={() => this.redirect('EditVision')}
      />,
      <ScrollView key={2}>
        <Image 
          source={{uri: this.state.image}} 
          style={{width: width, height: width}}
        />
        <Text>{this.state.description}</Text>
      </ScrollView>
    ])
  }
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    zIndex: 2,
   },
   headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    marginBottom: 20,
  },
})

export default ShowVision
