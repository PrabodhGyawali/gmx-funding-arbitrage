cmake_minimum_required(VERSION 3.24)
project(fra-engine VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

option(FRA_BUILD_TESTS "Build GoogleTest suite" ON)
option(FRA_BUILD_SERVICES "Build microservice binaries" OFF)
option(FRA_ENABLE_SANITIZERS "ASan+UBSan (GNU/Clang)" ON)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")
include(FraOptions)

add_library(fra_types
  src/types/money.cpp
)
target_include_directories(fra_types PUBLIC
  "${CMAKE_CURRENT_SOURCE_DIR}/include"
)
fra_apply_warnings(fra_types)

if(FRA_BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
endif()

if(FRA_BUILD_SERVICES)
  message(STATUS "FRA_BUILD_SERVICES is ON but no service binaries exist yet")
endif()
