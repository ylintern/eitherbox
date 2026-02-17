import { useTrackedPools } from '@/uniswapintegration';

interface PoolTabProps {
  walletConnected: boolean;
  onNavigateToYield: () => void;
}

const shortenPoolId = (poolId: string) => `${poolId.slice(0, 10)}...${poolId.slice(-8)}`;

export const PoolTab = ({ walletConnected, onNavigateToYield }: PoolTabProps) => {
  const { pools, isLoading, error } = useTrackedPools();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bubble p-8">
        <h2 className="text-2xl font-bold mb-2">Unichain Onchain Pools</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Live pool list is read from onchain-backed backend sync (RPC block snapshots).
        </p>

        {!walletConnected && (
          <p className="text-sm text-muted-foreground mb-4">
            Connect your wallet to see your positions in the Yield tab.
          </p>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Loading onchain pools...</p>}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load onchain pools: {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            {pools.map((pool) => (
              <div
                key={pool.poolId}
                className="bubble-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">{shortenPoolId(pool.poolId)}</p>
                  <p className="text-xs text-muted-foreground break-all">{pool.poolId}</p>
                </div>
                <div className="text-sm text-muted-foreground text-left md:text-right">
                  <p>Chain: {pool.chain}</p>
                  <p>Snapshot Block: {pool.blockNumber.toLocaleString()}</p>
                  <a
                    href={pool.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open on Uniswap
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bubble p-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Your LP Positions</h3>
          <p className="text-sm text-muted-foreground">
            Use Yield tab for wallet positions and fee claims sourced from backend wallet overview.
          </p>
        </div>
        <button
          onClick={onNavigateToYield}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          Go to Yield
        </button>
      </div>
    </div>
  );
};
