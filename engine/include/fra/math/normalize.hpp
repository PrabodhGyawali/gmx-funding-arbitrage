#pragma once

#include "fra/types.hpp"

#include <string>
#include <string_view>

namespace fra {

// Strip USDT, then PERP, then USD. Order matches the snapshot so
// "BTCUSDT" becomes "BTC", not "BTT".
Symbol normalize_symbol(std::string_view symbol);

// Convert a rate quoted over `period_hours` into an equivalent 8-hour rate.
Rate normalize_rate_to_8h(Rate rate, Hours period);

}  // namespace fra
