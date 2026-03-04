import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrackedPools } from '@/uniswapintegration';

interface PoolTabProps {
  walletConnected: boolean;
  onNavigateToYield: () => void;
}

const shortenPoolId = (poolId: string) => `${poolId.slice(0, 10)}...${poolId.slice(-8)}`;

const formatUsd = (amount?: string) => {
  if (!amount) return '—';
  const parsed = Number(amount);
  if (!Number.isFinite(parsed)) return '—';
  return `$${parsed.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

export const PoolTab = ({ walletConnected, onNavigateToYield }: PoolTabProps) => {
  const { pools, isLoading, error } = useTrackedPools();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Unichain Onchain Pools</CardTitle>
          <CardDescription>
            Live pool list is read from backend snapshots and normalized for frontend cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletConnected && (
            <p className="text-sm text-muted-foreground">
              Connect your wallet to see your positions in the Yield tab.
            </p>
          )}

          {isLoading && <p className="text-sm text-muted-foreground">Loading onchain pools...</p>}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load onchain pools: {error}
            </div>
          )}

          {!isLoading && !error && pools.length === 0 && (
            <p className="text-sm text-muted-foreground">No tracked pools returned by the backend.</p>
          )}

          {!isLoading && !error && pools.length > 0 && (
            <div className="grid gap-3">
              {pools.map((pool) => {
                const poolName =
                  pool.token0Symbol && pool.token1Symbol
                    ? `${pool.token0Symbol}/${pool.token1Symbol}`
                    : shortenPoolId(pool.poolId);

                return (
                  <Card key={pool.poolId} className="border-border/70">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg">{poolName}</CardTitle>
                        <div className="flex items-center gap-2">
                          {pool.feeTier && <Badge variant="secondary">Fee {pool.feeTier}</Badge>}
                          <Badge variant="outline">Block {pool.blockNumber.toLocaleString()}</Badge>
                        </div>
                      </div>
                      <CardDescription className="break-all">{pool.poolId}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Chain: {pool.chain}</p>
                        <p className="text-muted-foreground">TVL: {formatUsd(pool.tvlUsd)}</p>
                        <p className="text-muted-foreground">Volume: {formatUsd(pool.volumeUsd)}</p>
                        <p className="text-muted-foreground">Source: {pool.source || 'unknown'}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button asChild variant="outline" size="sm">
                        <a href={pool.explorerUrl} target="_blank" rel="noreferrer">
                          Open on Uniswap <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your LP Positions</CardTitle>
          <CardDescription>
            Use Yield tab for wallet positions and fee claims sourced from backend wallet overview.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button onClick={onNavigateToYield}>Go to Yield</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
