import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Crosshair, Radio, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DroneBadge, Propeller } from "@/components/drone-art";
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
      "https://image.pollinations.ai/prompt/soldier%20operating%20military%20drone%20control%20station%20dark%20tactical%20environment%20olive%20drab%20camera%20gimbal%20and%20rotor%20propellers%20visible%20cinematic?width=800&height=600&seed=201&nologo=true",
  },
  {
    title: "Commercial Remote Pilot",
    description:
      "Fly drones for cinematography, inspection, mapping, agriculture, and logistics under Part 107.",
    image:
      "https://image.pollinations.ai/prompt/commercial%20drone%20with%20camera%20and%20propellers%20flying%20over%20green%20farmland%20dark%20military%20theme%20overlay%20cinematic?width=800&height=600&seed=202&nologo=true",
  },
  {
    title: "Public Safety Drone Pilot",
    description:
      "Support law enforcement, fire, and search-and-rescue teams with aerial situational awareness.",
    image:
      "https://image.pollinations.ai/prompt/search%20and%20rescue%20drone%20with%20thermal%20camera%20and%20propellers%20hovering%20above%20emergency%20scene%20at%20night%20dark%20olive%20and%20black%20cinematic?width=800&height=600&seed=203&nologo=true",
  },
  {
    title: "Drone Maintenance Technician",
    description:
      "Keep airframes, sensors, and control stations mission-ready with inspections and preventive maintenance.",
    image:
      "https://image.pollinations.ai/prompt/technician%20hands%20repairing%20a%20drone%20propeller%20and%20camera%20gimbal%20on%20a%20workbench%20dark%20olive%20military%20workshop%20cinematic?width=800&height=600&seed=204&nologo=true",
  },
];

export default function HomePage() {
  return (
    <div className="-m-8 min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-olive-dark/40">
        <div className="absolute inset-0 camo-bg" />
        <div className="pointer-events-none absolute -right-20 -top-20 opacity-10">
          <Propeller className="h-96 w-96" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-olive/40 bg-olive-dark/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tan-light">
                <Target className="h-3.5 w-3.5" />
                FAA Part 107 Certification Prep
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Train like a drone operator. <span className="text-tan">Pass the exam.</span>
              </h1>
              <p className="max-w-lg text-lg text-tan-light/80">
                Tactical quiz drills, vocabulary flashcards, and progress tracking built for aspiring
                military and commercial UAS professionals.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/activate">
                  <Button size="lg" className="bg-olive text-white hover:bg-olive-light">
                    Unlock Pro mission access
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-tan/40 text-tan-light hover:bg-olive-dark/30 hover:text-tan"
                  >
                    Enter command center
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-olive-dark/60 shadow-2xl shadow-black/50">
              <Image
                src="https://image.pollinations.ai/prompt/military%20drone%20operator%20with%20tactical%20headset%20operating%20a%20UAS%20in%20a%20dark%20command%20center%20olive%20green%20and%20black%20dramatic%20lighting%20focus%20on%20camera%20and%20propellers%20cinematic?width=1200&height=600&seed=101&nologo=true"
                alt="AI-generated military drone operator at a tactical UAS control station"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm font-medium text-tan">Tactical UAS Operations</p>
                <p className="text-xs text-tan-light/70">Remote Pilot Certification Path</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample questions */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-tan-light">Sample mission questions</h2>
          <p className="mt-2 text-tan-light/60">The kind of scenarios you will face on test day.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {sampleQuestions.map((q) => (
            <Card key={q.id} className="border-olive-dark/40 bg-card text-foreground">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold leading-snug">{q.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.answers.slice(0, 2).map((answer, i) => (
                  <div
                    key={i}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      i === q.correctIndex
                        ? "border-olive/60 bg-olive-dark/30 text-tan-light"
                        : "border-olive-dark/40 bg-card-2 text-tan-light/60"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {answer}
                  </div>
                ))}
                <p className="pt-2 text-xs text-tan-light/40">
                  Correct: {String.fromCharCode(65 + q.correctIndex)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/quiz">
            <Button className="bg-olive text-white hover:bg-olive-light">Try the full quiz →</Button>
          </Link>
        </div>
      </section>

      {/* Marketing reasons */}
      <section className="border-y border-olive-dark/40 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-tan-light">Why upgrade to Pro?</h2>
            <p className="mt-2 text-tan-light/60">Free training gets you started. Pro gets you certified.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketingReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <Card key={reason.title} className="border-olive-dark/40 bg-card text-foreground">
                  <CardHeader className="space-y-3">
                    <Icon className="h-8 w-8 text-tan" />
                    <CardTitle className="text-lg">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-tan-light/70">{reason.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm text-tan-light/80 sm:grid-cols-2">
            {[
              "Unlimited cloud sync across devices",
              "Full quiz history and performance trends",
              "Weak-area targeting with study recommendations",
              "Priority access to new question banks",
              "Export-ready readiness reports",
              "Cancel anytime, no hidden fees",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-olive-light" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/activate">
              <Button size="lg" className="bg-olive text-white hover:bg-olive-light">
                Activate Pro — $9/mo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Drone careers */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-tan-light">
            Drone careers unlocked by Part 107
          </h2>
          <p className="mt-2 text-tan-light/60">
            Your certification is the launch point for high-demand UAS roles.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => (
            <Card
              key={career.title}
              className="overflow-hidden border-olive-dark/40 bg-card text-foreground"
            >
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
                <h3 className="font-semibold text-tan">{career.title}</h3>
                <p className="text-sm text-tan-light/70">{career.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-olive-dark/40 bg-olive-dark/10">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-olive/40 bg-olive-dark/30">
            <DroneBadge />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-tan-light">
            Mission-ready in weeks, not months
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-tan-light/70">
            Join operators, inspectors, and public-safety pilots who use Part 107 Flight School to pass
            the Remote Pilot exam and advance their UAS careers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="bg-olive text-white hover:bg-olive-light">
                Create free account
              </Button>
            </Link>
            <Link href="/activate">
              <Button
                size="lg"
                variant="outline"
                className="border-tan/40 text-tan-light hover:bg-olive-dark/30 hover:text-tan"
              >
                Go Pro now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
