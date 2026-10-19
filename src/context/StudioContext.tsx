import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  getDocFromServer,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  Appointment,
  Service,
  Trainer,
  ClassSchedule,
  MembershipPlan,
  Testimonial,
  GalleryItem,
  Enquiry,
  BusinessSetting,
  MemberSubscription,
  StudioAnnouncement,
} from '../types';
import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_TRAINERS,
  DEFAULT_CLASSES,
  DEFAULT_MEMBERSHIP_PLANS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_GALLERY,
} from '../data/defaultData';

interface StudioContextType {
  settings: BusinessSetting;
  updateSettings: (newSettings: Partial<BusinessSetting>) => Promise<void>;
  services: Service[];
  updateService: (service: Service) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  trainers: Trainer[];
  updateTrainer: (trainer: Trainer) => Promise<void>;
  addTrainer: (trainer: Omit<Trainer, 'id'>) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;
  classes: ClassSchedule[];
  updateClass: (cls: ClassSchedule) => Promise<void>;
  addClass: (cls: Omit<ClassSchedule, 'id'>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  membershipPlans: MembershipPlan[];
  updatePlan: (plan: MembershipPlan) => Promise<void>;
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  updateTestimonial: (item: Testimonial) => Promise<void>;
  addTestimonial: (item: Omit<Testimonial, 'id'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  gallery: GalleryItem[];
  updateGalleryItem: (item: GalleryItem) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  appointments: Appointment[];
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'bookingId'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  enquiries: Enquiry[];
  createEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  // Member Subscriptions (Synced between Member Sign-In and Admin Owner Account)
  memberSubscriptions: MemberSubscription[];
  registerMemberSignIn: (data: {
    name: string;
    phone: string;
    planName: string;
    durationLabel: string;
    durationDays: number;
    priceDisplay: string;
  }) => Promise<MemberSubscription>;
  updateMemberSubscription: (member: MemberSubscription) => Promise<void>;
  renewMemberSubscription: (id: string, durationDays?: number) => Promise<void>;
  markMemberExpired: (id: string) => Promise<void>;
  deleteMemberSubscription: (id: string) => Promise<void>;
  // Studio Holiday & Urgent Announcements (Broadcast from Admin to all Members)
  announcements: StudioAnnouncement[];
  createAnnouncement: (data: Omit<StudioAnnouncement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (ann: StudioAnnouncement) => Promise<void>;
  toggleAnnouncementActive: (id: string, isActive: boolean) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  saveAllAdminData: () => Promise<void>;
  isSlotAvailable: (date: string, timeSlot: string) => boolean;
  // Modal controllers
  isBookingOpen: boolean;
  openBooking: (preselectedServiceId?: string, preselectedTrainerId?: string) => void;
  closeBooking: () => void;
  selectedServiceForBooking?: string;
  selectedTrainerForBooking?: string;
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  isTrainersTabOpen: boolean;
  openTrainersTab: () => void;
  closeTrainersTab: () => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, phoneUser, updatePhoneUser } = useAuth();

  // Validate connection to Firestore on boot as required by Firebase guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
        }
      }
    }
    testConnection();
  }, []);

  // Clear stale keys on mount so updated trainers, swapped owner photo, ₹300 daily pass, ₹5000 3-month pricing, and schedule always take effect
  useEffect(() => {
    const staleKeys = [
      'bounce_settings',
      'bounce_services',
      'bounce_trainers',
      'bounce_classes',
      'bounce_plans',
      'bounce_testimonials',
      'bounce_gallery',
      'bounce_settings_v2',
      'bounce_services_v2',
      'bounce_trainers_v2',
      'bounce_classes_v2',
      'bounce_plans_v2',
      'bounce_settings_v3',
      'bounce_services_v3',
      'bounce_trainers_v3',
      'bounce_classes_v3',
      'bounce_plans_v3',
      'bounce_settings_v4',
      'bounce_services_v4',
      'bounce_trainers_v4',
      'bounce_classes_v4',
      'bounce_plans_v4',
      'bounce_settings_v5',
      'bounce_services_v5',
      'bounce_trainers_v5',
      'bounce_classes_v5',
      'bounce_plans_v5',
      'bounce_testimonials_v5',
      'bounce_gallery_v5',
      'bounce_settings_v6',
      'bounce_services_v6',
      'bounce_trainers_v6',
      'bounce_classes_v6',
      'bounce_plans_v6',
      'bounce_testimonials_v6',
      'bounce_gallery_v6',
      'bounce_trainers_v7',
      'bounce_plans_v7',
    ];
    staleKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  }, []);

  // Helper that guarantees all 4 core coaches (Alwyn, Glenn Prabhu, Firoz, Floor Trainer) are always present
  const mergeTrainersWithDefaults = (incoming: Trainer[]): Trainer[] => {
    const normalizeTrainerPhoto = (t: Trainer, defaultPhotoUrl?: string): Trainer => {
      const lowerName = (t.name || '').toLowerCase();
      if (t.photoUrl && t.photoUrl.startsWith('data:')) {
        return { ...t, isActive: true };
      }
      if (lowerName.includes('glenn')) {
        return { ...t, photoUrl: '/gym_images/trainer_glenn_prabhu.jpg', isActive: true };
      }
      if (lowerName.includes('firoz')) {
        return { ...t, photoUrl: '/gym_images/trainer_firoz.jpg', isActive: true };
      }
      if (lowerName.includes('alwyn')) {
        return { ...t, photoUrl: '/gym_images/owner_glenn_prabhu.jpg', isActive: true };
      }
      return {
        ...t,
        photoUrl: t.photoUrl || defaultPhotoUrl || '/gym_images/inside_dumbbell_rack.jpg',
        isActive: true,
      };
    };

    const mergedDefaults = DEFAULT_TRAINERS.map((defTrainer) => {
      const match = incoming.find(
        (item) =>
          item.id === defTrainer.id ||
          (defTrainer.id === 'trainer-alwyn' && item.name?.toLowerCase().includes('alwyn')) ||
          (defTrainer.id === 'trainer-glenn' && item.name?.toLowerCase().includes('glenn')) ||
          (defTrainer.id === 'trainer-firoz' && item.name?.toLowerCase().includes('firoz')) ||
          (defTrainer.id === 'trainer-floor' && item.name?.toLowerCase().includes('floor'))
      );
      if (match) {
        return normalizeTrainerPhoto(
          {
            ...defTrainer,
            ...match,
            id: defTrainer.id,
            order: defTrainer.order,
            isActive: true,
          },
          defTrainer.photoUrl
        );
      }
      return normalizeTrainerPhoto(defTrainer, defTrainer.photoUrl);
    });

    const defaultIds = new Set(DEFAULT_TRAINERS.map((d) => d.id));
    const extraTrainers = incoming
      .filter((item) => {
        if (defaultIds.has(item.id)) return false;
        const n = (item.name || '').toLowerCase();
        if (n.includes('alwyn') || n.includes('glenn') || n.includes('firoz') || n.includes('floor trainer')) {
          return false;
        }
        return true;
      })
      .map((t) => normalizeTrainerPhoto(t));

    return [...mergedDefaults, ...extraTrainers].sort((a, b) => a.order - b.order);
  };

  // Helper that guarantees all 6 core membership plans are always present
  const mergePlansWithDefaults = (incoming: MembershipPlan[]): MembershipPlan[] => {
    const mergedDefaults = DEFAULT_MEMBERSHIP_PLANS.map((defPlan) => {
      const match = incoming.find((item) => item.id === defPlan.id);
      if (match) {
        return {
          ...defPlan,
          ...match,
          id: defPlan.id,
          order: defPlan.order,
          isActive: true,
        };
      }
      return defPlan;
    });
    const defaultIds = new Set(DEFAULT_MEMBERSHIP_PLANS.map((d) => d.id));
    const extraPlans = incoming.filter((item) => !defaultIds.has(item.id));
    return [...mergedDefaults, ...extraPlans].sort((a, b) => a.order - b.order);
  };

  const [settings, setSettings] = useState<BusinessSetting>(() => {
    try {
      const saved = localStorage.getItem('bounce_settings_v7');
      return saved ? JSON.parse(saved) : DEFAULT_BUSINESS_SETTINGS;
    } catch {
      return DEFAULT_BUSINESS_SETTINGS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_services_v7');
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_trainers_v8');
      if (saved) {
        const parsed: Trainer[] = JSON.parse(saved);
        const merged = mergeTrainersWithDefaults(parsed);
        localStorage.setItem('bounce_trainers_v8', JSON.stringify(merged));
        return merged;
      }
      localStorage.setItem('bounce_trainers_v8', JSON.stringify(DEFAULT_TRAINERS));
      return DEFAULT_TRAINERS;
    } catch {
      return DEFAULT_TRAINERS;
    }
  });

  const [classes, setClasses] = useState<ClassSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_classes_v7');
      if (saved) {
        const parsed: ClassSchedule[] = JSON.parse(saved);
        const hasZeroSeats = parsed.every((c) => c.seatsTotal === 0);
        if (hasZeroSeats && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_CLASSES;
    } catch {
      return DEFAULT_CLASSES;
    }
  });

  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_plans_v8');
      if (saved) {
        const parsed: MembershipPlan[] = JSON.parse(saved);
        const merged = mergePlansWithDefaults(parsed);
        localStorage.setItem('bounce_plans_v8', JSON.stringify(merged));
        return merged;
      }
      localStorage.setItem('bounce_plans_v8', JSON.stringify(DEFAULT_MEMBERSHIP_PLANS));
      return DEFAULT_MEMBERSHIP_PLANS;
    } catch {
      return DEFAULT_MEMBERSHIP_PLANS;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_testimonials_v7');
      return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_gallery_v7');
      return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_enquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [memberSubscriptions, setMemberSubscriptions] = useState<MemberSubscription[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_member_subscriptions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [announcements, setAnnouncements] = useState<StudioAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('bounce_announcements_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState<string | undefined>(undefined);

  // Admin modal / page state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Trainers dedicated tab / modal state
  const [isTrainersTabOpen, setIsTrainersTabOpen] = useState(false);

  // Listen to storage events across browser tabs so Admin & Member tabs sync immediately
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bounce_member_subscriptions_v1' && e.newValue) {
        try {
          setMemberSubscriptions(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === 'bounce_announcements_v1' && e.newValue) {
        try {
          setAnnouncements(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === 'bounce_settings_v7' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === 'bounce_trainers_v8' && e.newValue) {
        try {
          setTrainers(mergeTrainersWithDefaults(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      }
      if (e.key === 'bounce_plans_v8' && e.newValue) {
        try {
          setMembershipPlans(mergePlansWithDefaults(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Real-time Firestore listener for Trainers (always merges with the 4 core coaches so none ever disappear)
  useEffect(() => {
    try {
      const q = query(collection(db, 'trainers'), orderBy('order', 'asc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Trainer[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Trainer);
          });
          const merged = mergeTrainersWithDefaults(list);
          setTrainers(merged);
          localStorage.setItem('bounce_trainers_v8', JSON.stringify(merged));

          // If Firestore is missing any of the 4 core trainers, seed them into Firestore
          const existingIds = new Set(list.map((t) => t.id));
          merged.forEach((trainer) => {
            if (!existingIds.has(trainer.id)) {
              setDoc(doc(db, 'trainers', trainer.id), trainer, { merge: true }).catch(() => {});
            }
          });
        },
        (error) => {
          console.warn('Trainers snapshot notice:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Fallback mode for trainers listener:', e);
    }
  }, []);

  // Real-time Firestore listener for Membership Plans (always merges all 6 core plans including 6 Months ₹6,999)
  useEffect(() => {
    try {
      const q = query(collection(db, 'membershipPlans'), orderBy('order', 'asc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: MembershipPlan[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as MembershipPlan);
          });
          const merged = mergePlansWithDefaults(list);
          setMembershipPlans(merged);
          localStorage.setItem('bounce_plans_v8', JSON.stringify(merged));
        },
        (error) => {
          console.warn('MembershipPlans snapshot notice:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Fallback mode for membershipPlans listener:', e);
    }
  }, []);

  // Real-time Firestore listener for Member Subscriptions (so Admin always sees every signed-in member & duration)
  useEffect(() => {
    try {
      const q = query(collection(db, 'memberSubscriptions'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: MemberSubscription[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as MemberSubscription);
          });
          setMemberSubscriptions(list);
          localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(list));
        },
        (error) => {
          console.warn('MemberSubscriptions snapshot notice:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Fallback mode for memberSubscriptions listener:', e);
    }
  }, []);

  // Real-time Firestore listener for Studio Holiday & Announcements (so every member gets notified on opening the site)
  useEffect(() => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: StudioAnnouncement[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as StudioAnnouncement);
          });
          setAnnouncements(list);
          localStorage.setItem('bounce_announcements_v1', JSON.stringify(list));
        },
        (error) => {
          console.warn('Announcements snapshot notice:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Fallback mode for announcements listener:', e);
    }
  }, []);

  // Keep signed-in phoneUser synced if admin renews or updates their subscription
  useEffect(() => {
    if (!phoneUser) return;
    const cleanPhone = phoneUser.phone.replace(/[^0-9]/g, '');
    const matching = memberSubscriptions.find(
      (m) => m.id === phoneUser.id || m.phone.replace(/[^0-9]/g, '') === cleanPhone
    );
    if (
      matching &&
      (matching.endDate !== phoneUser.endDate || matching.planName !== phoneUser.planName)
    ) {
      updatePhoneUser({
        ...phoneUser,
        id: matching.id,
        planName: matching.planName,
        durationLabel: matching.durationLabel,
        durationDays: matching.durationDays,
        priceDisplay: matching.priceDisplay,
        startDate: matching.startDate,
        endDate: matching.endDate,
      });
    }
  }, [memberSubscriptions, phoneUser, updatePhoneUser]);

  // Sync with Firestore appointments
  useEffect(() => {
    try {
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Appointment[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Appointment);
          });
          setAppointments(list);
          localStorage.setItem('bounce_appointments', JSON.stringify(list));
        },
        (error) => {
          console.warn('Firestore snapshot notice:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Offline or fallback mode for appointments listener:', e);
    }
  }, []);

  // Sync enquiries
  useEffect(() => {
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Enquiry[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Enquiry);
          });
          setEnquiries(list);
          localStorage.setItem('bounce_enquiries', JSON.stringify(list));
        },
        (error) => {
          console.warn('Enquiries listener:', error.message);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Offline mode for enquiries listener:', e);
    }
  }, []);

  // Helper to strip undefined fields before writing to Firestore
  const cleanForFirestore = <T extends Record<string, any>>(obj: T): T => {
    const cleaned: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned as T;
  };

  // Check if slot is available
  const isSlotAvailable = (date: string, timeSlot: string) => {
    const d = new Date(date + 'T00:00:00');
    if (d.getDay() === 0) return false;
    if (settings.blockedDates.includes(date)) return false;

    const count = appointments.filter(
      (a) => a.date === date && a.timeSlot === timeSlot && a.status !== 'rejected' && a.status !== 'cancelled'
    ).length;

    return count < 3;
  };

  const openBooking = (preselectedServiceId?: string, preselectedTrainerId?: string) => {
    setSelectedServiceForBooking(preselectedServiceId);
    setSelectedTrainerForBooking(preselectedTrainerId);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceForBooking(undefined);
    setSelectedTrainerForBooking(undefined);
  };

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const openTrainersTab = () => setIsTrainersTabOpen(true);
  const closeTrainersTab = () => setIsTrainersTabOpen(false);

  // Settings update
  const updateSettings = async (newSettings: Partial<BusinessSetting>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('bounce_settings_v7', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'businessSettings', 'general'), cleanForFirestore(updated), { merge: true });
    } catch (err) {
      console.warn('Settings saved locally:', err);
    }
  };

  // Service mutations
  const updateService = async (service: Service) => {
    const next = services.map((s) => (s.id === service.id ? service : s));
    setServices(next);
    localStorage.setItem('bounce_services_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'services', service.id), cleanForFirestore(service), { merge: true });
    } catch (e) {
      console.warn('Service updated locally:', e);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const id = 'svc-' + Date.now();
    const newSvc: Service = { id, ...service };
    const next = [...services, newSvc];
    setServices(next);
    localStorage.setItem('bounce_services_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'services', id), cleanForFirestore(newSvc));
    } catch (e) {
      console.warn('Service added locally:', e);
    }
  };

  const deleteService = async (id: string) => {
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    localStorage.setItem('bounce_services_v7', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn('Service deleted locally:', e);
    }
  };

  // Trainer mutations
  const updateTrainer = async (trainer: Trainer) => {
    const next = trainers.map((t) => (t.id === trainer.id ? trainer : t));
    setTrainers(next);
    localStorage.setItem('bounce_trainers_v8', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'trainers', trainer.id), cleanForFirestore(trainer), { merge: true });
    } catch (e) {
      console.warn('Trainer updated locally:', e);
    }
  };

  const addTrainer = async (trainer: Omit<Trainer, 'id'>) => {
    const id = 'trainer-' + Date.now();
    const newTrainer: Trainer = { id, ...trainer };
    const next = [...trainers, newTrainer];
    setTrainers(next);
    localStorage.setItem('bounce_trainers_v8', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'trainers', id), cleanForFirestore(newTrainer));
    } catch (e) {
      console.warn('Trainer added locally:', e);
    }
  };

  const deleteTrainer = async (id: string) => {
    const next = trainers.filter((t) => t.id !== id);
    setTrainers(next);
    localStorage.setItem('bounce_trainers_v8', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'trainers', id));
    } catch (e) {
      console.warn('Trainer deleted locally:', e);
    }
  };

  // Class mutations
  const updateClass = async (cls: ClassSchedule) => {
    const next = classes.map((c) => (c.id === cls.id ? cls : c));
    setClasses(next);
    localStorage.setItem('bounce_classes_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'classes', cls.id), cleanForFirestore(cls), { merge: true });
    } catch (e) {
      console.warn('Class updated locally:', e);
    }
  };

  const addClass = async (cls: Omit<ClassSchedule, 'id'>) => {
    const id = 'class-' + Date.now();
    const newClass: ClassSchedule = { id, ...cls };
    const next = [...classes, newClass];
    setClasses(next);
    localStorage.setItem('bounce_classes_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'classes', id), cleanForFirestore(newClass));
    } catch (e) {
      console.warn('Class added locally:', e);
    }
  };

  const deleteClass = async (id: string) => {
    const next = classes.filter((c) => c.id !== id);
    setClasses(next);
    localStorage.setItem('bounce_classes_v7', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (e) {
      console.warn('Class deleted locally:', e);
    }
  };

  // Plan mutations
  const updatePlan = async (plan: MembershipPlan) => {
    const next = membershipPlans.map((p) => (p.id === plan.id ? plan : p));
    setMembershipPlans(next);
    localStorage.setItem('bounce_plans_v8', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'membershipPlans', plan.id), cleanForFirestore(plan), { merge: true });
    } catch (e) {
      console.warn('Plan updated locally:', e);
    }
  };

  const addPlan = async (plan: Omit<MembershipPlan, 'id'>) => {
    const id = 'plan-' + Date.now();
    const newPlan: MembershipPlan = { id, ...plan };
    const next = [...membershipPlans, newPlan];
    setMembershipPlans(next);
    localStorage.setItem('bounce_plans_v8', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'membershipPlans', id), cleanForFirestore(newPlan));
    } catch (e) {
      console.warn('Plan added locally:', e);
    }
  };

  const deletePlan = async (id: string) => {
    const next = membershipPlans.filter((p) => p.id !== id);
    setMembershipPlans(next);
    localStorage.setItem('bounce_plans_v8', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'membershipPlans', id));
    } catch (e) {
      console.warn('Plan deleted locally:', e);
    }
  };

  // Testimonial mutations
  const updateTestimonial = async (item: Testimonial) => {
    const next = testimonials.map((t) => (t.id === item.id ? item : t));
    setTestimonials(next);
    localStorage.setItem('bounce_testimonials_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'testimonials', item.id), cleanForFirestore(item), { merge: true });
    } catch (e) {
      console.warn('Testimonial updated locally:', e);
    }
  };

  const addTestimonial = async (item: Omit<Testimonial, 'id'>) => {
    const id = 'test-' + Date.now();
    const newItem: Testimonial = { id, ...item };
    const next = [newItem, ...testimonials];
    setTestimonials(next);
    localStorage.setItem('bounce_testimonials_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'testimonials', id), cleanForFirestore(newItem));
    } catch (e) {
      console.warn('Testimonial added locally:', e);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const next = testimonials.filter((t) => t.id !== id);
    setTestimonials(next);
    localStorage.setItem('bounce_testimonials_v7', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      console.warn('Testimonial deleted locally:', e);
    }
  };

  // Gallery mutations
  const updateGalleryItem = async (item: GalleryItem) => {
    const next = gallery.map((g) => (g.id === item.id ? item : g));
    setGallery(next);
    localStorage.setItem('bounce_gallery_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'gallery', item.id), cleanForFirestore(item), { merge: true });
    } catch (e) {
      console.warn('Gallery item updated locally:', e);
    }
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const id = 'gal-' + Date.now();
    const newItem: GalleryItem = { id, ...item };
    const next = [newItem, ...gallery];
    setGallery(next);
    localStorage.setItem('bounce_gallery_v7', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'gallery', id), cleanForFirestore(newItem));
    } catch (e) {
      console.warn('Gallery item added locally:', e);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const next = gallery.filter((g) => g.id !== id);
    setGallery(next);
    localStorage.setItem('bounce_gallery_v7', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Gallery item deleted locally:', e);
    }
  };

  // Appointment creation
  const createAppointment = async (
    data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'bookingId'>
  ): Promise<Appointment> => {
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    const bookingId = `#BOUNCE-${randomHex}`;
    const id = 'apt-' + Date.now();
    const nowIso = new Date().toISOString();

    const newApt: Appointment = {
      id,
      bookingId,
      ...data,
      status: 'pending',
      createdAt: nowIso,
      ...(currentUser?.uid ? { userId: currentUser.uid } : {}),
    };

    const next = [newApt, ...appointments];
    setAppointments(next);
    localStorage.setItem('bounce_appointments', JSON.stringify(next));

    try {
      await setDoc(doc(db, 'appointments', id), cleanForFirestore(newApt));
    } catch (e) {
      console.warn('Appointment saved locally and queued for cloud sync:', e);
    }

    return newApt;
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const next = appointments.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
    setAppointments(next);
    localStorage.setItem('bounce_appointments', JSON.stringify(next));
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Appointment status updated locally:', e);
    }
  };

  const deleteAppointment = async (id: string) => {
    const next = appointments.filter((a) => a.id !== id);
    setAppointments(next);
    localStorage.setItem('bounce_appointments', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (e) {
      console.warn('Appointment deleted locally:', e);
    }
  };

  // Enquiry creation
  const createEnquiry = async (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = 'enq-' + Date.now();
    const newEnq: Enquiry = {
      id,
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const next = [newEnq, ...enquiries];
    setEnquiries(next);
    localStorage.setItem('bounce_enquiries', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'enquiries', id), cleanForFirestore(newEnq));
    } catch (e) {
      console.warn('Enquiry saved locally:', e);
    }
  };

  const updateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    const next = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiries(next);
    localStorage.setItem('bounce_enquiries', JSON.stringify(next));
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
    } catch (e) {
      console.warn('Enquiry status updated locally:', e);
    }
  };

  const deleteEnquiry = async (id: string) => {
    const next = enquiries.filter((e) => e.id !== id);
    setEnquiries(next);
    localStorage.setItem('bounce_enquiries', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (e) {
      console.warn('Enquiry deleted locally:', e);
    }
  };

  // Member Sign-In & Plan Subscription Registration (Shifts directly to Admin Account)
  const registerMemberSignIn = async (data: {
    name: string;
    phone: string;
    planName: string;
    durationLabel: string;
    durationDays: number;
    priceDisplay: string;
  }): Promise<MemberSubscription> => {
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');
    const id = `mem-${cleanPhone || Date.now()}`;
    const start = new Date();
    const end = new Date(start.getTime() + data.durationDays * 24 * 60 * 60 * 1000);
    const nowIso = start.toISOString();

    const sub: MemberSubscription = {
      id,
      name: data.name,
      phone: data.phone,
      planName: data.planName,
      durationLabel: data.durationLabel,
      durationDays: data.durationDays,
      priceDisplay: data.priceDisplay,
      startDate: nowIso,
      endDate: end.toISOString(),
      status: 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const existingIdx = memberSubscriptions.findIndex((m) => m.id === id);
    let next: MemberSubscription[];
    if (existingIdx >= 0) {
      next = memberSubscriptions.map((m, idx) => (idx === existingIdx ? sub : m));
    } else {
      next = [sub, ...memberSubscriptions];
    }
    setMemberSubscriptions(next);
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(next));

    try {
      await setDoc(doc(db, 'memberSubscriptions', id), cleanForFirestore(sub), { merge: true });
    } catch (e) {
      console.warn('Member subscription saved locally:', e);
    }

    return sub;
  };

  const updateMemberSubscription = async (member: MemberSubscription) => {
    const updated: MemberSubscription = {
      ...member,
      updatedAt: new Date().toISOString(),
    };
    const next = memberSubscriptions.map((m) => (m.id === member.id ? updated : m));
    setMemberSubscriptions(next);
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'memberSubscriptions', member.id), cleanForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Member subscription updated locally:', e);
    }
  };

  const renewMemberSubscription = async (id: string, customDays?: number) => {
    const target = memberSubscriptions.find((m) => m.id === id);
    if (!target) return;
    const days = customDays || target.durationDays || 30;
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const updated: MemberSubscription = {
      ...target,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: 'active',
      updatedAt: start.toISOString(),
    };
    const next = memberSubscriptions.map((m) => (m.id === id ? updated : m));
    setMemberSubscriptions(next);
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'memberSubscriptions', id), cleanForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Member renewed locally:', e);
    }
  };

  const markMemberExpired = async (id: string) => {
    const target = memberSubscriptions.find((m) => m.id === id);
    if (!target) return;
    const pastEnd = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const updated: MemberSubscription = {
      ...target,
      endDate: pastEnd,
      status: 'expired',
      updatedAt: new Date().toISOString(),
    };
    const next = memberSubscriptions.map((m) => (m.id === id ? updated : m));
    setMemberSubscriptions(next);
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'memberSubscriptions', id), cleanForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Member marked expired locally:', e);
    }
  };

  const deleteMemberSubscription = async (id: string) => {
    const next = memberSubscriptions.filter((m) => m.id !== id);
    setMemberSubscriptions(next);
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'memberSubscriptions', id));
    } catch (e) {
      console.warn('Member subscription deleted locally:', e);
    }
  };

  // Studio Holiday & Urgent Announcements (Broadcast from Admin to all Members)
  const createAnnouncement = async (data: Omit<StudioAnnouncement, 'id' | 'createdAt'>) => {
    const id = 'ann-' + Date.now();
    const newAnn: StudioAnnouncement = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    const next = [newAnn, ...announcements];
    setAnnouncements(next);
    localStorage.setItem('bounce_announcements_v1', JSON.stringify(next));

    // If holidayDate is provided, also add to blockedDates in settings automatically
    if (data.holidayDate && !settings.blockedDates.includes(data.holidayDate)) {
      await updateSettings({
        blockedDates: [...settings.blockedDates, data.holidayDate],
      });
    }

    try {
      await setDoc(doc(db, 'announcements', id), cleanForFirestore(newAnn));
    } catch (e) {
      console.warn('Announcement saved locally:', e);
    }
  };

  const updateAnnouncement = async (ann: StudioAnnouncement) => {
    const next = announcements.map((a) => (a.id === ann.id ? ann : a));
    setAnnouncements(next);
    localStorage.setItem('bounce_announcements_v1', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'announcements', ann.id), cleanForFirestore(ann), { merge: true });
    } catch (e) {
      console.warn('Announcement updated locally:', e);
    }
  };

  const toggleAnnouncementActive = async (id: string, isActive: boolean) => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return;
    const updated = { ...target, isActive };
    const next = announcements.map((a) => (a.id === id ? updated : a));
    setAnnouncements(next);
    localStorage.setItem('bounce_announcements_v1', JSON.stringify(next));
    try {
      await setDoc(doc(db, 'announcements', id), cleanForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Announcement status updated locally:', e);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const next = announcements.filter((a) => a.id !== id);
    setAnnouncements(next);
    localStorage.setItem('bounce_announcements_v1', JSON.stringify(next));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (e) {
      console.warn('Announcement deleted locally:', e);
    }
  };

  const saveAllAdminData = async () => {
    localStorage.setItem('bounce_settings_v7', JSON.stringify(settings));
    localStorage.setItem('bounce_services_v7', JSON.stringify(services));
    localStorage.setItem('bounce_trainers_v8', JSON.stringify(trainers));
    localStorage.setItem('bounce_classes_v7', JSON.stringify(classes));
    localStorage.setItem('bounce_plans_v8', JSON.stringify(membershipPlans));
    localStorage.setItem('bounce_testimonials_v7', JSON.stringify(testimonials));
    localStorage.setItem('bounce_gallery_v7', JSON.stringify(gallery));
    localStorage.setItem('bounce_member_subscriptions_v1', JSON.stringify(memberSubscriptions));
    localStorage.setItem('bounce_announcements_v1', JSON.stringify(announcements));
    try {
      await setDoc(doc(db, 'businessSettings', 'general'), cleanForFirestore(settings), { merge: true });
      await Promise.all(
        trainers.map((t) => setDoc(doc(db, 'trainers', t.id), cleanForFirestore(t), { merge: true }))
      );
    } catch (e) {
      console.warn('Saved all admin data locally:', e);
    }
  };

  return (
    <StudioContext.Provider
      value={{
        settings,
        updateSettings,
        services,
        updateService,
        addService,
        deleteService,
        trainers,
        updateTrainer,
        addTrainer,
        deleteTrainer,
        classes,
        updateClass,
        addClass,
        deleteClass,
        membershipPlans,
        updatePlan,
        addPlan,
        deletePlan,
        testimonials,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        gallery,
        updateGalleryItem,
        addGalleryItem,
        deleteGalleryItem,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        enquiries,
        createEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        memberSubscriptions,
        registerMemberSignIn,
        updateMemberSubscription,
        renewMemberSubscription,
        markMemberExpired,
        deleteMemberSubscription,
        announcements,
        createAnnouncement,
        updateAnnouncement,
        toggleAnnouncementActive,
        deleteAnnouncement,
        saveAllAdminData,
        isSlotAvailable,
        isBookingOpen,
        openBooking,
        closeBooking,
        selectedServiceForBooking,
        selectedTrainerForBooking,
        isAdminOpen,
        openAdmin,
        closeAdmin,
        isTrainersTabOpen,
        openTrainersTab,
        closeTrainersTab,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
