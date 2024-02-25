import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const CustomBottomSheetModal = () => {
    // ref
    const bottomSheetModalRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['35%', '55%','75%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <View style={styles.container}>
            <Button
                onPress={handlePresentModalPress}
                title="Present Modal"
                color="black"
            />

            <BottomSheetModal
                ref={bottomSheetModalRef}
                // index={2}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enableHandlePanningGesture={true}
                enableContentPanningGesture={true}
                enablePanDownToClose={true} // Enable panning down to dismiss

            >
                <View style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </View>
            </BottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        // flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default CustomBottomSheetModal;