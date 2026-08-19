#pragma once

#include "fra/types.hpp"

#include <map>
#include <vector>

namespace fra {

std::map<Symbol, std::vector<FundingTick>> group_ticks_by_symbol(
    const std::vector<FundingTick>& ticks);

void sort_ticks_by_rate(std::vector<FundingTick>& ticks);

// Pair every venue combo for one symbol. Long = lower 8h rate, short = higher.
// Equal rates are skipped. `as_of` is caller-supplied (no chain I/O).
std::vector<Opportunity> pair_venues_for_symbol(
    const std::vector<FundingTick>& ticks_for_symbol, Instant as_of);

std::vector<Opportunity> find_delta_neutral_opportunities(
    const std::vector<FundingTick>& ticks, Instant as_of);

// The leg with the smaller |rate| is the hedge. Equal |rate|: short is hedge.
Side hedge_side(Rate long_rate, Rate short_rate);

void rank_by_total_pnl(std::vector<ScoredOpportunity>& scored);

}  // namespace fra
