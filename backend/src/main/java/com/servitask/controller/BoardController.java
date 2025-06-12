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

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            
            User user = userService.getUserFromToken(authHeader);
            String name = request.get("name");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Board board = boardService.createBoard(name, user);
            return ResponseEntity.ok(board);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<Board> updateBoardName(@PathVariable Long boardId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            String newName = request.get("name");

            if (newName == null || newName.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Board> board = boardService.updateBoardName(boardId, newName, user);

            if (board.isPresent()) {
                return ResponseEntity.ok(board.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            boolean deleted = boardService.deleteBoard(boardId, user);

            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/{boardId}/columns")
    public ResponseEntity<BoardColumn> addColumn(@PathVariable Long boardId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            String columnName = request.get("name");

            if (columnName == null || columnName.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<BoardColumn> column = boardService.addColumn(boardId, columnName, user);

            if (column.isPresent()) {
                return ResponseEntity.ok(column.get());
            } else {
                return ResponseEntity.notFound().build();  
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/{boardId}/columns/{columnId}")
    public ResponseEntity<BoardColumn> updateColumnName(@PathVariable Long boardId,
            @PathVariable Long columnId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            String newName = request.get("name");

            if (newName == null || newName.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<BoardColumn> column = boardService.updateColumnName(boardId, columnId, newName, user);

            if (column.isPresent()) {
                return ResponseEntity.ok(column.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/{boardId}/columns/{columnId}")
    public ResponseEntity<Void> removeColumn(@PathVariable Long boardId,
            @PathVariable Long columnId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            boolean removed = boardService.removeColumn(boardId, columnId, user);

            if (removed) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/{boardId}/columns/{columnId}/cards")
    public ResponseEntity<Card> addCard(@PathVariable Long boardId,
            @PathVariable Long columnId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            String title = request.get("title");
            String description = request.get("description");
            String priority = request.get("priority");

            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Card> card = boardService.addCard(boardId, columnId, title, description, priority, user);

            if (card.isPresent()) {
                return ResponseEntity.ok(card.get());
            } else {
                return ResponseEntity.notFound().build();  
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/{boardId}/columns/{columnId}/cards/{cardId}")
    public ResponseEntity<Card> updateCard(@PathVariable Long boardId,
            @PathVariable Long columnId,
            @PathVariable Long cardId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            String title = request.get("title");
            String description = request.get("description");
            String priority = request.get("priority");

            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Card> card = boardService.updateCard(boardId, columnId, cardId, title, description, priority,
                    user);

            if (card.isPresent()) {
                return ResponseEntity.ok(card.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/{boardId}/columns/{columnId}/cards/{cardId}")
    public ResponseEntity<Void> removeCard(@PathVariable Long boardId,
            @PathVariable Long columnId,
            @PathVariable Long cardId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);
            boolean removed = boardService.removeCard(boardId, columnId, cardId, user);

            if (removed) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/{boardId}/cards/{cardId}/move")
    public ResponseEntity<Card> moveCard(@PathVariable Long boardId,
            @PathVariable Long cardId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserFromToken(authHeader);

            Long targetColumnId = Long.valueOf(request.get("targetColumnId").toString());
            Integer targetPosition = request.get("targetPosition") != null
                    ? Integer.valueOf(request.get("targetPosition").toString())
                    : null;  

            Optional<Card> card = boardService.moveCard(boardId, cardId, targetColumnId, targetPosition, user);

            if (card.isPresent()) {
                return ResponseEntity.ok(card.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}