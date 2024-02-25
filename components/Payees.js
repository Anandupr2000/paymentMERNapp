import React, { useCallback, useRef, useState } from 'react'
import { Alert, Animated, Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { doPayment } from '../api/server'
import { BottomSheetScrollView, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { refresh } from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../store/features/user/userSlice';

function Payee({ balanceChangedHook, payor, payee }) {
    let payorPhn = payor;
    const [payeePhn, setPayeePhn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [activatePaymentBtn, setPaymentBtn] = useState(false);
    const [amount, setAmount] = useState(0);
    const textInputRef = useRef(null);
    const user = useSelector(selectUser)

    const dispatch = useDispatch()
    const performPayment = () => {
        doPayment(payorPhn, payeePhn, amount).then(res => {

            if (res.success) {
                Alert.alert("Payment", "Your payment was successfull")
                balanceChangedHook(res.newBalance)
                user.balance = res.newBalance
                dispatch(setUser(user))
                setAmount(0);
                setModalVisible(!modalVisible)
            }
            else
                Alert.alert("Payment", "Your payment failed")
            setPaymentBtn(false)
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
                transparent={modalVisible}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 20 }}>Enter amount to send</Text>
                        <View style={styles.amountView}>
                            <Text style={styles.amount}>₹</Text>
                            <TextInput
                                style={[styles.amountInp, styles.amount]}
                                value={amount.toString()}
                                onChangeText={(text) => setAmount(text)}
                            />
                        </View>
                        <View style={styles.modalActions}>
                            <Button title='Send' disabled={activatePaymentBtn} onPress={() => {
                                setPaymentBtn(true)
                                let pattern = /\D/g;
                                if (amount.match(pattern)) {
                                    alert("Please enter a valid amount!")
                                    setPaymentBtn(false)
                                }
                                else
                                    performPayment()

                            }} />

                            <Button title='close' color={'gray'} onPress={() => {
                                setModalVisible(!modalVisible)
                            }} />
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

const Payees = ({ balanceChangedHook, userPhn, payees = [] }) => {

    const renderItem = useCallback(
        (payee, i) =>
            <Payee key={i} balanceChangedHook={balanceChangedHook} payor={userPhn} payee={payee} />, []
    );

    // console.log(payees.length)
    return (
        // <ScrollView style={styles.scrollView}>
        <BottomSheetScrollView style={styles.scrollView} >
            {
                payees?.map(renderItem)
            }
        </BottomSheetScrollView>
    )
}

export default Payees
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.2)'
        // alignItems: 'center',
        // marginTop: '60%',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'lightgray',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.55,
        shadowRadius: 4,
        elevation: 200,
        gap: 20,
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
        // height: 'auto',
        // minHeight: SCREEN_HEIGHT * .7,
        // minHeight: '100%',
        borderTopColor: 'black',
        flex: 1,
        // backgroundColor: 'lightpink'
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
    amountView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amount: {
        fontSize: 36,
    },
    amountInp: {
        // borderColor: 'lightgray',
        padding: 5,
        // borderWidth: 1,
        textAlign: 'center',
        width: 'auto',
        height: 'auto',
        borderRadius: 15
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150
    }
})