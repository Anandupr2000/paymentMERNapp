import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getTransactions } from '../api/server'
import { SCREEN_HEIGHT, SCREEN_WIDTH, WINDOW_HEIGHT } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/features/user/userSlice'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { isConnectedToInternet } from '../store/features/app/appSettingsSlice'

const Transactions = () => {
    const [loadingModalVisible, setLoadingModalVisible] = useState(false)
    const [tData, setTData] = useState([])
    const user = useSelector(selectUser)
    const haveInternet = useSelector(isConnectedToInternet)
    const syncData = () => {
        if (!haveInternet)
            Alert.alert("Internet", "Please connect to the internet")
        setLoadingModalVisible(true)
        getData().then(res => {
            setLoadingModalVisible(false)
        }).catch(err => {
            setLoadingModalVisible(false)
            Alert('Transactions', "Unable to load data")
        })
    }
    const getData = async () => {
        await getTransactions(user.phn).then(tArr => {
            setTData(tArr)
            console.log(tArr);
        })
    }
    useEffect(() => {
        getData()
        // setTData([])
    }, [])
    // console.log(tData);
    const produceDate = (dateString) => {
        let date = new Date(dateString)
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity
                role='button'
                accessibilityRole='button'
                accessibilityLabel='refresh'
                style={{ alignSelf: 'flex-end' }}
                onPress={e => {
                    console.log('settings icon pressed')
                    syncData()
                }}>
                <FontAwesome name='rotate-right' size={26} style={{ color: 'gray', paddingTop: 20, marginRight: 10 }} />
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={loadingModalVisible}
                visible={loadingModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 18 }}>Refreshing ...</Text>
                        <ActivityIndicator size={'large'} />

                    </View>
                </View>
            </Modal>
            {/* <Text style={styles.heading}>Transactions</Text> */}
            {
                tData.length > 0 ?
                    <View style={styles.transactions}>
                        <View style={styles.tableHeadings}>
                            {/* table heading */}
                            <View style={styles.tableCell}>
                                <Text style={styles.tableHeading}>Date</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={styles.tableHeading}>Payee</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text style={styles.tableHeading}>Amount</Text>
                            </View>
                        </View>
                        <ScrollView style={[styles.tableRows, { height: '75%' }]} >
                            {
                                tData.map((t, i) =>
                                    <View key={i} style={styles.tableRow}>
                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableCellTextNormal]}>{produceDate(t.time)}</Text>
                                        </View>

                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableCellTextNormal]}>{t.receiver}</Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            {
                                                t.sender == user.phn ?
                                                    <Text style={[styles.tableCellTextNormal, { color: 'red' }]}> {t.senderBalanceAfter - t.senderBalanceBefore}</Text>
                                                    :
                                                    <Text style={[styles.tableCellTextNormal, { color: 'green' }]}>+ {t.amount}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            }
                        </ScrollView>
                    </View>
                    :

                    <View style={styles.msgBox}>
                        <Text style={{ fontSize: 20, color: 'gray' }}>No data to display</Text>
                    </View>
            }

        </View>
    )
}

export default Transactions

const styles = StyleSheet.create({
    container: {
        maxHeight: SCREEN_HEIGHT
    },
    heading: {
        fontSize: 22,
        marginStart: 20,
        // color: 'gray'
    },
    tableCell: {
        // backgroundColor: 'red',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableHeadings: {
        marginTop: 30,
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: 35,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 2
    },
    tableHeading: {
        fontSize: 16,
        color: 'gray'

    },
    tableRows: {
        marginTop: 8,
    },
    tableRow: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // backgroundColor: 'red',
        color: 'gray',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1
    },
    tableCellTextNormal: {
        fontSize: 14
    },
    msgBox: {
        height: WINDOW_HEIGHT,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        // justifyContent: 'center'
        paddingTop: '30%',
        fontSize: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: '60%',
        backgroundColor: 'rgba(155,155,155,0.7)',

    },
    modalView: {
        margin: 20,
        backgroundColor: 'lightgray',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'lightgray',
        padding: 50,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.55,
        shadowRadius: 4,
        elevation: 200,
        gap: 30,
    }
})