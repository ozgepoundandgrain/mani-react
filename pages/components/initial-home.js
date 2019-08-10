import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ImagePicker } from 'expo'
import AnimateLoadingButton from 'react-native-animate-loading-button';

class InitialHome extends React.Component {
  constructor(props){
    super(props);
    this.redirect = this.redirect.bind(this)
  }


  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.props.accessToken, 
        email: this.props.email,
        imageURI: this.state.image,
      }
    )
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.redirect('PostVision')
    }
  }

  render() {

    return (
      <View style={styles.container}> 
      <Text style={{width: '100%', textAlign: 'center', marginBottom: 20}}>
          Your vision board is empty
      </Text>

        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={200}
          height={50}
          title="Add Affirmation"
          titleFontSize={16}
          titleColor="rgb(255,255,255)"
          backgroundColor="rgb(29,18,121)"
          borderRadius={4}
          onPress={() => this.redirect('PostMantra')} 
        />

        <Text style={{width: '100%', textAlign: 'center'}}>Or</Text>

        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={200}
          height={50}
          title="Add Vision"
          titleFontSize={16}
          titleColor="rgb(255,255,255)"
          backgroundColor="rgb(29,18,121)"
          borderRadius={4}
          onPress={this._pickImage} 
        />
       </View>

    )
  }
}
const styles = StyleSheet.create({
    container: {
        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 50
    }
})

export default InitialHome