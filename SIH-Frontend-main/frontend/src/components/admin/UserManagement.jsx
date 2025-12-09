import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  Plus,
  Trash2,
  Edit,
  Key,
  Search,
  Users,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import * as adminService from '@services/adminService';

// Integrated with backend API for complete user management

const UserManagement = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // detect midnight calm theme in a safe way (many projects set theme.name or data-theme on root)
  const [isMidnight, setIsMidnight] = useState(false);
  useEffect(() => {
    try {
      const themeName = theme?.name?.toLowerCase?.() || theme?.id?.toLowerCase?.();
      const docTheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
      const docClass = typeof document !== 'undefined' ? document.documentElement.classList.contains('theme-midnight-calm') : false;
      const midnightMatch =
        themeName?.includes('midnight') ||
        docTheme === 'midnight-calm' ||
        docTheme === 'midnight' ||
        docClass;
      setIsMidnight(Boolean(midnightMatch));
    } catch (e) {
      setIsMidnight(false);
    }
  }, [theme]);

  // State management
  const [allUsers, setAllUsers] = useState([]); // All users from API
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCounsellors: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Loading and error states
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Dialog states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddCounsellor, setShowAddCounsellor] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  
  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    passing_year: '',
    roll_no: '',
  });
  
  const [counsellorForm, setCounsellorForm] = useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
    phone: '',
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
  });

  const [editForm, setEditForm] = useState({});

  // Fetch user statistics
  const fetchUserStats = async () => {
    setIsLoadingStats(true);
    setError(null);
    try {
      const stats = await adminService.getUserStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
      setError(err.message || 'Failed to load user statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch all users (once on mount)
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    try {
      // Fetch all users without pagination
      const response = await adminService.getUsers({
        page: 1,
        limit: 1000 // Get all users at once
      });
      console.log('API Response:', response);
      console.log('Users data:', response.data);
      setAllUsers(response.data || []);
      applyFilters(response.data || [], filterRole, searchQuery);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Apply filters and search on frontend
  const applyFilters = (usersToFilter, role, search) => {
    let filtered = usersToFilter;

    // Apply role filter
    if (role && role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Reset to first page
    setCurrentPage(1);
    setFilteredUsers(filtered);
  };

  // Load stats and users on mount
  useEffect(() => {
    fetchUserStats();
    fetchUsers();
  }, []);

  // Apply filters when role or search changes (frontend filtering)
  useEffect(() => {
    console.log('Filtering users with:', { filterRole, searchQuery });
    applyFilters(allUsers, filterRole, searchQuery);
  }, [filterRole, searchQuery]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add student
  const handleAddStudent = async () => {
    // Validate required fields
    const requiredFields = {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    };
    
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!studentForm[field] || studentForm[field].trim() === '') {
        setError(`${label} is required`);
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      const studentData = {
        name: studentForm.name,
        email: studentForm.email,
        password: studentForm.password,
        phone: studentForm.phone || undefined,
        passing_year: studentForm.passing_year ? parseInt(studentForm.passing_year) : undefined,
        roll_no: studentForm.roll_no || undefined,
      };
      
      console.log('Submitting student data:', studentData);
      
      await adminService.createStudent(studentData);
      
      setSuccessMessage(`Student "${studentForm.name}" created successfully`);
      setStudentForm({ name: '', email: '', password: '', phone: '', passing_year: '', roll_no: '' });
      setShowAddStudent(false);
      
      // Refresh data
      await Promise.all([fetchUsers(), fetchUserStats()]);
    } catch (err) {
      console.error('Failed to create student:', err);
      setError(err.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add counsellor
  const handleAddCounsellor = async () => {
    // Validate required fields
    const requiredFields = {
      name: 'Name',
      email: 'Email',
      password: 'Password'
    };
    
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!counsellorForm[field] || counsellorForm[field].trim() === '') {
        setError(`${label} is required`);
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.createCounsellor({
        name: counsellorForm.name,
        email: counsellorForm.email,
        password: counsellorForm.password,
        phone: counsellorForm.phone || undefined,
        specialization: counsellorForm.specialization || undefined,
      });
      
      setSuccessMessage(`Counsellor "${counsellorForm.name}" created successfully`);
      setCounsellorForm({ name: '', email: '', specialization: '', password: '', phone: '' });
      setShowAddCounsellor(false);
      
      // Refresh data
      await Promise.all([fetchUsers(), fetchUserStats()]);
    } catch (err) {
      console.error('Failed to create counsellor:', err);
      setError(err.message || 'Failed to create counsellor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleOpenResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetPassword(true);
  };

  const handleCloseDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  // Delete user
  const handleDeleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.deleteUser(userToDelete.id);
      setSuccessMessage(`User "${userToDelete.name}" deleted successfully`);
      
      // Refresh data
      await Promise.all([fetchUsers(), fetchUserStats()]);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!resetPasswordForm.newPassword) {
      setError('Please enter a new password');
      return;
    }

    // Validate password length (minimum 6 characters)
    if (resetPasswordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Trim whitespace
    const password = resetPasswordForm.newPassword.trim();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long (excluding whitespace)');
      return;
    }

    if (!selectedUser) {
      setError('No user selected');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.changeUserPassword(selectedUser.id, password);
      setSuccessMessage(`Password updated successfully for ${selectedUser.name}`);
      setResetPasswordForm({ newPassword: '' });
      setShowResetPassword(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to reset password:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to reset password';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-0">
      {/* Success/Error Notifications */}
      {successMessage && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 dark:text-green-200 text-sm">{successMessage}</p>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text}`}>{t('userManagement')}</h2>

        <div className="mt-4 lg:mt-0 flex flex-row gap-2 sm:gap-3">
          <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white text-sm flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                {t('addStudent')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] !bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">{t('addNewStudentTitle')}</DialogTitle>
                <DialogDescription className="text-gray-600">{t('addNewStudentDesc')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="e.g., student@example.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    placeholder="e.g., +91 98765 43210"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('rollNo')}</label>
                  <Input
                    placeholder="e.g., GV-CSE-2024-055"
                    value={studentForm.roll_no}
                    onChange={(e) => setStudentForm({ ...studentForm, roll_no: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Passing Year</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2025"
                    min="2020"
                    max="2035"
                    value={studentForm.passing_year}
                    onChange={(e) => setStudentForm({ ...studentForm, passing_year: e.target.value })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Initial Password *</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStudentForm({ ...studentForm, password: generatePassword() })}
                    >
                      Generate
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Set initial password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">Student can change this password after login</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddStudent(false)} disabled={isSubmitting}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    t('createStudent')
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddCounsellor} onOpenChange={setShowAddCounsellor}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white text-sm flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                {t('addCounsellor')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] !bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">{t('addNewCounsellorTitle')}</DialogTitle>
                <DialogDescription className="text-gray-600">{t('addNewCounsellorDesc')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    placeholder="e.g., Dr. Sarah Smith"
                    value={counsellorForm.name}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="e.g., counsellor@example.com"
                    value={counsellorForm.email}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    placeholder="e.g., +91 98765 43210"
                    value={counsellorForm.phone}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Specialization</label>
                  <Input
                    placeholder="e.g., Anxiety Disorders, Behavioral Issues"
                    value={counsellorForm.specialization}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Initial Password *</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCounsellorForm({ ...counsellorForm, password: generatePassword() })}
                    >
                      Generate
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Set initial password"
                    value={counsellorForm.password}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">Counsellor can change this password after login</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddCounsellor(false)} disabled={isSubmitting}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleAddCounsellor} className="bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    t('createCounsellor')
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats - Moved to Top */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className={`${theme.colors.card} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>{t('totalUsers')}</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>
                  {isLoadingStats ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    userStats.totalUsers
                  )}
                </p>
              </div>
              {/* Icon wrapper - white border & icon when midnight */}
              <div className={isMidnight ? 'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/60' : ''}>
                <Users className={`w-8 h-8 sm:w-10 sm:h-10 ${isMidnight ? 'text-white opacity-80' : 'text-blue-500 opacity-20'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>{t('totalStudents')}</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>
                  {isLoadingStats ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    userStats.totalStudents
                  )}
                </p>
              </div>
              <div className={isMidnight ? 'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/60' : ''}>
                <User className={`w-8 h-8 sm:w-10 sm:h-10 ${isMidnight ? 'text-white opacity-80' : 'text-cyan-500 opacity-20'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>{t('totalCounsellors')}</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>
                  {isLoadingStats ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    userStats.totalCounsellors
                  )}
                </p>
              </div>
              <div className={isMidnight ? 'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/60' : ''}>
                <Users className={`w-8 h-8 sm:w-10 sm:h-10 ${isMidnight ? 'text-white opacity-80' : 'text-purple-500 opacity-20'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter - Moved Below Counts */}
      <Card className={`${theme.colors.card} border-0 shadow-lg`}>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('search') || 'Search by name or email...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => {
                console.log('Filter changed to:', e.target.value);
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 border rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
            >
              <option value="all">{t('allUsers') || 'All Users'}</option>
              <option value="student">{t('studentLabel') || 'Students'}</option>
              <option value="counsellor">{t('counsellorLabel') || 'Counsellors'}</option>
            </select>
          </div>
        </CardContent>
      </Card>

        {/* User Details Dialog */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>View user information</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${selectedUser.role === 'student' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center text-white text-2xl font-semibold`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <Badge className={selectedUser.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                      {selectedUser.role === 'student' ? 'Student' : 'Counsellor'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  
                  {selectedUser.role === 'student' && selectedUser.roll_no && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('rollNo')}</label>
                      <p className="text-sm">{selectedUser.roll_no}</p>
                    </div>
                  )}
                  
                  {selectedUser.role === 'student' && selectedUser.year && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Passing Year</label>
                      <p className="text-sm">{selectedUser.year}</p>
                    </div>
                  )}
                  
                  {selectedUser.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-sm">{selectedUser.phone}</p>
                    </div>
                  )}
                  
                  {selectedUser.role === 'counsellor' && selectedUser.specialization && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialization</label>
                      <p className="text-sm">{selectedUser.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDetails}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Reset Password for {selectedUser?.name}</DialogTitle>
              <DialogDescription>Set a new password for this user</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResetPasswordForm({ newPassword: generatePassword() })}
                    disabled={isSubmitting}
                  >
                    Generate
                  </Button>
                </div>
                <Input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={resetPasswordForm.newPassword}
                  onChange={(e) => setResetPasswordForm({ newPassword: e.target.value })}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetPassword(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword} className="bg-yellow-500 hover:bg-yellow-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Users Table with Pagination */}
      <Card className={`${theme.colors.card} border-0 shadow-lg overflow-hidden`}>
        <CardContent className="p-0">
          {isLoadingUsers ? (
            <div className="p-6 sm:p-12 text-center">
              <Loader className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-blue-500 mb-3 sm:mb-4 animate-spin" />
              <p className={`${theme.colors.muted} text-sm sm:text-base md:text-lg`}>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <Users className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
              <p className={`${theme.colors.muted} text-sm sm:text-base md:text-lg`}>{t('noUsersFound')}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Roll No</th>
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Calculate pagination on frontend
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
                      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

                      if (paginatedUsers.length === 0) {
                        return (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        );
                      }

                      return paginatedUsers.map((user) => {
                        const isStudent = user.role === 'student';
                        const avatarGradient = isStudent 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500';

                        // row class: if midnight -> remove white hover background and use scale hover; otherwise keep original
                        const rowClass = isMidnight
                          ? 'border-b transition-transform duration-180 cursor-pointer hover:scale-105 hover:bg-transparent dark:hover:bg-transparent'
                          : 'border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer';

                        return (
                          <tr 
                            key={user.id} 
                            className={rowClass}
                            onClick={() => handleViewDetails(user)}
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full ${avatarGradient} flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0`}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-medium truncate ${isMidnight ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {user.name}
                                  </p>
                                  <p className={`text-xs truncate ${isMidnight ? 'text-white/75' : 'text-gray-500'}`}>{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className={`px-3 sm:px-6 py-3 sm:py-4 truncate ${isMidnight ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {isStudent ? (user.roll_no || '-') : '-'}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <Badge className={isStudent ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                                {isStudent ? 'Student' : 'Counsellor'}
                              </Badge>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenResetPassword(user);
                                  }}
                                  disabled={isSubmitting}
                                  title="Reset Password"
                                >
                                  {/* Key icon color becomes white in midnight, otherwise default */}
                                  <Key className={`w-4 h-4 ${isMidnight ? 'text-white' : ''}`} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user);
                                  }}
                                  disabled={isSubmitting}
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredUsers.length > 0 && (
              <div className="px-3 sm:px-6 py-4 border-t bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {(() => {
                    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage + 1;
                    const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);
                    return `Showing ${startIndex} to ${endIndex} of ${filteredUsers.length} results`;
                  })()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoadingUsers}
                    className="text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xs sm:text-sm font-medium">{currentPage} / {Math.ceil(filteredUsers.length / itemsPerPage)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage) || isLoadingUsers}
                    className="text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
