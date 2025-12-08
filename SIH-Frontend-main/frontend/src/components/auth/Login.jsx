import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Heart, Loader2, Sparkles, Shield, UserCheck } from 'lucide-react';
import ThemeLanguageSelector from '@components/shared/ThemeLanguageSelector';
import AnimatedBackground from '@components/shared/AnimatedBackground';
import SensEaseLogo from '@components/shared/SensEaseLogo';

const Login = ({ onLoginSuccess, isModal = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Detect midnight theme
  const isMidnight = (theme?.currentTheme === 'midnight' || (theme?.name && theme.name.toLowerCase() === 'midnight'));

  // Shared style/class for midnight inputs so text, placeholder and caret are white
  const midnightInputInlineStyle = isMidnight ? { color: '#ffffff', caretColor: '#ffffff' } : {};
  const midnightInputClasses = isMidnight ? 'text-white placeholder-white' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Call the success callback if provided (modal mode)
        if (onLoginSuccess && isModal) {
          onLoginSuccess();
          // Navigate after a short delay to allow modal to close
          setTimeout(() => {
            const role = (result.user?.role || '').toLowerCase();
            switch (role) {
              case 'student':
                navigate('/student-dashboard');
                break;
              case 'counsellor':
                navigate('/counsellor-dashboard');
                break;
              case 'admin':
              case 'superadmin':
                navigate('/admin-dashboard');
                break;
              default:
                setError('Unknown role. Please contact support.');
            }
          }, 300);
        } else {
          // Navigate based on user role (normal mode)
          const role = (result.user?.role || '').toLowerCase();
          switch (role) {
            case 'student':
              navigate('/student-dashboard');
              break;
            case 'counsellor':
              navigate('/counsellor-dashboard');
              break;
            case 'admin':
            case 'superadmin':
              navigate('/admin-dashboard');
              break;
            default:
              setError('Unknown role. Please contact support.');
          }
        }
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    // Prefill with seeded test credentials from backend
    const demoCredentials = {
      student: { email: 'john.student@greenvalley.edu', password: 'Test@12345' },
      counsellor: { email: 'dr.sarah@greenvalley.edu', password: 'Test@12345' },
      admin: { email: 'admin@greenvalley.edu', password: 'Test@12345' }
    };
    const creds = demoCredentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  return (
    <>
      {isModal ? (
        // Modal mode - just show the card
        <Card className={`w-full ${theme.colors.card} border-0 shadow-2xl transform transition-transform duration-300`}>
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Enhanced Logo Section */}
            <div className="flex justify-center">
              <SensEaseLogo
                className="w-16 h-16 sm:w-24 sm:h-24"
                showText={false}
              />
            </div>

            <div className="space-y-3">
              <CardTitle
                className={
                  isMidnight
                    ? 'text-3xl sm:text-4xl font-bold text-white'
                    : `text-3xl sm:text-4xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent`
                }
              >
                {t('sensEase')}
              </CardTitle>
              <CardDescription className={`${theme.colors.muted} text-base sm:text-lg font-medium`}>
                {t('mentalHealthSupport')}
              </CardDescription>
              <p className={`text-sm ${theme.colors.muted} opacity-80`}>
                {t('tagline')}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${theme.colors.text}`}>
                  {t('email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email')}
                  required
                  style={midnightInputInlineStyle}
                  className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md h-11 text-base ${midnightInputClasses}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm font-medium ${theme.colors.text}`}>
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  required
                  style={midnightInputInlineStyle}
                  className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md h-11 text-base ${midnightInputClasses}`}
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 animate-shake">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                variant="animated"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('signIn')}...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    {t('signIn')}
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-3 ${theme.colors.card} ${theme.colors.muted}`}>
                  {t('demoAccounts')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('student')}
                className="flex flex-col items-center p-3 h-auto hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 hover:scale-105 space-y-1"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('student')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('counsellor')}
                className="flex flex-col items-center p-3 h-auto hover:bg-green-50 hover:border-green-200 transition-all duration-200 hover:scale-105 space-y-1"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('counsellor')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center p-3 h-auto hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 hover:scale-105 space-y-1"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('admin')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Full page mode - show everything
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} flex items-center justify-center p-4 relative ${isRTL ? 'rtl' : 'ltr'}`}>
          <AnimatedBackground theme={theme} />

          {/* Theme and Language selector in top corner */}
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
            <ThemeLanguageSelector />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-1/4 opacity-20">
            <Sparkles className="w-8 h-8 text-current animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute bottom-10 right-1/4 opacity-20">
            <Heart className="w-6 h-6 text-current animate-bounce" />
          </div>

          <Card className={`w-full max-w-md mx-auto ${theme.colors.card} border-0 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-transform duration-300 fit-mobile-screen`}>
            <CardHeader className="text-center space-y-6 pb-8">
              {/* Enhanced Logo Section */}
              <div className="flex justify-center">
                <SensEaseLogo
                  className="w-16 h-16 sm:w-24 sm:h-24"
                  showText={false}
                />
              </div>

              <div className="space-y-3">
                <CardTitle
                  className={
                    isMidnight
                      ? 'text-3xl sm:text-4xl font-bold text-white'
                      : `text-3xl sm:text-4xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent`
                  }
                >
                  {t('sensEase')}
                </CardTitle>
                <CardDescription className={`${theme.colors.muted} text-base sm:text-lg font-medium`}>
                  {t('mentalHealthSupport')}
                </CardDescription>
                <p className={`text-sm ${theme.colors.muted} opacity-80`}>
                  {t('tagline')}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${theme.colors.text}`}>
                    {t('email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    required
                    style={midnightInputInlineStyle}
                    className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md h-11 text-base ${midnightInputClasses}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={`text-sm font-medium ${theme.colors.text}`}>
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    required
                    style={midnightInputInlineStyle}
                    className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md h-11 text-base ${midnightInputClasses}`}
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50 animate-shake">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="animated"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('signIn')}...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 mr-2" />
                      {t('signIn')}
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-3 ${theme.colors.card} ${theme.colors.muted}`}>
                    {t('demoAccounts')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('student')}
                  className="flex flex-col items-center p-3 h-auto hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 hover:scale-105 space-y-1"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('student')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('counsellor')}
                  className="flex flex-col items-center p-3 h-auto hover:bg-green-50 hover:border-green-200 transition-all duration-200 hover:scale-105 space-y-1"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('counsellor')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  className="flex flex-col items-center p-3 h-auto hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 hover:scale-105 space-y-1"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isMidnight ? 'text-white' : ''}`}>{t('admin')}</span>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="text-center pt-4">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>Trusted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Professional</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Login;
