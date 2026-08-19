#include "fra/math/pnl.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(Neutralize, OppositeSignsGiveLinearCrossingTime) {
  const auto hours =
      hours_to_neutralize(rate_from_decimal(0.001), rate_from_decimal(-0.0005));
  ASSERT_TRUE(hours.has_value());
  EXPECT_NEAR(hours_to_double(*hours), 2.0, 1e-9);
}

TEST(Neutralize, SameSignDoesNotCross) {
  EXPECT_FALSE(
      hours_to_neutralize(rate_from_decimal(0.001), rate_from_decimal(0.0005))
          .has_value());
}

TEST(Neutralize, ZeroRateOrVelocityIsEmpty) {
  EXPECT_FALSE(
      hours_to_neutralize(Rate{0}, rate_from_decimal(-0.001)).has_value());
  EXPECT_FALSE(
      hours_to_neutralize(rate_from_decimal(0.001), Rate{0}).has_value());
}

TEST(SameSignAfter, StaysPositive) {
  EXPECT_TRUE(same_sign_after(rate_from_decimal(0.001),
                              rate_from_decimal(0.0001),
                              hours_from_double(10.0)));
}

TEST(SameSignAfter, CrossesToNegative) {
  EXPECT_FALSE(same_sign_after(rate_from_decimal(0.001),
                               rate_from_decimal(-0.0002),
                               hours_from_double(10.0)));
}

TEST(SameSignAfter, ZeroRateCountsAsSame) {
  EXPECT_TRUE(same_sign_after(Rate{0}, rate_from_decimal(-0.001),
                              hours_from_double(1.0)));
}
