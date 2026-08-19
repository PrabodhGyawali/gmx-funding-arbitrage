#include "fra/math/delta.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(DeltaBound, BalancedOppositeLegsAreNeutral) {
  EXPECT_TRUE(delta_within_bound(usd_from_decimal(100.0),
                                 usd_from_decimal(-100.0), 0.03));
}

TEST(DeltaBound, SmallMismatchWithinBound) {
  EXPECT_TRUE(delta_within_bound(usd_from_decimal(100.0),
                                 usd_from_decimal(-97.0), 0.03));
}

TEST(DeltaBound, LargeMismatchExceedsBound) {
  EXPECT_FALSE(delta_within_bound(usd_from_decimal(100.0),
                                  usd_from_decimal(-90.0), 0.03));
}

TEST(DeltaBound, SameSideIsFullyOffside) {
  EXPECT_FALSE(delta_within_bound(usd_from_decimal(100.0),
                                  usd_from_decimal(100.0), 0.03));
}

TEST(DeltaBound, BothZeroIsWithinBound) {
  EXPECT_TRUE(delta_within_bound(Usd{0}, Usd{0}, 0.03));
}

TEST(PctFromLiq, LongAboveLiq) {
  const auto pct =
      pct_from_liq(usd_from_decimal(100.0), usd_from_decimal(90.0), true);
  ASSERT_TRUE(pct.has_value());
  EXPECT_DOUBLE_EQ(*pct, 10.0);
}

TEST(PctFromLiq, ShortBelowLiq) {
  const auto pct =
      pct_from_liq(usd_from_decimal(100.0), usd_from_decimal(110.0), false);
  ASSERT_TRUE(pct.has_value());
  EXPECT_DOUBLE_EQ(*pct, 10.0);
}

TEST(PctFromLiq, ZeroMarkIsEmpty) {
  EXPECT_FALSE(pct_from_liq(Usd{0}, usd_from_decimal(10.0), true).has_value());
}
