// This is a mock implementation of a local AI service.
// In a real application, this function would interact with an on-device
// machine learning model (e.g., using TensorFlow.js, ONNX Runtime, or WebLLM).
// For demonstration, it returns predefined suggestions based on keywords.
export async function suggestTasks(goal) {
    const lowerCaseGoal = goal.toLowerCase();
    // Simulate a delay, as a local model might take a moment to run.
    await new Promise(resolve => setTimeout(resolve, 300));
    if (lowerCaseGoal.includes('party')) {
        return [
            { title: 'Send invitations', description: 'Create and send out invitations to all guests.' },
            { title: 'Plan the menu', description: 'Decide on food and drinks, and create a shopping list.' },
            { title: 'Arrange decorations', description: 'Buy or create decorations to set the mood.' },
            { title: 'Create a playlist', description: 'Compile a music playlist for the party atmosphere.' },
        ];
    }
    if (lowerCaseGoal.includes('vacation') || lowerCaseGoal.includes('trip')) {
        return [
            { title: 'Book flights and accommodation', description: 'Find and book travel and lodging for the trip.' },
            { title: 'Create an itinerary', description: 'Outline daily activities and sights to see.' },
            { title: 'Pack luggage', description: 'Gather and pack all necessary clothing and items.' },
            { title: 'Arrange for pet/house sitter', description: 'Organize care for your home and pets while away.' },
        ];
    }
    if (lowerCaseGoal.includes('learn') || lowerCaseGoal.includes('skill')) {
        return [
            { title: 'Research learning resources', description: 'Find books, online courses, and tutorials.' },
            { title: 'Create a study schedule', description: 'Allocate specific times for learning and practice.' },
            { title: 'Practice daily', description: 'Dedicate a small amount of time each day to practice.' },
            { title: 'Find a mentor or community', description: 'Connect with others to get feedback and support.' },
        ];
    }
    // Default suggestions
    return [
        { title: 'Define the main objective', description: 'Clearly state the primary outcome you want to achieve.' },
        { title: 'Break down into smaller steps', description: 'List all the individual actions required to reach the goal.' },
        { title: 'Set a deadline', description: 'Establish a target date for completion to stay motivated.' },
    ];
}
