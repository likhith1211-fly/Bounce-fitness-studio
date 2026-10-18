export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingId: string; // e.g. #BOUNCE-849201
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 06:00 AM - 07:00 AM
  fitnessGoal?: string;
  preferredTrainerId?: string;
  preferredTrainerName?: string;
  message?: string;
  status: BookingStatus;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  priceDisplay: string;
  iconName: string;
  popular?: boolean;
  order: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  bio: string;
  photoUrl: string;
  availableDays: string;
  availableHours: string;
  order: number;
  isActive: boolean;
}

export interface ClassSchedule {
  id: string;
  name: string;
  dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  time: string;
  duration: string;
  trainerName: string;
  seatsTotal: number;
  seatsBooked: number;
  category: string;
}

export interface MembershipPlan {
  id: string;
  title: string;
  duration: string;
  price: string;
  popular?: boolean;
  features: string[];
  terms?: string;
  order: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  verified: boolean;
  date?: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'EQUIPMENT' | 'STUDIO' | 'EXTERIOR' | 'TRAINING' | 'CLASSES';
  imageUrl: string;
  order: number;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interestedIn?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface BusinessSetting {
  id: string;
  businessName: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  openingHoursMonSat: string;
  openingHoursSun: string;
  blockedDates: string[];
  googleMapsUrl: string;
  embedMapsUrl: string;
}

export interface MemberSubscription {
  id: string;
  name: string;
  phone: string;
  planName: string;
  durationLabel: string; // e.g. '1 Day', '1 Month (30 Days)', '3 Months (90 Days)', '1 Year (365 Days)'
  durationDays: number;
  priceDisplay: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  status: 'active' | 'expired';
  reminderDismissedByMember?: boolean;
  reminderNotifiedAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StudioAnnouncement {
  id: string;
  title: string;
  message: string;
  holidayDate?: string; // YYYY-MM-DD
  type: 'holiday' | 'notice' | 'urgent';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

