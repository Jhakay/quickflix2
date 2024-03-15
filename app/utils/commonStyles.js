import { StyleSheet, Dimensions } from "react-native";

//Get device screen dimensions
const {width, height} = Dimensions.get('window');

//Calculate responsive sizes
const responsiveSize = (size) => width * size/100;

//Define common styles
export const commonStyles = StyleSheet.create({
    button: {
        backgroundColor: '#6D31EDFF',
        width: responsiveSize(88),
        height: height * 0.045,
        borderRadius: responsiveSize(1.5),
        justifyContent: 'center',
        alignItems: 'center',   
    },

    buttonText: {
        fontSize: responsiveSize(2.8),
        fontWeight: '600',
        color: '#FFFFFF',
    },

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: window.height * 0.15,
        alignItems: 'center',
    },

    heading: {
        fontSize: responsiveSize(5),
        fontWeight: 'bold',
        marginBottom: responsiveSize(3),
    },

    headerText: {
        fontSize: responsiveSize(5),
        fontWeight: 'bold',
        marginBottom: responsiveSize(3),
    },

    hLinkText: {
        fontSize: responsiveSize(4.5),
        paddingTop: responsiveSize(5),
    },

    input: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 5,
        padding: 8,
        width: responsiveSize(88), 
        marginBottom: responsiveSize(2),
    },

});