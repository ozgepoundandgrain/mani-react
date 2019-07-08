import React from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';

const LoadingModal = (props) => {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={props.visible}
      >
      <View style={styles.animationModal}>
      <View style={{ alignContent: 'center' }}>
        <Text style={styles.text}>Decide</Text>
        <Text style={styles.text}>Beleive</Text>
        <Text style={styles.text}>Visualize</Text>
        <Text style={styles.text}>Feel</Text>
        <Text style={styles.text}>Give thanks</Text>
        <Text style={styles.text}>Release</Text>
      </View>
    </View>
  </Modal>
    )
}

const styles = StyleSheet.create({
    text: {
        backgroundColor: "transparent",
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Abril-Fatface',
        paddingBottom: 40,
      },
      animationModal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.70)',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        height: '100%',
        width: '100%'
      }
})

export default LoadingModal