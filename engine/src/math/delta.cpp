#include "fra/math/delta.hpp"

#include <cmath>

namespace fra {

bool delta_within_bound(Usd n1, Usd n2, double bound) {
  const double a = usd_to_decimal(n1);
  const double b = usd_to_decimal(n2);
  const double denom = std::abs(a) + std::abs(b);
  if (denom == 0.0) {
    return true;
  }
  const double relative = std::abs(a + b) / denom;
  return relative <= bound;
}

std::optional<double> pct_from_liq(Usd mark, Usd liq, bool is_long) {
  if (mark.micros == 0) {
    return std::nullopt;
  }
  const double mark_d = usd_to_decimal(mark);
  const double liq_d = usd_to_decimal(liq);
  const double differential = is_long ? (mark_d - liq_d) : (liq_d - mark_d);
  return std::abs(differential / mark_d) * 100.0;
}

}  // namespace fra
