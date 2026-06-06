package com.wms.wms_backend.domain.user.repository;

import com.wms.wms_backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "account")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "account")
    List<User> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = "account")
    List<User> findAllByTopAccountIdOrderByIdAsc(Long topAccountId);
}
