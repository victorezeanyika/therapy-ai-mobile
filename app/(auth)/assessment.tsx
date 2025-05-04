import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/ui/backbutton';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import { useSubmitUserPreferencesMutation } from '@/features/auth-api';
import { useToast } from '@/context/toast-context';
import { router } from 'expo-router';
import { useAppSelector } from '@/features/hooks';

const steps = [
  {
    key: 'primaryConcern',
    title: 'What brings you to HarmonyAI?',
    desc:'This helps us understand your primary focus area',
    options: ['Anxiety and Stress', 'Depression', 'Relationship Issues', 'Grief/Bereavement', 'Sleep Problems', 'Other'],
  },
  {
    key: 'therapyExperience',
    title: 'Have you tried therapy before?',
    desc:"This helps us personalize your experience",
    options: ['Yes, i\'m currently in therapy',
       'Yes, in the past',
        'I have always wanted to try it', 
        'It\'s been difficult to find one',
         'Prefer not to disclose',
          'Other'],
  },
  {
    key: 'preferredApproach',
    title: 'What are your main therapy goals?',
    desc:'Select what resonate most with you',
    options: ['Develop coping techniques', 'Build self-confidence', 'Calm anxiety', 'Better stress management', 'Personal growth'],
  },
  {
    key: 'communicationStyle',
    title: 'How would you describe your current mental well-being?',
    desc:'Be honest- there is no right or wrong answer',
    options: ['Consistently struggling', 'Having some difficult times', 'Going through ups and downs', 'In crisis'],
  }
];

const PreferencesSchema = z.object({
  primaryConcern: z.string(),
  therapyExperience: z.string(),
  preferredApproach: z.string(),
  communicationStyle: z.string()
});

export type PreferencesForm = z.infer<typeof PreferencesSchema>;
export default function AssessmentScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const btnBg = useThemeColor({light:'#FFFFFF', dark:'#232627'}, 'button')
  const [submitUserPreference, {isLoading:isSubmitting}] = useSubmitUserPreferencesMutation();
  const { success, error:toastError, info } = useToast();
  const { user } = useAppSelector(state => state.auth);

  const { control, handleSubmit, getValues, watch } = useForm<PreferencesForm>({
    resolver: zodResolver(PreferencesSchema),
    defaultValues: {
      primaryConcern: '',
      therapyExperience: '',
      preferredApproach: '',
      communicationStyle: ''
    }
  });
  const currentStep = steps[step];
  const selected = watch(currentStep.key as keyof PreferencesForm);

  const onNext = async () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      const preferences = getValues();
      try {
        const res = await submitUserPreference(preferences).unwrap();
        success("Your preferences have been saved successfully");
        router.replace('/(tabs)'); // Only redirect after successful save
      } catch (error) {
        toastError("Something went wrong.");
      }
    }
  };

  return (
    <ThemedView 
    lightColor=''
    style={{ flex: 1, padding: 20, paddingTop:40, }}>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
      }}>
      <BackButton />
      <View style={{
        backgroundColor:Colors.harmony.primary,
        width:56,
        height:28,
        borderRadius:32,
        justifyContent:'center',
        
      }}> 
       <Text style={{
        fontFamily: 'Gotham-Bold',
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
      }}>{step + 1} of {steps.length}</Text>

      </View>
      </View>
      
      <ThemedText
       type='title' 
       style={{ 
         fontSize: 20,
         marginTop: 30
        }}>
        {currentStep.title}
      </ThemedText>
      <ThemedText type='subtitle' style={{
        fontSize:12,
        marginTop:12,
        marginBottom:40,
      }}>
        {currentStep.desc}
      </ThemedText>

      <Controller
        control={control}
        name={currentStep.key as keyof PreferencesForm}
        render={({ field: { onChange } }) => (
          <FlatList
  data={currentStep.options}
  keyExtractor={(item) => item}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => onChange(item)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: selected === item ? Colors.harmony.primary : btnBg,
        padding: 20,
        borderRadius: 30,
        marginBottom: 10,
      }}
    >
      {/* Option text */}
      <ThemedText 
        style={{
        color: selected === item ?  'white' :'black',
        fontSize: 16,
        fontFamily: 'Gotham-Medium',
        flexShrink: 1,
      }}>
        {item}
      </ThemedText>

      {/* Radio circle on the right */}
      <View style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: selected === item ? 'white' : '#888',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
      }}>
        {selected === item && (
          <View style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: 'white',
          }} />
        )}
      </View>
    </TouchableOpacity>
  )}
/>

        )}
      />

      <TouchableOpacity
        onPress={onNext}
        disabled={!selected}
        style={{
          backgroundColor: selected ? Colors.harmony.primary : '#444',
          padding: 20,
          borderRadius: 30,
          alignItems: 'center',
          marginVertical: 20,
          flexDirection:'row',
          justifyContent:'center',
          gap:20,
        }}
      >
        <Text style={{ color: 'white', fontFamily:'Gotham-bold', fontWeight: 'bold' }}>
          {step === steps.length - 1 ? 'Submit' : 'Continue'}
        </Text>
        <Feather 
        name='chevron-right'
        color='white'
        size={16}
          />
      </TouchableOpacity>
    </ThemedView>
  );
}
