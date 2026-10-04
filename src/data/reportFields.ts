// Source: the citizen-science form in the OneAquaHealth AquaLink repo
// (https://github.com/Sravya1802/aqualink, codes.js), 7 questions, options verbatim.
// As reproduced by a hackathon participant repo, not verified against the official OAH app.

export type ReportField = {
  id: string;
  label: string;
  question: string;
  options: string[];
  multi?: boolean;
};

export const reportFields: ReportField[] = [
  { id: "foam", label: "Foam", question: "Does the water look or smell unusual?", options: ["normal", "foam", "colour", "sewage-smell", "oil-sheen"] },
  { id: "riparian", label: "Riparian vegetation", question: "How much of the bank is covered by plants?", options: ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"] },
  { id: "algae", label: "Filamentous algae", question: "Do you see green slime or stringy algae in the water?", options: ["none", "some", "lots"] },
  { id: "hydrology", label: "Hydrology", question: "How is the water moving?", options: ["flowing", "slow", "stagnant pools", "dry bed"] },
  { id: "diptera", label: "Diptera", question: "Do you see mosquito larvae or swarms of small flies?", options: ["none", "few", "many"] },
  { id: "ticks", label: "Ticks", question: "Did you find ticks in the grass near the stream?", options: ["no", "yes"] },
  { id: "wildlife", label: "Wildlife", question: "Which animals did you see?", options: ["none", "fish", "amphibians", "birds"], multi: true },
];
