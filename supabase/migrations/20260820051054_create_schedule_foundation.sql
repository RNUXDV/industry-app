-- =========================================================
-- INDUSTRY — SCHEDULE FOUNDATION
-- Section 1: Workplaces
-- =========================================================

CREATE TABLE public.workplaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL
    CHECK (char_length(trim(name)) > 0),

  city text,
  region text,
  time_zone text NOT NULL,

  created_by uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- Section 2: Workplace Members
-- =========================================================

CREATE TABLE public.workplace_members (
  workplace_id uuid NOT NULL
    REFERENCES public.workplaces(id)
    ON DELETE CASCADE,

  profile_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  role text,

  joined_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (workplace_id, profile_id)
);

-- =========================================================
-- Section 3: Shifts
-- =========================================================

CREATE TABLE public.shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  workplace_id uuid NOT NULL
    REFERENCES public.workplaces(id)
    ON DELETE CASCADE,

  assigned_profile_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  role text,

  starts_at timestamptz NOT NULL,
  ends_at timestamptz,

  end_label text,

  status text NOT NULL DEFAULT 'scheduled'
    CHECK (
      status IN (
        'scheduled',
        'open',
        'coverage_needed',
        'completed',
        'cancelled'
      )
    ),

  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    ends_at IS NULL
    OR ends_at > starts_at
  )
);

-- =========================================================
-- Section 4: Indexes
-- =========================================================

CREATE INDEX workplace_members_profile_id_idx
  ON public.workplace_members(profile_id);

CREATE INDEX shifts_assigned_profile_starts_at_idx
  ON public.shifts(assigned_profile_id, starts_at);

CREATE INDEX shifts_workplace_status_starts_at_idx
  ON public.shifts(workplace_id, status, starts_at);

 -- =========================================================
-- Section 5: Row Level Security
-- =========================================================

ALTER TABLE public.workplaces
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.workplace_members
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.shifts
  ENABLE ROW LEVEL SECURITY;


-- Users may read their own workplace memberships.

CREATE POLICY "Users can view own workplace memberships"
ON public.workplace_members
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
);


-- Users may read workplaces they belong to.

CREATE POLICY "Users can view their workplaces"
ON public.workplaces
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.workplace_members
    WHERE workplace_members.workplace_id = workplaces.id
      AND workplace_members.profile_id = auth.uid()
  )
);


-- Users may read their own shifts.
-- Open shifts are visible only within workplaces they belong to.

CREATE POLICY "Users can view relevant shifts"
ON public.shifts
FOR SELECT
TO authenticated
USING (
  assigned_profile_id = auth.uid()

  OR (

    status = 'open'

    AND EXISTS (
      SELECT 1
      FROM public.workplace_members
      WHERE workplace_members.workplace_id = shifts.workplace_id
        AND workplace_members.profile_id = auth.uid()
    )

  )
);

-- =========================================================
-- Section 6: Permissions
-- =========================================================

GRANT SELECT ON public.workplaces TO authenticated;
GRANT SELECT ON public.workplace_members TO authenticated;
GRANT SELECT ON public.shifts TO authenticated;