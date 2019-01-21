import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, Dimensions} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Polyline from '@mapbox/polyline';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width/height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class LocScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			initialPosition: {
				latitude: 0,
				longitude: 0,
				latitudeDelta: 0,
				longitudeDelta: 0
			},
			markerPosition: {
				latitude: 0,
				longitude: 0
			},
			parkingPosition: {
				latitude: null,
				longitude: null
			},
			coords: [],		
			location: null,
			directionValidity: 'false'
		}
		this._mergeLot = this._mergeLot.bind(this);
	}

	static navigationOptions = {
		title: 'Location Services',
	};



	componentDidMount = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			var lat = parseFloat(position.coords.latitude)
			var long = parseFloat(position.coords.longitude)
			var initialRegion = {
				latitude: lat,
			    longitude: long,
			    latitudeDelta: LATITUDE_DELTA,
			    longitudeDelta: LONGITUDE_DELTA,
			}

			this.setState({initialPosition: initialRegion})
			this.setState({markerPosition: initialRegion})
			Alert.alert(this.state.markerPosition.latitude + "--------" + this.state.markerPosition.longitude)
			Alert.alert(this.state.parkingPosition.latitude + "--------" + this.state.parkingPosition.longitude)
		},
		(error) => {
			Alert.alert(JSON.stringify(error))
		}, {
			enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
		})

		this.watchID = navigator.geolocation.watchPosition((position) => {
			var lat = parseFloat(position.coords.latitude)
			var long = parseFloat(position.coords.longitude)
			var newRegion = {
				latitude: lat,
				longitude: long,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			}

			//this.setState({initialPosition: newRegion})
			this.setState({markerPosition: newRegion})
		})
	}

	// shouldComponentUpdate(nextProps, nextState) {
 //        return nextState.parkingPosition.latitude != this.state.parkingPosition.latitude;
 //    }

  	ComponentWillUnmount() {
  		navigator.geolocation.clearWatch(this.watchID)
  		var nullify = {
  			latitude: null,
  			longitude: null
  		}
  		this.setState({parkingPosition: nullify})
  	}

  	_mergeLot() {
  		//console.log("I");
  		if(this.state.parkingPosition.latitude != null && this.state.parkingPosition.longitude != null) {
  			let destination = this.state.parkingPosition.latitude + "," + this.state.parkingPosition.longitude
  			//let destination = '30.4393696' + "," + '-97.6200043'
  			let source = this.state.markerPosition.latitude + "," + this.state.markerPosition.longitude
  			console.log('destination' + destination + ";;" + ' source' + source)
  			this.setState({location: destination}, () => {

  				this._getDirections(source, destination);
  			});
  		}
  	}

  	async _getDirections(source, destination) {
  		try {
  			const API_KEY = 'AIzaSyDQJFoWenQWTnMW-zFkQyU2-p_FJlh72ns'
  			let response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${ API_KEY }&origin=${ source }&destination=${ destination }`);
  			let responseJSON = await response.json();
  			console.log(responseJSON)
  			let points = Polyline.decode(responseJSON.routes[0].overview_polyline.points);
  			let coords = points.map((point, index) => {
  				return {
  					latitude: point[0],
  					longitude: point[1]
  				}
  			})
  			this.setState({coords: coords})
  			this.setState({directionValidity: 'true'})
  			return coords
  		} catch(error) {
  			Alert.alert(error)
  			this.setState({directionValidity: 'error'})
  			return error
  		}
  	}

  	_onMarkerClick = () => {
  		Alert.alert("Making current location as parking spot")

  		navigator.geolocation.getCurrentPosition((position) => {
			var lat = parseFloat(position.coords.latitude)
			var long = parseFloat(position.coords.longitude)
			//Alert.alert(lat + "~~~~~~" + long)
			//Alert.alert(this.state.markerPosition.latitude + "!!!!!!" + this.state.markerPosition.longitude)
			var curRegion = {
				latitude: lat,
			    longitude: long,
			    latitudeDelta: LATITUDE_DELTA,
			    longitudeDelta: LONGITUDE_DELTA,
			}
			console.log("Parking lot " + this.state.markerPosition.latitude + ";" + this.state.markerPosition.longitude)
			this.setState({parkingPosition: curRegion})
			//this._mergeLot() ------------------------------------------->>>>>>>>>>
		},
		(error) => {
			Alert.alert(JSON.stringify(error))
		}, {
			enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
		})

  		// Alert.alert(this.state.parkingPosition.latitude + "--------" + this.state.parkingPosition.longitude)
  	}

	render() {
		return (
	    	<View style={styles.container}>
		      	<MapView provider={PROVIDER_GOOGLE}
		      		style = {styles.maps} region = {this.state.initialPosition}>
		      		
		      		{
		      			//First click sets current pos as parking spot
		      			
		      			this.state.parkingPosition.latitude == null && this.state.parkingPosition.longitude == null && 
		      				<MapView.Marker draggable coordinate={this.state.markerPosition}
		      					title={"Marker before parking"}
		      					pinColor={'green'}
		      					onDragEnd={(e) => console.log("Marker before spot")}
		      					onPress={this._onMarkerClick}/>	
		      				//<MapView.Marker coordinate={this.state.parkingPosition}
		      				// onDragEnd={(e) => this.setState({markerPosition: e.nativeEvent.coordinate})}
		      				//onPress={this._mergeLot()}/>
		      			
					}

					{
						this.state.parkingPosition.latitude != null && this.state.parkingPosition.longitude != null && 
		      				<MapView.Marker draggable coordinate={this.state.parkingPosition}
		      					title={"Set parking spot"}
		      					pinColor={'yellow'}
		      					onDragEnd={(e) => console.log("Inside parking marker")}
		      					/>	
		      				
					}

		      		
		      		{	//REGION NOT PARKING LOT
		      			//this.state.parkingPosition.latitude != this.state.markerPosition.latitude && this.state.markerPosition.longitude != this.state.parkingPosition.longitude && 
		      			<MapView.Marker draggable coordinate={this.state.markerPosition}
		      			title={"Non parking spot"}
		      			onPress={() => this._mergeLot()}
		      			onDragEnd={(e) => {
		      				// this.setState({markerPosition: e.nativeEvent.coordinate})
		      				// console.log(e.nativeEvent.coordinate)
		      				console.log("This is my non parking spot")
		      			}}
		      			/>	
		      		}

		      		{
		      			this.state.directionValidity == 'true' && <MapView.Polyline
            			coordinates={this.state.coords} strokeWidth={2} strokeColor="red"/>
		      		}

		      		{
		      			this.state.directionValidity == 'error' && <MapView.Polyline
          				coordinates={[
              				{latitude: this.state.markerPosition.latitude, longitude: this.state.markerPosition.longitude},
              				{latitude: this.state.parkingPosition.latitude, longitude: this.state.parkingPosition.longitude},
          				]}
          				strokeWidth={2}
          				strokeColor="red"/>
		      		}
		      		
		      	</MapView>

	      	</View>
	    );
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maps: {
  	left: 0, right:0, top:0, bottom:0, position:'absolute'
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
