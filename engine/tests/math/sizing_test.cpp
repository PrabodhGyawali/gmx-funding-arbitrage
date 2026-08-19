#include "fra/math/sizing.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(SignedSize, LongStaysPositive) {
  EXPECT_EQ(signed_size(usd_from_decimal(25.0), true), usd_from_decimal(25.0));
}

TEST(SignedSize, ShortNegates) {
  EXPECT_EQ(signed_size(usd_from_decimal(25.0), false),
            usd_from_decimal(-25.0));
}

TEST(SignedSize, AbsoluteValueFirst) {
  EXPECT_EQ(signed_size(usd_from_decimal(-25.0), false),
            usd_from_decimal(-25.0));
}

TEST(SizeFromCollateral, UsesTheSmallerSideAndPercent) {
  const auto size = size_from_collateral(usd_from_decimal(1000.0),
                                         usd_from_decimal(800.0), 50);
  ASSERT_TRUE(size.has_value());
  EXPECT_EQ(*size, usd_from_decimal(400.0));
}

TEST(SizeFromCollateral, UsesShortWhenShortIsSmaller) {
  const auto size = size_from_collateral(usd_from_decimal(200.0),
                                         usd_from_decimal(1000.0), 25);
  ASSERT_TRUE(size.has_value());
  EXPECT_EQ(*size, usd_from_decimal(50.0));
}

TEST(SizeFromCollateral, RejectsRatioBelowMinimum) {
  // 5 / 1000 = 0.005 < 0.01. Snapshot compared long/long and would miss this.
  EXPECT_FALSE(size_from_collateral(usd_from_decimal(1000.0),
                                    usd_from_decimal(5.0), 50)
                   .has_value());
}

TEST(SizeFromCollateral, RejectsNonPositiveOrBadPercent) {
  EXPECT_FALSE(size_from_collateral(usd_from_decimal(100.0), Usd{0}, 50)
                   .has_value());
  EXPECT_FALSE(size_from_collateral(usd_from_decimal(-10.0),
                                    usd_from_decimal(10.0), 50)
                   .has_value());
  EXPECT_FALSE(size_from_collateral(usd_from_decimal(100.0),
                                    usd_from_decimal(100.0), 0)
                   .has_value());
  EXPECT_FALSE(size_from_collateral(usd_from_decimal(100.0),
                                    usd_from_decimal(100.0), 101)
                   .has_value());
}
