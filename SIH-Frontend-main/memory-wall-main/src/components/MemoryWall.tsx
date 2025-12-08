import { useMemo, useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Memory {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

const defaultMemories: Memory[] = [
  {
    id: 1,
    title: "LIVE GIG VIBES",
    date: "Nov 05, 2023",
    description: "A night full of real beats and raw energy was electric!",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "HALLOWEEN SPOOK",
    date: "Oct 31, 2023",
    description: "Costume party frights and delights!",
    imageUrl: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "SUMMER SUNSET",
    date: "Aug 15, 2023",
    description: "Golden hour at the beach with best friends.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    title: "BIRTHDAY BASH",
    date: "Jul 22, 2023",
    description: "Celebrating another year of adventures!",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    title: "ROAD TRIP",
    date: "Jun 10, 2023",
    description: "Miles of open road and endless memories.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    title: "COZY NIGHTS",
    date: "Dec 25, 2022",
    description: "Hot cocoa, fairy lights, and good company.",
    imageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=400&fit=crop"
  }
];

const STORAGE_KEY = 'memory-wall-memories';

const loadMemories = (): Memory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading memories:', e);
  }
  return defaultMemories;
};

const saveMemories = (memories: Memory[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error('Error saving memories:', e);
  }
};

const MemoryCard = ({ memory, isLeft }: { memory: Memory; isLeft: boolean }) => {
  const rotation = useMemo(() => {
    const base = (memory.id % 3 - 1) * 2;
    return base;
  }, [memory.id]);

  return (
    <div className={`flex items-start gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Polaroid Photo */}
      <div 
        className="bg-white p-4 pb-14 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        style={{ 
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <img 
          src={memory.imageUrl} 
          alt={memory.title}
          className="w-64 h-64 object-cover"
        />
      </div>

      {/* Note Card */}
      <div 
        className="mt-8 pt-6 px-8 pb-8 min-w-[240px] max-w-[300px]"
        style={{ 
          backgroundColor: '#E8F6FF',
          boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h3 className="font-bold text-foreground text-base tracking-wide mb-2">
          {memory.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">
          {memory.date}
        </p>
        <p className="text-foreground/80 text-base leading-relaxed">
          {memory.description}
        </p>
      </div>
    </div>
  );
};

interface AddMemoryDialogProps {
  onAdd: (memory: Omit<Memory, 'id'>) => void;
}

const AddMemoryDialog = ({ onAdd }: AddMemoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!imagePreview || !title.trim() || !description.trim()) {
      toast({
        title: "Missing fields",
        description: "Please add a photo, title, and description.",
        variant: "destructive"
      });
      return;
    }

    const memoryDate = date || new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });

    onAdd({
      title: title.toUpperCase(),
      date: memoryDate,
      description,
      imageUrl: imagePreview
    });

    // Reset form
    setImagePreview(null);
    setTitle('');
    setDescription('');
    setDate('');
    setOpen(false);

    toast({
      title: "Memory added!",
      description: "Your memory has been pinned to the wall."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#7EC8E3' }}
        >
          <Plus className="w-7 h-7 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl text-center"
            style={{ fontFamily: "'Pacifico', cursive", color: '#2d3748' }}
          >
            Add a Memory
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-4">
          {/* Image Upload */}
          <div 
            className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-[#7EC8E3]"
            style={{ borderColor: '#C5E4F3' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-56 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="py-6">
                <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#7EC8E3' }} />
                <p className="text-sm text-muted-foreground">
                  Click or drag to upload a photo
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <Input
            placeholder="Memory title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] text-base py-5"
          />

          {/* Date */}
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] text-base py-5"
          />

          {/* Description */}
          <Textarea
            placeholder="What made this moment special?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] resize-none text-base"
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full text-white font-medium text-base py-5"
            style={{ backgroundColor: '#7EC8E3' }}
          >
            Pin this Memory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MemoryWall = () => {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const handleAddMemory = (newMemory: Omit<Memory, 'id'>) => {
    const memory: Memory = {
      ...newMemory,
      id: Date.now()
    };
    const updated = [memory, ...memories];
    setMemories(updated);
    saveMemories(updated);
  };

  return (
    <section className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="py-16 px-4 text-center">
        <h2 
          className="text-5xl mb-4 tracking-wide"
          style={{ 
            fontFamily: "'Pacifico', cursive",
            color: '#2d3748'
          }}
        >
          Memory Wall
        </h2>
        <p className="text-muted-foreground text-lg">
          Moments worth remembering, pinned with love.
        </p>
      </div>
      
      {/* Timeline Container with smooth scroll */}
      <div 
        className="relative px-8 pb-24 overflow-y-auto scroll-smooth"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
          .memory-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="max-w-6xl mx-auto relative memory-scroll">
          {/* Vertical String/Line */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: '#C5E4F3' }}
          />
          
          {/* Memory Items */}
          <div className="relative space-y-24">
            {memories.map((memory, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={memory.id}
                  className="relative flex justify-center"
                >
                  {/* Horizontal connector to string */}
                  <div 
                    className="absolute top-16 h-0.5 z-0"
                    style={{ 
                      backgroundColor: '#C5E4F3',
                      width: '120px',
                      left: isLeft ? 'calc(50% - 120px)' : '50%'
                    }}
                  />
                  
                  {/* Offset container for balanced layout */}
                  <div 
                    className={`${isLeft ? '-translate-x-20' : 'translate-x-20'}`}
                  >
                    <MemoryCard 
                      memory={memory} 
                      isLeft={isLeft} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Memory Button */}
      <AddMemoryDialog onAdd={handleAddMemory} />
    </section>
  );
};

export default MemoryWall;
