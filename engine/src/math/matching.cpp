#include "fra/math/matching.hpp"

#include "fra/math/normalize.hpp"

#include <algorithm>
#include <utility>

namespace fra {

std::map<Symbol, std::vector<FundingTick>> group_ticks_by_symbol(
    const std::vector<FundingTick>& ticks) {
  std::map<Symbol, std::vector<FundingTick>> grouped;
  for (FundingTick tick : ticks) {
    tick.symbol = normalize_symbol(tick.symbol);
    grouped[tick.symbol].push_back(std::move(tick));
  }
  return grouped;
}

void sort_ticks_by_rate(std::vector<FundingTick>& ticks) {
  std::sort(ticks.begin(), ticks.end(),
            [](const FundingTick& a, const FundingTick& b) {
              return a.funding_rate_8h < b.funding_rate_8h;
            });
}

std::vector<Opportunity> pair_venues_for_symbol(
    const std::vector<FundingTick>& ticks_for_symbol, Instant as_of) {
  std::vector<Opportunity> out;
  const std::size_t n = ticks_for_symbol.size();
  for (std::size_t i = 0; i < n; ++i) {
    for (std::size_t j = i + 1; j < n; ++j) {
      const FundingTick* a = &ticks_for_symbol[i];
      const FundingTick* b = &ticks_for_symbol[j];
      if (a->funding_rate_8h == b->funding_rate_8h) {
        continue;
      }
      if (b->funding_rate_8h < a->funding_rate_8h) {
        std::swap(a, b);
      }
      Opportunity opp;
      opp.long_venue = a->venue;
      opp.short_venue = b->venue;
      opp.symbol = normalize_symbol(a->symbol);
      opp.long_rate_8h = a->funding_rate_8h;
      opp.short_rate_8h = b->funding_rate_8h;
      opp.long_skew_usd = a->skew_usd;
      opp.short_skew_usd = b->skew_usd;
      opp.as_of = as_of;
      out.push_back(std::move(opp));
    }
  }
  return out;
}

std::vector<Opportunity> find_delta_neutral_opportunities(
    const std::vector<FundingTick>& ticks, Instant as_of) {
  std::vector<Opportunity> out;
  if (ticks.empty()) {
    return out;
  }
  const auto grouped = group_ticks_by_symbol(ticks);
  for (const auto& [symbol, group] : grouped) {
    (void)symbol;
    auto pairs = pair_venues_for_symbol(group, as_of);
    out.insert(out.end(), pairs.begin(), pairs.end());
  }
  return out;
}

Side hedge_side(Rate long_rate, Rate short_rate) {
  const auto long_abs = abs_rate(long_rate);
  const auto short_abs = abs_rate(short_rate);
  if (short_abs < long_abs || short_abs == long_abs) {
    return Side::Short;
  }
  return Side::Long;
}

void rank_by_total_pnl(std::vector<ScoredOpportunity>& scored) {
  std::sort(scored.begin(), scored.end(),
            [](const ScoredOpportunity& a, const ScoredOpportunity& b) {
              return b.total_profit < a.total_profit;
            });
}

}  // namespace fra
