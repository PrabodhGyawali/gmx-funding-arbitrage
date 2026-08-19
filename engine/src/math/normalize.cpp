#include "fra/math/normalize.hpp"

#include <string>

namespace fra {
namespace {

void replace_all(std::string& text, std::string_view from) {
  std::size_t pos = 0;
  while ((pos = text.find(from, pos)) != std::string::npos) {
    text.erase(pos, from.size());
  }
}

}  // namespace

Symbol normalize_symbol(std::string_view symbol) {
  std::string out{symbol};
  replace_all(out, "USDT");
  replace_all(out, "PERP");
  replace_all(out, "USD");
  return out;
}

Rate normalize_rate_to_8h(Rate rate, Hours period) {
  if (period.ms == 0) {
    return Rate{0};
  }
  constexpr std::int64_t kEightHoursMs = 8 * 3'600'000;
  return Rate{mul_div_s64(rate.ppt, kEightHoursMs, period.ms)};
}

}  // namespace fra
