#include "fra/math/matching.hpp"

#include <gtest/gtest.h>

#include <utility>
#include <vector>

using namespace fra;

namespace {

FundingTick tick(VenueId venue, Symbol symbol, double rate, double skew = 0.0) {
  FundingTick t;
  t.venue = std::move(venue);
  t.symbol = std::move(symbol);
  t.funding_rate_8h = rate_from_decimal(rate);
  t.skew_usd = usd_from_decimal(skew);
  return t;
}

}  // namespace

TEST(Matching, GroupsNormalizedSymbolsTogether) {
  const auto grouped = group_ticks_by_symbol({
      tick("A", "BTCUSDT", 0.001),
      tick("B", "BTC", -0.0002),
      tick("A", "ETH", 0.0001),
  });
  ASSERT_EQ(grouped.size(), 2U);
  ASSERT_EQ(grouped.at("BTC").size(), 2U);
  ASSERT_EQ(grouped.at("ETH").size(), 1U);
}

TEST(Matching, SortsByRateAscending) {
  auto ticks = std::vector<FundingTick>{
      tick("A", "ETH", 0.002),
      tick("B", "ETH", -0.001),
      tick("C", "ETH", 0.0005),
  };
  sort_ticks_by_rate(ticks);
  EXPECT_EQ(ticks[0].venue, "B");
  EXPECT_EQ(ticks[1].venue, "C");
  EXPECT_EQ(ticks[2].venue, "A");
}

TEST(Matching, PairsLongAsLowerRate) {
  const Instant as_of{1};
  const auto opps = pair_venues_for_symbol(
      {
          tick("A", "ETH", 0.001, 10.0),
          tick("B", "ETH", -0.0005, -3.0),
      },
      as_of);
  ASSERT_EQ(opps.size(), 1U);
  EXPECT_EQ(opps[0].long_venue, "B");
  EXPECT_EQ(opps[0].short_venue, "A");
  EXPECT_EQ(opps[0].symbol, "ETH");
  EXPECT_EQ(opps[0].as_of.unix_ms, 1);
  EXPECT_EQ(opps[0].long_skew_usd, usd_from_decimal(-3.0));
  EXPECT_EQ(opps[0].short_skew_usd, usd_from_decimal(10.0));
}

TEST(Matching, SkipsEqualRates) {
  const auto opps = pair_venues_for_symbol(
      {
          tick("A", "ETH", 0.001),
          tick("B", "ETH", 0.001),
      },
      Instant{0});
  EXPECT_TRUE(opps.empty());
}

TEST(Matching, ZeroRateIsAValidLongLeg) {
  const auto opps = pair_venues_for_symbol(
      {
          tick("A", "ETH", 0.001),
          tick("B", "ETH", 0.0),
      },
      Instant{0});
  ASSERT_EQ(opps.size(), 1U);
  EXPECT_EQ(opps[0].long_venue, "B");
  EXPECT_EQ(opps[0].short_venue, "A");
}

TEST(Matching, BothNegativeLongsTheMoreNegative) {
  const auto opps = pair_venues_for_symbol(
      {
          tick("A", "ETH", -0.001),
          tick("B", "ETH", -0.0002),
      },
      Instant{0});
  ASSERT_EQ(opps.size(), 1U);
  EXPECT_EQ(opps[0].long_venue, "A");
  EXPECT_EQ(opps[0].short_venue, "B");
}

TEST(Matching, FindPairsEveryVenueComboPerSymbol) {
  const auto opps = find_delta_neutral_opportunities(
      {
          tick("A", "ETHUSDT", 0.001),
          tick("B", "ETH", -0.0005),
          tick("C", "ETH", 0.0002),
          tick("A", "BTC", 0.001),
      },
      Instant{42});
  // ETH: A-B, A-C, B-C. BTC: single venue, no pair.
  EXPECT_EQ(opps.size(), 3U);
  for (const auto& opp : opps) {
    EXPECT_EQ(opp.symbol, "ETH");
    EXPECT_EQ(opp.as_of.unix_ms, 42);
  }
}

TEST(Matching, EmptyInputYieldsEmpty) {
  EXPECT_TRUE(find_delta_neutral_opportunities({}, Instant{0}).empty());
}

TEST(Matching, HedgeIsTheSmallerAbsoluteRate) {
  EXPECT_EQ(hedge_side(rate_from_decimal(0.002), rate_from_decimal(0.0005)),
            Side::Short);
  EXPECT_EQ(hedge_side(rate_from_decimal(0.0001), rate_from_decimal(-0.002)),
            Side::Long);
}

TEST(Matching, EqualAbsRatePicksShortAsHedge) {
  EXPECT_EQ(hedge_side(rate_from_decimal(0.001), rate_from_decimal(-0.001)),
            Side::Short);
}

TEST(Matching, RankSortsDescendingByProfit) {
  ScoredOpportunity a;
  a.total_profit = usd_from_decimal(1.0);
  a.opportunity.symbol = "A";
  ScoredOpportunity b;
  b.total_profit = usd_from_decimal(5.0);
  b.opportunity.symbol = "B";
  ScoredOpportunity c;
  c.total_profit = usd_from_decimal(3.0);
  c.opportunity.symbol = "C";
  std::vector<ScoredOpportunity> scored{a, b, c};
  rank_by_total_pnl(scored);
  EXPECT_EQ(scored[0].opportunity.symbol, "B");
  EXPECT_EQ(scored[1].opportunity.symbol, "C");
  EXPECT_EQ(scored[2].opportunity.symbol, "A");
}
