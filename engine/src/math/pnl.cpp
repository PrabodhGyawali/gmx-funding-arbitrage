#include "fra/math/pnl.hpp"

namespace fra {

Usd trapezoid_funding_pnl(Usd size, Hours hours, Rate velocity_24h,
                          Rate initial_rate_24h) {
  const Rate delta = rate_times_hours(rate_per_hour(velocity_24h), hours);
  const Rate final_rate = initial_rate_24h + delta;
  const Rate sum = initial_rate_24h + final_rate;
  const Rate avg_daily{sum.ppt / 2};
  const Usd daily = apply_rate(abs_usd(size), abs_rate(avg_daily));
  return scale_by_day_fraction(daily, hours);
}

Usd event_count_pnl(Usd size, Rate rate_per_event, std::int64_t n_events,
                    bool is_long) {
  if (n_events <= 0) {
    return Usd{0};
  }
  const Usd one = apply_rate(abs_usd(size), rate_per_event);
  const Usd signed_one = is_long ? -one : one;
  return Usd{mul_div_s64(signed_one.micros, n_events, 1)};
}

std::optional<Hours> hours_to_neutralize(Rate rate, Rate velocity_per_hour) {
  if (rate.ppt == 0 || velocity_per_hour.ppt == 0) {
    return std::nullopt;
  }
  if (rate_sign(rate) == rate_sign(velocity_per_hour)) {
    return std::nullopt;
  }
  return Hours{mul_div_s64(abs_rate(rate).ppt, 3'600'000,
                           abs_rate(velocity_per_hour).ppt)};
}

bool same_sign_after(Rate rate, Rate velocity_per_hour, Hours horizon) {
  if (rate.ppt == 0) {
    return true;
  }
  const Rate future = rate + rate_times_hours(velocity_per_hour, horizon);
  if (rate.ppt > 0) {
    return future.ppt > 0;
  }
  return future.ppt < 0;
}

}  // namespace fra
