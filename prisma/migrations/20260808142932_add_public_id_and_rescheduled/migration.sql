-- Add the public-facing 4-digit appointment ID as nullable first so existing rows can be backfilled safely.
ALTER TABLE "appointments" ADD COLUMN "publicId" TEXT;

-- Backfill existing rows with unique 4-digit codes (zero-padded), ordered by creation date.
-- Starting at 1001 keeps every value strictly 4 digits even if the table grows before this runs.
WITH numbered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt") AS rn
  FROM "appointments"
)
UPDATE "appointments" a
SET "publicId" = LPAD((1000 + numbered.rn)::text, 4, '0')
FROM numbered
WHERE a."id" = numbered."id";

-- Now that every row has a value, enforce NOT NULL + uniqueness going forward.
ALTER TABLE "appointments" ALTER COLUMN "publicId" SET NOT NULL;
CREATE UNIQUE INDEX "appointments_publicId_key" ON "appointments"("publicId");

-- Track whether an appointment has been rescheduled at least once.
ALTER TABLE "appointments" ADD COLUMN "rescheduled" BOOLEAN NOT NULL DEFAULT false;

-- Prevent two active (PENDING/CONFIRMED) appointments from racing onto the same
-- therapist + date + time slot. Cancelled/completed appointments don't block a slot,
-- and appointments with no assigned therapist are not considered for this check.
CREATE UNIQUE INDEX "appointments_active_slot_key"
  ON "appointments"("therapistId", "appointmentDate", "appointmentTime")
  WHERE "status" IN ('PENDING', 'CONFIRMED') AND "therapistId" IS NOT NULL;
