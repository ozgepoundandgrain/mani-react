import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableHighlight } from 'react-native';

const ConfirmationModal = (props) => {

    return (
      <Modal
        animationType="slide"
        transparent
        visible={props.visible}
      >
          <View style={styles.modalContent}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.buttonsContent}>
              <TouchableHighlight
                onPress={props.onPressDelete}
                style={styles.deleteButton}        
                underlayColor="#F2B5A7"
                activeOpacity={0}
              >
                <Text style={{fontSize: 20, color: 'white', fontWeight: '400'}}>Delete</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.cancelButton}
                onPress={props.onPressCancel}
                underlayColor="#F2B5A7"
                activeOpacity={0}
              >
                <Text style={{fontSize: 20, color: 'black', fontWeight: '400'}}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20, 
    textAlign: 'center', 
    color: 'black'
  },
  cancelButton: {
    borderWidth: 1, 
    borderColor: 'black', 
    borderRadius: 5, 
    padding: 15
  },
  deleteButton: {
    borderWidth: 1, 
    borderColor: '#F25252', 
    backgroundColor: '#F25252',
    borderRadius: 5, 
    padding: 15
  },
   modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
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