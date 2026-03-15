# Work Mode Dynamic Features Design

**Date:** 2026-03-09
**Status:** Approved
**Author:** Claude

---

## Overview

Mengubah Work mode pages dari data statis menjadi dinamis dengan database dan API. User dapat menambah, edit, dan melihat data klien, proyek, invoice, time tracking, dll dengan persistent storage.

---

## 1. Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `work_clients` | Data klien (nama, company, email, phone, status, notes) |
| `work_projects` | Proyek per klien (client_id, name, status, budget, deadline) |
| `work_invoices` | Faktur (project_id/client_id, amount, status, due_date, paid_date) |
| `work_time_entries` | Entri waktu (project_id, start_time, end_time, description) |
| `work_contracts` | Kontrak (client_id, title, content, status, signed_date) |
| `work_meeting_notes` | Catatan rapat (client_id/project_id, title, date, content) |
| `work_activities` | Aktivitas terbaru untuk dashboard |

### Migration Files

```
database/migrations/2026_03_09_130001_create_work_clients_table.php
database/migrations/2026_03_09_130002_create_work_projects_table.php
database/migrations/2026_03_09_130003_create_work_invoices_table.php
database/migrations/2026_03_09_130004_create_work_time_entries_table.php
database/migrations/2026_03_09_130005_create_work_contracts_table.php
database/migrations/2026_03_09_130006_create_work_meeting_notes_table.php
database/migrations/2026_03_09_130007_create_work_activities_table.php
```

### Models

```
app/Models/WorkClient.php
app/Models/WorkProject.php
app/Models/WorkInvoice.php
app/Models/WorkTimeEntry.php
app/Models/WorkContract.php
app/Models/WorkMeetingNote.php
app/Models/WorkActivity.php
```

---

## 2. API Routes

### Clients
- `GET /api/work/clients` - List all clients
- `POST /api/work/clients` - Create client
- `PUT /api/work/clients/{id}` - Update client
- `DELETE /api/work/clients/{id}` - Delete client

### Projects
- `GET /api/work/projects` - List all projects (with client data)
- `POST /api/work/projects` - Create project
- `PUT /api/work/projects/{id}` - Update project
- `DELETE /api/work/projects/{id}` - Delete project

### Invoices
- `GET /api/work/invoices` - List all invoices
- `POST /api/work/invoices` - Create invoice
- `PUT /api/work/invoices/{id}` - Update invoice (mark as paid)
- `DELETE /api/work/invoices/{id}` - Delete invoice

### Time Entries
- `GET /api/work/time-entries` - List time entries
- `POST /api/work/time-entries` - Create time entry
- `PUT /api/work/time-entries/{id}` - Update time entry
- `DELETE /api/work/time-entries/{id}` - Delete time entry

### Dashboard
- `GET /api/work/dashboard` - Aggregated data for dashboard

---

## 3. Controller Updates

Update routes/web.php untuk pass data ke page components:

```php
Route::get('/work/dashboard', [WorkController::class, 'dashboard']);
Route::get('/work/clients', [WorkController::class, 'clients']);
Route::get('/work/pipeline', [WorkController::class, 'pipeline']);
Route::get('/work/time-tracking', [WorkController::class, 'timeTracking']);
Route::get('/work/invoices', [WorkController::class, 'invoices']);
Route::get('/work/income', [WorkController::class, 'income']);
Route::get('/work/meeting-notes', [WorkController::class, 'meetingNotes']);
Route::get('/work/contracts', [WorkController::class, 'contracts']);
```

Buat WorkController baru:
```
app/Http/Controllers/WorkController.php
```

---

## 4. Frontend Pattern

### Empty State Component

Buat reusable `EmptyState` component untuk semua halaman:

```jsx
function EmptyState({ icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">{icon}</span>
            <h3 className="font-handwriting text-xl text-gray-600">{title}</h3>
            <p className="font-note text-gray-400 mt-2 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <button onClick={onAction} className="...">{actionLabel}</button>
            )}
        </div>
    );
}
```

### Page Pattern (Seperti DailySpread)

```jsx
export default function Clients({ clients: propClients }) {
    const [clients, setClients] = useState(propClients || []);

    useEffect(() => { setClients(propClients || []); }, [propClients]);

    // Add/Edit modal forms
    // Auto-save dengan debounce

    return (
        <JournalLayout>
            {clients.length === 0 ? (
                <EmptyState icon="people" title="Belum ada klien" ... />
            ) : (
                <ClientList clients={clients} />
            )}
        </JournalLayout>
    );
}
```

---

## 5. Implementation Order

1. **WorkClient** - Clients page + CRUD
2. **WorkProject** - Pipeline page + CRUD
3. **WorkInvoice** - Invoices page + CRUD
4. **WorkTimeEntry** - Time Tracking page + CRUD
5. **WorkContract** - Contracts page + CRUD
6. **WorkMeetingNote** - Meeting Notes page + CRUD
7. **WorkActivity** + Dashboard aggregation
8. **Income** - derived from invoices

---

## 6. Success Criteria

- Semua Work pages bisa melakukan CRUD
- Data tersimpan ke SQLite database
- Empty state menampilkan placeholder yang sesuai
- Dashboard menampilkan data agregat dari tabel lain
- Timer functionality untuk time tracking