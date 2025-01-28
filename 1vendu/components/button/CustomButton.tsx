import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const BUTTON_STYLES = {
    primary: { backgroundColor: Colors.primary, textColor: Colors.blanc },
    secondary: { backgroundColor: Colors.secondary, textColor: Colors.blanc },
    success: { backgroundColor: Colors.green, textColor: Colors.blanc },
    danger: { backgroundColor: Colors.red, textColor: Colors.blanc },
    warning: { backgroundColor: Colors.neutral_red, textColor: Colors.primary },
    info: { backgroundColor: Colors.neutral_green, textColor: Colors.primary },
    light: { backgroundColor: Colors.light_grey, textColor: Colors.primary },
    dark: { backgroundColor: Colors.grey, textColor: Colors.blanc },
    outline: { backgroundColor: 'transparent', textColor: Colors.primary, borderWidth: 1, borderColor: Colors.primary },
    rounded: { backgroundColor: Colors.secondary, textColor: Colors.blanc, borderRadius: 25 },
    link: { backgroundColor: 'transparent', textColor: Colors.secondary },
};

const CustomButton = ({
                          title,
                          type = 'primary',
                          backgroundColor,
                          textColor,
                          size = 'medium',
                          borderRadius = 5,
                          icon,
                          onPress,
                      }) => {
    const buttonStyle = BUTTON_STYLES[type] || {};
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor || buttonStyle.backgroundColor,
                    borderRadius: borderRadius || buttonStyle.borderRadius,
                    borderWidth: buttonStyle.borderWidth || 0,
                    borderColor: buttonStyle.borderColor || 'transparent',
                },
                size === 'small' && styles.small,
                size === 'large' && styles.large,
            ]}
            onPress={onPress}
        >
            <View style={styles.content}>
                {icon && <Ionicons name={icon} size={20} color={textColor || buttonStyle.textColor} style={styles.icon} />}
                <Text style={[styles.text, { color: textColor || buttonStyle.textColor }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 5,
    },
    small: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    large: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
});

export default CustomButton;
