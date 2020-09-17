import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config'

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            allTransactions:[],
            lastVisibleTransaction:null,
            search:''
        }
    }
    searchTransaction=async(text)=>{
        var text=this.state.search.toUpperCase()
        var enteredText=text.split('')
        if(enteredText[0].toUpperCase()==='B'){
        const query=await db.collection('transactions').where('bookId','==',text).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    else if(enteredText[0].toUpperCase()==='S'){
        const query=await db.collection('transactions').where('studentId','==',text).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    }
    componentDidMount=async()=>{
        const query=await db.collection('transactions').get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })

        
    }
    fetchMoreTransactions=async()=>{
        var text=this.state.search.toUpperCase()
        var enteredText=text.split('')
        if(enteredText[0].toUpperCase()==='B'){
        const query=await db.collection('transactions').where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    else if(enteredText[0].toUpperCase()==='S'){
        const query=await db.collection('transactions').where('studentId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    }
    render(){
    return(
        <View>
            <TextInput
            placeholder='enter Id'
            onChangeText={(text)=>{this.setState({search:text})}}
            ></TextInput>
            <TouchableOpacity
            onPress={()=>{this.searchTransaction(this.state.search)}}
            >
                <Text>Search</Text>
            </TouchableOpacity>
        <FlatList
            
                data={this.state.allTransactions}
                renderItem={({item})=>{

                
                    <View style={{borderBottomWidth:2}}> 
                    <Text> {'Book Id'+ item.bookId} </Text>
                    <Text> {'Student Id'+ item.studentId} </Text>
                    <Text> {'transaction Type'+ item.transactionsType} </Text>
                </View>
                }}
                keyExtractor={(item,index)=>index.toString()}
                onEndReached={this.fetchMoreTransactions}
                onEndReachedThreshold={0.7}
        />
           
    
    </View>
    )}
}