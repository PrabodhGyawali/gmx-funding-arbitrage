#include "fra/math/fees.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(MakerTaker, PartialNeutralizeIsAllMaker) {
  const auto split =
      maker_taker_split(usd_from_decimal(100.0), usd_from_decimal(-30.0));
  EXPECT_EQ(split.maker, usd_from_decimal(30.0));
  EXPECT_EQ(split.taker, Usd{0});
}

TEST(MakerTaker, OvershootSplitsMakerThenTaker) {
  const auto split =
      maker_taker_split(usd_from_decimal(100.0), usd_from_decimal(-150.0));
  EXPECT_EQ(split.maker, usd_from_decimal(100.0));
  EXPECT_EQ(split.taker, usd_from_decimal(50.0));
}

TEST(MakerTaker, SameSignIsAllTaker) {
  const auto split =
      maker_taker_split(usd_from_decimal(100.0), usd_from_decimal(50.0));
  EXPECT_EQ(split.maker, Usd{0});
  EXPECT_EQ(split.taker, usd_from_decimal(50.0));
}

TEST(MakerTaker, ShortSkewLongImpactNeutralizes) {
  const auto split =
      maker_taker_split(usd_from_decimal(-80.0), usd_from_decimal(80.0));
  EXPECT_EQ(split.maker, usd_from_decimal(80.0));
  EXPECT_EQ(split.taker, Usd{0});
}

TEST(FeeFromSplit, WeightedSumOfRates) {
  MakerTakerSplit split;
  split.maker = usd_from_decimal(100.0);
  split.taker = usd_from_decimal(50.0);
  const Usd fee = fee_from_split(split, rate_from_decimal(0.0005),
                                 rate_from_decimal(0.0007));
  EXPECT_EQ(fee, usd_from_decimal(0.085));
}
