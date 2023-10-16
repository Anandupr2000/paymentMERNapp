import React, { useRef, useState } from 'react'
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { doPayment } from '../api/server'

function Payee({ balanceChangedHook, payor, payee }) {
    let payorPhn = payor;
    const [payeePhn, setPayeePhn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState(0);
    const textInputRef = useRef(null);
    const performPayment = () => {
        doPayment(payorPhn, payeePhn, amount).then(res => {
            if (res.success){
                Alert.alert("Payment","Your payment was successfull")
                balanceChangedHook(res.newBalance)
            }
        })
    }

    const handleConfirm = () => {
        onConfirm(amount);
    };

    return (
        <View style={styles.scrollViewItems}>
            <View style={styles.scrollViewItemsInfo}>
                <Text style={styles.name}>{payee.name}</Text>
                <Text style={styles.phone}>{payee.phn}</Text>
                {/* <Text style={styles.name}>Name</Text>
                        <Text style={styles.phone}>Phn</Text> */}
            </View>
            <View style={styles.payBtn}>
                <Button title='Pay' onPress={() => {
                    setPayeePhn(payee.phn)
                    setModalVisible(!modalVisible)
                }} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Enter amount to send</Text>
                        <TextInput
                            style={styles.amountInp}
                            value={amount.toString()}
                            onChangeText={(text) => setAmount(text)}
                        />
                        <Button title='ok' onPress={() => {
                            setModalVisible(!modalVisible)
                            performPayment()
                        }} />
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const Payees = ({ balanceChangedHook, userPhn, payees = [] }) => {
    return (
        <ScrollView style={styles.scrollView}>
            {
                payees?.map((payee, i) => (
                    <Payee key={i} balanceChangedHook={balanceChangedHook} payor={userPhn} payee={payee} />
                ))
            }
        </ScrollView>)
}

export default Payees
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
        gap: 20
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
    scrollView: {
        // height:300
        borderTopColor: 'black'
    },
    scrollViewItems: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // margin:20,
        marginTop: 10,
        marginStart: 20,
        marginEnd: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingBottom: 5,
        // width:340
    },
    scrollViewItemsInfo: {
        gap: 2
    },
    name: {
        fontSize: 18
    },
    phone: {
        color: 'gray'
    },
    payBtn: {
        height: 50,
        justifyContent: 'center'
    },
    amountInp: {
        borderColor: 'lightgray',
        padding: 5,
        borderWidth: 1,
        textAlign: 'center',
        width: 150,
        borderRadius: 15
    }
})