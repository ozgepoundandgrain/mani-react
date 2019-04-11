import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';


class EntryFeed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      mantras: []
    }

  }

  async componentDidUpdate(){
    this.fetchData()
  }

  async componentDidMount(){
    this.fetchData()
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

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerScroll}>
          {Object.values(this.state.mantras).map(mant => {
            return (
              <View style={styles.mantraCard} key={mant.id}>
                <Text style={styles.title}>{mant.title}</Text>
                <Text numberOfLines={5} style={styles.description}>{mant.description}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
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
    paddingTop: 40
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

export default EntryFeed