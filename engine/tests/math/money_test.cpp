#include "fra/types.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(Money, UsdRoundTrip) {
  EXPECT_EQ(usd_from_decimal(1.0).micros, 1'000'000);
  EXPECT_DOUBLE_EQ(usd_to_decimal(Usd{2'500'000}), 2.5);
}

TEST(Money, ApplyRateIsNotionalTimesRate) {
  // $100 * 0.0001 = $0.01
  EXPECT_EQ(apply_rate(usd_from_decimal(100.0), rate_from_decimal(0.0001)),
            usd_from_decimal(0.01));
}

TEST(Money, HoursRoundTrip) {
  EXPECT_NEAR(hours_to_double(hours_from_double(8.0)), 8.0, 1e-12);
}

TEST(Money, RatePerHourIsDailyOverTwentyFour) {
  EXPECT_EQ(rate_per_hour(rate_from_decimal(0.024)), rate_from_decimal(0.001));
}
