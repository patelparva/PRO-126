import * as React from "react";
import { Button, View, Platform, ToastAndroid, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  constructor() {
    super();
    this.state = { image: "" };
  }

  componentDidMount=()=>{
    this.getPermissions()
  }

  getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (status !== "granted") {
        ToastAndroid.show(
          "Sorry, We need camera roll permissions to make this work!",
          ToastAndroid.LONG
        );
      }
    }
  };

  pickImage = async () => {
    try {
      var result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [11,15],
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({
          image: result.data,
        });

        this.uploadImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  uploadImage = async (imageURL) => {
    const data = new FormData();

    var fileName = imageURL.split("/")[imageURL.split("/").length - 1];
    var fileType = imageURL.split(".")[1];
    var type = `image/${fileType}`;

    const fileToUpload = { uri: imageURL, name: fileName, type: type };
    data.append("alphabet", fileToUpload);

    fetch("https://27b5-103-138-104-22.in.ngrok.io/predict-alphabet", {
      method: "POST",
      body: data,
      headers: { "content-type": "multipart/form-data" },
    })
      .then((response) => {
        response.json();
      })
      .then((result) => {
        console.log("Success : " + result);
        Alert.alert(result);
      })
      .catch((error) => {
        console.error("Error : " + error);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an Image"
          onPress={() => {
            this.pickImage();
          }}
        />
      </View>
    );
  }
}
