#pragma once

#include "fra/types.hpp"

#include <cstdint>
#include <optional>

namespace fra {

// Positive size, negated if short.
Usd signed_size(Usd absolute, bool is_long);

// min(long, short) * percent / 100 after a collateral-ratio check.
// nullopt if either side is non-positive or min/max < min_ratio.
std::optional<Usd> size_from_collateral(Usd long_collateral,
                                        Usd short_collateral,
                                        std::int32_t percent,
                                        double min_ratio = 0.01);

}  // namespace fra
