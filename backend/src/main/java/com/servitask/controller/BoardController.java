package com.servitask.controller;

import com.servitask.model.Board;
import com.servitask.model.BoardColumn;
import com.servitask.model.Card;
import com.servitask.servitask.entity.User;
import com.servitask.service.BoardService;
import com.servitask.servitask.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")         

public class BoardController {

    private final BoardService boardService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Board>> getUserBoards(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            List<Board> boards = boardService.getUserBoards(user);
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long boardId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            Optional<Board> board = boardService.getBoardById(boardId, user);

            if (board.isPresent()) {
                return ResponseEntity.ok(board.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    
}   