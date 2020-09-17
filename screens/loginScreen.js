import React from 'react';
import * as firebase from 'firebase'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ToastAndroid, Alert } from 'react-native';
export default class LoginScreen extends React.Component{
    constructor(){
        super()
         this.state={
             emailId:'',
             password:''
         }   
        
    }
login=async(email,password)=>{
    if(email && password){
        try{
            const response=await firebase.auth().signInWithEmailAndPassword(email,password)
            if(response){
                this.props.navigation.navigate('Transaction')
            }
        }
        catch(error){
            switch(error.code){
                case 'auth/user-not-found':
                    Alert.alert('user does not exist')
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Incorrect email or password')
            }
        }
    }
    else{
        Alert.alert('Enter email and password')
    }
}
    render(){
    return(
        <KeyboardAvoidingView>
            <View>
<Image source={require('../assets/booklogo.jpg')} 
style={{width:200,height:200}}
/>
<TextInput
placeholder='email'
keyboardType='email-address'
onChangeText={(text)=>{
   this.setState({
    emailId:text
   })
}}
></TextInput>
<TextInput
placeholder='password'
secureTextEntry={true}
onChangeText={(text)=>{
   this.setState({
    password:text
   })
}}/>
<TouchableOpacity
onPress={()=>{this.login(this.state.emailId, this.state.password)}}
>
    <Text>LOGIN</Text>
</TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
    }
}