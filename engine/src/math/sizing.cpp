#include "fra/math/sizing.hpp"

#include <algorithm>

namespace fra {

Usd signed_size(Usd absolute, bool is_long) {
  const Usd magnitude = abs_usd(absolute);
  return is_long ? magnitude : -magnitude;
}

std::optional<Usd> size_from_collateral(Usd long_collateral,
                                        Usd short_collateral,
                                        std::int32_t percent,
                                        double min_ratio) {
  if (percent <= 0 || percent > 100) {
    return std::nullopt;
  }
  if (long_collateral.micros <= 0 || short_collateral.micros <= 0) {
    return std::nullopt;
  }
  const Usd smaller = std::min(long_collateral, short_collateral);
  const Usd larger = std::max(long_collateral, short_collateral);
  const double ratio = usd_to_decimal(smaller) / usd_to_decimal(larger);
  if (ratio < min_ratio) {
    return std::nullopt;
  }
  return Usd{mul_div_s64(smaller.micros, percent, 100)};
}

}  // namespace fra
