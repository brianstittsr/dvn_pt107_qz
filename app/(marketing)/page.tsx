import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Crosshair, Radio, Shield, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    image: "https://images.unsplash.com/photo-1540226130473-62fd8269b3fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Commercial Remote Pilot",
    description:
      "Fly drones for cinematography, inspection, mapping, agriculture, and logistics under Part 107.",
    image: "https://images.unsplash.com/photo-1757170889571-24e12e70dd21?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Public Safety Drone Pilot",
    description:
      "Support law enforcement, fire, and search-and-rescue teams with aerial situational awareness.",
    image: "https://images.unsplash.com/photo-1690149372906-8dedeb6496ea?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Drone Maintenance Technician",
    description:
      "Keep airframes, sensors, and control stations mission-ready with inspections and preventive maintenance.",
    image: "https://images.unsplash.com/photo-1774553988130-ccda57774818?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="-m-8 min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-olive/30 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-olive-light/40 bg-olive/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tan-light">
                <Target className="h-3.5 w-3.5" />
                FAA Part 107 Certification Prep
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Train like a drone operator. <span className="text-tan">Pass the exam.</span>
              </h1>
              <p className="max-w-lg text-lg text-slate-400">
                Tactical quiz drills, vocabulary flashcards, and progress tracking built for aspiring
                military and commercial UAS professionals.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/quiz">
                  <Button size="lg" className="bg-olive text-white hover:bg-olive-light">
                    Start mission training
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-900"
                  >
                    Enter admin panel
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1485464612313-85b4a3b32e94?auto=format&fit=crop&w=1200&q=80"
                alt="Remote pilot controlling a small UAS during a tactical exercise"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                <p className="text-sm font-medium text-tan">Tactical UAS Operations</p>
                <p className="text-xs text-slate-300">Remote Pilot Certification Path</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample questions */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Sample mission questions</h2>
          <p className="mt-2 text-slate-400">The kind of scenarios you will face on test day.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {sampleQuestions.map((q) => (
            <Card key={q.id} className="border-slate-800 bg-slate-900/50 text-slate-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold leading-snug">{q.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.answers.slice(0, 2).map((answer, i) => (
                  <div
                    key={i}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      i === q.correctIndex
                        ? "border-olive/60 bg-olive/20 text-tan-light"
                        : "border-slate-700 bg-slate-800/50 text-slate-400"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {answer}
                  </div>
                ))}
                <p className="pt-2 text-xs text-slate-500">
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
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why upgrade to Pro?</h2>
            <p className="mt-2 text-slate-400">Free training gets you started. Pro gets you certified.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketingReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <Card key={reason.title} className="border-slate-800 bg-slate-950 text-slate-100">
                  <CardHeader className="space-y-3">
                    <Icon className="h-8 w-8 text-tan" />
                    <CardTitle className="text-lg">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">{reason.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm text-slate-300 sm:grid-cols-2">
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
          <h2 className="text-3xl font-bold tracking-tight">Drone careers unlocked by Part 107</h2>
          <p className="mt-2 text-slate-400">Your certification is the launch point for high-demand UAS roles.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => (
            <Card key={career.title} className="overflow-hidden border-slate-800 bg-slate-900/50 text-slate-100">
              <div className="relative aspect-[3/2]">
                <Image
                  src={career.image}
                  alt={career.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <CardContent className="space-y-2 p-5">
                <h3 className="font-semibold text-tan">{career.title}</h3>
                <p className="text-sm text-slate-400">{career.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-800 bg-olive/10">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Trophy className="mx-auto h-10 w-10 text-tan" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Mission-ready in weeks, not months</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
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
                className="border-slate-600 text-slate-200 hover:bg-slate-900"
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
