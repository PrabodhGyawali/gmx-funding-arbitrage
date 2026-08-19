#include "fra/math/normalize.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(NormalizeSymbol, StripsUsdtBeforeUsd) {
  EXPECT_EQ(normalize_symbol("BTCUSDT"), "BTC");
  EXPECT_EQ(normalize_symbol("ETHUSD"), "ETH");
  EXPECT_EQ(normalize_symbol("SOLPERP"), "SOL");
  EXPECT_EQ(normalize_symbol("ETH"), "ETH");
  EXPECT_EQ(normalize_symbol("1000PEPEUSDT"), "1000PEPE");
}

TEST(NormalizeRate, ScalesLinearlyToEightHours) {
  const Rate one_hour = rate_from_decimal(0.0003);
  const Rate eight = normalize_rate_to_8h(one_hour, hours_from_double(1.0));
  EXPECT_EQ(eight, rate_from_decimal(0.0024));
}

TEST(NormalizeRate, IdentityWhenAlreadyEightHours) {
  const Rate rate = rate_from_decimal(0.001);
  EXPECT_EQ(normalize_rate_to_8h(rate, hours_from_double(8.0)), rate);
}

TEST(NormalizeRate, ZeroPeriodReturnsZero) {
  EXPECT_EQ(normalize_rate_to_8h(rate_from_decimal(0.001), Hours{0}).ppt, 0);
}
