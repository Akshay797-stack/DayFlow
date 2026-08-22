import React, { useState, useRef, useMemo } from 'react';
import { Employee, PrivateInfo, SalaryStructure, EmployeeCertification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { Badge } from '../common/Badge';
import { DocumentManager } from './DocumentManager';
import { EditProfileModal } from './EditProfileModal';
import { computeSalaryStructure } from '../../utils/salaryCalculator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Edit3, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Camera,
  Upload,
  Heart,
  Sparkles,
  Award,
  Plus,
  CreditCard,
  Lock,
  Calculator,
  Save,
  Check
} from 'lucide-react';

interface ProfileViewProps {
  employee: Employee;
  isSelf?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ employee, isSelf = false }) => {
  const { isAdmin, currentUser } = useAuth();
  const { updateEmployee } = useHRData();

  // Tab State (Default to 'resume' / Overview)
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'docs' | 'emergency'>('resume');
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Quick Inline Skills & Certification Modal State
  const [newSkillText, setNewSkillText] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Wage Editing State for Salary Info Tab (Admin Only)
  const initialMonthlyWage = employee.salaryStructure?.monthlyWage || (
    (employee.salaryStructure?.baseSalary || 25000) * 2
  );
  const [wageInput, setWageInput] = useState<number>(initialMonthlyWage);
  const [wageCurrency, setWageCurrency] = useState<string>(employee.salaryStructure?.currency || 'INR');
  const [isSavingSalary, setIsSavingSalary] = useState(false);
  const [salarySavedToast, setSalarySavedToast] = useState(false);

  // Auto-calculated salary structure based on wireframe formulas
  const liveSalary = useMemo(() => {
    return computeSalaryStructure(wageInput, {
      currency: wageCurrency,
      workingDaysPerWeek: employee.salaryStructure?.workingDaysPerWeek || 5,
      workingHoursPerDay: employee.salaryStructure?.workingHoursPerDay || 8,
      breakTimeHours: employee.salaryStructure?.breakTimeHours || 1
    });
  }, [wageInput, wageCurrency, employee.salaryStructure]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPEG or PNG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateEmployee(employee.id, { avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const currentSkills = employee.skills || ['React', 'TypeScript', 'Node.js', 'Team Collaboration'];
    if (!currentSkills.includes(newSkillText.trim())) {
      const updatedSkills = [...currentSkills, newSkillText.trim()];
      updateEmployee(employee.id, { skills: updatedSkills });
    }
    setNewSkillText('');
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = employee.skills || [];
    const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
    updateEmployee(employee.id, { skills: updatedSkills });
  };

  const handleAddCert = () => {
    if (!newCertName.trim()) return;
    const currentCerts = employee.certifications || [];
    const newCert: EmployeeCertification = {
      id: 'cert-' + Date.now(),
      name: newCertName.trim(),
      issuer: newCertIssuer.trim() || 'Accredited Authority',
      date: new Date().toISOString().split('T')[0]
    };
    updateEmployee(employee.id, { certifications: [...currentCerts, newCert] });
    setNewCertName('');
    setNewCertIssuer('');
    setIsAddingCert(false);
  };

  const handleSaveSalaryStructure = () => {
    setIsSavingSalary(true);
    updateEmployee(employee.id, { salaryStructure: liveSalary });
    setTimeout(() => {
      setIsSavingSalary(false);
      setSalarySavedToast(true);
      setTimeout(() => setSalarySavedToast(false), 3000);
    }, 400);
  };

  // Wireframe Tabs - "Salary Info tab Should only be visible to Admin"
  const tabs = [
    { id: 'resume', label: 'Resume / Overview', icon: Briefcase },
    { id: 'private', label: 'Private Info', icon: UserCheck },
    ...(isAdmin ? [{ id: 'salary', label: 'Salary Info (Admin Only)', icon: DollarSign }] : []),
    { id: 'docs', label: 'Documents Vault', icon: FileText, count: employee.documents?.length || 0 },
    { id: 'emergency', label: 'Emergency Info', icon: ShieldCheck },
  ];

  const currencySymbol = wageCurrency === 'INR' ? '₹' : '$';

  // Fallback Private Info data if not initialized
  const privateInfo: PrivateInfo = employee.privateInfo || {
    dateOfBirth: '1995-06-15',
    residingAddress: employee.address || '742 Evergreen Terrace, San Francisco, CA 94107',
    nationality: 'American',
    personalEmail: employee.email || 'personal@example.com',
    gender: 'Male',
    maritalStatus: 'Single',
    dateOfJoining: employee.joiningDate || '2023-01-15',
    bankName: 'Silicon Valley National Bank',
    accountNumber: '987654321098',
    ifscCode: 'SVNB0004521',
    panNumber: 'ABCDE1234F',
    uanNumber: '100987654321'
  };

  const currentSkills = employee.skills && employee.skills.length > 0
    ? employee.skills
    : ['React', 'TypeScript', 'Node.js', 'UI/UX Design', 'Database Architecture', 'System Scaling'];

  const currentCerts = employee.certifications && employee.certifications.length > 0
    ? employee.certifications
    : [
        { id: 'c1', name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2024-02-18' },
        { id: 'c2', name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance', date: '2023-08-10' }
      ];

  return (
    <div className="space-y-6">
      {/* Hidden file input for quick photo update */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleQuickAvatarChange}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />

      {/* Profile Header Hero Card (Wireframe Top Section) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Banner with geometric gradient */}
        <div className="h-36 bg-gradient-to-r from-odoo-900 via-odoo-800 to-teal-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        </div>

        {/* Profile Avatar & Header Information Grid */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative group">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
                />
                
                {/* 1-Click Quick Camera Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer shadow-inner"
                  title="Upload New JPEG / PNG Profile Photo"
                >
                  <Camera className="w-6 h-6 mb-1 drop-shadow-md text-white" />
                  <span className="text-[10px] font-bold tracking-tight uppercase text-white">Change</span>
                </button>

                {employee.isEmailVerified && (
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" title="Verified Employee">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {employee.name}
                  </h2>
                  <Badge status={employee.role} size="sm" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-odoo-700 dark:text-odoo-400 mt-0.5">
                  {employee.designation} • {employee.department}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">Login ID: {employee.employeeId}</span>
                  <span>•</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-odoo-700 dark:text-odoo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">{isAdmin ? 'Edit Profile (Admin)' : 'Edit Profile Info'}</span>
              </button>
            </div>
          </div>

          {/* Wireframe Metadata 4-Column Header Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Company</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-odoo-700 dark:text-odoo-400" />
                Dayflow Technologies Inc.
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Department</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                {employee.department}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Reporting Manager</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                {employee.managerName || 'Sarah Jenkins'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Location / Phone</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="truncate">{employee.address}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex overflow-x-auto gap-2 py-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-odoo-800 text-odoo-800 dark:border-odoo-400 dark:text-odoo-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESUME / OVERVIEW (About, Job Love, Hobbies, Skills, Certs) */}
      {/* ========================================================================= */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: About, Job Love, Hobbies (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* About Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs relative group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-odoo-700 dark:text-odoo-400" />
                  <span>About Me</span>
                </h3>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-odoo-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit About"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {employee.about || employee.bio || 'Passionate professional specializing in enterprise systems, collaborative engineering, and continuous organizational growth.'}
              </p>
            </div>

            {/* What I Love About My Job Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs relative group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>What I love about my job</span>
                </h3>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {employee.whatILoveAboutJob || 'Empowering teams with seamless automated tools, solving complex technical challenges, and working with enthusiastic and talented colleagues.'}
              </p>
            </div>

            {/* Interests & Hobbies Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs relative group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>My interests and hobbies</span>
                </h3>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {employee.interestsAndHobbies || 'Exploring open-source innovations, hiking mountain trails, photography, playing chess, and continuous learning.'}
              </p>
            </div>
          </div>

          {/* Right Column: Skills & Certifications (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Skills Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Skills & Competencies</span>
                </h3>
                <button
                  onClick={() => setIsAddingSkill(prev => !prev)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-odoo-50 dark:bg-odoo-950/40 text-odoo-700 dark:text-odoo-300 text-xs font-bold hover:bg-odoo-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {isAddingSkill && (
                <div className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter skill name (e.g. Next.js)..."
                    value={newSkillText}
                    onChange={e => setNewSkillText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-odoo-800 text-white text-xs font-bold shadow-xs hover:bg-odoo-900 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {currentSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold group/skill"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover/skill:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Certifications</span>
                </h3>
                <button
                  onClick={() => setIsAddingCert(prev => !prev)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Cert</span>
                </button>
              </div>

              {isAddingCert && (
                <div className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <input
                    type="text"
                    placeholder="Certificate Title..."
                    value={newCertName}
                    onChange={e => setNewCertName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization (e.g. AWS, Scrum Alliance)..."
                    value={newCertIssuer}
                    onChange={e => setNewCertIssuer(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCert(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCert}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save Certification
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {currentCerts.map(cert => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {cert.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {cert.issuer} • Issued {cert.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRIVATE INFO (Personal & Demographic + Bank Details) */}
      {/* ========================================================================= */}
      {activeTab === 'private' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-odoo-700 dark:text-odoo-400" />
                  <span>Private & Demographic Information</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confidential identity, residential, and employment records
                </p>
              </div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Private Details</span>
              </button>
            </div>

            {/* Grid 1: Personal Demographic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Date of Birth
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.dateOfBirth || '1995-06-15'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Nationality
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.nationality || 'American'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Gender
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.gender || 'Male'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Marital Status
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.maritalStatus || 'Single'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Residing Address
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.residingAddress || employee.address}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Personal Email
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block truncate">
                  {privateInfo.personalEmail || employee.email}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Date of Joining
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                  {privateInfo.dateOfJoining || employee.joiningDate}
                </span>
              </div>
            </div>

            {/* Grid 2: Bank & Statutory Details (Wireframe specified) */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-odoo-800 dark:text-odoo-300 mt-8 mb-4 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Bank Account & Statutory Identifiers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Bank Name</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {privateInfo.bankName || 'Silicon Valley National Bank'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Account Number</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                  {privateInfo.accountNumber || '•••• •••• 1098'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">IFSC / Routing Code</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                  {privateInfo.ifscCode || 'SVNB0004521'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">PAN Number / Tax ID</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block font-mono uppercase">
                  {privateInfo.panNumber || 'ABCDE1234F'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SALARY INFO (ADMIN-ONLY TAB AS MANDATED IN WIREFRAME) */}
      {/* ========================================================================= */}
      {activeTab === 'salary' && isAdmin && (
        <div className="space-y-6">
          {/* Admin Lock Badge Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-200">
              <Lock className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="font-bold">
                Salary Information Tab (Restricted Admin Control)
              </span>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300">
              Salary components auto-compute dynamically based on Monthly Defined Wage
            </span>
          </div>

          {/* Wage Type & Working Schedule Header Card (Wireframe Top Section) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-odoo-800 dark:text-odoo-300" />
                  <span>Salary Structure & Working Schedule Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Wage Type: <span className="font-bold text-slate-700 dark:text-slate-200">Fixed Wage</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveSalaryStructure}
                  disabled={isSavingSalary}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {salarySavedToast ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span className="text-white font-bold">Saved in MongoDB!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-white" />
                      <span className="text-white font-bold">Save Salary Structure</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Wage Inputs Grid (Month Wage, Yearly Wage, Working Days, Hours, Break) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Monthly Wage Input */}
              <div className="p-4 rounded-2xl bg-odoo-50/50 dark:bg-odoo-950/20 border border-odoo-200/60 dark:border-odoo-800/40">
                <label className="text-[11px] font-bold uppercase tracking-wider text-odoo-800 dark:text-odoo-300 block mb-1">
                  Month Wage
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-odoo-800 dark:text-odoo-300">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={wageInput}
                    onChange={e => setWageInput(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-sm font-extrabold rounded-xl bg-white dark:bg-slate-900 border border-odoo-300 dark:border-odoo-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">/ Month</span>
              </div>

              {/* Yearly Wage (Auto calculated: Monthly * 12) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Yearly Wage
                </label>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono py-2">
                  {currencySymbol}{liveSalary.yearlyWage.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">/ Yearly (12x)</span>
              </div>

              {/* Working Days per Week */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Working Days / Wk
                </label>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono py-2">
                  {liveSalary.workingDaysPerWeek} Days
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">Standard week</span>
              </div>

              {/* Working Hours / Day */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Work Hours / Day
                </label>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono py-2">
                  {liveSalary.workingHoursPerDay} hrs / day
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">Standard shift</span>
              </div>

              {/* Break Time */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Break Time
                </label>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono py-2">
                  {liveSalary.breakTimeHours} hr
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">Lunch & intervals</span>
              </div>
            </div>

            {/* Salary Components (Wireframe Auto-calculated Section) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                <span>Salary Components Breakdown</span>
                <span className="text-[11px] text-slate-400 font-normal">Auto-calculated from Monthly Wage</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Basic Salary: 50% of Wage */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Basic Salary</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Define Basic salary from company cost, compute it based on monthly wages
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                      50.00%
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.baseSalary.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                {/* House Rent Allowance (HRA): 50% of Basic */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">House Rent Allowance (HRA)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        HRA provided to employees 50% of the basic salary
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold font-mono text-[11px]">
                      50.00% of Basic
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.hra.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                {/* Standard Allowance: 16.67% of Basic */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Standard Allowance</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        A predetermined, fixed amount provided to employee as part of their salary
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold font-mono text-[11px]">
                      16.67% of Basic
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.standardAllowance.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                {/* Performance Bonus: 8.33% of Basic */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Performance Bonus</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Variable amount paid during payroll, calculated as % of basic salary
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold font-mono text-[11px]">
                      8.33% of Basic
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.performanceBonus.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                {/* Leave Travel Allowance (LTA): 8.33% of Basic */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Leave Travel Allowance (LTA)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        LTA paid to employees to cover travel expenses, calculated as % of basic salary
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold font-mono text-[11px]">
                      8.33% of Basic
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.leaveTravelAllowance.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                {/* Fixed Allowance: Remaining portion of wage */}
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Fixed Allowance (Residual)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Fixed allowance portion of wages determined after calculating all salary components
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold font-mono text-[11px]">
                      Residual Balance
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {currencySymbol}{liveSalary.fixedAllowance.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provident Fund (PF) & Statutory Tax Deductions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Provident Fund (PF) Contribution */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Provident Fund (PF) Contribution</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">12.00%</span>
                </h5>
                <p className="text-[11px] text-slate-400">
                  PF is calculated based on the basic salary
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-300">Employee PF (12% of Basic)</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{currencySymbol}{liveSalary.providentFund.toLocaleString()} / month</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-300">Employer PF (12% of Basic)</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{currencySymbol}{liveSalary.employerPF.toLocaleString()} / month</span>
                  </div>
                </div>
              </div>

              {/* Tax Deductions */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Tax Deductions</span>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-mono font-bold">Statutory</span>
                </h5>
                <p className="text-[11px] text-slate-400">
                  Professional Tax deducted from the gross salary
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-300">Professional Tax (PT)</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{currencySymbol}{liveSalary.professionalTax.toLocaleString()} / month</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-300">Income Tax (TDS / Withholding)</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{currencySymbol}0.00 / month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOCUMENTS VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'docs' && (
        <DocumentManager employee={employee} />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EMERGENCY & SECURITY */}
      {activeTab === 'emergency' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Emergency Contact & Security Credentials</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Primary point of contact for urgent situations & security status
              </p>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Contact</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Contact Name</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                {employee.emergencyContact?.name || 'Robert Jenkins'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Relationship</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                {employee.emergencyContact?.relationship || 'Spouse / Family'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Emergency Phone</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                {employee.emergencyContact?.phone || '+1 (555) 987-6543'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          employee={employee}
        />
      )}
    </div>
  );
};
