import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const data = [
  {
    'copy': 'Your mind must arrive at the destination before your life does'
  },
  {
    'copy': 'When manfesting: Remember the fun and magic is in the journey, not the destination. The experiences, people and even the challenges along the way make your manifestation worthwhile. Dont forget to give thanks for all the moments, leading up to your manifestation. - Shakira Maria'
  },
  {
    'copy': 'The body doesn’t know the difference between an experience and a though. You can literally change your biology, neuro-circuitry, chemistry, hormones, and genes simply by having an inner event.  - Dr Joe Dispenza'
  },
  {
    'copy': 'If we truly believe in the universe delivering us our desires, we must let go. Not of the possibility of it happening, but because there is nothing left to do. It’s as good as done. Detach and let go with faith and confidence; not in your desire, but in the universe who all things are possible. - Shakira Maria'
  },
  {
    'copy': 'Express gratitude now because your desires are already yours! A grateful heart is a magnet for blessings. If you have faith that the universe has your back, give thanks now for your manifestations - Shakira Maria'
  },
  {
    'copy': 'You need to resonate with your desires in order to manifest them to “reality”. In order to resonate, you need to raise your vibration to that of your desire. This can be done with gratitude for everything you have now and affirming that the universe is working its magic to manifest your desired reality.'
  },
  {
    'copy': 'When visualizing, start by thinking of a happy memory, one filled with joy and happiness. Then switch your thoughts to your desire. This will supercharge your desire with positive emotions. Emotions are the driving force in the manifestation process -  Shakira Maria'
  },
  {
    'copy': 'It cannot be transformed unless it is felt - Phil Good'
  },
  {
    'copy': 'When you’re so passionate about something that it continuously crosses your mind and becomes a part of your lifestyle; the universe makes way for you to reach it.'
  },
  {
    'copy': 'I AM - Two of the most powerful words; for what you put after them shapes your reality'
  },
  {
    'copy': 'Whatever energy and intention you’re sending out into the ether, you will attract back to you. A part of being conscious is living in the moment and being grateful for now, for there is no better than now.'
  },
  {
    'copy': 'If you don’t like something, takes away it’s only power; your attention. Focus on the good. Use the magic of gratitude to attract more abundance. The art of knowing, is knowing what to ignore - Ruminator'
  },
  {
    'copy': 'The law of attraction cannot bring you positivity if you are not already that. You attract what you are.'
  },
  {
    'copy': 'If energy is neither created nor destroyed, everything you will ever want is already here. It is simply a matter of choosing the thought which will put you in harmonious vibration with what you desire - Hina Hashmi'
  },
  {
    'copy': 'Instead of saying “I want”, say “I have” and “I am” - Focus on your gratitudes and affirm confidence that the universe has your back'
  },
  {
    'copy': 'True currency of the earth is not money, it’s energy. Consistently be the energy that you want to attract.'
  }
]


class CarouselComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activeSlide: 0
    }
  }

  _renderItem ({item, index}) {
    return (
      <View style={styles.card}>
        <Text 
          style={styles.text}
          adjustsFontSizeToFit={true}
          numberOfLines={10}
          minimumFontScale={0.01}
        >
          {item.copy}
        </Text>
      </View>
    );
  }

  render () {
    return (
      <View>
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={data}
        renderItem={this._renderItem}
        sliderWidth={this.props.sliderWidth}
        itemWidth={this.props.itemWidth}
        layout={"stack"}
        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
      />
      </View>
    )
    }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 200,
    elevation: 5,
    backgroundColor: '#1D8ECE'
  },
  text: {
    color: '#ffffff',
    width: 250,
    fontSize: 200, 
    fontWeight: '300'
  }
})

export default CarouselComponent