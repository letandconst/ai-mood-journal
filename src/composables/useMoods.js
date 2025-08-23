import { ref } from "vue";

export function useMoods() {
  const moods = ref([
    {
      id: "joy",
      name: "Joy",
      character: "😊",
      description: "Happy & Energetic",
      color: "#FFD700",
      prompt: "What made you feel joyful today?",
      placeholder: "Share what brought happiness to your day...",
    },
    {
      id: "sadness",
      name: "Sadness",
      character: "😢",
      description: "Down & Reflective",
      color: "#4169E1",
      prompt: "What's weighing on your heart?",
      placeholder: "It's okay to feel sad. What happened today?",
    },
    {
      id: "anger",
      name: "Anger",
      character: "😠",
      description: "Frustrated & Intense",
      color: "#DC143C",
      prompt: "What triggered your anger today?",
      placeholder: "Express what made you feel angry or frustrated...",
    },
    {
      id: "fear",
      name: "Fear",
      character: "😰",
      description: "Anxious & Worried",
      color: "#9370DB",
      prompt: "What are you worried about?",
      placeholder: "Share your fears and concerns...",
    },
    {
      id: "disgust",
      name: "Disgust",
      character: "🤢",
      description: "Disappointed & Critical",
      color: "#228B22",
      prompt: "What didn't sit well with you today?",
      placeholder: "What made you feel disgusted or disappointed?",
    },
    {
      id: "anxiety",
      name: "Anxiety",
      character: "😵‍💫",
      description: "Overwhelmed & Restless",
      color: "#FF6347",
      prompt: "What's making you feel overwhelmed?",
      placeholder: "Describe what's causing your anxiety...",
    },
    {
      id: "excitement",
      name: "Excitement",
      character: "🤩",
      description: "Thrilled & Anticipating",
      color: "#FF1493",
      prompt: "What are you excited about?",
      placeholder: "Share what's got you feeling thrilled...",
    },
    {
      id: "calm",
      name: "Calm",
      character: "😌",
      description: "Peaceful & Centered",
      color: "#20B2AA",
      prompt: "What brought you peace today?",
      placeholder: "Reflect on moments of tranquility...",
    },
  ]);

  const getMoodById = (id) => moods.value.find((m) => m.id === id);
  const getMoodColor = (id) => getMoodById(id)?.color || "#ccc";

  return { moods, getMoodById, getMoodColor };
}
