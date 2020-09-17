
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import TransactionScreen from './screens/TransactionScreen'
import SearchScreen from './screens/SearchScreen'
import LoginScreen from './screens/loginScreen';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default class App extends React.Component {
  render(){
  return (
   
      <AppContainer/>
    
   
  );
}
}
const tabNavigator=createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  search:{screen:SearchScreen}
})
defaultNavigationOptions:({navigation})=>({
  tabBarIcon:({})=>{
    const routeName=navigation.state.routeName
    if (routeName==='Transaction'){
      return(
        <Image
        source ={require('./assets/book.png')}
        style={{width:40,height:40}}
        />
      )
    }
else if(routeName==='Search'){
  return(
    <Image
    source ={require('./assets/searchingbook.png')}
        style={{width:40,height:40}}
    />
  )
}
  }
})
const SwitchNavigator=createSwitchNavigator({
  loginscreen:{screen:LoginScreen},
  tabNavigator:{screen:tabNavigator}
})
const AppContainer=createAppContainer(SwitchNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
