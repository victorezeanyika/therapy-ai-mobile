import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import { TouchableOpacity, Animated, TextInput } from "react-native";
import { Text, View } from "react-native";

const RenderField = ({field, props}:{field:any, props:any}) => {
    switch (props.fieldType) {
        case 'input':
            const [showPass, setShowPass] = useState(false);
            const showPassword = () => setShowPass(!showPass);
            return (
                <View 
                style={{
                    backgroundColor: Colors.lightgray,
                    borderRadius: 10,
                    borderColor: Colors.purple,
                    flexDirection: 'row', 
                    marginTop: 10, 
                    width: '100%',
                    height: 50,
                    alignItems: 'center'
                }}>
                    <TextInput 
                        style={{
                            flex: 1,
                            color: Colors.secondary,
                            fontFamily: 'Ubuntu',
                            width: '100%',
                            fontSize: 18,
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
                                size={24}
                                color={Colors.secondary}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            );

        case 'select':
            const [selectedValues, setSelectedValues] = useState<string[]>(
                Array.isArray(field.value) ? field.value : []
            );
            const [searchQuery, setSearchQuery] = useState('');
            const [scaleAnims] = useState(() => 
                props.options?.reduce((acc: any, _: any) => {
                    acc[_.value] = new Animated.Value(1);
                    return acc;
                }, {})
            );

            const handleSelect = useCallback((value: string) => {
                // Animate the selection
                Animated.sequence([
                    Animated.timing(scaleAnims[value], {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnims[value], {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]).start();

                const newSelected = selectedValues.includes(value)
                    ? selectedValues.filter(v => v !== value)
                    : [...selectedValues, value];
                
                setSelectedValues(newSelected);
                field.onChange(newSelected);
            }, [selectedValues, field, scaleAnims]);

            const filteredOptions = props.options?.filter((option: { value: string; label: string }) => 
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
                <View>
                    {/* Search Input */}
                    <View style={{
                        backgroundColor: Colors.lightgray,
                        borderRadius: 10,
                        marginVertical: 10,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Feather name="search" size={20} color={Colors.gray} />
                        <TextInput
                            style={{
                                marginLeft: 10,
                                flex: 1,
                                fontFamily: 'Ubuntu',
                                fontSize: 16,
                                color: Colors.secondary
                            }}
                            placeholder={`Search ${props.placeholder}...`}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Selected Count */}
                    <Text style={{
                        fontFamily: 'Ubuntu',
                        fontSize: 14,
                        color: Colors.gray,
                        marginBottom: 8
                    }}>
                        Selected: {selectedValues.length} 
                        {props.minRequired && ` (Minimum ${props.minRequired} required)`}
                    </Text>

                    {/* Options Grid */}
                    <View style={{ 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        gap: 8,
                        marginTop: 8 
                    }}>
                        {filteredOptions?.map((option: { value: string; label: string }) => (
                            <Animated.View
                                key={option.value}
                                style={{
                                    transform: [{ scale: scaleAnims[option.value] }]
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => handleSelect(option.value)}
                                    style={{
                                        backgroundColor: selectedValues.includes(option.value) 
                                            ? Colors.purple 
                                            : Colors.lightgray,
                                        borderRadius: 20,
                                        padding: 12,
                                        minWidth: 100,
                                        alignItems: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 2,
                                    }}
                                >
                                    <Text style={{
                                        color: selectedValues.includes(option.value) 
                                            ? 'white' 
                                            : Colors.secondary,
                                        fontFamily: 'Ubuntu',
                                        fontSize: 16,
                                    }}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    {/* No Results Message */}
                    {filteredOptions?.length === 0 && (
                        <Text style={{
                            textAlign: 'center',
                            marginTop: 20,
                            color: Colors.gray,
                            fontFamily: 'Ubuntu'
                        }}>
                            No exam types found
                        </Text>
                    )}
                </View>
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
}

export default function CustomFormField(props: CustomFormFieldProps) {
    const { control, name, label, errors } = props;
    
    return (
        <Controller 
            control={control}
            name={name}
            render={({field}) => (
                <View style={{ marginTop: 20 }}>
                    {label && (
                        <Text style={{
                            color: Colors.gray,
                            fontSize: 18, 
                            fontFamily: 'Ubuntu',
                            marginBottom: 8
                        }}>
                            {label}
                        </Text>
                    )}
                    <RenderField 
                        field={field}
                        props={props}
                    />
                    {errors && (
                        <Text style={{
                            color:Colors.red,
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