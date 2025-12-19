# Schema Design for Smart Clinic

## MySQL Database Design
This section defines the structured data for the core operational needs of the clinic. We enforce strict relationships (Foreign Keys) to ensure data integrity.

### Table: patients
Stores personal information for individuals receiving care.
- `id`: INT, Primary Key, Auto Increment
- `first_name`: VARCHAR(50), Not Null
- `last_name`: VARCHAR(50), Not Null
- `email`: VARCHAR(100), Unique, Not Null (Valid email format required in app logic)
- `phone`: VARCHAR(20), Not Null
- `date_of_birth`: DATE, Not Null

### Table: doctors
Stores medical professional details and credentials.
- `id`: INT, Primary Key, Auto Increment
- `first_name`: VARCHAR(50), Not Null
- `last_name`: VARCHAR(50), Not Null
- `specialty`: VARCHAR(50), Not Null (e.g., Cardiology, General)
- `email`: VARCHAR(100), Unique, Not Null

### Table: appointments
The pivotal table linking patients to doctors.
- `id`: INT, Primary Key, Auto Increment
- `doctor_id`: INT, Foreign Key → doctors(id)
- `patient_id`: INT, Foreign Key → patients(id)
- `appointment_time`: DATETIME, Not Null
- `status`: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)

### Table: admin
Manages system access and configuration.
- `id`: INT, Primary Key, Auto Increment
- `username`: VARCHAR(50), Unique, Not Null
- `password`: VARCHAR(255), Not Null (Store as Hash)
- `role`: VARCHAR(20), Default 'ADMIN'

---

## MongoDB Collection Design
We use MongoDB for data that requires flexibility, such as medical prescriptions which may contain varying lists of medications and metadata.

### Collection: prescriptions
Links to a specific appointment but stores complex nested data about medications.

**Example Document (JSON):**

```json
{
  "_id": "ObjectId('64abc123456')",
  "appointmentId": 101,
  "patientId": 5,
  "doctorId": 3,
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Every 8 hours",
      "duration": "7 days"
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "Every 6 hours",
      "duration": "3 days"
    }
  ],
  "tags": ["antibiotic", "pain relief"],
  "metadata": {
    "createdAt": "2025-10-27T14:30:00Z",
    "updatedAt": "2025-10-27T14:35:00Z",
    "status": "active"
  },
  "doctorNotes": "Patient should take medication with food."
}
