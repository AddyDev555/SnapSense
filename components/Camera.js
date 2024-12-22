import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import PhotoView from './PhotoView';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default function Camera() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [latestPhoto, setLatestPhoto] = useState(null);
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef(null);
    const [aiResponse, setAiResponse] = useState(null);
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Request media permissions on component mount
    useEffect(() => {
        (async () => {
            if (!mediaPermission) {
                await requestMediaPermission();
            }
        })();
    }, []);

    if (!permission || !mediaPermission) {
        // Permissions are still loading
        return <View />;
    }

    if (!permission.granted || !mediaPermission.granted) {
        // Either camera or media permissions are not granted
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need camera and media library permissions</Text>
                <Button
                    onPress={async () => {
                        await requestPermission();
                        await requestMediaPermission();
                    }}
                    title="Grant permissions"
                />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }


    async function clickPhoto() {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ base64: true });
                const asset = await MediaLibrary.createAssetAsync(photo.uri);
                setLatestPhoto(photo.uri)

                const imageData = {
                    inlineData: {
                        data: photo.base64,
                        mimeType: "image/jpeg"
                    }
                };
    
                // Send to Gemini with both prompt and image
                const prompt = "Analyze this image and describe what you see in one max paragraph also if there is any other language than English then translate it to English";
                const result = await model.generateContent([prompt, imageData]);
                const response = await result.response;
                const text = response.text();
                console.log('Gemini analysis:', text);
                setAiResponse(text);


            } catch (error) {
                console.error('Error capturing photo:', error);
                // Show error to user
                alert('Failed to save photo: ' + error.message);
            }
        }
    }

    return (
        <View style={styles.container}>
            {latestPhoto ? (
                <PhotoView
                    uri={latestPhoto}
                    onClose={() => {
                        setLatestPhoto(null); 
                        setAiResponse(null);
                    }}
                    aiResponse = {aiResponse}
                />
            ) : (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={clickPhoto}>
                            <Image source={require('../assets/circle.png')} style={styles.clickBtn} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Image source={require('../assets/flip.png')} style={styles.flipBtn} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        paddingBottom: 20,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    button: {
        flex: 0,
        marginLeft: 'auto',
        marginRight: 30,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    flipBtn: {
        width: 35,
        height: 35,
        marginBottom: 15,
    },
    clickBtn: {
        width: 70,
        height: 70,
        marginLeft: 90,
    },
})