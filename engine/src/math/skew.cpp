#include "fra/math/skew.hpp"

#include <cmath>

namespace fra {

Usd skew_usd(Usd long_oi, Usd short_oi) { return long_oi - short_oi; }

std::optional<double> oi_imbalance(Usd long_oi, Usd short_oi) {
  const double long_d = usd_to_decimal(abs_usd(long_oi));
  const double short_d = usd_to_decimal(abs_usd(short_oi));
  const double total = long_d + short_d;
  if (total == 0.0) {
    return std::nullopt;
  }
  return std::abs(long_d - short_d) / total;
}

}  // namespace fra
