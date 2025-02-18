import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Tailles prédéfinies (petit, moyen, grand)
const SIZE_STYLES = {
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  large: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    fontSize: 18,
  },
};

// Thèmes de couleur
const BUTTON_STYLES = {
  primary:   { backgroundColor: Colors.primary,   textColor: Colors.blanc },
  secondary: { backgroundColor: Colors.secondary, textColor: Colors.blanc },
  success:   { backgroundColor: Colors.green,     textColor: Colors.blanc },
  danger:    { backgroundColor: Colors.red,       textColor: Colors.blanc },
  warning:   { backgroundColor: Colors.neutral_red,   textColor: Colors.primary },
  info:      { backgroundColor: Colors.neutral_green, textColor: Colors.primary },
  light:     { backgroundColor: Colors.light_grey,    textColor: Colors.primary },
  dark:      { backgroundColor: Colors.grey,         textColor: Colors.blanc },
  outline:   { backgroundColor: 'transparent', textColor: Colors.primary, borderWidth: 1, borderColor: Colors.primary },
  rounded:   { backgroundColor: Colors.secondary, textColor: Colors.blanc, borderRadius: 25 },
  link:      { backgroundColor: 'transparent', textColor: Colors.secondary },
};

const CustomButton = ({
  title,
  type = 'primary',
  backgroundColor,
  textColor,
  size = 'medium',
  paddingVertical,
  paddingHorizontal,
  fontSize,
  //
  borderRadius = 5,
  borderColor,
  icon,
  onPress,
  style: userStyle,
}) => {
  const themeStyle = BUTTON_STYLES[type] || {};
  
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.medium;

  const finalPaddingVertical   = paddingVertical   ?? sizeStyle.paddingVertical;
  const finalPaddingHorizontal = paddingHorizontal ?? sizeStyle.paddingHorizontal;
  const finalFontSize = fontSize ?? sizeStyle.fontSize;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          // Couleurs
          backgroundColor: backgroundColor || themeStyle.backgroundColor,
          borderColor: borderColor ?? themeStyle.borderColor ?? 'transparent',
          borderWidth: themeStyle.borderWidth || 0,
          // Coins arrondis
          borderRadius: borderRadius || themeStyle.borderRadius || 0,
          // Paddings dynamiques
          paddingVertical:   finalPaddingVertical,
          paddingHorizontal: finalPaddingHorizontal,
        },
        userStyle 
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={textColor || themeStyle.textColor}
            style={styles.icon}
          />
        )}
        <Text style={[
          styles.text,
          {
            color: textColor || themeStyle.textColor,
            fontSize: finalFontSize,
          },
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default CustomButton;
