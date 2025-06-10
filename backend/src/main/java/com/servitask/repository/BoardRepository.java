package com.servitask.repository;

import com.servitask.model.Board;
import com.servitask.servitask.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    List<Board> findByUserOrderByCreatedAtDesc(User user);

    Optional<Board> findByIdAndUser(Long id, User user);

    @Query("SELECT b FROM Board b WHERE b.user = :user AND LOWER(b.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY b.createdAt DESC")
    List<Board> findByUserAndNameContainingIgnoreCase(@Param("user") User user, @Param("name") String name);

    long countByUser(User user);
}