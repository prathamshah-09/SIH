import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate a short 2-3 word title for a conversation based on user messages.
export function generateHistoryTitle(messages, maxWords = 3) {
  if (!messages || messages.length === 0) return 'Conversation';

  // pick last user message (non-bot) or first available
  const userMsg = [...messages].reverse().find(m => !m.isBot && m.text) || messages.find(m => !m.isBot && m.text);
  const text = (userMsg && userMsg.text) ? userMsg.text : messages.map(m => m.text).find(Boolean) || '';
  if (!text) return 'Conversation';

  // basic cleanup
  const cleaned = text.replace(/[\u2018\u2019\u201c\u201d]/g, "'")
                      .replace(/[^\w\s']/g, ' ')
                      .toLowerCase();

  const stopwords = new Set(['i','me','my','we','our','you','your','the','a','an','and','or','but','if','to','in','on','for','of','is','are','was','were','be','been','it','that','this','with','as','at','from','by','about','can','could','would','should','have','has','had','do','does','did','not','no','yes','so','too','very']);

  const parts = cleaned.split(/\s+/).filter(w => w && !stopwords.has(w));
  if (parts.length === 0) {
    // fallback to first few words of raw text
    return cleaned.split(/\s+/).filter(Boolean).slice(0, maxWords).join(' ')
           || 'Conversation';
  }

  // pick first distinct words up to maxWords
  const picked = [];
  for (const w of parts) {
    if (!picked.includes(w)) picked.push(w);
    if (picked.length >= maxWords) break;
  }

  const title = picked.join(' ');
  return title || 'Conversation';
}