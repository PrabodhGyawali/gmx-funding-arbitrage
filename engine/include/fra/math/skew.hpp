#pragma once

#include "fra/types.hpp"

#include <optional>

namespace fra {

Usd skew_usd(Usd long_oi, Usd short_oi);

// |L - S| / (L + S). nullopt if total OI is 0.
std::optional<double> oi_imbalance(Usd long_oi, Usd short_oi);

}  // namespace fra
