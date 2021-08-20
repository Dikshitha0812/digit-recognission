import * as React from 'react';
import { View, Button, Platform, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker;'

export default class PickImage extends React.Component {
    constructor(){
        super();
        this.state = {
            image : ''
        }
    }
    componentDidMount() {
        this.getCameraPermissions();
    }
    getCameraPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            if (status !== "granted") {
                Alert.alert("Sorry. We need the gallery access to make the app work")
            }
        }
    }
    uploadImage = async(uri) =>{
        const data = new FormData();
        var filename = uri.split("/")[uri.split("/").length - 1]
        var type = `image/${uri.split(".")[uri.split('.').length -1]}`
        const fileToupload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append("digit", fileToupload);
        fetch( "https://b06dded88b31.ngrok.io/predict-digit", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        .then((response)=>response.json())
        .then((result )=>{
            console.log("Success", result)
        })
        .catch(error){
            console.log("failure", error)
        }
    }

    pickImage = async() =>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypesOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            });
            if(!result.cancelled){
                this.setState({image: result.data});
                this.uploadImage(result.uri);
            }

        }
        catch(E){
            console.log(E);
        }
    }
    render() {
        return (<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Button title="Select any digit image form gallery" onPress={this.pickImage()} />
        </View>)
    }
}