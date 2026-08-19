# fra-engine

C++ rewrite of the funding-rate searcher. `funding-rate-arbitrage/` is a
read-only snapshot — this tree does not include it.

This drop is `libfra_types` + venue-agnostic `libfra_math` + GoogleTest.
No venue names, no network, no service binaries.

## Build and test

Needs CMake ≥ 3.24, a C++20 compiler, and Ninja. First configure downloads
[GoogleTest v1.15.2](https://github.com/google/googletest) via FetchContent
(or pass `-DFRA_USE_SYSTEM_GTEST=ON` to use a distro package).

```bash
cd engine
cmake --preset debug
cmake --build --preset debug
ctest --preset debug --output-on-failure
```

Release (no sanitizers):

```bash
cmake --preset release
cmake --build --preset release
ctest --preset release --output-on-failure
```

## Layout

| Path | Role |
| --- | --- |
| `include/fra/types.hpp` | `Usd`, `Rate`, `FundingTick`, `Opportunity`, … |
| `include/fra/math/` | normalize, matching, PnL, fees, skew, sizing, delta |
| `tests/math/` | golden cases; venues are `"A"` / `"B"`, not exchange names |

`FRA_BUILD_SERVICES` is off. Venue adapters come after the math is reviewed.
