import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import DrawerComponent from './components/drawer.js'
import MantraFeed from './components/mantra-feed.js'
import VisionFeed from './components/vision-feed.js'
import Footer from './components/footer.js'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

var {width, height} = Dimensions.get('window')


class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showVision: true,
      email: this.props.navigation.state.params.email,
      accessToken: this.props.navigation.state.params.accessToken,
      mantras: this.props.navigation.state.params.mantras,
      visions: this.props.navigation.state.params.visions,
      index: 0,
      routes: [
        { key: 'first', title: 'Vision Board' },
        { key: 'second', title: 'Manifestation Journal' },
      ],
    }

    this.pressTab = this.pressTab.bind(this)
  }

  pressTab(){
    this.state.showVision ? 
    this.setState({ showVision: false}) : 
    this.setState({ showVision: true})
  }

  FirstRoute = () => (
    <VisionFeed
    email={this.state.email}
    accessToken={this.state.accessToken}
    data={this.state.visions}
    {...this.props}
  />
);
SecondRoute = () => (
  <MantraFeed
    email={this.state.email}
    accessToken={this.state.accessToken}
    data={this.state.mantras}
    {...this.props}
  />
);


  render() {
    return (
      <DrawerComponent {...this.props}>
      <TabView
        renderTabBar={props =>
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={styles.tabStyle}
          />
        }
        navigationState={this.state}
        renderScene={SceneMap({
          first: this.FirstRoute,
          second: this.SecondRoute,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}

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
    backgroundColor: 'transparent',
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
   mantraCard: {
    zIndex: 1,
    minHeight: 130,
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  scene: {
    flex: 1,
  },
  tabStyle: {
    backgroundColor: 'transparent', 
    marginTop: (width === 320) ? 15 : 30
  }
})

export default Home