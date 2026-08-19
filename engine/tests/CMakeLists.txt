include(FetchGoogleTest)

add_executable(fra_tests
  math/money_test.cpp
  math/normalize_test.cpp
  math/matching_test.cpp
  math/pnl_test.cpp
  math/neutralize_test.cpp
  math/fees_test.cpp
  math/skew_test.cpp
  math/delta_test.cpp
  math/sizing_test.cpp
)
target_link_libraries(fra_tests PRIVATE
  fra_types
  fra_math
  GTest::gtest_main
)
fra_apply_warnings(fra_tests)
fra_apply_sanitizers(fra_tests)

include(GoogleTest)
gtest_discover_tests(fra_tests)
