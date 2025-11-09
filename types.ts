import React from 'react';

// Status types
export type LoadStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';
export type ScannedDocumentStatus = 'Processing' | 'Completed' | 'Failed';
export type DriverStatus = 'Available' | 'On Load' | 'Off Duty';
export type ExpenseType = 'Fuel' | 'Maintenance' | 'Toll' | 'Other';
export type DocumentCategory = 'BOL' | 'POD' | 'Invoice' | 'Rate Confirmation' | 'Other' | 'Unknown';

// User roles for the new company system
export type UserRole = 'admin' | 'driver' | 'user' | 'owner' | 'manager' | 'driver_company' | 'driver_independent';

// Company types
export interface Company {
  id: string;
  name: string;
  dba_name?: string; // Doing Business As
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  mc_number?: string; // Motor Carrier Number
  dot_number?: string; // Department of Transportation Number
  tax_id?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  operating_authority: 'active' | 'pending' | 'inactive';
  fleet_size_category: 'small' | 'medium' | 'large' | 'enterprise';
  primary_business_type: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  is_verified: boolean;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role: UserRole;
  permissions: string[];
  status: 'active' | 'pending' | 'inactive';
  invited_by: string;
  joined_at: string;
  updated_at: string;
}

// Chat types
export type ChatMessageType = 'text' | 'image' | 'file';
export type ChatSenderType = 'admin' | 'driver';
export type ChatAttachmentType = 'image' | 'pdf' | 'text' | 'file';

// Chat data models
export interface ChatConversation {
    id: string;
    admin_id: string;
    driver_id: string;
    last_message_at: string;
    last_message: string;
    unread_count_admin: number;
    unread_count_driver: number;
    status: 'active' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: ChatSenderType;
    message: string;
    message_type: ChatMessageType;
    attachment_url?: string;
    attachment_type?: string;
    attachment_name?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
    updated_at: string;
    attachments?: ChatAttachment[];
}

export interface ChatAttachment {
    id: string;
    message_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    public_url: string;
    thumbnail_url?: string;
    upload_status: 'uploading' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}


// Main data models
export interface Load {
    id: number;
    loadNumber: string;
    customer: string;
    origin: string;
    destination: string;
    status: LoadStatus;
    driver: string;
    eta: string;
}

export interface Expense {
    id: number;
    loadId: number;
    type: ExpenseType;
    description: string;
    amount: number;
    date: string;
}

export interface ScannedDocument {
    id: string;
    name: string;
    previewUrl: string;
    uploadDate: string;
    status: ScannedDocumentStatus;
    category?: DocumentCategory;
    extractedText?: string;
}

export interface AvailableLoad {
    id: number;
    origin: string;
    destination: string;
    miles: number;
    rate: number;
    equipmentType: string;
    date: string;
}

export interface TruckStop {
    id: number;
    name: string;
    location: string;
    parking: 'High Availability' | 'Limited Spots' | 'Full';
}

export interface FuelStop {
    id: number;
    name: string;
    location: string;
    dieselPrice: number;
    amenities: string[];
}

export interface TripHistoryEntry {
    id: number;
    loadNumber: string;
    customer: string;
    origin: string;
    destination: string;
    completionDate: string;
    revenue: number;
}

export interface VehicleDetails {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
}

export interface PerformanceMetrics {
    onTimePercentage: number;
    averageLoadRevenue: number;
    milesLastQuarter: number;
}

export interface DriverStatusLog {
    timestamp: string;
    status: DriverStatus;
    details?: string;
}

export interface Driver {
    id: number;
    name: string;
    truckNumber: string;
    status: DriverStatus;
    location: string;
    position: [number, number];
    phone: string;
    email: string;
    yearsOfService: number;
    licenseNumber: string;
    cdlState: string;
    licenseExpiry: string;
    safetyRating: number;
    currentLoad: string | null;
    vehicle: VehicleDetails;
    performanceMetrics: PerformanceMetrics;
    statusHistory: DriverStatusLog[];
    
    // Campos para filtrado por company
    company_id?: string;
    fleet_id?: string;
}

// Map & Route types
export type Route = [number, number][];

// Chat & Conversation types
export interface AIChatMessage {
    id: number;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    status?: 'sent' | 'read';
}

export interface LiveTranscriptEntry {
    id: number;
    speaker: 'You' | 'AI';
    text: string;
}

// Smart Search types
export interface WebChunk {
    uri?: string;
    title?: string;
}

export interface MapsChunk {
    uri?: string;
    title?: string;
}

export interface GroundingChunk {
    web?: WebChunk;
    maps?: MapsChunk;
}

// Invoicing types
export interface Invoice {
    id: string;
    invoiceNumber: string;
    loads: Load[];
    totalAmount: number;
    issueDate: string;
    dueDate: string;
}


// Component Prop types
export interface DashboardProps {
    loads: Load[];
    drivers: Driver[];
}

export interface LoadsProps {
    loads: Load[];
    setLoads: React.Dispatch<React.SetStateAction<Load[]>>;
}

export interface DriversProps {
    drivers: Driver[];
}

export interface AdminDashboardProps extends LoadsProps {
    drivers: Driver[];
    setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

export interface DriverProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver: Driver;
}

export interface AddDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddDriver: (newDriver: Omit<Driver, 'id'>) => void;
}

export interface InvoicingProps {
    loads: Load[];
    invoices: Invoice[];
    expenses: Expense[];
    onGenerateInvoice: (loadsToInvoice: Load[], invoiceNumber: string, dueDate: string) => void;
}

export interface InvoiceGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    loadsToInvoice: Load[];
    expensesForLoads: Expense[];
    onConfirm: (invoiceNumber: string, dueDate: string) => void;
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'normal' | 'high' | 'urgent';

export interface Notification {
    id: string;
    driver_id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    is_read: boolean;
    metadata?: any;
    load_id?: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationPreferences {
    emailEnabled: boolean;
    pushEnabled: boolean;
    soundEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    enabledTypes: NotificationType[];
}

// Notification Component Props
export interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    driverId: string;
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markAsRead: (notificationId: string) => Promise<boolean>;
    markAllAsRead: () => Promise<boolean>;
    createTestNotification: () => Promise<boolean>;
}

export interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (notificationId: string) => void;
    onNotificationClick?: (notification: Notification) => void;
}

export interface NotificationBadgeProps {
    count: number;
    onClick: () => void;
}

export interface NotificationPreferencesProps {
    isOpen: boolean;
    onClose: () => void;
    driverId: string;
}

// Chat Component Props
export interface ChatInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
    adminId?: string;
    driverId?: string;
    currentUserId: string;
    currentUserType: ChatSenderType;
}

export interface ConversationListProps {
    conversations: ChatConversation[];
    currentUserId: string;
    currentUserType: ChatSenderType;
    selectedConversationId?: string;
    onConversationSelect: (conversation: ChatConversation) => void;
    loading: boolean;
}

export interface MessageBubbleProps {
    message: ChatMessage;
    isOwnMessage: boolean;
    onAttachmentClick?: (attachment: ChatAttachment) => void;
}

export interface MessageInputProps {
    onSendMessage: (message: string, attachment?: File) => void;
    disabled?: boolean;
    placeholder?: string;
}

export interface AttachmentPreviewProps {
    attachment: ChatAttachment;
    onClick?: () => void;
    showDownload?: boolean;
}

export interface ChatHeaderProps {
    conversation?: ChatConversation;
    otherUserName?: string;
    isOnline?: boolean;
    onClose: () => void;
}

// Driver Dashboard Props
export interface DriverDashboardProps {
    // The DriverDashboard is self-contained and doesn't need props currently
    // but keeping this for future extensibility
}
// Document Management types
export type DocumentType = 'license' | 'insurance' | 'registration' | 'medical' | 'hazmat' | 'other';
export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending_review';
export type DocumentVerificationStatus = 'verified' | 'pending' | 'rejected';

// Document data models
export interface DriverDocument {
    id: string;
    driver_id: string;
    document_type: DocumentType;
    document_name: string;
    document_url: string;
    file_size: number;
    mime_type: string;
    expiry_date?: string;
    status: DocumentStatus;
    upload_date: string;
    last_updated: string;
    is_required: boolean;
    notes?: string;
    verification_status: DocumentVerificationStatus;
    verified_by?: string;
    verified_at?: string;
    created_at: string;
    updated_at: string;
}

// Document Component Props
export interface DocumentDashboardProps {
    driverId: string;
}

export interface DocumentUploadProps {
    documentType?: DocumentType;
    onUploadSuccess: (document: DriverDocument) => void;
    onUploadError: (error: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export interface DocumentViewerProps {
    document: DriverDocument;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (documentId: string) => void;
    onEdit?: (documentId: string, updates: Partial<DriverDocument>) => void;
}

export interface DocumentCategoriesProps {
    documents: DriverDocument[];
    onDocumentSelect: (document: DriverDocument) => void;
    selectedCategory?: DocumentType;
    onCategorySelect: (category: DocumentType | 'all') => void;
}

export interface DocumentAlertsProps {
    driverId: string;
    expiringDocuments: DriverDocument[];
    expiredDocuments: DriverDocument[];
    onDismissAlert: (documentId: string) => void;
}

export interface DocumentStatsProps {
    totalDocuments: number;
    validDocuments: number;
    expiringDocuments: number;
    expiredDocuments: number;
    pendingVerification: number;
}

// Document Upload types
export interface DocumentUploadData {
    fileData: string; // base64 data URL
    fileName: string;
    documentType: DocumentType;
    documentName: string;
    expiryDate?: string;
    isRequired?: boolean;
    notes?: string;
}

export interface DocumentUploadResult {
    document: DriverDocument;
    publicUrl: string;
    status: string;
}

// Document filtering and sorting
export interface DocumentFilter {
    type?: DocumentType | 'all';
    status?: DocumentStatus | 'all';
    verificationStatus?: DocumentVerificationStatus | 'all';
    searchTerm?: string;
}

export interface DocumentSortOption {
    field: 'upload_date' | 'expiry_date' | 'document_name' | 'last_updated';
    direction: 'asc' | 'desc';
}

// Document validation types
export interface DocumentValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface DocumentExpiryAlert {
    document: DriverDocument;
    daysUntilExpiry: number;
    alertType: 'urgent' | 'warning' | 'info';
    message: string;
}// =============================================
// TIPOS PARA SISTEMA DE HISTORIAL DE CARGAS
// =============================================

// Tipos específicos para historial (evitando conflictos)
export type LoadHistoryStatus = 'completed' | 'in_progress' | 'pending' | 'cancelled';

export interface LoadHistory {
  id: string;
  driver_id: string;
  load_number: string;
  customer: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  distance_miles: number;
  load_weight_lbs: number;
  rate_per_mile: number;
  total_revenue: number;
  fuel_cost: number;
  fuel_gallons_used: number;
  driving_time_hours: number;
  total_time_hours: number;
  on_time_delivery: boolean;
  equipment_type: string;
  cargo_type: string;
  special_requirements?: string;
  weather_conditions: string;
  route_difficulty: string;
  status: LoadHistoryStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverPerformanceMetrics {
  id: string;
  driver_id: string;
  metric_period: MetricPeriod;
  period_start: string;
  period_end: string;
  total_loads: number;
  total_miles: number;
  total_revenue: number;
  total_fuel_cost: number;
  total_driving_hours: number;
  on_time_percentage: number;
  average_rating?: number;
  fuel_efficiency_mpg: number;
  revenue_per_mile: number;
  average_speed: number;
  safety_incidents: number;
  customer_complaints: number;
  created_at: string;
  updated_at: string;
}

export interface LoadRating {
  id: string;
  load_history_id: string;
  driver_id: string;
  customer_name: string;
  overall_rating: number;
  punctuality_rating: number;
  communication_rating: number;
  vehicle_condition_rating: number;
  professionalism_rating: number;
  customer_feedback?: string;
  positive_aspects?: string;
  improvement_suggestions?: string;
  would_recommend: boolean;
  rating_date: string;
  created_at: string;
  updated_at: string;
}

export interface EfficiencyStatistics {
  id: string;
  driver_id: string;
  statistic_type: StatisticType;
  calculation_period: string;
  loads_completed: number;
  total_miles: number;
  total_revenue: number;
  total_costs: number;
  net_profit: number;
  average_mph: number;
  fuel_efficiency: number;
  on_time_rate: number;
  customer_satisfaction: number;
  rank_among_drivers: number;
  percentile_performance: number;
  miles_per_day: number;
  revenue_per_day: number;
  efficiency_score: number;
  last_calculated: string;
  created_at: string;
  updated_at: string;
}

// Tipos Enum para historial
export type MetricPeriod = 'monthly' | 'quarterly' | 'yearly';

export type StatisticType = 'performance_summary' | 'monthly_trend' | 'quarterly_performance' | 
  'yearly_performance' | 'fleet_comparison' | 'safety_quality' | 'projection';

export type EquipmentType = 'Dry Van' | 'Reefer' | 'Flatbed' | 'Tank' | 'Lowboy';

export type CargoType = 'General Freight' | 'Refrigerated' | 'Hazmat' | 'Oversized' | 
  'Electronics' | 'Food Products' | 'Building Materials' | 'Automotive';

export type RouteDifficulty = 'Easy' | 'Medium' | 'Hard';

export type WeatherConditions = 'Clear' | 'Rainy' | 'Snowy' | 'Foggy' | 'Windy' | 'Stormy';

// Interfaces para componentes frontend
export interface LoadHistoryFilters {
  startDate?: string;
  endDate?: string;
  customer?: string;
  equipmentType?: EquipmentType;
  cargoType?: CargoType;
  status?: LoadHistoryStatus;
  onTimeOnly?: boolean;
  minRevenue?: number;
  maxRevenue?: number;
  sortBy?: LoadSortField;
  sortOrder?: 'asc' | 'desc';
}

export type LoadSortField = 'delivery_date' | 'total_revenue' | 'distance_miles' | 
  'customer' | 'on_time_delivery' | 'fuel_efficiency';

export interface PerformanceMetricsData {
  current: DriverPerformanceMetrics;
  previous?: DriverPerformanceMetrics;
  trend: 'improving' | 'declining' | 'stable';
  percentileRank: number;
  fleetRank: number;
  totalDrivers: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface PerformanceChartData {
  revenue: ChartDataPoint[];
  mileage: ChartDataPoint[];
  fuelEfficiency: ChartDataPoint[];
  onTimeRate: ChartDataPoint[];
  customerRating: ChartDataPoint[];
}

export interface LoadStatistics {
  totalLoads: number;
  totalMiles: number;
  totalRevenue: number;
  totalFuelCost: number;
  grossProfit: number;
  profitMargin: number;
  averageMPG: number;
  onTimePercentage: number;
  averageRating: number;
  uniqueCustomers: number;
}

export interface RankingData {
  rank: number;
  driver_id: string;
  driver_name: string;
  truck_number: string;
  efficiency_score: number;
  on_time_rate: number;
  customer_satisfaction: number;
  total_revenue: number;
  total_miles: number;
  percentile: number;
  performance_badge: PerformanceBadge;
  recent_activity: {
    recent_loads: number;
    last_delivery: string | null;
    recent_on_time_rate: number;
  };
  recent_ratings: {
    recent_average_rating: number;
    total_recent_ratings: number;
  };
  improvement_areas: ImprovementArea[];
}

export type PerformanceBadge = 'champion' | 'elite' | 'excellent' | 'good' | 'average' | 'needs_improvement';

export type ImprovementArea = 'punctuality' | 'fuel_efficiency' | 'customer_service' | 'safety' | 'communication';

export interface FleetStatistics {
  average_efficiency: number;
  average_on_time_rate: number;
  average_customer_satisfaction: number;
  total_revenue: number;
  total_miles: number;
  total_drivers: number;
}

export interface DriverRankingResponse {
  rankings: RankingData[];
  current_driver: RankingData | null;
  fleet_statistics: FleetStatistics;
  ranking_criteria: {
    type: RankingType;
    period: RankingPeriod;
    total_drivers: number;
    last_updated: string;
  };
}

export type RankingType = 'overall' | 'efficiency' | 'safety' | 'customer_satisfaction';

export type RankingPeriod = 'current_year' | 'last_month' | 'last_quarter' | 'all_time';

export interface ReportGenerationOptions {
  driver_id: string;
  report_type: ReportType;
  format: ReportFormat;
  start_date?: string;
  end_date?: string;
  include_ratings?: boolean;
}

export type ReportType = 'summary' | 'detailed' | 'financial';

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface GeneratedReport {
  report_data: string | object;
  content_type: string;
  filename: string;
  summary: LoadStatistics;
  total_loads: number;
  date_range: {
    start: string | null;
    end: string | null;
  };
  generated_at: string;
}

// Constantes para el historial de cargas
export const LOAD_HISTORY_STATUSES: { value: LoadHistoryStatus; label: string }[] = [
  { value: 'completed', label: 'Completada' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'cancelled', label: 'Cancelada' }
];

export const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: 'Dry Van', label: 'Camión Seco' },
  { value: 'Reefer', label: 'Refrigerado' },
  { value: 'Flatbed', label: 'Plataforma' },
  { value: 'Tank', label: 'Tanque' },
  { value: 'Lowboy', label: 'Cama Baja' }
];

export const CARGO_TYPES: { value: CargoType; label: string }[] = [
  { value: 'General Freight', label: 'Carga General' },
  { value: 'Refrigerated', label: 'Refrigerado' },
  { value: 'Hazmat', label: 'Materiales Peligrosos' },
  { value: 'Oversized', label: 'Sobredimensionado' },
  { value: 'Electronics', label: 'Electrónicos' },
  { value: 'Food Products', label: 'Productos Alimenticios' },
  { value: 'Building Materials', label: 'Materiales de Construcción' },
  { value: 'Automotive', label: 'Automotriz' }
];

export const PERFORMANCE_BADGE_COLORS: { [K in PerformanceBadge]: string } = {
  champion: '#FFD700',
  elite: '#C0C0C0',
  excellent: '#CD7F32',
  good: '#4CAF50',
  average: '#FF9800',
  needs_improvement: '#F44336'
};

export const PERFORMANCE_BADGE_LABELS: { [K in PerformanceBadge]: string } = {
  champion: 'Campeón',
  elite: 'Elite',
  excellent: 'Excelente',
  good: 'Bueno',
  average: 'Promedio',
  needs_improvement: 'Necesita Mejorar'
};// Interfaces para hooks del historial de cargas
export interface UseLoadHistoryResult {
  loads: LoadHistory[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: LoadHistoryFilters;
  statistics: LoadStatistics;
  setFilters: (filters: LoadHistoryFilters) => void;
  setPage: (page: number) => void;
  refreshData: () => void;
  exportData: (format: ReportFormat) => Promise<void>;
}

export interface UsePerformanceMetricsResult {
  metrics: PerformanceMetricsData | null;
  chartData: PerformanceChartData | null;
  loading: boolean;
  error: string | null;
  period: MetricPeriod;
  setPeriod: (period: MetricPeriod) => void;
  refreshMetrics: () => void;
  calculateTrend: (current: number, previous: number) => 'improving' | 'declining' | 'stable';
}

export interface UseLoadRatingsResult {
  ratings: LoadRating[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: { [key: number]: number };
  recentFeedback: string[];
  refreshRatings: () => void;
}

export interface UseDriverRankingsResult {
  rankings: RankingData[];
  currentDriverRank: RankingData | null;
  fleetStats: FleetStatistics | null;
  loading: boolean;
  error: string | null;
  rankingType: RankingType;
  period: RankingPeriod;
  setRankingType: (type: RankingType) => void;
  setPeriod: (period: RankingPeriod) => void;
  refreshRankings: () => void;
}

export interface UseReportExportResult {
  generateReport: (options: ReportGenerationOptions) => Promise<GeneratedReport>;
  downloading: boolean;
  error: string | null;
  lastReport: GeneratedReport | null;
}