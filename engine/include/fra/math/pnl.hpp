#pragma once

#include "fra/types.hpp"

#include <optional>

namespace fra {

// Average of initial and final 24h rate over `hours`, times size, times days.
// final = initial_24h + (velocity_24h / 24) * hours
Usd trapezoid_funding_pnl(Usd size, Hours hours, Rate velocity_24h,
                          Rate initial_rate_24h);

// Long pays a positive per-event rate; short receives it. Multiplied by n.
Usd event_count_pnl(Usd size, Rate rate_per_event, std::int64_t n_events,
                    bool is_long);

// Linear zero-crossing time. nullopt if velocity is 0 or rate is 0.
std::optional<Hours> hours_to_neutralize(Rate rate, Rate velocity_per_hour);

// true if rate + velocity * horizon still has the original (non-zero) sign.
bool same_sign_after(Rate rate, Rate velocity_per_hour, Hours horizon);

}  // namespace fra
