// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  department?: string;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  LAB_TECH = 'lab_tech'
}

// Lab and Equipment Types
export interface Lab {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  equipment_ids: string[];
  instructor_id: string;
  status: LabStatus;
  created_at: string;
  updated_at: string;
}

export enum LabStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive'
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  manufacturer: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  lab_id: string;
  purchase_date: string;
  warranty_expiry?: string;
  maintenance_schedule?: MaintenanceSchedule;
  created_at: string;
  updated_at: string;
}

export enum EquipmentCategory {
  MICROSCOPE = 'microscope',
  CENTRIFUGE = 'centrifuge',
  SPECTROPHOTOMETER = 'spectrophotometer',
  AUTOCLAVE = 'autoclave',
  INCUBATOR = 'incubator',
  BALANCE = 'balance',
  COMPUTER = 'computer',
  OTHER = 'other'
}

export enum EquipmentStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order'
}

// Booking and Reservation Types
export interface Booking {
  id: string;
  user_id: string;
  lab_id: string;
  equipment_ids?: string[];
  start_time: string;
  end_time: string;
  purpose: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Course and Assignment Types
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor_id: string;
  semester: string;
  year: number;
  lab_ids: string[];
  student_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  instructions: string;
  due_date: string;
  max_score: number;
  lab_id?: string;
  required_equipment?: string[];
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string;
  attachments?: string[];
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

// Maintenance and Service Types
export interface MaintenanceSchedule {
  id: string;
  equipment_id: string;
  frequency: MaintenanceFrequency;
  last_maintenance: string;
  next_maintenance: string;
  maintenance_type: MaintenanceType;
  assigned_to?: string;
  notes?: string;
}

export enum MaintenanceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually'
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  CALIBRATION = 'calibration'
}

export interface MaintenanceRecord {
  id: string;
  equipment_id: string;
  technician_id: string;
  maintenance_type: MaintenanceType;
  description: string;
  parts_used?: string[];
  cost?: number;
  duration_minutes: number;
  completed_at: string;
  next_maintenance_due?: string;
}

// Inventory and Supply Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  cost_per_unit: number;
  supplier_id?: string;
  location: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  payment_terms: string;
  created_at: string;
  updated_at: string;
}

// Analytics and Reporting Types
export interface UsageAnalytics {
  lab_id: string;
  equipment_id?: string;
  date: string;
  usage_hours: number;
  booking_count: number;
  user_count: number;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  generated_by: string;
  generated_at: string;
  data: any;
  filters: any;
}

export enum ReportType {
  USAGE = 'usage',
  MAINTENANCE = 'maintenance',
  INVENTORY = 'inventory',
  FINANCIAL = 'financial',
  STUDENT_PROGRESS = 'student_progress'
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface BookingForm {
  lab_id: string;
  equipment_ids?: string[];
  start_time: string;
  end_time: string;
  purpose: string;
  notes?: string;
}

export interface EquipmentForm {
  name: string;
  model: string;
  serial_number: string;
  manufacturer: string;
  category: EquipmentCategory;
  lab_id: string;
  purchase_date: string;
  warranty_expiry?: string;
}

export interface LabForm {
  name: string;
  description: string;
  location: string;
  capacity: number;
  instructor_id: string;
}