import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import { TouchableOpacity, Animated, TextInput } from "react-native";
import { Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const RenderField = ({field, props}:{field:any, props:any}) => {
    switch (props.fieldType) {
        case 'input':
            const [showPass, setShowPass] = useState(false);
            const showPassword = () => setShowPass(!showPass);
            return (
                <ThemedView
                lightColor="#FFFFFF"
                darkColor="#232627"
                style={{
                    borderRadius: 10,
                    flexDirection: 'row', 
                    width: '100%',
                    height: 46,
                    alignItems: 'center',
                    paddingHorizontal:20,
                    
                }}> 
                {props.icon &&
                 <Feather 
                 name={props.icon}
                 color='#ACB5BB'
                 size={16}
                />
                }
                    <TextInput 
                        style={{
                            flex: 1,
                            fontFamily: 'Gotham-Book',
                            width: '100%',
                            fontSize: 14,
                            height: '100%',
                            padding: 10,
                        }}
                        keyboardType={props.keyboardType}
                        value={field.value}
                        placeholder={props.placeholder}
                        onChangeText={(text) => {
                            const value = props.keyboardType === 'numeric' ? Number(text) || 0 : text;
                            field.onChange(value);
                        }}
                        onBlur={field.onBlur}
                        secureTextEntry={props.name === 'password' && !showPass}
                    />
                    {props.name === 'password' && (
                        <TouchableOpacity onPress={showPassword}>
                            <Feather
                                name={showPass ? 'eye' : 'eye-off'}
                                size={16}
                                color='#ACB5BB'
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                    )}
                </ThemedView>
            );
        default:
            return null;
    }
};

interface CustomFormFieldProps {
    control: any;
    name: string;
    label?: string;
    errors?: any;
    fieldType: 'input' | 'select';
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    minRequired?: number;
    keyboardType?: 'numeric' | 'text';
    icon?:string
}

export default function CustomFormField(props: CustomFormFieldProps) {
    const { control, name, label, errors } = props;
    
    return (
        <Controller 
            control={control}
            name={name}
            render={({field}) => (
                <View style={{ marginTop: 5 }}>
                    {label && (
                        <ThemedText 
                        lightColor="#6C7278"
                        darkColor="#ffffff"
                        style={{
                            fontSize: 12, 
                            fontFamily: 'Gotham-Book',
                        }}>
                            {label}
                        </ThemedText>
                    )}
                    <RenderField 
                        field={field}
                        props={props}
                    />
                    {errors && (
                        <Text style={{
                            color:'red',
                            marginTop: 8,
                            fontFamily: 'Ubuntu',
                            fontSize: 14,
                        }}>
                            {errors.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
}