import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableHighlight, FlatList } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';

class MantraFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      mantras: []
    }

    this.redirect = this.redirect.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  // componentWillUpdate() {
  //   this.fetchData()
  // }

  redirect(routeName, mantraId, title, description) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.props.accessToken, 
        email: this.props.email,
        mantraId: mantraId,
        title: title,
        description: description
      }
    )
  }

  _renderItem = ({item}) => (
    <View>
      <View style={styles.mantraCard} key={item.id}>
        <Text style={styles.title}>{item.title}</Text>
        <ViewMoreText
          numberOfLines={5}
          renderViewMore={this.renderViewMore}
          renderViewLess={this.renderViewLess}
        >
          <Text style={styles.description}>{item.description}</Text>
        </ViewMoreText>
      </View>

      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0}
        style={styles.buttonTouchable} 
        onPress={() => this.redirect('EditMantra', item.id, item.title, item.description)}
      >
        <View style={{flexDirection: 'row'}}>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
        </View>
      </TouchableHighlight>
      </View>
  );



  async fetchData(){
    try {
      let response = await fetch('https://prana-app.herokuapp.com/v1/mantras',{
                              method: 'GET',
                              headers: {
                                'X-User-Email': this.props.email,
                                'X-User-Token': this.props.accessToken,
                                'Content-Type': 'application/json',
                              }
                            });
        if (response.status >= 200 && response.status < 300) {
          this.setState({mantras: JSON.parse(response._bodyText).data})
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  renderViewMore(onPress){
    return(
      <Text onPress={onPress}>View more</Text>
    )
  }

  renderViewLess(onPress){
    return(
      <Text onPress={onPress}>View less</Text>
    )
  }

  render() {
    console.log('hello')
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerScroll}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          data={(this.state.mantras).reverse()}
          renderItem={this._renderItem}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mantraCard: {
    minHeight: 130,
    position: 'relative',
    width: '100%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  }, 
  scrollView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 10
  },
  innerScroll: {     
    marginBottom: 200
  },
  title: {
    fontSize: 20,
    color: '#13202E'
  },
  description: {
    fontSize: 18,
    color: 'white'
  },
  view: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 20
  },
  buttonTouchable: {
    position: 'absolute', 
    top: 0, 
    right: 0,
    paddingRight: 10,
    paddingTop: 5
  },
  circle: {
    height: 4, 
    width: 4, 
    borderRadius: 2, 
    backgroundColor: 'white', 
    margin: 2
  }
})

export default MantraFeed