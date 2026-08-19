#include "fra/math/pnl.hpp"

#include <gtest/gtest.h>

using namespace fra;

TEST(TrapezoidPnl, ZeroVelocityIsSizeTimesRateTimesDays) {
  // $1000 * 0.001 / day * (8/24) day = $0.333333
  const Usd pnl = trapezoid_funding_pnl(usd_from_decimal(1000.0),
                                        hours_from_double(8.0), Rate{0},
                                        rate_from_decimal(0.001));
  EXPECT_EQ(pnl.micros, 333333);
}

TEST(TrapezoidPnl, FullDayWithVelocityUsesAverageRate) {
  // initial 0.001, velocity 0.002 / 24h, horizon 24h
  // final ≈ 0.003, avg ≈ 0.002, profit ≈ $2 on $1000
  const Usd pnl = trapezoid_funding_pnl(usd_from_decimal(1000.0),
                                        hours_from_double(24.0),
                                        rate_from_decimal(0.002),
                                        rate_from_decimal(0.001));
  EXPECT_NEAR(usd_to_decimal(pnl), 2.0, 0.00001);
}

TEST(TrapezoidPnl, UsesAbsoluteSizeAndRate) {
  const Usd pos = trapezoid_funding_pnl(usd_from_decimal(100.0),
                                        hours_from_double(24.0), Rate{0},
                                        rate_from_decimal(0.01));
  const Usd neg = trapezoid_funding_pnl(usd_from_decimal(-100.0),
                                        hours_from_double(24.0), Rate{0},
                                        rate_from_decimal(-0.01));
  EXPECT_EQ(pos, neg);
  EXPECT_EQ(pos, usd_from_decimal(1.0));
}

TEST(EventCountPnl, LongPaysPositiveRate) {
  const Usd pnl = event_count_pnl(usd_from_decimal(100.0),
                                  rate_from_decimal(0.0001), 3, true);
  EXPECT_EQ(pnl, usd_from_decimal(-0.03));
}

TEST(EventCountPnl, ShortReceivesPositiveRate) {
  const Usd pnl = event_count_pnl(usd_from_decimal(100.0),
                                  rate_from_decimal(0.0001), 3, false);
  EXPECT_EQ(pnl, usd_from_decimal(0.03));
}

TEST(EventCountPnl, LongReceivesNegativeRate) {
  const Usd pnl = event_count_pnl(usd_from_decimal(100.0),
                                  rate_from_decimal(-0.0001), 2, true);
  EXPECT_EQ(pnl, usd_from_decimal(0.02));
}

TEST(EventCountPnl, NonPositiveEventsAreZero) {
  EXPECT_EQ(event_count_pnl(usd_from_decimal(100.0), rate_from_decimal(0.001),
                            0, true),
            Usd{0});
  EXPECT_EQ(event_count_pnl(usd_from_decimal(100.0), rate_from_decimal(0.001),
                            -1, false),
            Usd{0});
}
