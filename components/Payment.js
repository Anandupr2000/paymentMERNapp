import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TextInput } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';


import Payees from './Payees';
import { searchUser } from '../api/server';
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { selectUserPhn } from '../store/features/user/userSlice';

const windowDimensions = Dimensions.get('screen');


// const Payment = ({ balanceChangedHook, visibility, userPhn, showThisComponent }) => {
const Payment = React.forwardRef(({ balanceChangedHook, userPhn, showThisComponent }, ref) => {
    // visibility = true
    const [payees, setPayees] = useState([])
    const [height, setHeight] = useState(windowDimensions.height)
    const [keyboardInpStatus, setKeyboardInpStatus] = useState(false)


    const snapPoints = useMemo(() => ['45%', '65%', '85%'], []);
    // const snapPoints = useMemo(() => ["25%"], []);

    const handleSheetChanges = (index) => {
        console.log('handleSheetChanges', index);
        // ref.current?.snapToIndex(0)
        if (index < 0) showThisComponent(false)
        else showThisComponent(true)
    };


    Dimensions.addEventListener('change', () => {
        let height = Dimensions.get('screen').height
        let width = Dimensions.get('screen').width
        if (height > width)
            setHeight(Dimensions.get('screen').height * 0.9)
        else
            setHeight(Dimensions.get('screen').width)
    })

    const handlePayeesSearch = async (keyword = "", phn = userPhn) => {
        // if(keyword=)
        keyword = keyword.replace(/\s/g, '')
        let res = await searchUser(keyword, phn)
        if (res.success)
            setPayees(res.users)
    }

    useEffect(() => {
        handlePayeesSearch()
        showThisComponent(true)
    }, [])

    // backdrop
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );
    // useFocusEffect(
    //     useCallback
    // useEffect(() => {

    //     // if(navigation)

    // }, [])
    // // )
    return (
        <BottomSheetModal ref={ref} snapPoints={snapPoints} index={0}
            // enableDynamicSizing={true}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={false}>
            <BottomSheetView >
                <TextInput style={styles.searchBtn} onFocus={e => { console.log('focus in'); ref.current?.snapToIndex(1) }}
                    onChangeText={handlePayeesSearch} placeholder='Search with phone number or name' />
            </BottomSheetView>
            <Payees paymentBottomSheetRef={ref} balanceChangedHook={balanceChangedHook} userPhn={userPhn} payees={payees} />
        </BottomSheetModal>
    )
})

export default Payment


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
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
        // borderWidth: 1,
        borderColor: "gray",
        // marginTop: 5,
        // height: 40,
        // minWidth:'100%',
        // borderRadius: 30,
        // paddingStart: 15,
        // paddingEnd: 15,
        // alignSelf: 'center'
        margin: 10,
        borderRadius: 20,
        fontSize: 16,
        padding: 8,
        paddingStart: 20,
        backgroundColor: 'rgb(211, 215, 230)',
    },
    footerContainer: {
        padding: 12,
        margin: 12,
        borderRadius: 12,
        backgroundColor: '#80f',
    },
    footerText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '800',
    },
})
