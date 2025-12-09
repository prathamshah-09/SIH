import { useMemo, useState, useEffect } from 'react';
import { Plus, X, Upload, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { useToast } from '@hooks/use-toast';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import memoryService from '@services/memoryService';

/**
 * Format date from backend (YYYY-MM-DD) to display format (Mon DD, YYYY)
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  });
};

/**
 * Transform backend memory to component format
 */
const transformMemory = (backendMemory) => {
  return {
    id: backendMemory.id,
    title: backendMemory.title.toUpperCase(),
    date: formatDate(backendMemory.date),
    description: backendMemory.description || '',
    imageUrl: backendMemory.photo_url,
    rawDate: backendMemory.date,
    created_at: backendMemory.created_at
  };
};

const MemoryCard = ({ memory, isLeft, onDelete }) => {
  const rotation = useMemo(() => {
    const base = (memory.id % 3 - 1) * 2;
    return base;
  }, [memory.id]);

  return (
    <div className={`flex items-start gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Polaroid Photo */}
      <div 
        className="bg-white p-4 pb-14 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl relative group"
        style={{ 
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <img 
          src={memory.imageUrl} 
          alt={memory.title}
          className="w-64 h-64 object-cover"
        />
        {/* Delete button - shows on hover */}
        <button
          onClick={() => onDelete(memory.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
          title="Delete memory"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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

const AddMemoryDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const { toast } = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview || !title.trim()) {
      toast({
        title: "Missing fields",
        description: "Please add a photo, title, and date.",
        variant: "destructive"
      });
      return;
    }

    await onAdd({
      photo: imageFile,
      title: title.trim(),
      date: date,
      description: description.trim()
    });

    // Reset form
    setImagePreview(null);
    setImageFile(null);
    setTitle('');
    setDescription('');
    setDate('');
    setOpen(false);
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
      <DialogContent className="sm:max-w-lg !bg-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl text-center text-gray-800"
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
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] text-base py-5 bg-white text-gray-900"
          />

          {/* Date */}
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] text-base py-5 bg-white text-gray-900"
          />

          {/* Description */}
          <Textarea
            placeholder="What made this moment special?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border-[#C5E4F3] focus:border-[#7EC8E3] focus:ring-[#7EC8E3] resize-none text-base bg-white text-gray-900"
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
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Fetch memories from backend
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const response = await memoryService.getAllMemories();
      if (response.success && response.data) {
        const transformedMemories = response.data.map(transformMemory);
        setMemories(transformedMemories);
      }
    } catch (err) {
      console.error('Error fetching memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load memories on component mount
  useEffect(() => {
    fetchMemories();
  }, []);

  // Handle adding a new memory
  const handleAddMemory = async (newMemoryData) => {
    try {
      const response = await memoryService.createMemory(newMemoryData);
      
      if (response.success && response.data) {
        const transformedMemory = transformMemory(response.data);
        setMemories([transformedMemory, ...memories]);
        
        toast({
          title: "Memory added!",
          description: "Your memory has been pinned to the wall."
        });
      }
    } catch (err) {
      console.error('Error creating memory:', err);
      toast({
        title: "Error",
        description: "Failed to create memory. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a memory
  const handleDeleteMemory = async (memoryId) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await memoryService.deleteMemory(memoryId);
      
      if (response.success) {
        setMemories(memories.filter(m => m.id !== memoryId));
        
        toast({
          title: "Memory deleted",
          description: "Your memory has been removed from the wall."
        });
      }
    } catch (err) {
      console.error('Error deleting memory:', err);
      toast({
        title: "Error",
        description: "Failed to delete memory. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <section className={`w-full min-h-screen ${theme.colors.background} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#7EC8E3' }} />
          <p className={`${theme.colors.muted} text-lg`}>Loading your memories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full min-h-screen ${theme.colors.background}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        .memory-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Header */}
      <div className="py-10 px-4 text-center">
        <p className={`${theme.colors.muted} text-lg`}>
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
                      onDelete={handleDeleteMemory}
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