import { sql } from "@vercel/postgres";

export default async function Home({
  params
} : {
  params: { user: string }
}): Promise<JSX.Element> {
  const { rows } = await sql`SELECT * from CARS`;

  return (
    <div>
      {rows.map((row) => (
        <div key={row.brand}>
          {row.brand} ➡️ {row.model} ➡️ {row.year}
        </div>
      ))}
    </div>
  );
}