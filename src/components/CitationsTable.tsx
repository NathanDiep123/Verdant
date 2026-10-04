import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { citations } from "@/data/citations";

const LINK =
  "break-all text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-ring";

function SourceLink({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener" className={LINK}>
      {url}
    </a>
  );
}

export function CitationsTable() {
  return (
    <>
      <div className="hidden border border-border bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] md:block">
        <Table className="table-fixed">
          <TableHeader className="border-b-[3px] border-double border-foreground/40 bg-muted/60 text-[0.8125rem] [&_th]:text-muted-foreground [&_tr]:border-b-0">
            <TableRow>
              <TableHead className="w-[14%] whitespace-normal">Item</TableHead>
              <TableHead className="w-[26%] whitespace-normal">Value or claim</TableHead>
              <TableHead className="w-[22%] whitespace-normal">Source</TableHead>
              <TableHead className="w-[12%] whitespace-normal">Publisher</TableHead>
              <TableHead className="w-[16%] whitespace-normal">URL</TableHead>
              <TableHead className="w-[10%] whitespace-normal">Accessed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {citations.map((c) => (
              <TableRow key={c.id} className="align-top">
                <TableCell className="whitespace-normal font-semibold">{c.item}</TableCell>
                <TableCell className="whitespace-normal">{c.claim}</TableCell>
                <TableCell className="whitespace-normal">{c.source}</TableCell>
                <TableCell className="whitespace-normal">{c.publisher}</TableCell>
                <TableCell className="whitespace-normal">
                  <SourceLink url={c.url} />
                </TableCell>
                <TableCell className="whitespace-normal font-mono text-xs tabular-nums text-muted-foreground">
                  {c.accessed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y divide-border border border-border bg-card md:hidden">
        {citations.map((c) => (
          <li key={c.id} className="flex flex-col gap-2 p-4 text-sm">
            <p className="font-semibold">{c.item}</p>
            <p>{c.claim}</p>
            <dl className="flex flex-col gap-1 text-muted-foreground">
              <div>
                <dt className="inline font-medium text-foreground">Source: </dt>
                <dd className="inline">{c.source}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">Publisher: </dt>
                <dd className="inline">{c.publisher}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">URL: </dt>
                <dd className="inline">
                  <SourceLink url={c.url} />
                </dd>
              </div>
              <div className="font-mono text-xs tabular-nums">Accessed {c.accessed}</div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
