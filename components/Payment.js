import React, { useEffect, useState } from 'react'
import { Alert, Button, Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


import { SafeAreaView } from 'react-native-safe-area-context';
import Payees from './Payees';
import { searchUser } from '../api/server';

const Payment = ({ balanceChangedHook, visibility, userPhn, showThisComponent }) => {
    // visibility = true
    const [payees, setPayees] = useState([])
    const handlePayeesSearch = async (keyword = "") => {
        // if(keyword=)
        keyword = keyword.replace(/\s/g, '')
        let res = await searchUser(keyword)
        if (res.success)
            setPayees(res.users)
    }
    useEffect(() => { handlePayeesSearch("") }, [])
    // return (
    //     // <SafeAreaView>
    //         <View style={styles.centeredView}>
    //         <Text>adsad</Text>
    //             <Modal
    //                 animationType="slide"
    //                 transparent={true}
    //                 // visible={true}
    //                 visible={visibility}>
    //                 <View style={styles.modalItemsView}>
    //                     {/* <Text>Hello </Text> */}
    //                     <View style={styles.modalCloseBtn}>
    //                         <Pressable title={"close"} onPress={() => showThisComponent(!visibility)} >
    //                             <Text>X</Text>
    //                         </Pressable>
    //                         {/* <Text style={styles.modalCloseBtn} onPress={() => setModalVisible(!modalVisible)} >Close</Text> */}
    //                     </View>
    //                     <TextInput style={styles.searchBtn} onChangeText={handlePayeesSearch} placeholder='Search with phone number or name' />
    //                     <Payees balanceChangedHook={balanceChangedHook} userPhn={userPhn} payees={payees} />
    //                 </View>
    //             </Modal>
    //         </View>
    //     // </SafeAreaView>
    // )
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibility}>
                <View style={styles.centeredView}>
                    {/* <View style={{ borderColor: 'red', borderBottomWidth: 0, borderTopWidth: 4 }}> */}
                    <View style={styles.modalView}>
                        <View style={styles.modalCloseBtn}>
                            <Pressable title={"close"} onPress={() => showThisComponent(!visibility)} >
                                <Text style={{ fontSize: 25 }}>x</Text>
                            </Pressable>
                        </View>

                        <TextInput style={styles.searchBtn} onChangeText={handlePayeesSearch} placeholder='Search with phone number or name' />
                        <Payees balanceChangedHook={balanceChangedHook} userPhn={userPhn} payees={payees} />
                        {/* </View> */}
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
        </View>
    );
}

export default Payment


// const styles = StyleSheet.create({
//     centeredView: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         // alignItems: 'center',
//         margin: 70,
//         // backgroundColor: 'lightgray',
//         // position:'relative'
//     },
//     modalView: {
//         margin: 20,
//         // position: "absolute",
//         // marginBottom: 0,
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 35,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     button: {
//         borderRadius: 20,
//         padding: 10,
//         elevation: 2,
//     },
//     buttonOpen: {
//         backgroundColor: '#F194FF',
//     },
//     buttonClose: {
//         backgroundColor: '#2196F3',
//     },
//     textStyle: {
//         color: 'white',
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     modalText: {
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     modalItemsView: {
//         marginTop: 100,
//         backgroundColor: 'white',
//         borderColor: 'gray',
//         borderRadius: 20,
//         borderWidth: 1,
//         gap: 5,
//         width: 350,
//         height: 450,
//         alignSelf: 'center'
//     },
//     modalCloseBtn: {
//         width: 70,
//         // backgroundColor:'lightblue'
//         // marginEnd:0,
//         margin: 10,
//     },
//     searchBtn: {
//         borderColor: "lightgray",
//         borderWidth: 1,
//         marginTop: 5,
//         height: 40,
//         maxWidth: 450,
//         borderRadius: 30,
//         paddingStart: 15,
//         paddingEnd: 15,
//         alignSelf: 'center'
//     },
// })

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: "40%",
    },
    modalView: {
        // marginBottom: "1%",
        backgroundColor: 'white',
        borderStartWidth: 2,
        borderStartColor: 'lightgray',
        borderEndWidth: 2,
        borderEndColor: 'lightgray',
        borderTopColor: 'lightgray',
        borderTopWidth: 4,
        borderRadius: 20,
        padding: 35,
        justifyContent: "space-between",
        gap: 10,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 300,
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
        // marginTop: 100,
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
        width: 40,
        height: 40,
        backgroundColor: 'lightblue',
        // marginEnd:0,
        alignItems: 'center',
        borderRadius: 100,
        margin: -20,
    },
    searchBtn: {
        borderColor: "lightgray",
        borderWidth: 1,
        marginTop: 30,
        height: 55,
        width: 300,
        borderRadius: 30,
        paddingStart: 15,
        paddingEnd: 15,
        alignSelf: 'center'
    },
});