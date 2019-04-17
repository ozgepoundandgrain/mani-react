import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableHighlight } from 'react-native';

class ConfirmationModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      modalVisible: false
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.props.visible}
      >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Are you sure you want to delete this entry?</Text>
            <View style={styles.buttonsContent}>
              <TouchableHighlight
                onPress={this.props.onPressDelete}
                style={styles.deleteButton}
              >
                <Text style={{fontSize: 20, color: 'red'}}>Delete</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.cancelButton}
                onPress={this.props.onPressCancel}
              >
                <Text style={{fontSize: 20, color: 'white'}}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20, 
    textAlign: 'center', 
    color: 'white'
  },
  cancelButton: {
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 5, 
    padding: 15
  },
  deleteButton: {
    borderWidth: 1, 
    borderColor: 'red', 
    borderRadius: 5, 
    padding: 15
  },
   modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.90)',
    position: 'absolute', 
    top: 0, left: 0, 
    right: 0, bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center'
   },
   buttonsContent: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 50
   }
})

export default ConfirmationModal