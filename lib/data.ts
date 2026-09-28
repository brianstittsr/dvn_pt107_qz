import { Category, Question, VocabTerm } from "@/lib/types";

export const categories: Category[] = [
  { id: "regulations", name: "Regulations", desc: "Operating rules, certificates, and limitations" },
  { id: "airspace", name: "Airspace & Requirements", desc: "Classes, authorizations, and chart reading" },
  { id: "weather", name: "Weather", desc: "Reports, forecasts, hazards, and effects" },
  { id: "loading", name: "Loading & Performance", desc: "Weight, balance, and aircraft capability" },
  { id: "operations", name: "Operations", desc: "Risk management, inspections, and emergencies" },
  { id: "airport", name: "Airport Operations", desc: "Airport data, traffic patterns, and signs" },
  { id: "radio", name: "Radio Procedures", desc: "Communication terms and best practices" },
  { id: "physiology", name: "Human Factors", desc: "Vision, fatigue, drugs, and decision-making" },
  { id: "maintenance", name: "Maintenance & Inspection", desc: "Preflight, maintenance, and records" },
];

const rawQuestions: [string, string, string, string[], number, string][] = [
  ["q1", "regulations", "What is the maximum groundspeed for a small unmanned aircraft operating under Part 107?", ["87 knots", "100 mph", "120 knots", "55 mph"], 1, "Part 107 sets the maximum groundspeed at 100 miles per hour (87 knots)."],
  ["q2", "regulations", "What is the maximum altitude for a Part 107 operation, unless an exception applies?", ["400 feet AGL", "500 feet AGL", "400 feet MSL", "1,000 feet AGL"], 0, "The general ceiling is 400 feet above ground level, or within 400 feet of a structure under the applicable exception."],
  ["q3", "regulations", "How long is a Remote Pilot Certificate valid before recurrent training is required?", ["12 calendar months", "24 calendar months", "36 calendar months", "It never expires"], 1, "Remote pilots must complete recurrent training every 24 calendar months to remain current."],
  ["q4", "regulations", "A small unmanned aircraft must yield the right of way to:", ["Other unmanned aircraft only", "All aircraft, airborne vehicles, and people", "Aircraft only when below 400 feet", "No one if the pilot has LAANC"], 1, "The remote pilot must yield to all other aircraft, airborne vehicles, and launch/landing activities."],
  ["q5", "airspace", "Which airspace generally requires ATC authorization before a Part 107 flight?", ["Class G", "Class E beginning at 14,500 feet", "Class B, C, D, and surface Class E designated for an airport", "All Class G"], 2, "Operations in controlled airspace identified in the authorization requirements need prior ATC authorization."],
  ["q6", "airspace", "What does LAANC primarily provide?", ["Automatic aircraft maintenance records", "Near-real-time airspace authorizations and facility maps", "Weather briefings from the NWS", "A replacement for the Remote Pilot Certificate"], 1, "LAANC can provide near-real-time authorization in controlled airspace and display FAA facility maps."],
  ["q7", "airspace", "On a sectional chart, a dashed blue line most commonly identifies:", ["Class B airspace", "Class D airspace", "Class E airspace beginning at the surface", "A prohibited area"], 2, "A dashed blue boundary commonly depicts Class E airspace beginning at the surface around an airport."],
  ["q8", "airspace", "Before flight, the remote pilot should check for temporary flight restrictions (TFRs) because they:", ["Change the drone battery chemistry", "Can restrict or prohibit flight in a defined area", "Only apply to manned aircraft", "Are optional advisories"], 1, "TFRs can temporarily restrict or prohibit flight operations in a specific area."],
  ["q9", "weather", "Which report gives current observed weather at an airport?", ["TAF", "METAR", "AIRMET", "SIGMET"], 1, "A METAR is a routine aviation weather observation; a TAF is a forecast."],
  ["q10", "weather", "Fog is best described as:", ["A cloud at or near the ground that reduces visibility", "Wind above 25 knots", "Rain falling from a thunderstorm", "A temperature inversion only"], 0, "Fog is a cloud at the surface and can reduce visibility enough to make visual operations unsafe."],
  ["q11", "weather", "Which condition is most associated with rapid changes, turbulence, and lightning?", ["A stable high-pressure day", "A thunderstorm", "A clear winter night", "Light mist"], 1, "Thunderstorms combine strong updrafts and downdrafts, turbulence, lightning, hail, and rapid weather changes."],
  ["q12", "weather", "A temperature inversion can create:", ["Unlimited visibility", "Stable air and reduced mixing near the surface", "Only stronger GPS signals", "A guaranteed tailwind"], 1, "An inversion can trap smoke, haze, and pollutants near the surface and may reduce visibility."],
  ["q13", "loading", "Why does a forward center of gravity generally increase required control effort?", ["It reduces the aircraft weight to zero", "The aircraft must generate more nose-up control force", "It turns off GPS", "It eliminates induced drag"], 1, "A forward CG increases the tail or control force required to balance the aircraft, which can reduce efficiency."],
  ["q14", "loading", "Adding weight to a small unmanned aircraft generally causes:", ["Lower stall speed and longer endurance", "Higher stall speed and potentially reduced endurance", "No performance change", "Higher battery voltage automatically"], 1, "More weight generally increases stall speed, takeoff/landing distance, and power required, while reducing endurance."],
  ["q15", "loading", "A load that shifts during flight is dangerous primarily because it can:", ["Improve stability too much", "Change the center of gravity and make control difficult", "Improve radio range", "Reduce air density"], 1, "A shifting load can move the center of gravity outside the controllable range."],
  ["q16", "loading", "Density altitude increases when:", ["Temperature decreases and pressure increases", "Temperature increases or pressure decreases", "Humidity becomes zero only", "Wind becomes calm"], 1, "High temperature, high elevation, and lower pressure increase density altitude and can reduce performance."],
  ["q17", "operations", "The best first response to a lost-link event is to:", ["Ignore it and continue the mission", "Follow the aircraft's preplanned lost-link procedure", "Immediately land in any roadway", "Turn off the controller"], 1, "A safe operation includes a preplanned lost-link response, which the remote pilot should follow."],
  ["q18", "operations", "Risk management is most effective when the pilot:", ["Identifies hazards before flight and applies mitigations", "Waits until an incident occurs", "Only considers battery level", "Relies on experience alone"], 0, "Systematic hazard identification and mitigation reduce risk before the aircraft is launched."],
  ["q19", "operations", "A remote pilot should discontinue a flight when:", ["The mission is interesting", "Conditions exceed the aircraft, pilot, or regulatory limits", "The battery is above 50%", "The aircraft is visible"], 1, "A safe pilot is willing to abort when conditions exceed aircraft, pilot, or regulatory limits."],
  ["q20", "operations", "Crew resource management emphasizes:", ["Working alone without communication", "Effective communication, planning, and decision-making", "Flying faster than other aircraft", "Avoiding all checklists"], 1, "CRM uses communication, workload management, and shared situational awareness to improve safety."],
  ["q21", "airport", "The segmented circle at an airport is used to provide:", ["A runway surface only", "Traffic pattern and wind indicators", "Battery charging", "A weather forecast"], 1, "The segmented circle and its indicators help pilots interpret traffic pattern direction and runway use."],
  ["q22", "airport", "Runway numbers are based on the runway's:", ["Length in feet", "Magnetic heading rounded to the nearest 10 degrees", "Elevation in hundreds of feet", "Airport identifier"], 1, "Runway designations represent the magnetic azimuth rounded to the nearest 10 degrees, with the final zero omitted."],
  ["q23", "radio", "The phonetic alphabet word for the letter 'N' is:", ["November", "Navajo", "Niner", "November-two"], 0, "November is the ICAO phonetic alphabet word for N."],
  ["q24", "radio", "When communicating with ATC, a remote pilot should:", ["Use concise, standard phraseology and read back clearances", "Use slang to save time", "Transmit continuously", "Avoid stating location"], 0, "Clear, concise, standard phraseology improves shared understanding and safety."],
  ["q25", "physiology", "Night vision generally requires:", ["Bright white light exposure", "Time for dark adaptation", "A full moon", "Closing one eye for the entire flight"], 1, "Dark adaptation takes time. Bright light can temporarily reduce night vision."],
  ["q26", "physiology", "Fatigue can degrade a pilot's:", ["Judgment, reaction time, and attention", "Only the aircraft's GPS", "Battery capacity", "Airspace classification"], 0, "Fatigue affects cognitive performance, decision-making, attention, and reaction time."],
  ["q27", "maintenance", "A preflight inspection should be completed:", ["Only after takeoff", "Before every flight", "Once per calendar year", "Only after maintenance"], 1, "The remote pilot should inspect the aircraft and control station before each flight."],
  ["q28", "maintenance", "If a propeller has a crack, the correct action is to:", ["Fly at reduced speed", "Repair or replace it before flight", "Add tape and continue", "Ignore it if GPS works"], 1, "A cracked propeller is an airworthiness hazard and should be repaired or replaced before flight."],
  ["q29", "maintenance", "Maintenance records help the remote pilot:", ["Track condition, work performed, and recurring issues", "Obtain automatic airspace authorization", "Increase maximum altitude", "Avoid inspections"], 0, "Accurate records support airworthiness, troubleshooting, and safe return to service."],
];

export const questions: Question[] = rawQuestions.map(([id, categoryId, question, answers, correctIndex, explanation]) => ({
  id,
  categoryId,
  question,
  answers,
  correctIndex,
  explanation,
}));

const rawVocab: [string, string, string][] = [
  ["AGL", "Above Ground Level: altitude measured from the surface directly below the aircraft.", "regulations"],
  ["ATC", "Air Traffic Control: a service that manages aircraft traffic and authorizations.", "airspace"],
  ["BVLOS", "Beyond Visual Line of Sight: operating where the remote pilot cannot maintain direct unaided sight.", "regulations"],
  ["CG", "Center of Gravity: the point where the aircraft's weight is considered concentrated.", "loading"],
  ["CRM", "Crew Resource Management: communication and decision-making practices that improve safety.", "operations"],
  ["Density Altitude", "Pressure altitude corrected for nonstandard temperature; high density altitude reduces performance.", "weather"],
  ["LAANC", "Low Altitude Authorization and Notification Capability: a system for near-real-time controlled-airspace authorization.", "airspace"],
  ["METAR", "Aviation routine weather report containing current observed conditions.", "weather"],
  ["NOTAM", "Notice to Air Missions: timely information about hazards, changes, or restrictions.", "airspace"],
  ["Remote Pilot", "A person who holds the certificate and is responsible for the small UAS operation.", "regulations"],
  ["RPIC", "Remote Pilot in Command: the person with final authority and responsibility for the operation.", "operations"],
  ["TAF", "Terminal Aerodrome Forecast: a forecast of expected weather at an airport.", "weather"],
  ["TFR", "Temporary Flight Restriction: a temporary rule limiting or prohibiting flight in a defined area.", "airspace"],
  ["UAS", "Unmanned Aircraft System: the unmanned aircraft plus associated elements required for safe operation.", "regulations"],
  ["VLOS", "Visual Line of Sight: the pilot can see the aircraft sufficiently to control and avoid hazards.", "operations"],
  ["AGL Ceiling", "A maximum height measured above the ground, not sea level.", "regulations"],
  ["Airworthiness", "The aircraft is fit for safe operation and in a condition for safe flight.", "maintenance"],
  ["Class B", "Controlled airspace generally surrounding the busiest airports, shown with solid blue boundaries.", "airspace"],
  ["Class C", "Controlled airspace generally surrounding airports with radar service and a control tower.", "airspace"],
  ["Class D", "Controlled airspace generally surrounding airports with an operating control tower.", "airspace"],
  ["FAR", "Federal Aviation Regulations: the rules governing civil aviation in the United States.", "regulations"],
  ["Hypoxia", "A lack of sufficient oxygen reaching the body's tissues.", "physiology"],
  ["Stall", "A condition where the wing exceeds its critical angle of attack and loses lift.", "loading"],
  ["Lost Link", "A condition where the control link between the remote pilot station and aircraft is interrupted.", "operations"],
];

export const vocabTerms: VocabTerm[] = rawVocab.map(([term, definition, categoryId], index) => ({
  id: `v${index}`,
  term,
  definition,
  categoryId,
}));

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getQuestionsByCategory(categoryId: "all" | string): Question[] {
  if (categoryId === "all") return [...questions];
  return questions.filter((q) => q.categoryId === categoryId);
}
