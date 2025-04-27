export async function fetchMotivationalQuote() {
    return "Believe in yourself! Every journey starts with a single step.";
  }
  
  export const featuresData = [
    { id: '1', title: 'Clear and precise', 
      image:require('../assets/images/precise.png'),
      description: 'Radiate confidence and clarity in your actions.' },
    { id: '2',
       title: 'Personalized Approach',
       image:require('../assets/images/location.png'),
       description: 'Receive tailored advice for your unique journey.' },
    { id: '3',
       title: 'Increased Efficiency',
       image:require('../assets/images/efficient.png'),
        description: 'Achieve goals faster with optimized strategies.' }
  ];
  
  export async function fetchBotResponse(userInput: string) {
    return `You said: "${userInput}". Let's dive deeper!`;
  }
  
  export const activityOptions = [
    { id: 'a1', name: 'Choose an Activity' },
    { id: 'a2', name: 'Another Task' }
  ];
  