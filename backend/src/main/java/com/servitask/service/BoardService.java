package com.servitask.service;

import com.servitask.model.Board;
import com.servitask.model.BoardColumn;
import com.servitask.model.Card;
import com.servitask.servitask.entity.User;
import com.servitask.repository.BoardRepository;
import com.servitask.repository.BoardColumnRepository;
import com.servitask.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;  

@Service                    //componente de serviço do Spring
@RequiredArgsConstructor    //gera construtor com todos os campos finais
@Transactional              //todas as operações deste serviço serão transacionais
public class BoardService {
    private final BoardRepository boardRepository;   
    private final BoardColumnRepository boardColumnRepository;
    private final CardRepository cardRepository;

    public Board createBoard(String name, User user) {
        Board board = new Board();
        board.setName(name);
        board.setUser(user);

        Board savedBoard = boardRepository.save(board);

        createDefaultColumns(savedBoard);

        return boardRepository.findById(savedBoard.getId()).orElse(savedBoard);
    }

    private void createDefaultColumns(Board board) {
        String[] defaultColumnNames = {"A Fazer", "A Progresso", "Revisão", "Concluído"};

        // cria cada coluna com posição sequencial
        for (int i = 0; i < defaultColumnNames.length; i++) {
            BoardColumn column = new BoardColumn();
            column.setName(defaultColumnNames[i]);
            column.setPosition(i + 1);
            column.setBoard(board);
            boardColumnRepository.save(column);
        }
    }

    @Transactional(readOnly = true)
    public List<Board> getUserBoards(User user){
        return boardRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public Optional<Board> getBoardById(Long boardId, User user){
        return boardRepository.findByIdAndUser(boardId, user);
    }

    public Optional<Board> updateBoardName(Long boardId, String newName, User user){
        Optional<Board> boardOpt = boardRepository.findByIdAndUser(boardId, user);
        if (boardOpt.isPresent()){
            Board board = boardOpt.get();
            board.setName(newName);
            return Optional.of(boardRepository.save(board));
        }
        return Optional.empty();
    }
}
