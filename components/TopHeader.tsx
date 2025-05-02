import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import BackButton from "./ui/backbutton";

export default function TopHeader({title}:{title:string}){
    return (
        <View
         style={{
            
            justifyContent:'space-between',
            alignItems:'center',
            flexDirection:'row',
            paddingTop:32,
            paddingBottom:10,
            paddingHorizontal:20,
        }}>
            <BackButton />
            <ThemedText>{title}</ThemedText>
        </View>
    )
}