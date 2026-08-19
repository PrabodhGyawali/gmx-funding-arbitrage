#pragma once

#include "fra/types.hpp"

namespace fra {

// If trade_impact reduces |skew|, that slice is maker; overflow (or a
// same-sign trade) is taker. Sizes are absolute USD.
MakerTakerSplit maker_taker_split(Usd skew, Usd trade_impact);

Usd fee_from_split(const MakerTakerSplit& split, Rate maker_rate,
                   Rate taker_rate);

}  // namespace fra
