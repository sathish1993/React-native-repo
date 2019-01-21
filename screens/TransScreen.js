import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, TextInput, Picker, Keyboard} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default class TransScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text:'',
      trText:'',
      language: 'fr',
      items: [
        {label: 'French', value: 'fr'},
        {label: 'Tamil', value: 'ta'},
        {label: 'German', value: 'de'},
        {label: 'Italian', value: 'it'},
        {label: 'Spanish', value: 'es'},
      ]
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
  	const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{flex:3, backgroundColor: 'powderblue', padding:10}}>
         
        	<Text style={styles.welcome}> Enter Text to translate </Text>
        	<TextInput style={styles.txtIn} placeholder="Type here to translate!"
        		multiline={true} numberOfLines= {4}
              onSubmitEditing={Keyboard.dismiss}
          		onChangeText={(text) => this.setState({text})}/>
          <RNPickerSelect placeholder = {{
                        label: 'Select a language...',
                        value: null,
                    }}
            style={styles.picker}
            items={this.state.items}
            onValueChange={(value) => {
              this.setState({language: value});
            }} 
            value={this.state.language}
          />
			     <Button style={styles.button} title="Click to translate" onPress={this._onButtonPress}/>
      		<Text>{this.state.trText}</Text>
      	</View>
      	<View style={{flex:1, backgroundColor: 'powderblue', padding:10}}>
      		<Button style={styles.button} title="Go to Location Services"
        		onPress={() => navigate('Location')}/>
        </View>
     </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtIn: {marginTop: 50, marginLeft: 15, fontSize: 20, marginBottom: 20},
  welcome: {marginTop: 50, marginLeft: 15, fontSize: 20},
  picker: {
    marginBottom: 50, fontSize: 20
  },
  button: {
    marginTop: 100, marginLeft: 15
  }
});
