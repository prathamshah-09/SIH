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
} from 'lucide-react';

// Removed localStorage-based persistence. All user management is now
// in-memory only and will reset on reload. TODO: Replace with real
// backend API integration for CRUD operations.

const UserManagement = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddCounsellor, setShowAddCounsellor] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  
  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    studentId: '',
    passingYear: '',
  });
  
  const [counsellorForm, setCounsellorForm] = useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
    phoneNumber: '',
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
  });

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Seed with minimal sample data (optional). Remove if undesired.
  useEffect(() => {
    const sampleStudents = [
      {
        id: 'student_seed_1',
        name: 'Alice Student',
        email: 'alice@student.test',
        password: 'Pass1234!',
        role: 'student',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];
    const sampleCounsellors = [
      {
        id: 'counsellor_seed_1',
        name: 'Bob Counsellor',
        email: 'bob@counsellor.test',
        specialization: 'General Wellness',
        password: 'Pass1234!',
        role: 'counsellor',
        createdAt: new Date().toISOString(),
        status: 'active',
        isAvailable: true
      }
    ];
    setStudents(sampleStudents);
    setCounsellors(sampleCounsellors);
    setUsers([...sampleStudents, ...sampleCounsellors]);
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Add student
  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.email || !studentForm.password) {
      alert('Please fill all required fields');
      return;
    }
    const newStudent = {
      id: `student_${Date.now()}`,
      name: studentForm.name,
      email: studentForm.email,
      password: studentForm.password,
      phoneNumber: studentForm.phoneNumber || '',
      studentId: studentForm.studentId || '',
      passingYear: studentForm.passingYear || '',
      role: 'student',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setUsers([...updatedStudents, ...counsellors]);
    setStudentForm({ name: '', email: '', password: '', phoneNumber: '', studentId: '', passingYear: '' });
    setShowAddStudent(false);
  };

  // Add counsellor
  const handleAddCounsellor = () => {
    if (!counsellorForm.name || !counsellorForm.email || !counsellorForm.password || !counsellorForm.specialization) {
      alert('Please fill all fields');
      return;
    }
    const newCounsellor = {
      id: `counsellor_${Date.now()}`,
      name: counsellorForm.name,
      email: counsellorForm.email,
      specialization: counsellorForm.specialization,
      password: counsellorForm.password,
      phoneNumber: counsellorForm.phoneNumber || '',
      role: 'counsellor',
      createdAt: new Date().toISOString(),
      status: 'active',
      isAvailable: true
    };
    const updatedCounsellors = [...counsellors, newCounsellor];
    setCounsellors(updatedCounsellors);
    setUsers([...students, ...updatedCounsellors]);
    setCounsellorForm({ name: '', email: '', specialization: '', password: '', phoneNumber: '' });
    setShowAddCounsellor(false);
  };

  // Edit handlers
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setShowEditDialog(true);
  };

  const handleCloseEdit = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (!editForm || !editForm.id) return;
    if (editForm.role === 'student') {
      const updatedStudents = students.map(s => s.id === editForm.id ? { ...s, ...editForm } : s);
      setStudents(updatedStudents);
      setUsers([...updatedStudents, ...counsellors]);
    } else {
      const updatedCounsellors = counsellors.map(c => c.id === editForm.id ? { ...c, ...editForm } : c);
      setCounsellors(updatedCounsellors);
      setUsers([...students, ...updatedCounsellors]);
    }
    handleCloseEdit();
  };

  // Delete user
  const handleDeleteUser = (toDelete) => {
    if (!window.confirm(`Delete ${toDelete.name}?`)) return;
    if (toDelete.role === 'student') {
      const updatedStudents = students.filter(s => s.id !== toDelete.id);
      setStudents(updatedStudents);
      setUsers([...updatedStudents, ...counsellors]);
    } else {
      const updatedCounsellors = counsellors.filter(c => c.id !== toDelete.id);
      setCounsellors(updatedCounsellors);
      setUsers([...students, ...updatedCounsellors]);
    }
  };

  // Reset password
  const handleResetPassword = () => {
    if (!resetPasswordForm.newPassword) {
      alert('Please enter a new password');
      return;
    }
    if (!selectedUser) return;
    if (selectedUser.role === 'student') {
      const updatedStudents = students.map(s => s.id === selectedUser.id ? { ...s, password: resetPasswordForm.newPassword } : s);
      setStudents(updatedStudents);
      setUsers([...updatedStudents, ...counsellors]);
    } else {
      const updatedCounsellors = counsellors.map(c => c.id === selectedUser.id ? { ...c, password: resetPasswordForm.newPassword } : c);
      setCounsellors(updatedCounsellors);
      setUsers([...students, ...updatedCounsellors]);
    }
    setResetPasswordForm({ newPassword: '' });
    setShowResetPassword(false);
    setSelectedUser(null);
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('addNewStudentTitle')}</DialogTitle>
                <DialogDescription>{t('addNewStudentDesc')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
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
                    value={studentForm.phoneNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Student ID</label>
                  <Input
                    placeholder="e.g., S123456"
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Passing Year</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2024"
                    min="2020"
                    max="2030"
                    value={studentForm.passingYear}
                    onChange={(e) => setStudentForm({ ...studentForm, passingYear: e.target.value })}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Initial Password</label>
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
                <Button variant="outline" onClick={() => setShowAddStudent(false)}>{t('cancel')}</Button>
                <Button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600">
                  {t('createStudent')}
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('addNewCounsellorTitle')}</DialogTitle>
                <DialogDescription>{t('addNewCounsellorDesc')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="e.g., Dr. Sarah Smith"
                    value={counsellorForm.name}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
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
                    value={counsellorForm.phoneNumber}
                    onChange={(e) => setCounsellorForm({ ...counsellorForm, phoneNumber: e.target.value })}
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
                    <label className="text-sm font-medium">Initial Password</label>
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
                <Button variant="outline" onClick={() => setShowAddCounsellor(false)}>{t('cancel')}</Button>
                <Button onClick={handleAddCounsellor} className="bg-purple-500 hover:bg-purple-600">
                  {t('createCounsellor')}
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
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>Total Users</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>{users.length}</p>
              </div>
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>Total Students</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>{users.filter(u => u.role === 'student').length}</p>
              </div>
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.colors.muted} text-xs sm:text-sm font-medium`}>Total Counsellors</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} mt-2`}>{users.filter(u => u.role === 'counsellor').length}</p>
              </div>
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 opacity-20" />
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

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details below. Click Save to apply changes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input value={editForm.phoneNumber || ''} onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })} />
              </div>
              {editForm.role === 'student' && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Student ID</label>
                    <Input value={editForm.studentId || ''} onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Passing Year</label>
                    <Input type="number" value={editForm.passingYear || ''} onChange={(e) => setEditForm({ ...editForm, passingYear: e.target.value })} />
                  </div>
                </>
              )}
              {editForm.role === 'counsellor' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Specialization</label>
                  <Input value={editForm.specialization || ''} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })} />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input type="password" value={editForm.password || ''} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              </div>
            </div>
            <DialogFooter className="justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="destructive" onClick={() => { handleDeleteUser(editForm); handleCloseEdit(); }} className="text-white bg-red-600 hover:bg-red-700">Delete</Button>
                <Button variant="outline" onClick={() => { setResetPasswordForm({ newPassword: generatePassword() }); setShowResetPassword(true); }}>Reset Password</Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleCloseEdit}>Cancel</Button>
                <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600">Save</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog (global) */}
        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
          <DialogContent className="sm:max-w-[425px]">
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
                  >
                    Generate
                  </Button>
                </div>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={resetPasswordForm.newPassword}
                  onChange={(e) => setResetPasswordForm({ newPassword: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetPassword(false)}>Cancel</Button>
              <Button onClick={handleResetPassword} className="bg-yellow-500 hover:bg-yellow-600">Update Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Users Table with Pagination */}
      <Card className={`${theme.colors.card} border-0 shadow-lg overflow-hidden`}>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
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
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">ID</th>
                      <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((user) => {
                        const isStudent = user.role === 'student';
                        const avatarGradient = isStudent 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500';
                        return (
                          <tr 
                            key={user.id} 
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" 
                            onClick={() => handleOpenEdit(user)}
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full ${avatarGradient} flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0`}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {user.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 truncate">
                              {user.studentId || user.id.substring(0, 8)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <Badge className={isStudent ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                                {isStudent ? 'Student' : 'Counsellor'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-3 sm:px-6 py-4 border-t bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xs sm:text-sm font-medium">{currentPage}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                    className="text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
