import { generateMetadata as generateFarcasterMetadata } from "@/lib/farcaster-embed";
import Quiz from "@/components/quiz";

export async function generateMetadata() {
  const meta = await generateFarcasterMetadata();
  return {
    ...meta,
    other: {
      ...meta.other,
      'base:app_id': '691fbaee7f22d95cdee2ffb2',
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <Quiz />
    </main>
  );
}
