import { PrismaClient, ServiceCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SERVICES: { name: string; category: ServiceCategory; description: string }[] = [
  // Speech Therapy
  { name: "Speech Delay Therapy", category: "SPEECH_THERAPY", description: "Support for children who are not meeting expected speech and language milestones." },
  { name: "Articulation Disorder Therapy", category: "SPEECH_THERAPY", description: "Helping children and adults produce speech sounds more clearly." },
  { name: "Stammering Therapy", category: "SPEECH_THERAPY", description: "Structured techniques to build fluency and confidence in speaking." },
  { name: "Aphasia Therapy", category: "SPEECH_THERAPY", description: "Language rebuilding support for individuals affected by aphasia." },
  { name: "Apraxia of Speech Therapy", category: "SPEECH_THERAPY", description: "Targeted exercises to improve motor planning for speech." },
  { name: "Dysarthria Therapy", category: "SPEECH_THERAPY", description: "Therapy to improve clarity and strength of speech muscles." },
  { name: "Voice Disorder Therapy", category: "SPEECH_THERAPY", description: "Care for vocal strain, hoarseness, and voice quality concerns." },
  { name: "Pediatric Speech-Language Therapy", category: "SPEECH_THERAPY", description: "Comprehensive speech and language support designed for children." },
  { name: "Fluency Therapy", category: "SPEECH_THERAPY", description: "Techniques to build smooth, natural speech flow and reduce disfluencies." },
  // Audiology
  { name: "Pure Tone Audiometry", category: "AUDIOLOGY", description: "Standard hearing test to measure the softest sounds you can hear." },
  { name: "Tympanometry", category: "AUDIOLOGY", description: "Assessment of middle ear function and eardrum movement." },
  { name: "OAE (Otoacoustic Emissions) Testing", category: "AUDIOLOGY", description: "Screening test that checks inner ear response, commonly used for infants." },
  { name: "BERA / ABR Testing", category: "AUDIOLOGY", description: "Brainstem response testing to assess hearing pathway function." },
  { name: "Comprehensive Hearing Assessment", category: "AUDIOLOGY", description: "Full evaluation of hearing health across all frequencies." },
  { name: "Hearing Aid Consultation", category: "AUDIOLOGY", description: "Guidance on hearing aid options suited to your hearing profile and lifestyle." },
  // Stroke Rehabilitation
  { name: "Aphasia Rehabilitation", category: "STROKE_REHAB", description: "Post-stroke language recovery therapy tailored to individual needs." },
  { name: "Apraxia Rehabilitation", category: "STROKE_REHAB", description: "Rehabilitation for speech motor planning difficulties after stroke." },
  { name: "Dysarthria Therapy (Stroke Recovery)", category: "STROKE_REHAB", description: "Speech clarity rehabilitation following a stroke or neurological event." },
  { name: "Cognitive-Communication Therapy", category: "STROKE_REHAB", description: "Support for memory, attention, and communication after brain injury." },
  { name: "Swallowing (Dysphagia) Rehabilitation", category: "STROKE_REHAB", description: "Safe-swallowing strategies and exercises after stroke." },
  { name: "Personalized Therapy Plans", category: "STROKE_REHAB", description: "Individually tailored rehabilitation plans built around each patient's recovery goals." },
  // Home-Based
  { name: "Home Speech Therapy", category: "HOME_BASED", description: "Professional speech therapy delivered in the comfort of your home." },
  { name: "Stroke Rehabilitation at Home", category: "HOME_BASED", description: "Personalized post-stroke rehabilitation support delivered at home." },
  { name: "Pediatric Home Therapy", category: "HOME_BASED", description: "Child-friendly therapy sessions designed around your child's routine at home." },
];

const THERAPISTS = [
  {
    name: "Dr. Soranjali Srichandan",
    qualification: "Senior SLP and Audiologist",
    specialization: "Paediatric specialist",
    bio: "Senior Speech-Language Pathologist and Audiologist specializing in paediatric speech, language and hearing care.",
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@princyhearandspeech.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Clinic Admin",
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Seeded admin: ${adminEmail} (password: ${adminPassword} — change this after first login)`);

  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }
  console.log(`Seeded ${SERVICES.length} services.`);

  const therapistIds: string[] = [];
  for (const therapist of THERAPISTS) {
    const existing = await prisma.therapist.findFirst({ where: { specialization: therapist.specialization } });
    const record = existing ?? (await prisma.therapist.create({ data: therapist }));
    therapistIds.push(record.id);
  }
  console.log(`Seeded ${THERAPISTS.length} placeholder therapists.`);

  for (const therapistId of therapistIds) {
    const existingAvailability = await prisma.availability.findFirst({ where: { therapistId } });
    if (existingAvailability) continue;
    // Monday (1) to Saturday (6), 9:00-17:00, 30-minute slots
    for (let dayOfWeek = 1; dayOfWeek <= 6; dayOfWeek++) {
      await prisma.availability.create({
        data: {
          therapistId,
          dayOfWeek,
          startTime: dayOfWeek === 6 ? "09:00" : "09:00",
          endTime: dayOfWeek === 6 ? "13:00" : "17:00",
          slotDurationMinutes: 30,
        },
      });
    }
  }
  console.log("Seeded default weekly availability for each therapist.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
