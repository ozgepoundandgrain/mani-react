import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableHighlight, FlatList } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';

class MantraFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }

    this.redirect = this.redirect.bind(this)
  }

  componentWillMount() {
    this.fetchData()
  }

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
    return (
      this.state.mantras ?
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerScroll}>
        <FlatList
          keyExtractor={(index) => index.toString()}
          numColumns={1}
          data={(this.state.mantras).reverse()}
          renderItem={({item, index}) => 
              <TouchableHighlight
                key={index}
                onPress={() => this.redirect('EditMantra', item.id, item.title, item.description)}
                underlayColor="transparent"
                activeOpacity={0}
              >
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
              </TouchableHighlight>
          }
          />
        </View>
      </ScrollView>
      :
      <Text>nothing</Text>
    )
  }
}

const styles = StyleSheet.create({
  mantraCard: {
    minHeight: 130,
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
    marginTop: 40
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
  }
})

export default MantraFeed