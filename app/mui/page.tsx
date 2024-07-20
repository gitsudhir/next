import Switch from "@mui/material/Switch";

export default function Home() {
  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Switch {...label} defaultChecked />
        <Switch {...label} />
        <Switch {...label} disabled defaultChecked />
      </div>
    </main>
  );
}
