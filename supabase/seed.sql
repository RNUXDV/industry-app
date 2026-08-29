-- =========================================================
-- INDUSTRY LOCAL TEST SEED
-- LOCAL DEVELOPMENT ONLY
-- =========================================================

-- All four local test users use:
-- password: industry123

-- Stable test identities:
-- Robert Local
-- 3de89e73-85a9-43d2-a76c-599c90ae1634
--
-- Manager C
-- 4d842c8d-31d5-46d8-a628-b84ff4022210
--
-- Worker B
-- 79e3858d-923d-473a-b1ad-b2965c32231d
--
-- Worker C
-- ecb9476f-b075-4b54-96f9-a0073d82d96e


-- =========================================================
-- AUTH USERS
-- =========================================================

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values
(
  '00000000-0000-0000-0000-000000000000',
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  'authenticated',
  'authenticated',
  'robert+local@example.com',
  extensions.crypt(
    'industry123',
    extensions.gen_salt('bf')
  ),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Robert Local"}'::jsonb,
  now(),
  now(),
  false,
  false
),
(
  '00000000-0000-0000-0000-000000000000',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'authenticated',
  'authenticated',
  'manager+c-local@example.com',
  extensions.crypt(
    'industry123',
    extensions.gen_salt('bf')
  ),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Manager C"}'::jsonb,
  now(),
  now(),
  false,
  false
),
(
  '00000000-0000-0000-0000-000000000000',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  'authenticated',
  'authenticated',
  'worker+b-local@example.com',
  extensions.crypt(
    'industry123',
    extensions.gen_salt('bf')
  ),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Worker B"}'::jsonb,
  now(),
  now(),
  false,
  false
),
(
  '00000000-0000-0000-0000-000000000000',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  'authenticated',
  'authenticated',
  'worker+c-local@example.com',
  extensions.crypt(
    'industry123',
    extensions.gen_salt('bf')
  ),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Worker C"}'::jsonb,
  now(),
  now(),
  false,
  false
);
-- Normalize Supabase Auth token fields for seeded users.
update auth.users
set
  confirmation_token = '',
  recovery_token = '',
  email_change = '',
  email_change_token_new = ''
where id in (
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e'
);
-- =========================================================
-- AUTH EMAIL IDENTITIES
-- =========================================================

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
)
values
(
  'd0b00000-0000-4000-8000-000000000001',
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  jsonb_build_object(
    'sub', '3de89e73-85a9-43d2-a76c-599c90ae1634',
    'email', 'robert+local@example.com',
    'email_verified', true
  ),
  'email',
  now(),
  now()
),
(
  'd0b00000-0000-4000-8000-000000000002',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  jsonb_build_object(
    'sub', '4d842c8d-31d5-46d8-a628-b84ff4022210',
    'email', 'manager+c-local@example.com',
    'email_verified', true
  ),
  'email',
  now(),
  now()
),
(
  'd0b00000-0000-4000-8000-000000000003',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  jsonb_build_object(
    'sub', '79e3858d-923d-473a-b1ad-b2965c32231d',
    'email', 'worker+b-local@example.com',
    'email_verified', true
  ),
  'email',
  now(),
  now()
),
(
  'd0b00000-0000-4000-8000-000000000004',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  jsonb_build_object(
    'sub', 'ecb9476f-b075-4b54-96f9-a0073d82d96e',
    'email', 'worker+c-local@example.com',
    'email_verified', true
  ),
  'email',
  now(),
  now()
);
-- =========================================================
-- PROFILES
-- =========================================================

insert into public.profiles (
  id,
  created_at,
  full_name
)
values
(
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  now(),
  'Robert Local'
),
(
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  now(),
  'Manager C'
),
(
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  now(),
  'Worker B'
),
(
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  now(),
  'Worker C'
)
on conflict (id)
do update set
  full_name = excluded.full_name;


-- =========================================================
-- DEPARTURE LOUNGE
-- =========================================================

insert into public.workplaces (
  id,
  name,
  city,
  region,
  time_zone,
  created_by,
  created_at
)
values (
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'Departure Lounge',
  'Portland',
  'OR',
  'America/Los_Angeles',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  now()
);


-- =========================================================
-- WORKPLACE MEMBERSHIPS
-- =========================================================

insert into public.workplace_members (
  workplace_id,
  profile_id,
  role,
  joined_at
)
values
(
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Manager',
  now()
),
(
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  'Server',
  now()
),
(
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  'Server',
  now()
),
(
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  'Server',
  now()
);
-- =========================================================
-- LOCAL TEST SCHEDULE
-- =========================================================

insert into public.shifts (
  id,
  workplace_id,
  assigned_profile_id,
  role,
  starts_at,
  ends_at,
  end_label,
  status,
  created_at,
  coverage_stage
)
values
(
  '10000000-0000-4000-8000-000000000001',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server',
  '2026-09-08 01:00:00+00',
  null,
  'Close',
  'scheduled',
  now(),
  null
),
(
  '10000000-0000-4000-8000-000000000002',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  'Server',
  '2026-09-09 01:00:00+00',
  null,
  'Close',
  'scheduled',
  now(),
  null
),
(
  '10000000-0000-4000-8000-000000000003',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  'Server',
  '2026-09-10 01:00:00+00',
  null,
  'Close',
  'scheduled',
  now(),
  null
),
(
  '10000000-0000-4000-8000-000000000004',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '3de89e73-85a9-43d2-a76c-599c90ae1634',
  'Server',
  '2026-09-12 02:00:00+00',
  null,
  'Close',
  'scheduled',
  now(),
  null
);