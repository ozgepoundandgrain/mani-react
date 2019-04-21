import React from 'react';
import { 
  Image, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  FlatList,
  TouchableHighlight } from 'react-native';
import { AppLoading, Asset } from 'expo'
  

var {height, width} = Dimensions.get('window')

const cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

class VisionFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      image: '',
      isReady: false,
      visions: [],
      imagesURLarray: []
    }
  }

  imagesArray() {
    (this.state.visions).filter(vision => {
      this.setState({ imagesURLarray: vision.image_url })
    })
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      this.state.imagesURLarray
    ]);
    try {
      await Promise.all([...imageAssets]);
    } catch(error) {
      console.log(error)
    }
  }

  
  // componentDidMount() {
  //   this.fetchVision()
  //   this.imagesArray()
  // }

  // componentWillUpdate() {
  //   this.fetchVision()
  // }

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

  _renderItem = ({item}) => (
    <TouchableHighlight
      id={item.id}
      onPress={() => this.redirect('ShowVision', item.id, item.image_url, item.description)}
      underlayColor="transparent"
      activeOpacity={0}
    >
      <Image 
        key={item.id} 
        style={{height: width/3, width: width/3}} 
        source={{uri: item.image_url}}
      />
    </TouchableHighlight>
  );


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
    return (
      <ScrollView style={styles.scrollView}>
        {this.state.visions ?
        <FlatList
          keyExtractor={(item, index) => index}
          numColumns={3}
          data={(this.state.visions).reverse()}
          renderItem={this._renderItem}
      />
      :
      <Text>nothing</Text>
        }
      </ScrollView>
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
  }
})

export default VisionFeed