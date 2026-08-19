#pragma once

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace fra {

using VenueId = std::string;
using Symbol = std::string;

enum class Side { Long, Short };

enum class CloseReason {
  LiquidationRisk,
  FoundBetterOpportunity,
  NoLongerProfitable,
  DeltaAboveBound,
  PositionOpenError,
  FundingTurningAgainstTrade,
  CloseAllPositions,
};

// USD with 1e6 scale. $1.00 == 1'000'000 micros.
struct Usd {
  std::int64_t micros{0};
  static constexpr std::int64_t scale = 1'000'000;
};

// Dimensionless rate with 1e12 scale. 0.0001 == 100'000'000 ppt.
struct Rate {
  std::int64_t ppt{0};
  static constexpr std::int64_t scale = 1'000'000'000'000LL;
};

// Duration stored as milliseconds.
struct Hours {
  std::int64_t ms{0};
};

struct Instant {
  std::int64_t unix_ms{0};
};

// Saturating 64-bit helpers. Intermediates may use a compiler 128-bit type.
std::int64_t add_s64(std::int64_t a, std::int64_t b);
std::int64_t sub_s64(std::int64_t a, std::int64_t b);
std::int64_t mul_div_s64(std::int64_t a, std::int64_t b, std::int64_t den);

Usd usd_from_decimal(double dollars);
double usd_to_decimal(Usd value);
Usd abs_usd(Usd value);
Usd operator+(Usd lhs, Usd rhs);
Usd operator-(Usd lhs, Usd rhs);
Usd operator-(Usd value);
bool operator==(Usd lhs, Usd rhs);
bool operator<(Usd lhs, Usd rhs);
bool operator<=(Usd lhs, Usd rhs);

Rate rate_from_decimal(double value);
double rate_to_decimal(Rate value);
Rate abs_rate(Rate value);
int rate_sign(Rate value);
Rate operator+(Rate lhs, Rate rhs);
Rate operator-(Rate lhs, Rate rhs);
Rate operator-(Rate value);
bool operator==(Rate lhs, Rate rhs);
bool operator<(Rate lhs, Rate rhs);

Hours hours_from_double(double hours);
double hours_to_double(Hours value);
bool operator==(Hours lhs, Hours rhs);

// notional * rate, truncated toward zero.
Usd apply_rate(Usd notional, Rate rate);

// rate_24h / 24
Rate rate_per_hour(Rate rate_24h);

// per_hour * hours
Rate rate_times_hours(Rate per_hour, Hours hours);

// value * hours / 24h
Usd scale_by_day_fraction(Usd daily, Hours hours);

struct FundingTick {
  VenueId venue;
  Symbol symbol;
  Rate funding_rate_8h{};
  Usd skew_usd{};
  std::optional<Rate> funding_velocity_24h{};
};

struct Opportunity {
  VenueId long_venue;
  VenueId short_venue;
  Symbol symbol;
  Rate long_rate_8h{};
  Rate short_rate_8h{};
  Usd long_skew_usd{};
  Usd short_skew_usd{};
  Instant as_of{};
};

struct ScoredOpportunity {
  Opportunity opportunity{};
  std::optional<Hours> neutralize_hours{};
  Usd long_pnl{};
  Usd short_pnl{};
  Usd total_profit{};
};

struct Position {
  std::string strategy_id;
  VenueId venue;
  Symbol symbol;
  Side side{Side::Long};
  bool is_hedge{false};
  Usd size_asset{};
  Usd liq_price{};
  Instant open_time{};
};

struct CloseReport {
  VenueId venue;
  Symbol symbol;
  Usd pnl{};
  Usd accrued_funding{};
  CloseReason reason{CloseReason::CloseAllPositions};
};

struct MakerTakerSplit {
  Usd maker{};
  Usd taker{};
};

}  // namespace fra
