package com.servitask.repository;

import com.servitask.model.BoardColumn;
import com.servitask.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository  
public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByColumnOrderByPosition(BoardColumn column);

    Optional<Card> findByIdAndColumn(Long id, BoardColumn column);

    @Query("SELECT COALESCE(MAX(c.position), 0) + 1 FROM Card c WHERE c.column = :column")
    Integer findNextPosition(@Param("column") BoardColumn column);

    List<Card> findByColumnAndPositionGreaterThanOrderByPosition(BoardColumn column, Integer position);

    @Query("SELECT c FROM Card c WHERE c.column = :column AND LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%')) ORDER BY c.position")
    List<Card> findByColumnAndTitleContainingIgnoreCase(@Param("column") BoardColumn column, @Param("title") String title);

    List<Card> findByColumnAndPriorityOrderByPosition(BoardColumn column, Card.Priority priority);
} 