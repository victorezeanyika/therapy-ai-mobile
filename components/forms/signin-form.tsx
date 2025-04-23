// import React, { useEffect } from "react";
// import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable, Alert, SafeAreaView } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { router } from "expo-router";
// import Colors from "@/constants/Colors";
// import Button from "@/components/Button";
// import BackButton from "@/components/BackButton";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import CustomFormField from "@/components/CustomFormField";
// import { useLoginMutation } from "@/features/auth-api";
// import { setCredentials, setUser } from "@/features/auth-slice";
// import { useAppSelector } from "@/features/hooks";

// const Signin = () => {
//   const dispatch = useDispatch();
//   const isAuthenticated = useAppSelector(state  => state.auth.isAuthenticated);
//   const [login, { isLoading }] = useLoginMutation();

//   // Auto-redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push("/(tabs)");
//     }
//   }, [isAuthenticated]);

//   const userLoginSchema = z.object({
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z.string().min(8, { message: "Password must be at least 8 characters." }),
//   });

//   const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof userLoginSchema>>({
//     resolver: zodResolver(userLoginSchema),
//   });

//   const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
//     try {
//       const result = await login(data).unwrap();
  
//       // Save user `id` in Redux store
//       dispatch(setCredentials({ user: result.user }));
  
//       Alert.alert("Success", "Login successful");
  
//       // Navigate to home
//       router.push("/(tabs)");
//     } catch (error: any) {
      
//       if (error?.data?.error === "Email not verified") {
//         router.push({
//           pathname: "/(auth)/verify-email",
//           params: { email: data.email },
//         });
//         return;
//       }
  
//       Alert.alert(
//         error?.data?.message ||
//         error?.data?.error ||
//         error?.message ||
//         "An error occurred"
//       );
//     }
//   };
  
  

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <KeyboardAvoidingView style={styles.formContainer}>
//           <BackButton />
//           <Text style={styles.heading}>Login</Text>
//           <Text style={styles.subHeading}>Enter Your Passpadi Username and Password</Text>

//           <CustomFormField
//             name="email"
//             label="Email"
//             placeholder="Enter your Passpadi Email"
//             control={control}
//             errors={errors.email}
//             fieldType="input"
//           />

//           <CustomFormField
//             name="password"
//             label="Password"
//             placeholder="Enter your Password"
//             control={control}
//             errors={errors.password}
//             fieldType="input"
//           />

//           <Pressable onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotPassword}>
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </Pressable>

//           <View style={styles.buttonContainer}>
//             <Button
//               onPress={handleSubmit(onSubmit)}
//               title="Login"
//               color={Colors.secondary}
//               textColor={Colors.white}
//               isLoading={isLoading}
//             />
//           </View>

//           <Pressable onPress={() => router.navigate("/(auth)/signup")} style={styles.link}>
//             <Text style={styles.linkText}>
//               Don't have an account? <Text style={styles.linkBold}> Register Now!!</Text>
//             </Text>
//           </Pressable>

//           <Pressable onPress={() => router.navigate("https://www.passpadi.com/privacy")} style={styles.link}>
//             <Text style={styles.linkText}>Our Privacy and Policy</Text>
//           </Pressable>
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     padding: 20,
//   },
//   formContainer: {
//     width: "100%",
//   },
//   heading: {
//     fontSize: 25,
//     fontFamily: "Ubuntu",
//     marginTop: 25,
//     color: Colors.secondary,
//   },
//   subHeading: {
//     fontSize: 18,
//     fontFamily: "Raleway",
//     color: Colors.gray,
//   },
//   buttonContainer: {
//     marginTop: 45,
//     width: "100%",
//   },
//   link: {
//     marginTop: 20,
//     color: Colors.gray,
//   },
//   linkText: {
//     textAlign: "center",
//     fontFamily: "ubuntu",
//     fontSize: 16,
//   },
//   linkBold: {
//     fontWeight: "500",
//     color: Colors.blue,
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     marginTop: 10,
//   },
//   forgotPasswordText: {
//     color: Colors.blue,
//     fontFamily: "Ubuntu",
//     fontSize: 14,
//   },
// });

// export default Signin;