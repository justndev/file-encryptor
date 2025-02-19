import React from "react";
import { TextInput } from "react-native-paper";
import CustomIcon from "../CustomIcon";
import { icons } from "../../utils/icons";

interface CustomInputFabricProps {
  type: "email" | "password" | "confirmPassword";
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}

const CustomInputFabric: React.FC<CustomInputFabricProps> = ({
  type,
  value,
  onChangeText,
  error,
  showPassword,
  toggleShowPassword,
}) => {
  const getLabel = () => {
    switch (type) {
      case "email":
        return "Email";
      case "password":
        return "Password";
      case "confirmPassword":
        return "Confirm Password";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "email":
        return <CustomIcon source={icons.mail}/>;
      case "password":
      case "confirmPassword":
        return <CustomIcon source={icons.lock}/>;
      default:
        return undefined;
    }
  };
  
  const getEyeIcon = () => {
    if (showPassword) return <CustomIcon source={icons.eye}/>
    else return <CustomIcon source={icons.eyeSlash}/>
  }

  return (
    <TextInput
      mode="outlined"
      label={getLabel()}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={type !== "email" && !showPassword}
      keyboardType={type === "email" ? "email-address" : "default"}
      autoCapitalize="none"
      error={!!error}
      style={{ marginBottom: 16, backgroundColor: "#fff" }}
      left={<TextInput.Icon icon={() =>getIcon()} />}
      right={
        (type === "password" || type === "confirmPassword") &&
        toggleShowPassword ? (
          <TextInput.Icon
            icon={()=> getEyeIcon()}
            onPress={toggleShowPassword}
          />
        ) : null
      }
    />
  );
};

export default CustomInputFabric;
