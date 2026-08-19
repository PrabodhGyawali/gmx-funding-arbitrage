function(fra_apply_warnings target)
  if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(${target} PRIVATE
      -Wall
      -Wextra
      -Wpedantic
      -Werror
      -Wconversion
      -Wshadow
    )
  endif()
endfunction()

function(fra_apply_sanitizers target)
  if(FRA_ENABLE_SANITIZERS AND CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(${target} PRIVATE
      -fsanitize=address,undefined
      -fno-omit-frame-pointer
    )
    target_link_options(${target} PRIVATE
      -fsanitize=address,undefined
    )
  endif()
endfunction()
