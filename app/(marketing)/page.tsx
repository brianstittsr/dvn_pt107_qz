import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Crosshair, Radio, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DroneBadge, Propeller } from "@/components/drone-art";
import { ChevronRank, HudCard, InsigniaBadge, SectionHeading } from "@/components/military";
import { questions } from "@/lib/data";

const sampleQuestions = questions.slice(0, 3);

const marketingReasons = [
  {
    icon: Target,
    title: "Operator-ready curriculum",
    description:
      "Study the exact regulations, airspace rules, and emergency procedures used by military and commercial drone crews.",
  },
  {
    icon: Crosshair,
    title: "Mission-focused practice",
    description:
      "Every question includes a tactical explanation so you understand why an answer is correct, not just what it is.",
  },
  {
    icon: Radio,
    title: "Real-world communications",
    description:
      "Master radio phraseology, airspace coordination, and crew-resource management skills that transfer directly to the field.",
  },
  {
    icon: Shield,
    title: "Confidence under pressure",
    description:
      "Track readiness, streaks, and weak areas so you walk into the testing center prepared and mission-capable.",
  },
];

const careers = [
  {
    title: "Military UAS Operator",
    description:
      "Plan, launch, and recover unmanned systems in support of reconnaissance, surveillance, and tactical operations.",
    image:
      "https://image.pollinations.ai/prompt/soldier%20operating%20military%20drone%20control%20station%20bright%20daylight%20clean%20professional%20photography%20white%20and%20olive%20tones%20official%20military%20training%20program%20high%20contrast?width=800&height=600&seed=302&nologo=true",
  },
  {
    title: "Commercial Remote Pilot",
    description:
      "Fly drones for cinematography, inspection, mapping, agriculture, and logistics under Part 107.",
    image:
      "https://image.pollinations.ai/prompt/commercial%20drone%20with%20camera%20flying%20over%20green%20farmland%20bright%20daylight%20clean%20professional%20photography%20white%20and%20olive%20tones%20official%20military%20training%20program%20high%20contrast?width=800&height=600&seed=303&nologo=true",
  },
  {
    title: "Public Safety Drone Pilot",
    description:
      "Support law enforcement, fire, and search-and-rescue teams with aerial situational awareness.",
    image:
      "https://image.pollinations.ai/prompt/search%20and%20rescue%20drone%20with%20camera%20hovering%20above%20emergency%20scene%20bright%20daylight%20clean%20professional%20photography%20white%20and%20olive%20tones%20official%20military%20training%20program%20high%20contrast?width=800&height=600&seed=304&nologo=true",
  },
  {
    title: "Drone Maintenance Technician",
    description:
      "Keep airframes, sensors, and control stations mission-ready with inspections and preventive maintenance.",
    image:
      "https://image.pollinations.ai/prompt/technician%20hands%20repairing%20a%20drone%20propeller%20and%20camera%20gimbal%20on%20a%20workbench%20bright%20daylight%20clean%20professional%20photography%20white%20and%20olive%20tones%20official%20military%20training%20program%20high%20contrast?width=800&height=600&seed=305&nologo=true",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 hud-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-20 text-tan-light opacity-10">
          <Propeller className="h-96 w-96" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-tan-light/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tan-light">
                <Target className="h-3.5 w-3.5" />
                FAA Part 107 Certification Prep
              </div>
              <h1 className="stencil text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                Train like a drone operator. <span className="text-tan">Pass the exam.</span>
              </h1>
              <p className="max-w-lg text-lg text-tan-light/80">
                Tactical quiz drills, vocabulary flashcards, and progress tracking built for aspiring
                military and commercial UAS professionals.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/activate">
                  <Button size="lg">Unlock Pro mission access</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="dark">
                    Enter command center
                  </Button>
                </Link>
              </div>
            </div>
            <HudCard dark className="overflow-hidden p-0">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://image.pollinations.ai/prompt/military%20drone%20operator%20with%20tactical%20headset%20operating%20a%20UAS%20control%20station%20bright%20daylight%20clean%20professional%20photography%20white%20and%20olive%20tones%20official%20military%20training%20program%20high%20contrast?width=1200&height=600&seed=301&nologo=true"
                  alt="AI-generated military drone operator at a tactical UAS control station"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-medium text-tan">Tactical UAS Operations</p>
                  <p className="text-xs text-tan-light/70">Remote Pilot Certification Path</p>
                </div>
              </div>
            </HudCard>
          </div>
        </div>
      </section>

      {/* Sample questions */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading
            eyebrow="Training intel"
            title="Sample mission questions"
            description="The kind of scenarios you will face on test day."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sampleQuestions.map((q, qi) => (
              <HudCard key={q.id}>
                <CardHeader className="pb-3">
                  <p className="stencil text-xs text-olive">
                    MISSION Q-0{qi + 1}
                  </p>
                  <CardTitle className="text-base font-semibold leading-snug text-foreground">
                    {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {q.answers.slice(0, 2).map((answer, i) => (
                    <div
                      key={i}
                      className={`rounded-md border px-3 py-2 text-sm ${
                        i === q.correctIndex
                          ? "border-olive bg-olive/10 text-olive-dark"
                          : "border-tan/40 bg-surface-2 text-olive-dark/60"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {answer}
                    </div>
                  ))}
                  <p className="pt-2 text-xs text-olive-dark/50">
                    Correct: {String.fromCharCode(65 + q.correctIndex)}
                  </p>
                </CardContent>
              </HudCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/quiz">
              <Button>Try the full quiz →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marketing reasons */}
      <section className="relative bg-surface-2">
        <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading
            eyebrow="Upgrade path"
            title="Why upgrade to Pro?"
            description="Free training gets you started. Pro gets you certified."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketingReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <HudCard key={reason.title}>
                  <CardHeader className="space-y-3">
                    <Icon className="h-8 w-8 text-olive" />
                    <CardTitle className="text-lg text-olive-dark">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-olive-dark/70">{reason.description}</p>
                  </CardContent>
                </HudCard>
              );
            })}
          </div>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm text-olive-dark/80 sm:grid-cols-2">
            {[
              "Unlimited cloud sync across devices",
              "Full quiz history and performance trends",
              "Weak-area targeting with study recommendations",
              "Priority access to new question banks",
              "Export-ready readiness reports",
              "Cancel anytime, no hidden fees",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/activate">
              <Button size="lg">Activate Pro — $97/mo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Drone careers */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading
            eyebrow="Career ops"
            title="Drone careers unlocked by Part 107"
            description="Your certification is the launch point for high-demand UAS roles."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {careers.map((career) => (
              <HudCard key={career.title} className="overflow-hidden">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={career.image}
                    alt={`AI-generated image for ${career.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <CardContent className="space-y-2 p-5">
                  <InsigniaBadge variant="neutral">{career.title}</InsigniaBadge>
                  <p className="text-sm text-olive-dark/70">{career.description}</p>
                </CardContent>
              </HudCard>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-tan-light/30 bg-white/10">
              <DroneBadge />
            </div>
            <ChevronRank readiness={100} dark />
          </div>
          <div className="mt-6">
            <SectionHeading
              dark
              title="Mission-ready in weeks, not months"
              description="Join operators, inspectors, and public-safety pilots who use Part 107 Flight School to pass the Remote Pilot exam and advance their UAS careers."
            />
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg">Create free account</Button>
            </Link>
            <Link href="/activate">
              <Button size="lg" variant="dark">
                Go Pro now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
