/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { SafeAreaView, ScrollView, Alert, StatusBar, StyleSheet, Text, useColorScheme, View, } from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging'

var fcmUnsubscribe = null

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text style={[ styles.sectionTitle, {  color: isDarkMode ? Colors.white : Colors.black, }, ]}> {title}</Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  ); };

class App extends React.Component {

  componentDidMount(){
    messaging()
  .requestPermission()
  .then(authStatus => {
console.log('APNs Status: ', authStatus);
if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus == messaging.AuthorizationStatus.PROVISIONAL) {
  messaging()
  .getToken()
  .then(token => {
    console.log('messaging.getToken: ', token);
  });
  messaging().onTokenRefresh(token => {
    console.log('messaging.onTokenRefresh: ', token)
  });
  fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new message just arrived. ', remoteMessage);

    Alert.alert(
        remoteMessage.notification.title, 
        remoteMessage.notification.body)
  });
}
  })
  .catch(err => {
console.log('messaging.requestPermission Error: ', err);
  });
} 
  
  //  isDarkMode = useColorScheme() === 'dark';


render () {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content', 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        >
        <Header />
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <Section title="Welcome">
            This is a simple <Text style={styles.highlight}> App Interface</Text> to test our Push notification App. 
          </Section>
        
        </View>
      </ScrollView>
    </SafeAreaView>
  );  }; };

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
