# Kakde Agro & Livestock — setup guide

This is a React + Vite website with a Supabase-backed admin area. The public site is bilingual (English/Marathi). The private farm ledger requires a real Supabase login; it is not protected by a browser-only password.

## 1. Run locally

Install Node.js (LTS), extract this ZIP, open the project folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## 2. Connect Supabase (required for Admin)

1. Create a project at https://supabase.com/
2. Open Project Settings → API and copy the Project URL and anon/public key.
3. Copy `.env.example` to `.env` in the project root.
4. Add the URL and anon key to `.env`. Never put a `service_role` key in a browser app.
5. In Supabase → SQL Editor, run the complete `supabase/schema.sql`.
6. In Authentication → Users, create your own admin user with your email and a strong password.
7. Disable public sign-ups in Authentication settings.
8. For strict single-admin security, replace the broad `to authenticated` policies in the SQL with policies restricted to your admin's `auth.uid()`. The project currently requires authenticated login but the initial policies permit any authenticated account, so do not enable additional users until you apply the single-admin restriction.
9. Restart `npm run dev`.

## 3. Make the admin truly single-user

After creating your user, run this SQL in Supabase SQL Editor, replacing `YOUR_ADMIN_USER_UUID` with the UUID shown for your account in Authentication → Users:

```sql
-- Restrict private ledger to one admin account
drop policy if exists "Authenticated admins manage ledger" on public.farm_ledger;
create policy "Only owner manages ledger" on public.farm_ledger
for all to authenticated
using (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid)
with check (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);

-- Restrict content management to the same admin; public SELECT policies remain.
drop policy if exists "Authenticated admins manage photos" on public.farm_photos;
create policy "Only owner manages photos" on public.farm_photos
for all to authenticated
using (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid)
with check (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);

drop policy if exists "Authenticated admins manage updates" on public.farm_updates;
create policy "Only owner manages updates" on public.farm_updates
for all to authenticated
using (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid)
with check (auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);

drop policy if exists "Authenticated admins upload farm gallery" on storage.objects;
create policy "Only owner uploads gallery" on storage.objects
for insert to authenticated
with check (bucket_id = 'farm-gallery' and auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);

drop policy if exists "Authenticated admins update farm gallery" on storage.objects;
create policy "Only owner updates gallery" on storage.objects
for update to authenticated
using (bucket_id = 'farm-gallery' and auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid)
with check (bucket_id = 'farm-gallery' and auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);

drop policy if exists "Authenticated admins delete farm gallery" on storage.objects;
create policy "Only owner deletes gallery" on storage.objects
for delete to authenticated
using (bucket_id = 'farm-gallery' and auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid);
```

## 4. Contact details and map

The map uses the pin coordinates supplied in the conversation (20.0452807, 75.0201958) and the exact Google Maps share link. Add your contact details to `.env`:

```env
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
VITE_CONTACT_PHONE=+91XXXXXXXXXX
```

Use digits only for WhatsApp (country code included). Leave these blank until you want to publish the numbers.

## 5. Deploy

Build with `npm run build`. Deploy the `dist` folder to Vercel, Netlify, or another static host. Add the same `VITE_...` environment variables in the hosting provider's project settings. Never expose a Supabase service-role key.

## Current scope / things to finish before public launch

- Add your own real farm photos in Admin → Gallery.
- Add and verify contact phone / WhatsApp number.
- Confirm the public farm address spelling and exact pin before launch.
- The Weather, crop calendar reminders and enquiry inbox are planned enhancements, not live integrations in this starter build.
- The first accounting screen supports income/expense entries and CSV export. Crop-wise/year-wise reports and JSON backup are planned next iterations.
- The farm website does not publish ledger records. Ledger rows are protected by Supabase Row Level Security once the single-admin SQL above is applied.
