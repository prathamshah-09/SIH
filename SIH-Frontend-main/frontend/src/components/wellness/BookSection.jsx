import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Star, FileDown, ExternalLink } from 'lucide-react';

const BookSection = ({ books = [] }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const handleReadBook = (book) => {
    // In a real app, this would open the book or redirect to reading platform
    window.open(book.downloadUrl || '#', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-2xl font-bold ${theme.colors.text} flex items-center`}>
          <BookOpen className="w-7 h-7 mr-3 text-blue-500" />
          {t('books')}
        </h3>
        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          {Math.min(books.length, 6)} books
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.slice(0, 6).map((book) => (
          <Card key={book.id} className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 group overflow-hidden`}>
            <CardContent className="p-0">
              {/* Book Cover */}
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                    <BookOpen className="w-16 h-16 text-white drop-shadow-2xl" />
                  </div>
                </div>
              </div>
              
              {/* Book Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className={`font-bold text-lg ${theme.colors.text} group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight`}>
                    {book.title}
                  </h4>
                  <p className={`${theme.colors.muted} text-sm font-medium`}>
                    by {book.author}
                  </p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(book.rating)}
                  </div>
                  <span className={`${theme.colors.muted} text-sm font-medium`}>
                    {book.rating}
                  </span>
                </div>
                
                {/* Description */}
                <p className={`${theme.colors.muted} text-sm line-clamp-3`}>
                  {book.description}
                </p>
                
                {/* Book Info */}
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {book.pages} pages
                  </Badge>
                  
                  <Button
                    onClick={() => handleReadBook(book)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    {t('readBook')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300`}>
          <CardContent className="p-12 text-center">
            <BookOpen className={`w-16 h-16 ${theme.colors.muted} mx-auto mb-4 opacity-50`} />
            <p className={`${theme.colors.muted} text-lg`}>
              No books available yet. Check back soon for curated self-help resources!
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Reading Tips */}
      {books.length > 0 && (
        <Card className={`${theme.colors.card} border-0 bg-gradient-to-r ${theme.colors.secondary}`}>
          <CardContent className="p-6">
            <h4 className={`font-semibold ${theme.colors.text} mb-3 flex items-center`}>
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Reading Tips for Better Mental Health
            </h4>
            <ul className={`${theme.colors.muted} space-y-2 text-sm`}>
              <li>• Set aside 15-20 minutes daily for reading</li>
              <li>• Take notes of key insights and strategies</li>
              <li>• Apply one concept at a time to avoid overwhelm</li>
              <li>• Join reading groups to discuss and share experiences</li>
              <li>• Revisit important chapters for better retention</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookSection;