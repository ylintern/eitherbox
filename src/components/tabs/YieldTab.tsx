import { useAccount } from 'wagmi';
import { useWalletOverview } from '@/uniswapintegration';

interface YieldTabProps {
  walletConnected: boolean;
}

export const YieldTab = ({ walletConnected }: YieldTabProps) => {
  const { address } = useAccount();
  const { overview, isLoading, error } = useWalletOverview(address);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bubble p-8">
        <h2 className="text-2xl font-bold mb-2">Wallet Yield Overview</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Real wallet balances and open LP position placeholders are loaded from backend RPC reads.
        </p>

        {!walletConnected && (
          <p className="text-sm text-muted-foreground">Connect wallet to load your active positions.</p>
        )}

        {walletConnected && isLoading && (
          <p className="text-sm text-muted-foreground">Loading wallet positions...</p>
        )}

        {walletConnected && error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load wallet overview: {error}
          </div>
        )}

        {walletConnected && !isLoading && !error && (
          <div className="space-y-6">
            <div className="bubble-sm p-5">
              <p className="text-sm text-muted-foreground mb-2">Native Balance (ETH)</p>
              <p className="text-2xl font-bold">{overview?.nativeBalanceEth ?? '0'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Token Balances</h3>
              <div className="space-y-2">
                {(overview?.tokenBalances || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No tracked token balances found.</p>
                )}
                {(overview?.tokenBalances || []).map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between bubble-sm px-4 py-3"
                  >
                    <span className="font-semibold">{token.symbol}</span>
                    <span>{token.balance}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Open Positions</h3>
              {(overview?.openPositions || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open positions detected yet for this wallet in tracked pools.
                </p>
              ) : (
                <div className="space-y-2">
                  {overview?.openPositions.map((position) => (
                    <div
                      key={`${position.poolId}-${position.liquidity}`}
                      className="bubble-sm px-4 py-3 flex items-center justify-between"
                    >
                      <span className="text-xs break-all mr-4">{position.poolId}</span>
                      <span className="font-semibold">Liquidity: {position.liquidity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
