import { StyleSheet, Text,Image,TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'

export default function PhotoView({ uri, onClose, aiResponse}) {
    const imageUri = uri;

    return (
        <ScrollView style={styles.photoViewContainer}>
            <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="contain"
                onError={(error) => console.log('Image loading error:', error)}
            />
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.AIRes}>{aiResponse}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    photoViewContainer: {
        flex: 1,
        backgroundColor: 'black',
        fontFamily: 'Roboto',
    },
    previewImage: {
        flex: 1,
        width: '100%',
        height: undefined,
        aspectRatio: 0.9,
        marginTop: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 55,
        right: 20,
        padding: 10,
        backgroundColor: 'darkblue',
        borderRadius: 5,
        marginBottom: 50,
        fontWeight: 'bold',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    AIRes:{
        padding: 20,
        textAlign: 'justify',
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        fontSize: 17,
    },
});