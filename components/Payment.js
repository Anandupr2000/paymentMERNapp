import React, { useEffect, useState } from 'react'
import { Alert, Button, Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Payees from './Payees';
import { searchUser } from '../api/server';

const Payment = ({ balanceChangedHook, visibility, userPhn, showThisComponent }) => {
    const [payees, setPayees] = useState([])
    const handlePayeesSearch = async (keyword = "") => {
        // if(keyword=)
        keyword = keyword.replace(/\s/g, '')
        let res = await searchUser(keyword)
        if (res.success)
            setPayees(res.users)
    }
    useEffect(() => { handlePayeesSearch("") }, [])
    return (
        <SafeAreaView>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    // visible={true}
                    visible={visibility}>
                    <View style={styles.modalItemsView}>
                        {/* <Text>Hello </Text> */}
                        <View style={styles.modalCloseBtn}>
                            <Button title={"close"} onPress={() => showThisComponent(!visibility)} />
                            {/* <Text style={styles.modalCloseBtn} onPress={() => setModalVisible(!modalVisible)} >Close</Text> */}
                        </View>
                        <TextInput style={styles.searchBtn} onChangeText={handlePayeesSearch} placeholder='Search with phone number or name' />
                        <Payees balanceChangedHook={balanceChangedHook} userPhn={userPhn} payees={payees} />
                    </View>
                </Modal>
            </View>
        </SafeAreaView>

    )
}

export default Payment


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 20,
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
    modalItemsView: {
        marginTop: 100,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRadius: 20,
        borderWidth: 1,
        gap: 5,
        width: 350,
        height: 450,
        alignSelf: 'center'
    },
    modalCloseBtn: {
        width: 70,
        // backgroundColor:'lightblue'
        // marginEnd:0,
        margin: 10,
    },
    searchBtn: {
        borderColor: "lightgray",
        borderWidth: 1,
        marginTop: 5,
        height: 40,
        maxWidth: 450,
        borderRadius: 30,
        paddingStart: 15,
        paddingEnd: 15,
        alignSelf: 'center'
    },
})