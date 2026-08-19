#pragma once

#include "fra/types.hpp"

#include <optional>

namespace fra {

// Relative net delta of two signed notionals: |n1 + n2| / (|n1| + |n2|).
// The snapshot used |n1 - n2| / sum, which is always ~1 for opposite legs.
bool delta_within_bound(Usd n1, Usd n2, double bound);

// Distance from mark to liq as a percent of mark. nullopt if mark is 0.
std::optional<double> pct_from_liq(Usd mark, Usd liq, bool is_long);

}  // namespace fra
