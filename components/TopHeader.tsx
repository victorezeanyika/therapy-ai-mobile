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
            padding:32,
        }}>
            <BackButton />
            <ThemedText>{title}</ThemedText>
            <ThemedText></ThemedText>
        </View>
    )
}