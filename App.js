import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {

  let camera;

  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [fotos, setFoto] = useState([])
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  async function requestPermission() {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted')
  }

  async function flipCamera() {
    if (type === Camera.Constants.Type.back) {
      setType(Camera.Constants.Type.front)
    } else {
      setType(Camera.Constants.Type.back)
    }
  }

  async function flashCamera() {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  }

  async function takePicture() {
    if (!camera) return
    const photo = await camera.takePictureAsync()
    setFoto([...fotos, photo])
  }

  useEffect(() => {
    requestPermission();
  }, [])

  if (hasPermission == null) {
    return <View></View>
  }

  if (hasPermission === false) {
    return <View><Text>Não foi possível acessar a câmera</Text></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewCamera}>
        <Camera ref={ref => camera = ref} type={type} flashMode={flashMode} style={styles.camera}>
          <View style={{ margin: 20 }}>
            <Button title="Alternar" onPress={() => flipCamera()}></Button>
            <Button title="Flash" onPress={() => flashCamera()}></Button>
            <Button title="Tirar foto" onPress={() => takePicture()}></Button>
          </View>
        </Camera>
      </View>
      <View style={styles.preview}>
        <ScrollView horizontal={true}>
          {
            fotos.map((foto, index) => <Image key={index} style={styles.imgPreview} source={{ uri: foto && foto.uri }}></Image>)
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1
  },
  viewCamera: {
    flex: 6,
    backgroundColor: 'pink'
  },
  preview: {
    flex: 2,
    flexDirection: 'row',
  },
  imgPreview: {
    margin: 1,
    width: 150,
  }
});