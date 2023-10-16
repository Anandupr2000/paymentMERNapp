import React, { useState } from 'react'
import { Alert, Button, Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';

function Popup({ type, msg, msgHook = null }) {
    const [modalVisible, setModalVisible] = useState(false);
    const message = msg;
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View>
                </View>
                <View style={styles.centeredView}>
                    <Text>Hello </Text>
                    <View style={styles.modalView}>
                        {
                            type == "alert" &&
                            <Text style={styles.modalText}>Hello World!</Text>
                        }
                        {
                            type == "prompt" &&
                            <TextInput
                                placeholder="Enter your message here"
                                value={message}
                                onChangeText={(text) => msgHook && msgHook(text)}
                                onSubmitEditing={() => alert(`Welcome to ${message}`)}
                            />
                        }
                        <Button title='close' onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
export default Popup;