import { Leaf, PawPrint, User } from "lucide-react";

const COLUMNS = [
  {
    icon: Leaf,
    title: "Environment",
    text: "Ecological stress, nutrient and runoff inputs, water and air temperature, and lake hydrology all feed the score.",
  },
  {
    icon: User,
    title: "Human health",
    text: "Recreational exposure: swimming, boating and shoreline use bring people into contact with the water.",
  },
  {
    icon: PawPrint,
    title: "Animal health",
    text: "Pets and wildlife drink from and wade in shallow water, which raises their exposure.",
  },
];

export function OneHealthPanel({ lakeMead }: { lakeMead: boolean }) {
  return (
    <section aria-labelledby="one-health" className="border-t border-border pt-6">
      <h2 id="one-health" className="text-[28px] font-semibold leading-tight">
        One Health
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
        {COLUMNS.map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              {title}
            </h3>
            <p className="mt-2 text-sm leading-[1.45] text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 max-w-[68ch]">
        <h3 className="text-xl font-semibold">Visitor guidance</h3>
        <p className="mt-2 leading-[1.55]">
          {lakeMead
            ? "The National Park Service reports that harmful blue-green algae blooms occur at Lake Mead, most often from August through December. Exposure can cause nausea, vomiting and breathing problems, and dogs and other animals can become seriously ill or die. Where water looks green, scummy or discolored, a cautious choice is to stay out, keep pets away, and follow posted park notices."
            : "Where water looks green, scummy or discolored, a cautious choice is to stay out, keep pets away, and follow notices from the local authority."}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This guidance is general. A high score is a reason to sample the water, not a finding that it is unsafe.
        </p>
      </div>
    </section>
  );
}
