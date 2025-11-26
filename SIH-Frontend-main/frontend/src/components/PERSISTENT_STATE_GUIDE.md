/**
 * PERSISTENT STATE IMPLEMENTATION GUIDE
 * 
 * Keep users on the same section after page refresh
 * Works for any component with tabs, sheets, modals, or expandable sections
 */

// ============================================================================
// OPTION 1: SIMPLE BOOLEAN STATE (Sheet Open/Close)
// ============================================================================

// BEFORE: State lost on refresh
const MyComponent = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  // ❌ On refresh: sheetOpen resets to false
};

// AFTER: State persisted to localStorage
import { useLocalStorage } from '@hooks/useLocalStorage';

const MyComponent = () => {
  const [sheetOpen, setSheetOpen] = useLocalStorage('my_sheet_open', false);
  // ✅ On refresh: sheetOpen restores to previous state
};


// ============================================================================
// OPTION 2: TAB/SECTION SELECTION (String State)
// ============================================================================

// BEFORE: Active tab lost on refresh
const DashboardComponent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // ❌ On refresh: always returns to 'overview'
};

// AFTER: Active tab remembered
import { useLocalStorage } from '@hooks/useLocalStorage';

const DashboardComponent = () => {
  const [activeTab, setActiveTab] = useLocalStorage('dashboard_active_tab', 'overview');
  // ✅ On refresh: shows the tab user was viewing
};


// ============================================================================
// OPTION 3: COMPLEX OBJECT STATE (Multiple Related Values)
// ============================================================================

// BEFORE: Multiple states lost on refresh
const FormComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  // ❌ All form data lost on refresh
};

// AFTER: All form data persisted
import { useLocalStorageObject } from '@hooks/useLocalStorage';

const FormComponent = () => {
  const [formData, setFormData, updateField] = useLocalStorageObject(
    'form_draft',
    { title: '', content: '', isVisible: true }
  );

  // Update individual fields
  const handleTitleChange = (e) => updateField('title', e.target.value);
  const handleContentChange = (e) => updateField('content', e.target.value);

  // ✅ All form data restored on refresh
};


// ============================================================================
// IMPLEMENTATION PATTERNS
// ============================================================================

// Pattern 1: Admin Dashboard - Remember Active Tab
// ─────────────────────────────────────────────────

import { useLocalStorage } from '@hooks/useLocalStorage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useLocalStorage('admin_active_tab', 'overview');

  return (
    <div>
      <TabButtons>
        <Button 
          onClick={() => setActiveTab('overview')}
          active={activeTab === 'overview'}
        >
          Overview
        </Button>
        <Button 
          onClick={() => setActiveTab('analytics')}
          active={activeTab === 'analytics'}
        >
          Analytics
        </Button>
      </TabButtons>

      {activeTab === 'overview' && <OverviewContent />}
      {activeTab === 'analytics' && <AnalyticsContent />}
    </div>
  );
};


// Pattern 2: Form Component - Remember Open State
// ────────────────────────────────────────────────

import { useLocalStorage } from '@hooks/useLocalStorage';

const AnnouncementForm = () => {
  const [sheetOpen, setSheetOpen] = useLocalStorage('announcement_sheet_open', false);
  const [title, setTitle] = useState('');

  const handlePublish = () => {
    // ... publish logic
    setSheetOpen(false); // Closes sheet when published
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger>Open Form</SheetTrigger>
      <SheetContent>
        {/* Form content */}
      </SheetContent>
    </Sheet>
  );
};


// Pattern 3: Expandable Sections - Remember Which Ones Are Open
// ───────────────────────────────────────────────────────────────

import { useLocalStorage } from '@hooks/useLocalStorage';

const AnalyticsModule = () => {
  const [expandedSections, setExpandedSections] = useLocalStorage(
    'analytics_expanded',
    { standard: true, dynamic: true }
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div>
      <Card 
        onClick={() => toggleSection('standard')}
        isExpanded={expandedSections.standard}
      >
        Standard Assessments
      </Card>

      <Card 
        onClick={() => toggleSection('dynamic')}
        isExpanded={expandedSections.dynamic}
      >
        Dynamic Forms
      </Card>
    </div>
  );
};


// ============================================================================
// COMPONENTS THAT SHOULD USE PERSISTENT STATE
// ============================================================================

COMPONENTS AND THEIR KEYS:
────────────────────────────

✅ AdminDashboard.jsx
   - Key: 'admin_active_tab'
   - Value: Current active tab (overview, analytics, users, etc.)
   - Status: ✓ Already implemented

✅ AnnouncementManagement.jsx
   - Key: 'announcement_sheet_open'
   - Value: Whether mobile announcement form sheet is open
   - Status: ✓ Just implemented

✅ AnalyticsModule.jsx
   - Key: 'analytics_active_tab'
   - Value: Which tab user is viewing (standard, dynamic)
   - Purpose: Remember if user was viewing standard or dynamic forms analytics

✅ StudentDashboard.jsx
   - Key: 'student_active_tab'
   - Value: Current tab (overview, chatbot, community, etc.)
   - Status: Might already exist

✅ CounsellorDashboard.jsx
   - Key: 'counsellor_active_tab'
   - Value: Current tab
   - Status: Might already exist

✅ FormBuilder.jsx
   - Key: 'form_builder_draft'
   - Value: Form title, description, questions (in case of accidental close)
   - Purpose: Save form draft to prevent data loss

✅ CommunityView.jsx
   - Key: 'community_expanded_threads'
   - Value: Which threads/conversations are expanded
   - Purpose: Remember which discussions user was reading

✅ AssessmentForm.jsx
   - Key: 'assessment_form_progress'
   - Value: Which questions have been answered
   - Purpose: Save progress if user navigates away

✅ StudentAppointments.jsx / CounsellorAppointments.jsx
   - Key: 'appointments_view_type'
   - Value: Current view (requests, upcoming, past, availability)
   - Purpose: Remember which view user prefers


// ============================================================================
// CLEARING STORAGE (When Needed)
// ============================================================================

import { useClearStorage } from '@hooks/useLocalStorage';

const Logout = () => {
  const clearAnnouncements = useClearStorage('announcement_sheet_open');
  const clearDashboard = useClearStorage('admin_active_tab');

  const handleLogout = () => {
    // Clear relevant storage
    clearAnnouncements();
    clearDashboard();
    
    // Redirect to login
  };
};


// ============================================================================
// ERROR HANDLING
// ============================================================================

The useLocalStorage hook automatically handles:

✅ localStorage not available (private browsing, etc.)
✅ JSON serialization errors
✅ Quota exceeded errors
✅ SSR (server-side rendering) safety

All errors are logged as warnings but don't break the app.


// ============================================================================
// BEST PRACTICES
// ============================================================================

DO:
✅ Use for tab selections
✅ Use for sheet/modal open states
✅ Use for accordion/collapsible states
✅ Use for form drafts (before submission)
✅ Use for filter/sort preferences
✅ Use consistent key naming: 'component_property'

DON'T:
❌ Store sensitive data (passwords, tokens)
❌ Store large objects (use IndexedDB instead)
❌ Rely on localStorage for critical data
❌ Use different keys for same data in different components
❌ Store user ID or auth tokens in localStorage

NAMING CONVENTION:
─────────────────
admin_active_tab
student_active_tab
counsellor_active_tab
announcement_sheet_open
analytics_active_tab
form_builder_draft
community_expanded_threads
appointments_view_type


// ============================================================================
// EXAMPLE: FULL IMPLEMENTATION IN ANALYTICS MODULE
// ============================================================================

import { useLocalStorage } from '@hooks/useLocalStorage';

const AnalyticsModule = () => {
  const [activeTab, setActiveTab] = useLocalStorage('analytics_active_tab', 'standard');
  const [expandedCategory, setExpandedCategory] = useLocalStorage('analytics_expanded_category', null);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('standard')}
          className={activeTab === 'standard' ? 'border-b-2' : ''}
        >
          Standard Assessments
        </button>
        <button
          onClick={() => setActiveTab('dynamic')}
          className={activeTab === 'dynamic' ? 'border-b-2' : ''}
        >
          Dynamic Forms
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'standard' && <StandardAssessments />}
      {activeTab === 'dynamic' && (
        <DynamicForms 
          expandedCategory={expandedCategory}
          setExpandedCategory={setExpandedCategory}
        />
      )}
    </div>
  );
};

// Result:
// ✅ When user refreshes page, they see the same tab they were viewing
// ✅ Expanded categories also restore to their previous state
