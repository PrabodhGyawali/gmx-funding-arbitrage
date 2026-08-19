#include "fra/math/skew.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(Skew, LongMinusShort) {
  EXPECT_EQ(skew_usd(usd_from_decimal(150.0), usd_from_decimal(50.0)),
            usd_from_decimal(100.0));
  EXPECT_EQ(skew_usd(usd_from_decimal(10.0), usd_from_decimal(40.0)),
            usd_from_decimal(-30.0));
}

TEST(OiImbalance, SymmetricIsZero) {
  const auto imb = oi_imbalance(usd_from_decimal(50.0), usd_from_decimal(50.0));
  ASSERT_TRUE(imb.has_value());
  EXPECT_DOUBLE_EQ(*imb, 0.0);
}

TEST(OiImbalance, OneSidedIsOne) {
  const auto imb = oi_imbalance(usd_from_decimal(80.0), Usd{0});
  ASSERT_TRUE(imb.has_value());
  EXPECT_DOUBLE_EQ(*imb, 1.0);
}

TEST(OiImbalance, Mixed) {
  const auto imb =
      oi_imbalance(usd_from_decimal(75.0), usd_from_decimal(25.0));
  ASSERT_TRUE(imb.has_value());
  EXPECT_DOUBLE_EQ(*imb, 0.5);
}

TEST(OiImbalance, ZeroTotalIsEmpty) {
  EXPECT_FALSE(oi_imbalance(Usd{0}, Usd{0}).has_value());
}
