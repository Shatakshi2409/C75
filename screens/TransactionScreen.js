import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ToastAndroid, Alert } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import * as firebase from 'firebase'
import db from '../config'



export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:''
        }
    }
    handleTransaction=async()=>{
       var transactionType=await this.checkbookEligibilty();
       if(!transactionType){
           Alert.alert('the book does not exist in the library')
           this.setState({
               scannedStudentId:'',
               scannedBookId:''
           })
           
       }
       else if(transactionType==='issue'){
           var isStudentEligible=await this.checkStudentEligibiltyforbookIssue()
           if(isStudentEligible){
               Alert.alert('book issued to the student')
           }
       }
       else{
        var isStudentEligible=await this.checkStudentEligibiltyforbookReturn()
        if(isStudentEligible){
            Alert.alert('book returned to the library')
        }

       }
    }
    checkStudentEligibiltyforbookIssue=async()=>{
        const studentref=await db.collection('students').where('studentId','==','scannedStudentId').get()
        var isStudentEligible=''
        if(studentref.docs.length==0){
            this.setState({scannedStudentId:'',scannedBookId:''})
isStudentEligible=false
Alert.alert('the student does not exist in the database')
        }
        else{
            studentref.docs.map(doc=>{
                var student=doc.data()
                if(student.numberOfBooksIssued<2){
                    isStudentEligible=true
                }
                else{
                    isStudentEligible=false
                    Alert.alert('the student has already issued two books')
                    this.setState({scannedStudentId:'',scannedBookId:''})
                }
            })
        }
        return isStudentEligible
    }
    checkStudentEligibiltyforbookReturn=async()=>{
        const transactionref=await db.collection('transaction').where('bookId','==',this.state.scannedBookId).limit(1).get()
        var isStudentEligible=''
        
       
           transactionref.docs.map(doc=>{
                var lastBookTransaction=doc.data()
                if(lastVisibleTransaction.studentId===this.state.scannedStudentId){
                
                    isStudentEligible=true
                }
                else{
                    isStudentEligible=false
                    Alert.alert('the book was not issued by the same student')
                    this.setState({scannedStudentId:'',scannedBookId:''})
                }
            })
        
        return isStudentEligible
    }  
    checkbookEligibilty=async()=>{
        const bookref=await db.collection('books').where('bookId','==',this.state.scannedBookId).get()
        var transactionType=''
        if(bookref.docs.length==0){
            transactionType=false

        }
        else{
            bookref.docs.map(doc=>{
                var book=doc.data()
                if(book.bookAvailability){
                    transactionType='issue'
                }
                else{
                    transactionType='return'
                }
            })
        }
        return transactionType
    }
    initiatebookIssue=async()=>{
        db.collection('transactions').add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'issue'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
           'bookAvailability':false
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
         })
         Alert.alert('bookIssue')
         this.setState({
             scannedBookId:'',
             scannedStudentId:''
         })
    }
    initiatebookReturn=async()=>{
        db.collection('transactions').add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'return'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
           'bookAvailability':true
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
         })
         Alert.alert('bookIsReturned')
         this.setState({
             scannedBookId:'',
             scannedStudentId:''
         })
    }
    getCameraPermission = async (id) =>{
const {status}=await Permissions.askAsync(Permissions.CAMERA);
this.setState({
    hasCameraPermission:status==='granted',
    scanned:false,
    buttonState:id
})
    }
    handleBarCodeScanned=async({type,data})=>{
        this.setState({scanned:true,scannedData:data, buttonState:'normal'})
    }
    render(){
        const hasCameraPermission=this.state.hasCameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;
        if(buttonState==='clicked' && hasCameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined:this.handleBarCodeScanned}
style={StyleSheet.absoluteFillObject}
                ></BarCodeScanner>
            )
        }
        else if(buttonState ==='normal'){
    return(
<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View> 
            <View>
            
                <Image
                source ={require ('../assets/booklogo.jpg')}
                style={{width:200,height:200}}
                />
                <Text
                style={{textAlign:'center',fontSize:30}}
                >Wily</Text>
            </View>
            
                <View style={styles.inputView}>
<TextInput
style={styles.inputBox}
placeholder='Book Id'
onChangeText={text=>{
    this.setState({
        scannedBookId:text
    })
}}
value={this.state.scannedBookId}
></TextInput>
               
    <TouchableOpacity
    style={styles.scanButton}
    onPress={()=>{this.getCameraPermission('BookId')}}
    >

        <Text style={styles.buttonText}>Scan</Text>
    </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
<TextInput
style={styles.inputBox}
placeholder='Student Id'
onChangeText={text=>{
    this.setState({
        scannedStudentId:text
    })
}}
value={this.state.scannedStudentId}
></TextInput>
               
    <TouchableOpacity 
    style={styles.scanButton}
    onPress={()=>{this.getCameraPermission('StudentId')}}

    >

        <Text style={styles.buttonText}>Scan</Text>
    </TouchableOpacity>
        </View> 
        <TouchableOpacity
        style={styles.submitButton}
         onPress={async()=>{var transactionMessage=this.handleTransaction();
         this.setState({
scannedBookId:'',
scannedStudentId:''
         })
        }}
        >
            <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

        </View>
        </KeyboardAvoidingView>
    )}
}}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButton:{
      backgroundColor: '#FBC02D',
      width: 100,
      height:50
    },
    submitButtonText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      fontWeight:"bold",
      color: 'white'
    }
  });