include(FetchContent)

# Pinned so reviews and CI see the same gtest. Set FRA_USE_SYSTEM_GTEST=ON
# to use a distro package instead of downloading.
option(FRA_USE_SYSTEM_GTEST "Use find_package(GTest) instead of FetchContent" OFF)

if(FRA_USE_SYSTEM_GTEST)
  find_package(GTest REQUIRED)
else()
  set(INSTALL_GTEST OFF CACHE BOOL "" FORCE)
  set(BUILD_GMOCK OFF CACHE BOOL "" FORCE)
  FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG        v1.15.2
    GIT_SHALLOW    TRUE
  )
  FetchContent_MakeAvailable(googletest)
endif()
