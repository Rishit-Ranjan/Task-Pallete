// Hybrid AI service: Uses Google Gemini API if available, falls back to keyword-based suggestions
// When internet/API key available: Real AI suggestions via Gemini
// When offline/no key: Keyword-based suggestions

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function tryGeminiAPI(goal) {
    // Skip if no API key
    if (!GEMINI_API_KEY) {
        console.log('No Gemini API key configured, skipping AI API');
        return null;
    }

    try {
        const prompt = `Generate exactly 4 task suggestions for this goal: "${goal}"

Return ONLY a JSON array with exactly 4 objects. Each object must have "title" and "description" fields.
[
  {"title":"Task 1","description":"Description 1"},
  {"title":"Task 2","description":"Description 2"},
  {"title":"Task 3","description":"Description 3"},
  {"title":"Task 4","description":"Description 4"}
]`;

        console.log('Attempting Gemini API for goal:', goal);
        console.log('Using API key:', GEMINI_API_KEY.substring(0, 10) + '...');
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            }),
            signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Gemini API Response:', result);
        
        if (!result.candidates || !result.candidates[0]) {
            console.warn('No candidates in response');
            throw new Error('No candidates in response');
        }

        if (!result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
            console.warn('Invalid content structure');
            throw new Error('Invalid content structure');
        }

        const responseText = result.candidates[0].content.parts[0].text || '';
        console.log('Gemini response text:', responseText);
        
        // Parse JSON response - handle different formats
        const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
            try {
                const suggestions = JSON.parse(jsonMatch[0]);
                if (Array.isArray(suggestions) && suggestions.length >= 1) {
                    console.log('✓ Gemini API: Successfully generated', suggestions.length, 'suggestions');
                    return suggestions.slice(0, 4);
                }
            } catch (parseError) {
                console.warn('JSON parse error:', parseError.message);
            }
        } else {
            console.warn('Could not find JSON array in response');
        }
        
        return null;
    } catch (error) {
        console.warn('Gemini API failed:', error.message);
        return null;
    }
}

export async function suggestTasks(goal) {
    try {
        console.log('=== suggestTasks START ===');
        console.log('Goal:', goal);
        console.log('API Key available:', !!GEMINI_API_KEY);
        
        // Try Gemini API first
        console.log('Attempting Gemini API...');
        const aiSuggestions = await tryGeminiAPI(goal);
        if (aiSuggestions) {
            console.log('✓ Using AI suggestions');
            return aiSuggestions;
        }
        
        // Fallback to keyword-based suggestions
        console.log('✗ AI failed, using keyword-based suggestions');
        const defaultSugg = getDefaultSuggestions(goal);
        console.log('Keyword suggestions for "' + goal + '":', defaultSugg);
        console.log('=== suggestTasks END ===');
        return defaultSugg;
    } catch (error) {
        console.error('Error in suggestTasks:', error);
        return getDefaultSuggestions(goal);
    }
}

// Fallback suggestions if AI model fails
function getDefaultSuggestions(goal) {
    const lowerCaseGoal = goal.toLowerCase();
    
    if (lowerCaseGoal.includes('party') || lowerCaseGoal.includes('celebration')) {
        return [
            { title: 'Send invitations', description: 'Create and send out invitations to all guests.' },
            { title: 'Plan the menu', description: 'Decide on food and drinks, and create a shopping list.' },
            { title: 'Arrange decorations', description: 'Buy or create decorations to set the mood.' },
            { title: 'Create a playlist', description: 'Compile a music playlist for the party atmosphere.' },
        ];
    }
    if (lowerCaseGoal.includes('wedding') || lowerCaseGoal.includes('marriage') || lowerCaseGoal.includes('anniversary')) {
        return [
            { title: 'Plan the venue', description: 'Choose and book a suitable venue for the event.' },
            { title: 'Create guest list', description: 'Compile and organize who will attend.' },
            { title: 'Arrange catering', description: 'Book food and beverage services.' },
            { title: 'Plan decorations and flowers', description: 'Select and arrange floral arrangements and décor.' },
        ];
    }
    if (lowerCaseGoal.includes('vacation') || lowerCaseGoal.includes('trip') || lowerCaseGoal.includes('travel')) {
        return [
            { title: 'Book flights and accommodation', description: 'Find and book travel and lodging for the trip.' },
            { title: 'Create an itinerary', description: 'Outline daily activities and sights to see.' },
            { title: 'Pack luggage', description: 'Gather and pack all necessary clothing and items.' },
            { title: 'Arrange for pet/house sitter', description: 'Organize care for your home and pets while away.' },
        ];
    }
    if (lowerCaseGoal.includes('learn') || lowerCaseGoal.includes('skill') || lowerCaseGoal.includes('course')) {
        return [
            { title: 'Research learning resources', description: 'Find books, online courses, and tutorials.' },
            { title: 'Create a study schedule', description: 'Allocate specific times for learning and practice.' },
            { title: 'Practice daily', description: 'Dedicate a small amount of time each day to practice.' },
            { title: 'Find a mentor or community', description: 'Connect with others to get feedback and support.' },
        ];
    }
    if (lowerCaseGoal.includes('fitness') || lowerCaseGoal.includes('exercise') || lowerCaseGoal.includes('workout')) {
        return [
            { title: 'Set fitness goals', description: 'Define specific and measurable fitness targets.' },
            { title: 'Choose a workout routine', description: 'Select exercises that match your fitness level.' },
            { title: 'Invest in equipment', description: 'Get necessary gym or home workout equipment.' },
            { title: 'Track your progress', description: 'Monitor workouts, weight, and performance metrics.' },
        ];
    }
    if (lowerCaseGoal.includes('diet') || lowerCaseGoal.includes('nutrition') || lowerCaseGoal.includes('meal')) {
        return [
            { title: 'Plan weekly meals', description: 'Create a meal plan for the entire week.' },
            { title: 'Create shopping list', description: 'Compile ingredients needed for your meals.' },
            { title: 'Prep ingredients', description: 'Cut, cook, or prepare ingredients in advance.' },
            { title: 'Track calories and nutrition', description: 'Monitor daily intake using apps or journals.' },
        ];
    }
    if (lowerCaseGoal.includes('project') || lowerCaseGoal.includes('build') || lowerCaseGoal.includes('create')) {
        return [
            { title: 'Define project scope', description: 'Outline what needs to be done and deliverables.' },
            { title: 'Create a timeline', description: 'Break down into phases and set deadlines.' },
            { title: 'Gather resources', description: 'Collect materials, tools, and information needed.' },
            { title: 'Execute and monitor', description: 'Start work and track progress regularly.' },
        ];
    }
    if (lowerCaseGoal.includes('home') || lowerCaseGoal.includes('organize') || lowerCaseGoal.includes('clean')) {
        return [
            { title: 'Declutter rooms', description: 'Remove unnecessary items and organize spaces.' },
            { title: 'Create storage solutions', description: 'Find or build storage for better organization.' },
            { title: 'Deep clean', description: 'Thoroughly clean each room and surface.' },
            { title: 'Arrange furniture', description: 'Rearrange furniture for better flow and aesthetics.' },
        ];
    }
    if (lowerCaseGoal.includes('garden') || lowerCaseGoal.includes('plant') || lowerCaseGoal.includes('grow')) {
        return [
            { title: 'Choose plants', description: 'Select plants suitable for your climate and space.' },
            { title: 'Prepare soil', description: 'Prepare and enrich the soil for planting.' },
            { title: 'Plant seeds or seedlings', description: 'Plant according to proper spacing and depth.' },
            { title: 'Create maintenance schedule', description: 'Plan watering, weeding, and fertilizing routines.' },
        ];
    }
    if (lowerCaseGoal.includes('business') || lowerCaseGoal.includes('startup') || lowerCaseGoal.includes('entrepreneurship')) {
        return [
            { title: 'Define business idea', description: 'Develop a clear business concept and value proposition.' },
            { title: 'Research the market', description: 'Analyze competitors and identify target customers.' },
            { title: 'Create business plan', description: 'Write a comprehensive business plan.' },
            { title: 'Secure funding', description: 'Identify funding sources and apply for capital.' },
        ];
    }
    if (lowerCaseGoal.includes('reading') || lowerCaseGoal.includes('book') || lowerCaseGoal.includes('literature')) {
        return [
            { title: 'Choose books to read', description: 'Select books based on interests and recommendations.' },
            { title: 'Create reading schedule', description: 'Set daily or weekly reading goals and times.' },
            { title: 'Join a book club', description: 'Find or start a community to discuss books.' },
            { title: 'Take notes and reflect', description: 'Document key takeaways and personal thoughts.' },
        ];
    }
    if (lowerCaseGoal.includes('art') || lowerCaseGoal.includes('creative') || lowerCaseGoal.includes('draw') || lowerCaseGoal.includes('paint')) {
        return [
            { title: 'Gather art supplies', description: 'Collect materials and tools needed for your art.' },
            { title: 'Find inspiration', description: 'Look at references and create mood boards.' },
            { title: 'Practice techniques', description: 'Work on fundamental skills through regular practice.' },
            { title: 'Share your work', description: 'Exhibit or post your art for feedback.' },
        ];
    }
    if (lowerCaseGoal.includes('music') || lowerCaseGoal.includes('instrument') || lowerCaseGoal.includes('sing')) {
        return [
            { title: 'Choose an instrument', description: 'Select an instrument and acquire it.' },
            { title: 'Find a teacher', description: 'Look for music lessons or tutorials.' },
            { title: 'Practice regularly', description: 'Set up a consistent practice schedule.' },
            { title: 'Join a group or band', description: 'Collaborate with other musicians.' },
        ];
    }
    if (lowerCaseGoal.includes('photography') || lowerCaseGoal.includes('camera')) {
        return [
            { title: 'Get a camera', description: 'Choose and purchase a suitable camera.' },
            { title: 'Learn photography basics', description: 'Study composition, lighting, and exposure.' },
            { title: 'Practice taking photos', description: 'Shoot regularly in different settings.' },
            { title: 'Edit and share photos', description: 'Use editing software and build a portfolio.' },
        ];
    }
    if (lowerCaseGoal.includes('health') || lowerCaseGoal.includes('wellness') || lowerCaseGoal.includes('sleep')) {
        return [
            { title: 'Schedule health checkup', description: 'Book appointments with healthcare professionals.' },
            { title: 'Establish sleep routine', description: 'Create consistent bedtime and wake-up times.' },
            { title: 'Reduce stress', description: 'Practice meditation, yoga, or relaxation techniques.' },
            { title: 'Track health metrics', description: 'Monitor weight, blood pressure, and other indicators.' },
        ];
    }
    if (lowerCaseGoal.includes('travel') || lowerCaseGoal.includes('explore') || lowerCaseGoal.includes('adventure')) {
        return [
            { title: 'Research destinations', description: 'Explore travel guides and reviews.' },
            { title: 'Plan budget', description: 'Calculate costs for accommodation, food, and activities.' },
            { title: 'Book accommodations', description: 'Reserve hotels or alternative lodging.' },
            { title: 'Create day plans', description: 'Organize activities and attractions to visit.' },
        ];
    }
    if (lowerCaseGoal.includes('social') || lowerCaseGoal.includes('connect') || lowerCaseGoal.includes('network')) {
        return [
            { title: 'Join groups or clubs', description: 'Find communities based on shared interests.' },
            { title: 'Attend events', description: 'Go to meetups, workshops, or social gatherings.' },
            { title: 'Reach out to friends', description: 'Schedule time to catch up with people.' },
            { title: 'Volunteer', description: 'Get involved in community service.' },
        ];
    }
    if (lowerCaseGoal.includes('finance') || lowerCaseGoal.includes('budget') || lowerCaseGoal.includes('save')) {
        return [
            { title: 'Track expenses', description: 'Record all spending to identify patterns.' },
            { title: 'Create a budget', description: 'Allocate money to different categories.' },
            { title: 'Set savings goal', description: 'Define target amounts and timelines for savings.' },
            { title: 'Invest wisely', description: 'Research investment options and diversify portfolio.' },
        ];
    }
    if (lowerCaseGoal.includes('career') || lowerCaseGoal.includes('job') || lowerCaseGoal.includes('promotion')) {
        return [
            { title: 'Update resume', description: 'Refine your resume with latest skills and experience.' },
            { title: 'Search for opportunities', description: 'Browse job postings on various platforms.' },
            { title: 'Network professionally', description: 'Attend conferences and connect with colleagues.' },
            { title: 'Develop new skills', description: 'Take courses relevant to your career goals.' },
        ];
    }
    
    // Default fallback suggestions
    return [
        { title: 'Define the main objective', description: 'Clearly state the primary outcome you want to achieve.' },
        { title: 'Break down into smaller steps', description: 'List all the individual actions required to reach the goal.' },
        { title: 'Set a deadline', description: 'Establish a target date for completion to stay motivated.' },
        { title: 'Gather resources', description: 'Collect tools, materials, or information you\'ll need.' },
    ];
}
