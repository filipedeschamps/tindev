import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAvoidingView, StyleSheet, Platform, Text, Image, TextInput, TouchableOpacity } from 'react-native'

import api from '../services/api.js'

import logo from '../assets/logo.png'

export default function Login( {navigation }) {
    const [user, setUser] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user })
            }
        })
    }, [])

    /* Avoid creating new functions inside render
     * and functional components, it turns out
     * that creating a new reference to a function
     * everytime a render function runs (which happens
     * pretty often) can lead to performance issues.
     */
    async function handleLogin() {
        const response = await api.post('/devs', { username: user })
        const { _id } = response.data

        await AsyncStorage.setItem('user', _id)

        navigation.navigate('Main', { user: _id })
    }

    return (
    <KeyboardAvoidingView style={styles.container}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
    >
        <Image source={logo}></Image>

        <TextInput
            autoCapitalize='none'
            autoCorrect={false}            
            placeholder='Digite seu usuário no Github'
            placeholderTextColor='#999'
            style={styles.input}
            value={user}
            onChangeText={setUser}
        />

        <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
})