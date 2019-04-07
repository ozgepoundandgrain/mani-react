import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

class Tabs extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.tabContainer}>
        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0}
          style={this.props.visionTabStyle}
          onPress={this.props.onPressVisionTab}
        >
          <Text style={styles.tabText}>Vision Board</Text>
        </TouchableHighlight> 

        <TouchableHighlight 
          underlayColor="transparent"
          activeOpacity={0}
          onPress={this.props.onPressJournalTab}
          style={this.props.journalTabStyle}
        >
          <Text style={styles.tabText}>Manifestation Journal</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  tabText: {
    paddingRight: 30,
    paddingLeft: 30,
    color: 'white',
    fontSize: 17
  }
})

export default Tabs