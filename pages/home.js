import React from 'react';
import { StyleSheet } from 'react-native';
import DrawerComponent from './components/drawer.js'
import Tabs from './components/tabs.js'
import EntryCard from './components/entry-card.js'
import Footer from './components/footer.js'

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showVision: true,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
    }

    this.pressTab = this.pressTab.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  redirect(routeName) {
    this.props.navigation.navigate(
      routeName,
      { accessToken: this.state.accessToken, 
        email: this.state.email
      }
    )
  }

  pressTab(){
    this.state.showVision ? 
    this.setState({ showVision: false}) : 
    this.setState({ showVision: true})
  }

  render() {
    console.log('home', this.props)
    return (
      <DrawerComponent {...this.props}>
        <Tabs 
          onPressJournalTab={this.pressTab}
          onPressVisionTab={this.pressTab}
          visionTabStyle={this.state.showVision ? styles.tab : null}
          journalTabStyle={!this.state.showVision ? styles.tab : null}
        />

        <EntryCard
          email={this.state.email}
          accessToken={this.state.accessToken}
        />

        <Footer 
          email={this.state.email}
          accessToken={this.state.accessToken}
          {...this.props}
        />
      </DrawerComponent>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    backgroundColor: 'transparent'
  },
   mantraCard: {
    zIndex: 1,
    minHeight: 130,
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  }
})

export default Home