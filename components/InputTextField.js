import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './Styles'

class InputTextField extends React.Component {
    render = () => {
        return (
            <View style={this.props.style}>
                <Text style={styles.inputTitle}>{this.props.title}</Text>
                <TextInput
                    placeholder={this.props.placeholderText}
                    secureTextEntry={this.props.isSecure}
                    style={styles.input}
                    value = {this.props.value}
                    onChangeText = {this.props.changeText}
                    keyboardType = {this.props.keyboardType}
                    maxLength={this.props.maxLength}
                />
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#d8d8d8" }}></View>
            </View>
        )
    }
}

export default InputTextField