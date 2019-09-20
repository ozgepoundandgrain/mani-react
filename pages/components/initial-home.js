import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

class InitialHome extends React.Component {
  constructor(props){
    super(props);


    this.state = {
      image: ''
    }  


    this.redirect = this.redirect.bind(this)
  }

  async componentDidMount(){
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (newPermission.status === 'granted') {
        console.log('just granted')
      }
  } else {
      console.log('GRANTED ALREADY')
  }
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
          width={200}
          height={50}
          title="Add Affirmation"
          titleFontSize={16}
          titleColor="rgb(255,255,255)"
          backgroundColor="#542B52"
          borderRadius={4}
          onPress={() => this.redirect('PostMantra')} 
        />

        <Text style={{width: '100%', textAlign: 'center'}}>Or</Text>

        <AnimateLoadingButton
          width={200}
          height={50}
          title="Add Vision"
          titleFontSize={16}
          // ef={c => (this.loadingButton = c)}
          titleColor="rgb(255,255,255)"
          backgroundColor="#542B52"
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