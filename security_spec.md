# Security Specification - Bounce Fitness Studio

## 1. Data Invariants
- Anyone can submit a new appointment request (`create` on `/appointments/{appointmentId}`) with pending status, or an enquiry on `/enquiries/{enquiryId}`.
- Appointments cannot be updated or deleted by arbitrary unauthenticated users. Only admins or the authenticated creator can view/update their appointments.
- Status changes (approve/reject/reschedule/cancel) on appointments are restricted to Admins (or cancellation by creator).
- Public users can read active services, trainers, membership plans, class schedules, gallery items, testimonials, and business settings.
- Only Admins can create, update, or delete services, trainers, membership plans, class schedules, gallery items, testimonials, or business settings.
- Admin status is verified via `request.auth.token.email == 'harishmugulavally@gmail.com' && request.auth.token.email_verified == true` or presence in `/admins/$(request.auth.uid)`.
- All string and payload fields have strict length checks, preventing denial of wallet attacks.

## 2. The Dirty Dozen Payloads
1. Unauthenticated user updating an appointment status to "approved" -> DENIED.
2. Authenticated non-admin attempting to write or modify a service/pricing plan -> DENIED.
3. User attempting to delete another member's appointment -> DENIED.
4. User attempting to create an appointment with 100KB string payload -> DENIED (length limit enforced).
5. User spoofing admin email without email_verified == true -> DENIED.
6. User attempting to edit businessSettings without admin privileges -> DENIED.
7. User attempting to inject arbitrary keys into services or appointment schema -> DENIED.
8. Unauthenticated user listing all customer private phone numbers and emails directly -> DENIED (appointments list restricted to admin or owner).
9. Malicious user attempting to overwrite another trainer's profile -> DENIED.
10. Malicious user attempting to alter admin document `/admins/{adminId}` -> DENIED.
11. Malicious user writing to undefined collection `/forbidden/{id}` -> DENIED (Global default deny).
12. Malicious user attempting to set status to invalid enum value in appointment -> DENIED.
