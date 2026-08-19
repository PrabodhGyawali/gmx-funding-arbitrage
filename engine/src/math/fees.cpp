#include "fra/math/fees.hpp"

namespace fra {

MakerTakerSplit maker_taker_split(Usd skew, Usd trade_impact) {
  MakerTakerSplit split;
  const bool neutralizing =
      (skew.micros > 0 && trade_impact.micros < 0) ||
      (skew.micros < 0 && trade_impact.micros > 0);
  const Usd abs_size = abs_usd(trade_impact);
  if (!neutralizing) {
    split.taker = abs_size;
    return split;
  }
  const Usd abs_skew = abs_usd(skew);
  if (abs_skew < abs_size) {
    split.maker = abs_skew;
    split.taker = abs_size - abs_skew;
  } else {
    split.maker = abs_size;
  }
  return split;
}

Usd fee_from_split(const MakerTakerSplit& split, Rate maker_rate,
                   Rate taker_rate) {
  return apply_rate(split.maker, maker_rate) +
         apply_rate(split.taker, taker_rate);
}

}  // namespace fra
