#include "fra/types.hpp"

#include <cmath>
#include <limits>

#if defined(__GNUC__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wpedantic"
#endif

namespace fra {
namespace {

constexpr std::int64_t kMillisPerHour = 3'600'000;
constexpr int kHoursPerDay = 24;

std::int64_t i128_to_i64(__int128 value) {
  constexpr __int128 kMin = std::numeric_limits<std::int64_t>::min();
  constexpr __int128 kMax = std::numeric_limits<std::int64_t>::max();
  if (value < kMin) {
    return std::numeric_limits<std::int64_t>::min();
  }
  if (value > kMax) {
    return std::numeric_limits<std::int64_t>::max();
  }
  return static_cast<std::int64_t>(value);
}

std::int64_t round_to_i64(double value) {
  if (!std::isfinite(value)) {
    return 0;
  }
  const double rounded = std::round(value);
  if (rounded > static_cast<double>(std::numeric_limits<std::int64_t>::max())) {
    return std::numeric_limits<std::int64_t>::max();
  }
  if (rounded < static_cast<double>(std::numeric_limits<std::int64_t>::min())) {
    return std::numeric_limits<std::int64_t>::min();
  }
  return static_cast<std::int64_t>(rounded);
}

}  // namespace

std::int64_t add_s64(std::int64_t a, std::int64_t b) {
  return i128_to_i64(static_cast<__int128>(a) + b);
}

std::int64_t sub_s64(std::int64_t a, std::int64_t b) {
  return i128_to_i64(static_cast<__int128>(a) - b);
}

std::int64_t mul_div_s64(std::int64_t a, std::int64_t b, std::int64_t den) {
  if (den == 0) {
    return 0;
  }
  return i128_to_i64(static_cast<__int128>(a) * b / den);
}

Usd usd_from_decimal(double dollars) {
  return Usd{round_to_i64(dollars * static_cast<double>(Usd::scale))};
}

double usd_to_decimal(Usd value) {
  return static_cast<double>(value.micros) / static_cast<double>(Usd::scale);
}

Usd abs_usd(Usd value) {
  if (value.micros == std::numeric_limits<std::int64_t>::min()) {
    return Usd{std::numeric_limits<std::int64_t>::max()};
  }
  return Usd{value.micros < 0 ? -value.micros : value.micros};
}

Usd operator+(Usd lhs, Usd rhs) {
  return Usd{add_s64(lhs.micros, rhs.micros)};
}

Usd operator-(Usd lhs, Usd rhs) {
  return Usd{sub_s64(lhs.micros, rhs.micros)};
}

Usd operator-(Usd value) { return Usd{sub_s64(0, value.micros)}; }

bool operator==(Usd lhs, Usd rhs) { return lhs.micros == rhs.micros; }
bool operator<(Usd lhs, Usd rhs) { return lhs.micros < rhs.micros; }
bool operator<=(Usd lhs, Usd rhs) { return lhs.micros <= rhs.micros; }

Rate rate_from_decimal(double value) {
  return Rate{round_to_i64(value * static_cast<double>(Rate::scale))};
}

double rate_to_decimal(Rate value) {
  return static_cast<double>(value.ppt) / static_cast<double>(Rate::scale);
}

Rate abs_rate(Rate value) {
  if (value.ppt == std::numeric_limits<std::int64_t>::min()) {
    return Rate{std::numeric_limits<std::int64_t>::max()};
  }
  return Rate{value.ppt < 0 ? -value.ppt : value.ppt};
}

int rate_sign(Rate value) {
  if (value.ppt > 0) {
    return 1;
  }
  if (value.ppt < 0) {
    return -1;
  }
  return 0;
}

Rate operator+(Rate lhs, Rate rhs) { return Rate{add_s64(lhs.ppt, rhs.ppt)}; }

Rate operator-(Rate lhs, Rate rhs) { return Rate{sub_s64(lhs.ppt, rhs.ppt)}; }

Rate operator-(Rate value) { return Rate{sub_s64(0, value.ppt)}; }

bool operator==(Rate lhs, Rate rhs) { return lhs.ppt == rhs.ppt; }
bool operator<(Rate lhs, Rate rhs) { return lhs.ppt < rhs.ppt; }

Hours hours_from_double(double hours) {
  return Hours{round_to_i64(hours * static_cast<double>(kMillisPerHour))};
}

double hours_to_double(Hours value) {
  return static_cast<double>(value.ms) / static_cast<double>(kMillisPerHour);
}

bool operator==(Hours lhs, Hours rhs) { return lhs.ms == rhs.ms; }

Usd apply_rate(Usd notional, Rate rate) {
  return Usd{mul_div_s64(notional.micros, rate.ppt, Rate::scale)};
}

Rate rate_per_hour(Rate rate_24h) {
  return Rate{rate_24h.ppt / kHoursPerDay};
}

Rate rate_times_hours(Rate per_hour, Hours hours) {
  return Rate{mul_div_s64(per_hour.ppt, hours.ms, kMillisPerHour)};
}

Usd scale_by_day_fraction(Usd daily, Hours hours) {
  return Usd{mul_div_s64(daily.micros, hours.ms, kMillisPerHour * kHoursPerDay)};
}

}  // namespace fra

#if defined(__GNUC__)
#pragma GCC diagnostic pop
#endif
