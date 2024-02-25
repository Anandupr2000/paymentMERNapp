import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, SCREEN_WIDTH } from '@gorhom/bottom-sheet';
// import appLogo from '../assets/images/app_logo-removebg.png'

const About = forwardRef(({ showThisComponent }, ref) => {
    const snapPoints = useMemo(() => ['47%','75%'], []);

    const handlePresentModalPress = () => {
        ref.current?.present();
    };

    const handleSheetChanges = (index) => {
        console.log('handleSheetChanges', index);
        // ref.current?.snapToIndex(0)
        if (index < 0) showThisComponent(false)
        else showThisComponent(true)
    };
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
    return (
        // <View>
        //     <ImageBackground source={require('../assets/images/index_bg1.jpg')} resizeMode="cover" style={styles.image}>
        //         <Text>About</Text>
        //     </ImageBackground>
        // </View>

        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints} index={0}
            // enableDynamicSizing={true}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={{ paddingHorizontal: 20, width: SCREEN_WIDTH, gap: 15 ,minHeight:250}}>
                {/* <TextInput style={styles.searchBtn}
                    onFocus={e => {
                        console.log('focus in');
                        ref.current?.snapToIndex(1)
                    }}
                    // onChangeText={handlePayeesSearch} 
                    placeholder='Search with phone number or name' /> */}
                <View style={styles.title}>
                    <Image style={{
                        width: 100,
                        maxHeight: 80,
                        // maxWidth: 'auto',
                        objectFit: 'contain',
                        // backgroundColor:'black',
                        alignSelf: 'center'
                    }}
                        source={require('../assets/images/app_logo-removebg.png')} />
                    <Text style={styles.version}>v1.0</Text>
                </View>
                <Text style={styles.desc}>This is project developed by Btech CS 2024, for enabling payment process more convenient.</Text>
                <View style={styles.footerView}>
                    <Text style={styles.footer}>Copyright @ Hipay team 2024</Text>
                    <Text style={styles.footer}>All rights reserved</Text>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
})

export default About

const styles = StyleSheet.create({
    image: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        minHeight: '100%',
        margin: 0,
        paddingTop: 20,
        paddingBottom: 100,
    },
    title: {
        // backgroundColor:'brown',
        width: 200,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        textAlign: 'right',
        borderColor: '#b9dcfc',
        elevation: 1,
        borderWidth: 2,
        borderRadius: 10,
        padding: 12
    },
    appName: {
        alignSelf: 'center',
        fontSize: 40,
        color: 'cyan',
        fontStyle: 'italic'
    },
    version: {
        color: 'gray',
        fontSize: 15
    },
    desc: {
        fontSize: 16,
        alignSelf: 'center',
    },
    footerView: {
        position: 'absolute',
        bottom: '0%',
        alignSelf:'center'
    },
    footer: {
        alignSelf: 'center',
    }
})