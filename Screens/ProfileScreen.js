import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUser } from '../store/features/user/userSlice'
import { TextInput } from 'react-native-gesture-handler'
import { TASK_UPDATE_USER } from '../constants'
import { updateUser } from '../api/server'

const Item = ({ item, editStatus, editTextHook }) => {
    const [value, setValue] = useState('')
    useEffect(() => {
        editTextHook(value)
    }, [value])
    useEffect(() => {
        // console.log(item);
        setValue(item.value)
    }, [item])
    return (
        <View style={styles.item} >
            <Text style={styles.title}>{item.title}</Text>
            {
                editStatus ?
                    <TextInput style={styles.editText} onChangeText={(text) => { setValue(text) }} value={value} />
                    :
                    <Text>{value}</Text>
            }
        </View>
    )
}

const ProfileScreen = ({ navigation }) => {
    const [user, setThisUser] = useState(useSelector(selectUser))
    // console.log(user);
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phn, setPhn] = useState('')

    const [editStatus, setEditStatus] = useState(false)
    const dispatch = useDispatch()


    const updateFields = () => {
        // console.log(Object.keys(user).length > 0);
        if (Object.keys(user).length > 0) {
            setUsername(user.name)
            setEmail(user.email)
            setPhn(user.phn)
        }
    }

    useEffect(() => {
        console.log("user data changed");
        updateFields()
    }, [user])

    useEffect(() => {
        updateFields()
        // console.log({ name: username, email: email, phn: phn });
    }, [])


    const handleEdit = (event, task) => {
        if (task == TASK_UPDATE_USER) {

            if (phn.length != 10) {
                Alert.alert("Invalid phone number", 'Please enter a valid phone number')
                return false
            }

            let id = user.pwd
            user.name = username
            user.email = email
            user.phn = phn

            // console.log(user);
            let updateData = { username: username, email: email, phn: phn }
            // console.log({ id: id, updateData });
            updateUser(id, updateData)
                .then(res => {
                    // console.log(res);
                    if (res.success) {
                        setThisUser(user)
                        dispatch(setUser(user))
                        Alert.alert('Profile', "Update success")
                    }
                    else
                        Alert.alert('Profile', "Update failed")
                    setEditStatus(!editStatus)
                })
                .catch(err => {
                    Alert.alert('Network', "Failed to reach server")
                    setEditStatus(!editStatus)
                })
        }
        else
            setEditStatus(!editStatus)
    }

    return (
        <View>
            <Item key={0} editTextHook={setUsername} editStatus={editStatus} item={{ title: "Name", value: username }} />
            <Item key={1} editTextHook={setEmail} editStatus={editStatus} item={{ title: "Email", value: email }} />
            <Item key={2} editTextHook={setPhn} editStatus={editStatus} item={{ title: "Phone number", value: phn }} />
            {
                editStatus ?
                    <View style={styles.submitForm}>
                        <View style={styles.btn}>
                            <Button title={'cancel'} onPress={(e) => handleEdit(e, 'cancel')}></Button>
                        </View>
                        <View style={styles.btn}>
                            <Button title={'submit'} onPress={(e) => handleEdit(e, 'update')}></Button>
                        </View>
                    </View>
                    :
                    <View style={styles.btn}>
                        <Button title={'edit'} onPress={handleEdit}></Button>
                    </View>
            }
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    item: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1
    },
    title: {
        flex: 1,
        fontSize: 18
    },
    btn: {
        width: 100,
        alignSelf: 'flex-end',
        padding: 10
    },
    editText: {
        borderWidth: 2,
        borderColor: 'lightblue',
        padding: 8,
        paddingStart: 20,
        borderRadius: 10
    },
    submitForm: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        gap: 5
    }
})