package com.servitask.repository;

import com.servitask.model.Board;
import com.servitask.model.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository  
public interface BoardColumnRepository extends JpaRepository<BoardColumn, Long> {

    List<BoardColumn> findByBoardOrderByPosition(Board board);

    Optional<BoardColumn> findByIdAndBoard(Long id, Board board);

    @Query("SELECT COALESCE(MAX(c.position), 0) + 1 FROM BoardColumn c WHERE c.board = :board")
    Integer findNextPosition(@Param("board") Board board);

    List<BoardColumn> findByBoardAndPositionGreaterThanOrderByPosition(Board board, Integer position);
} 