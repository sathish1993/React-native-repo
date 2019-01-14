/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, TextInput, Picker} from 'react-native';
import {StackNavigator} from 'react-navigation';

const App = StackNavigator({
  Translation: { screen: TransScreen },
  Location: { screen: LocScreen },
});

export default App;

type Props = {};
class TransScreen extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      text:'',
      trText:'',
      language: 'fr'
    }
  }

  static navigationOptions = {
    title: 'Translation Page',
  };

  _onButtonPress = () => {
    //Alert.alert(this.state.text)
    let fromLang = 'en';
    let toLang = this.state.language;
    let textInput = this.state.text;

    const API_KEY = 'AIzaSyAvBbnU8nS5ECFJmzVraiuJspQR3R8J4mI';
    let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    url += '&q='+encodeURI(textInput);
    url += `&source=${fromLang}`;
    url += `&target=${toLang}`;

    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(res => {return res.json();})
    .then((response) => {
      console.log("Response is", response);
      this.setState({trText:response.data.translations[0].translatedText})
    })
    .catch(error => {
      Alert.alert('There was an error with the translation request: ', error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, backgroundColor: 'powderblue', padding:10}}>
           

      </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {marginTop: 50, marginLeft: 15, fontSize: 20},
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    margin: 20
  }
});
