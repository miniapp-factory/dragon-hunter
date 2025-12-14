import { generateMetadata as generateFarcasterMetadata } from "@/lib/farcaster-embed";
import Quiz from "@/components/quiz";
import { useSendCalls } from 'wagmi';
import { parseEther } from 'viem';
import { Attribution } from 'ox/erc8021';

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
  const { sendCalls } = useSendCalls();
  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <Quiz />
      <button
        onClick={() =>
          sendCalls({
            calls: [
              {
                to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
                data: '0xdeadbeef',
              },
            ],
            capabilities: {
              dataSuffix: Attribution.toDataSuffix({ codes: ["bc_6qw3gmv5"] })
            }
          })
        }
      >
        Send calls
      </button>
    </main>
  );
}
